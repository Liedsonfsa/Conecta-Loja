/**
 * SalesChart - Componente de gráfico de vendas
 *
 * Exibe gráfico de barras/linhas com evolução de vendas
 */
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Button from "../../../components/ui/ButtonDash";

// Função auxiliar para formatação de moeda (exportada para testes)
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const SalesChart = ({ data }) => {
  const [chartType, setChartType] = useState("bar");

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{payload[0].payload.date}</p>
          <p className="text-sm text-green-600">
            Vendas: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-blue-600">Pedidos: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant={chartType === "bar" ? "default" : "outline"}
          iconName="BarChart3"
          iconPosition="left"
          onClick={() => setChartType("bar")}
        >
          Barras
        </Button>
        <Button
          size="sm"
          variant={chartType === "line" ? "default" : "outline"}
          iconName="LineChart"
          iconPosition="left"
          onClick={() => setChartType("line")}
        >
          Linhas
        </Button>
      </div>

      {/* Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis
                yAxisId="left"
                className="text-xs"
                tick={{ fill: "currentColor" }}
                tickFormatter={formatCurrency}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="sales"
                name="Vendas (R$)"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="orders"
                name="Pedidos"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis
                yAxisId="left"
                className="text-xs"
                tick={{ fill: "currentColor" }}
                tickFormatter={formatCurrency}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                name="Vendas (R$)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                name="Pedidos"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
