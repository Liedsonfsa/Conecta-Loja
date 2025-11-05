import React from 'react';
import Button from './ButtonDash';
import Icon from '../../components/AppIcon';

/**
 * Pagination - Componente de paginação para listas
 *
 * Fornece controles de navegação entre páginas com botões anterior/próximo,
 * numeração de páginas e informações sobre o total de itens.
 *
 * Funcionalidades principais:
 * - Navegação entre páginas (anterior/próximo)
 * - Numeração de páginas com limite de exibição
 * - Informações sobre itens exibidos/total
 * - Desabilitação automática de botões nos limites
 * - Design responsivo e acessível
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {number} props.currentPage - Página atual (baseado em 1)
 * @param {number} props.totalItems - Total de itens na lista
 * @param {number} props.itemsPerPage - Itens por página
 * @param {Function} props.onPageChange - Callback para mudança de página
 * @param {boolean} [props.showInfo=true] - Se deve mostrar informações de contagem
 *
 * @example
 * const [currentPage, setCurrentPage] = useState(1);
 * const itemsPerPage = 20;
 * const totalItems = 150;
 *
 * <Pagination
 *   currentPage={currentPage}
 *   totalItems={totalItems}
 *   itemsPerPage={itemsPerPage}
 *   onPageChange={setCurrentPage}
 * />
 */
const Pagination = ({
                        currentPage,
                        totalItems,
                        itemsPerPage,
                        onPageChange,
                        showInfo = true
                    }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Não renderiza se não há itens ou apenas uma página
    if (totalItems === 0 || totalPages <= 1) {
        return null;
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Ajusta o início se estamos no final
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Página anterior se necessário
        if (startPage > 1) {
            pages.push(
                <Button
                    key="start"
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="px-3"
                >
                    1
                </Button>
            );
            if (startPage > 2) {
                pages.push(<span key="ellipsis-start" className="px-2 text-muted-foreground">...</span>);
            }
        }

        // Páginas visíveis
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    className="px-3 min-w-[40px]"
                >
                    {i}
                </Button>
            );
        }

        // Página seguinte se necessário
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis-end" className="px-2 text-muted-foreground">...</span>);
            }
            pages.push(
                <Button
                    key="end"
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3"
                >
                    {totalPages}
                </Button>
            );
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            {/* Informações */}
            {showInfo && (
                <div className="text-sm text-muted-foreground">
                    Mostrando {startItem} a {endItem} de {totalItems} pedidos
                </div>
            )}

            {/* Controles de navegação */}
            <div className="flex items-center gap-2">
                {/* Botão Anterior */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-2"
                >
                    <Icon name="ChevronLeft" size={16} />
                    Anterior
                </Button>

                {/* Numeração de páginas */}
                <div className="flex items-center gap-1">
                    {renderPageNumbers()}
                </div>

                {/* Botão Próximo */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="flex items-center gap-2"
                >
                    Próximo
                    <Icon name="ChevronRight" size={16} />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
