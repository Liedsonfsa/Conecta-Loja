/**
 * Reports - Tela de Relatórios de Vendas e Estatísticas
 *
 * Tela dedicada para visualização de relatórios detalhados, gráficos
 * analíticos e estatísticas de gestão da loja.
 *
 * Funcionalidades:
 * - Filtros por período (hoje, semana, mês, ano, personalizado)
 * - Gráficos de vendas, produtos e categorias
 * - Estatísticas de performance
 * - Exportação de relatórios
 * - Consultas ao backend com dados reais
 *
 * @returns {JSX.Element} Página completa de relatórios
 */
import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Button from "../../components/ui/ButtonDash";
import Icon from "../../components/AppIcon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import ReportMetrics from "./components/ReportMetrics";
import SalesChart from "./components/SalesChart";
import TopProductsTable from "./components/TopProductsTable";
import CategoryChart from "./components/CategoryChart";
import PeakHoursChart from "./components/PeakHoursChart";
import OperationalMetrics from "./components/OperationalMetrics";

const Reports = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const url = new URL("http://localhost:8000/api/report");
      url.searchParams.set("period", selectedPeriod);
      if (selectedPeriod === "custom") {
        url.searchParams.set("startDate", customDateRange.startDate);
        url.searchParams.set("endDate", customDateRange.endDate);
      }

      const res = await fetch(url.toString());
      const data = await res.json();
      setReportData(data);
      // alert(data);
      // console.log(data);
    } catch (err) {
      console.error("Erro ao buscar relatórios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod, customDateRange]);

  /**
   * Manipula mudança de período
   */
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  /**
   * Exporta relatório
   */
  const handleExportReport = () => {
    // TODO: Implementar exportação de relatório (PDF ou CSV)
    console.log("Exportando relatório...", {
      period: selectedPeriod,
      data: reportData,
    });
    alert("Funcionalidade de exportação será implementada em breve!");
  };

  const periodOptions = [
    { value: "today", label: "Hoje", icon: "Calendar" },
    { value: "week", label: "Esta Semana", icon: "CalendarRange" },
    { value: "month", label: "Este Mês", icon: "CalendarDays" },
    { value: "year", label: "Este Ano", icon: "CalendarClock" },
    { value: "custom", label: "Personalizado", icon: "CalendarSearch" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-60"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Relatórios de Vendas
              </h1>
              <p className="text-muted-foreground">
                Acompanhe o desempenho da sua loja com dados detalhados
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={fetchReportData}
                disabled={loading}
              >
                Atualizar
              </Button>
              <Button
                variant="default"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportReport}
              >
                Exportar Relatório
              </Button>
            </div>
          </div>

          {/* Period Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtro de Período</CardTitle>
              <CardDescription>
                Selecione o período para visualizar os dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {periodOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      selectedPeriod === option.value ? "default" : "outline"
                    }
                    iconName={option.icon}
                    iconPosition="left"
                    onClick={() => handlePeriodChange(option.value)}
                    size="sm"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Custom Date Range */}
              {selectedPeriod === "custom" && (
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Data Inicial
                    </label>
                    <Input
                      type="date"
                      value={customDateRange.startDate}
                      onChange={(e) =>
                        setCustomDateRange({
                          ...customDateRange,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Data Final
                    </label>
                    <Input
                      type="date"
                      value={customDateRange.endDate}
                      onChange={(e) =>
                        setCustomDateRange({
                          ...customDateRange,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Carregando relatórios...
                </p>
              </div>
            </div>
          ) : reportData ? (
            <>
              {/* Metrics Summary */}
              <ReportMetrics data={reportData.summary} />

              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Icon
                          name="TrendingUp"
                          size={24}
                          className="text-primary"
                        />
                        Evolução de Vendas
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Visualize o crescimento das vendas ao longo do período
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <SalesChart data={reportData.salesByDay} />
                </CardContent>
              </Card>

              {/* Peak Hours Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={24} className="text-primary" />
                    Horários de Pico
                  </CardTitle>
                  <CardDescription>
                    Distribuição de pedidos ao longo do dia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PeakHoursChart data={reportData.peakHours} />
                </CardContent>
              </Card>

              {/* Products and Categories Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Award" size={24} className="text-primary" />
                      Produtos Mais Vendidos
                    </CardTitle>
                    <CardDescription>
                      Top 5 produtos com melhor desempenho
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopProductsTable products={reportData.topProducts} />
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon
                        name="PieChart"
                        size={24}
                        className="text-primary"
                      />
                      Distribuição por Categoria
                    </CardTitle>
                    <CardDescription>
                      Participação de cada categoria nas vendas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CategoryChart data={reportData.categoryDistribution} />
                  </CardContent>
                </Card>
              </div>

              {/* Operational Metrics */}
              <section>
                <div className="flex items-center space-x-2 mb-6">
                  <Icon name="Activity" size={24} className="text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Métricas Operacionais
                  </h2>
                </div>
                <OperationalMetrics data={reportData.operational} />
              </section>
            </>
          ) : (
            <div className="text-center py-20">
              <Icon
                name="FileX"
                size={48}
                className="mx-auto text-muted-foreground mb-4"
              />
              <p className="text-muted-foreground">Nenhum dado disponível</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;
