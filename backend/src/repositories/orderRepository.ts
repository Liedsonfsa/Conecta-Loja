import { PrismaClient, OrderStatus } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Repositório responsável por acessar os dados de pedidos no banco
 *
 * Utiliza o Prisma para realizar operações diretamente na tabela "pedido".
 */
export class OrderRepository {
    /**
     * Busca todos os pedidos da loja (para funcionários/administradores)
     *
     * @returns Promise<object[]> - Lista de todos os pedidos encontrados
     */
    static async getAllOrders() {
        return await prisma.pedido.findMany({
            include: {
                produtos: {
                    include: {
                        produto: true // Inclui os dados do produto relacionado
                    }
                },
                endereco: true, // Inclui os dados do endereço de entrega
                usuario: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        contact: true
                    }
                }, // Inclui dados básicos do usuário
                statusHistorico: {
                    include: {
                        funcionario: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc' // Ordena por data de criação (mais antigo primeiro)
                    }
                } // Inclui histórico completo de status
            },
            orderBy: {
                createdAt: 'desc' // Ordena por data de criação, mais recentes primeiro
            }
        })
    }

    /**
     * Busca os pedidos vinculados a um usuário específico
     *
     * @param usuarioId - ID do usuário cujos pedidos devem ser retornados
     * @returns Promise<object[]> - Lista de pedidos encontrados
     */
    static async getUserOrders(usuarioId: number) {
        return await prisma.pedido.findMany({
            where: { usuarioId },
            include: {
                produtos: {
                    include: {
                        produto: true // Inclui os dados do produto relacionado
                    }
                },
                endereco: true // Inclui os dados do endereço de entrega
            },
            orderBy: {
                createdAt: 'desc' // Ordena por data de criação, mais recentes primeiro
            }
        })
    }

    /**
     * Cria um novo pedido e associa seus produtos.
     *
     * @param data - Dados do pedido, incluindo lista de produtos
     * @returns Promise<object> - Pedido criado com relação aos produtos
     */
    static async createOrder(data: {
        usuarioId: number,
        enderecoId?: number,
        cupomId?: number,
        produtos: { produtoId: number, quantidade: number, precoUnitario: number | string }[],
        precoTotal: number | string,
        status?: string
    }) {
        const { usuarioId, enderecoId, cupomId, produtos, precoTotal, status } = data;

        const orderStatus: OrderStatus = (status && status in OrderStatus)
            ? (status as OrderStatus)
            : OrderStatus.RECEBIDO;

        return await prisma.pedido.create({
            data: {
                usuarioId,
                enderecoId,
                cupomId,
                precoTotal: Number(precoTotal),
                status: orderStatus,
                produtos: {
                    create: produtos.map(p => ({
                        produtoId: p.produtoId,
                        quantidade: p.quantidade,
                        precoUnitario: Number(p.precoUnitario)
                    }))
                }
            },
            include: {
                produtos: true,
                endereco: true
            }
        });
    }

    /**
     * Exclui um pedido no banco de dados
     *
     * Utiliza o Prisma para remover um pedido a partir do ID informado.
     *
     * @param id - ID do pedido a ser excluído
     * @returns Promise<object> - Pedido excluído
     * @throws Error - Se o pedido não existir
     */
    static async deleteOrder(id: number) {
        const existingOrder = await prisma.pedido.findUnique({
            where: { id },
        });

        if (!existingOrder) {
            throw new Error("Pedido não encontrado");
        }

        return await prisma.pedido.delete({
            where: { id },
        });
    }

    /**
     * Atualiza o status de um pedido
     *
     * @param id - ID do pedido a ser atualizado
     * @param novoStatus - Novo status do pedido
     * @returns Promise<object> - Pedido atualizado
     */
    /**
     * Busca um pedido específico por ID
     *
     * @param id - ID do pedido a ser retornado
     * @returns Promise<object> - Pedido encontrado com relacionamentos
     */
    static async getOrderById(id: number) {
        return await prisma.pedido.findUnique({
            where: { id },
            include: {
                produtos: {
                    include: {
                        produto: true // Inclui os dados do produto relacionado
                    }
                },
                endereco: true, // Inclui os dados do endereço de entrega
                usuario: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        contact: true
                    }
                }, // Inclui dados básicos do usuário
                statusHistorico: {
                    include: {
                        funcionario: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc' // Ordena por data de criação (mais antigo primeiro)
                    }
                } // Inclui histórico completo de status
            }
        });
    }

    static async updateOrderStatus(id: number, novoStatus: OrderStatus) {
        return await prisma.pedido.update({
            where: { id },
            data: {
                status: novoStatus,
                updatedAt: new Date()
            }
        });
    }
}
