/**
 * OperationalMetrics - Métricas operacionais
 *
 * Exibe métricas de performance operacional da loja
 */
import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import Icon from "../../../components/AppIcon";

const OperationalMetrics = ({ data }) => {
  const metrics = [
    {
      title: "Clientes Ativos",
      value: data?.activeCustomers || 0,
      icon: "Users",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
      suffix: " clientes",
    },
    {
      title: "Tempo Médio de Preparo",
      value: data?.averagePreparationTime || 0,
      icon: "Clock",
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-950",
      suffix: " min",
    },
    {
      title: "Tempo Médio de Entrega",
      value: data?.averageDeliveryTime || 0,
      icon: "Truck",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
      suffix: " min",
    },
    {
      title: "Avaliação Média",
      value: data?.averageRating ? data.averageRating.toFixed(1) : "0.0",
      icon: "Star",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-950",
      suffix: " / 5.0",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {metric.value}
                  {metric.suffix}
                </p>
              </div>
              <div className={`p-3 rounded-full ${metric.bgColor}`}>
                <Icon name={metric.icon} size={24} className={metric.color} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OperationalMetrics;
