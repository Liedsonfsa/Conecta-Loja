import React from 'react';
import Icon from '../../../components/AppIcon';

/**
 * StatsCards - Componente de exibição de estatísticas do catálogo de produtos
 *
 * Exibe cards com métricas importantes do catálogo de produtos,
 * incluindo total de produtos, valor do estoque, produtos com estoque
 * baixo e produtos esgotados. Calcula estatísticas em tempo real
 * baseado na lista de produtos fornecida.
 *
 * Métricas exibidas:
 * - Total de Produtos: Contagem total com subtítulo de produtos ativos
 * - Valor do Estoque: Valor total do estoque com média de preço
 * - Estoque Baixo: Produtos com ≤10 unidades (com alerta visual)
 * - Esgotados: Produtos sem estoque (com alerta visual)
 *
 * Funcionalidades:
 * - Cálculos automáticos baseados nos dados dos produtos
 * - Formatação de moeda brasileira (R$)
 * - Alertas visuais para situações críticas (estoque baixo/esgotado)
 * - Layout responsivo (1 coluna mobile, 4 colunas desktop)
 * - Ícones temáticos para cada métrica
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.products - Lista de produtos para calcular estatísticas
 *
 * @example
 * <StatsCards products={[
 *   { id: 1, name: 'Produto A', price: 50, stock: 15, isAvailable: true },
 *   { id: 2, name: 'Produto B', price: 30, stock: 5, isAvailable: true }
 * ]} />
 *
 * @example
 * // Exemplo de métricas calculadas:
 * // Total: 2 produtos (2 ativos)
 * // Valor: R$ 1.150,00 (Média: R$ 40,00)
 * // Estoque Baixo: 1 (≤10 unidades)
 * // Esgotados: 0 (Sem estoque)
 */
const StatsCards = ({ products }) => {
  const totalProducts = products?.length;
  const activeProducts = products?.filter(p => p?.isAvailable)?.length;
  const lowStockProducts = products?.filter(p => p?.stock <= 10 && p?.stock > 0)?.length;
  const outOfStockProducts = products?.filter(p => p?.stock === 0)?.length;
  const totalValue = products?.reduce((sum, p) => sum + (p?.price * p?.stock), 0);
  const averagePrice = totalProducts > 0 ? products?.reduce((sum, p) => sum + p?.price, 0) / totalProducts : 0;

  const stats = [
    {
      title: 'Total de Produtos',
      value: totalProducts,
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: `${activeProducts} ativos`
    },
    {
      title: 'Valor do Estoque',
      value: `R$ ${totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: `Média: R$ ${averagePrice?.toFixed(2)}`
    },
    {
      title: 'Estoque Baixo',
      value: lowStockProducts,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: '≤ 10 unidades',
      alert: lowStockProducts > 0
    },
    {
      title: 'Esgotados',
      value: outOfStockProducts,
      icon: 'XCircle',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      description: 'Sem estoque',
      alert: outOfStockProducts > 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats?.map((stat, index) => (
        <div
          key={index}
          className={`bg-card rounded-lg border border-border p-6 relative overflow-hidden ${
            stat?.alert ? 'ring-2 ring-warning/20' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat?.title}
              </p>
              <p className="text-2xl font-bold text-foreground mb-1">
                {stat?.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat?.description}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
          </div>

          {stat?.alert && (
            <div className="absolute top-2 right-2">
              <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;