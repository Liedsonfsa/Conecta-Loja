/**
 * TopProductsTable - Tabela de produtos mais vendidos
 *
 * Exibe ranking dos produtos com melhor performance
 */
import React from "react";
import Icon from "../../../components/AppIcon";

const TopProductsTable = ({ products }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getMedalIcon = (index) => {
    switch (index) {
      case 0:
        return { icon: "Medal", color: "text-yellow-500" };
      case 1:
        return { icon: "Medal", color: "text-gray-400" };
      case 2:
        return { icon: "Medal", color: "text-amber-600" };
      default:
        return { icon: "Circle", color: "text-muted-foreground" };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 text-sm font-medium text-muted-foreground">
              #
            </th>
            <th className="pb-3 text-sm font-medium text-muted-foreground">
              Produto
            </th>
            <th className="pb-3 text-sm font-medium text-muted-foreground text-right">
              Qtd
            </th>
            <th className="pb-3 text-sm font-medium text-muted-foreground text-right">
              Receita
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, index) => {
            const medal = getMedalIcon(index);
            return (
              <tr
                key={product.id}
                className="border-b border-border last:border-0"
              >
                <td className="py-3">
                  <Icon name={medal.icon} size={20} className={medal.color} />
                </td>
                <td className="py-3">
                  <p className="font-medium text-foreground">{product.name}</p>
                </td>
                <td className="py-3 text-right">
                  <span className="text-muted-foreground">
                    {product.quantity}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className="font-medium text-green-600">
                    {formatCurrency(product.revenue)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductsTable;
