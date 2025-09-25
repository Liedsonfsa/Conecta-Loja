/**
 * MetricsCard - Componente para exibir métricas do dashboard
 *
 * Cartão informativo que apresenta uma métrica específica com ícone,
 * valor principal, indicador de mudança e cor temática. Utilizado
 * para mostrar KPIs importantes como vendas, pedidos, etc.
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título da métrica (ex: "Vendas Hoje")
 * @param {string|number} props.value - Valor principal da métrica
 * @param {string} [props.change] - Texto de mudança/variação
 * @param {string} [props.changeType] - Tipo da mudança: "positive" | "negative" | "neutral"
 * @param {string} props.icon - Nome do ícone (da biblioteca Lucide)
 * @param {string} [props.color="primary"] - Cor do tema: "primary" | "success" | "warning" | "error"
 *
 * @returns {JSX.Element} Cartão de métrica renderizado
 *
 * @example
 * <MetricsCard
 *   title="Vendas Hoje"
 *   value="R$ 2.847,50"
 *   change="+12,5%"
 *   changeType="positive"
 *   icon="TrendingUp"
 *   color="success"
 * />
 */
import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  /**
   * Obtém as classes CSS de cor baseadas no tipo de cor especificado
   * @returns {string} Classes CSS para o fundo do ícone
   */
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success text-success-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'error':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  /**
   * Obtém a classe CSS de cor para o indicador de mudança
   * @returns {string} Classe CSS para a cor do texto da mudança
   */
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-layout">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon 
              name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
              size={16} 
            />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default MetricsCard;