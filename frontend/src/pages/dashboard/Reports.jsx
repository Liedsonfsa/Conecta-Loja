/**
 * Reports - Tela de Relatórios de Vendas e Estatísticas
 *
 * Tela dedicada para visualização de relatórios detalhados, gráficos
 * analíticos e estatísticas de gestão da loja.
 *
 * @returns {JSX.Element} Página completa de relatórios
 */
import React, { useState, useEffect, useRef } from "react";
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

// Helper para carregar scripts dinamicamente (versão UMD)
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    // Evita carregar o mesmo script várias vezes
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = (err) =>
      reject(new Error(`Falha ao carregar o script: ${src}`));
    document.body.appendChild(script);
  });
};

const Reports = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const reportContentRef = useRef(null);

  /**
   * Busca dados de relatórios do backend
   */
  const fetchReportData = async () => {
    setLoading(true);
    try {
      // TODO: Implementar chamada real ao backend
      // const response = await api.get('/api/reports', { params: { period: selectedPeriod } });

      // Mock data por enquanto
      const mockData = {
        summary: {
          totalSales: 45678.9,
          totalOrders: 324,
          averageTicket: 140.99,
          topProduct: "Pizza Margherita",
          growthRate: 12.5,
        },
        salesByDay: [
          { date: "01/10", sales: 1234.5, orders: 12 },
          { date: "02/10", sales: 2345.6, orders: 18 },
          { date: "03/10", sales: 1890.3, orders: 15 },
          { date: "04/10", sales: 3456.7, orders: 25 },
          { date: "05/10", sales: 2789.9, orders: 20 },
          { date: "06/10", sales: 4123.4, orders: 28 },
          { date: "07/10", sales: 3567.8, orders: 24 },
        ],
        topProducts: [
          { id: 1, name: "Pizza Margherita", quantity: 85, revenue: 2975.0 },
          {
            id: 2,
            name: "Hambúrguer Artesanal",
            quantity: 72,
            revenue: 2520.0,
          },
          { id: 3, name: "Refrigerante 2L", quantity: 120, revenue: 1200.0 },
          { id: 4, name: "Batata Frita Grande", quantity: 65, revenue: 975.0 },
          { id: 5, name: "Salada Caesar", quantity: 45, revenue: 1282.5 },
        ],
        categoryDistribution: [
          { name: "Pizzas", value: 35, sales: 15987.0 },
          { name: "Lanches", value: 28, sales: 12789.0 },
          { name: "Bebidas", value: 20, sales: 9123.0 },
          { name: "Sobremesas", value: 10, sales: 4567.0 },
          { name: "Saladas", value: 7, sales: 3212.9 },
        ],
        peakHours: [
          { hour: "08h", orders: 5, revenue: 234.5 },
          { hour: "09h", orders: 8, revenue: 456.8 },
          { hour: "10h", orders: 12, revenue: 678.9 },
          { hour: "11h", orders: 25, revenue: 1234.5 },
          { hour: "12h", orders: 42, revenue: 2345.6 },
          { hour: "13h", orders: 38, revenue: 2156.3 },
          { hour: "14h", orders: 18, revenue: 987.4 },
          { hour: "15h", orders: 10, revenue: 567.2 },
          { hour: "16h", orders: 8, revenue: 445.8 },
          { hour: "17h", orders: 15, revenue: 789.5 },
          { hour: "18h", orders: 35, revenue: 1890.3 },
          { hour: "19h", orders: 45, revenue: 2567.8 },
          { hour: "20h", orders: 38, revenue: 2234.6 },
          { hour: "21h", orders: 22, revenue: 1345.9 },
          { hour: "22h", orders: 12, revenue: 678.5 },
          { hour: "23h", orders: 5, revenue: 289.4 },
        ],
        operational: {
          activeCustomers: 1847,
          averagePreparationTime: 18,
          averageDeliveryTime: 32,
          averageRating: 4.7,
        },
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReportData(mockData);
    } catch (error) {
      console.error("Erro ao buscar dados do relatório:", error);
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
   * Exporta relatório em PDF de forma estilizada (Versão UMD)
   */
  const handleExportReport = async () => {
    // 1. Verifica se o conteúdo de referência existe
    if (!reportContentRef.current || !reportData) {
      console.error("Referência do conteúdo ou dados não encontrados.");
      return;
    }

    setIsExporting(true);

    try {
      // --- CORREÇÃO: Carregamento Dinâmico (via <script> UMD) ---
      // Carrega as versões UMD que criam globais no 'window'
      await Promise.all([
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        ),
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        ),
      ]);

      // 2. Pega as bibliotecas a partir do 'window'
      const { jsPDF } = window.jspdf;
      const html2canvas = window.html2canvas;
      // --- Fim da Correção ---

      // 3. Usa html2canvas para capturar o elemento
      const element = reportContentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // 4. Configura o jsPDF (A4, retrato, milímetros)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 5. Pega as dimensões da página A4 e da imagem
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calcula a proporção para caber na página
      const maxWidth = pdfWidth - 20; // 190mm
      const maxHeight = pdfHeight - 40; // 257mm
      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
      const imgFinalWidth = imgWidth * ratio;
      const imgFinalHeight = imgHeight * ratio;

      // Centraliza a imagem
      const imgX = (pdfWidth - imgFinalWidth) / 2;
      const imgY = 30; // Margem superior para o título

      // 6. Adiciona o Título e Subtítulo
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Relatório de Vendas e Estatísticas", pdfWidth / 2, 15, {
        align: "center",
      });

      const periodLabel =
        periodOptions.find((p) => p.value === selectedPeriod)?.label ||
        "Período Personalizado";
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Período: ${periodLabel}`, pdfWidth / 2, 22, {
        align: "center",
      });

      // 7. Adiciona a imagem capturada ao PDF
      pdf.addImage(imgData, "PNG", imgX, imgY, imgFinalWidth, imgFinalHeight);

      // 8. Salva o arquivo
      pdf.save(`relatorio_vendas_${selectedPeriod}.pdf`);
    } catch (error) {
      console.error("Erro ao exportar o PDF:", error);
    } finally {
      setIsExporting(false);
    }
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
        <div className="p-6 space-y-6" ref={reportContentRef}>
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
                disabled={isExporting || loading}
              >
                {isExporting ? "Exportando..." : "Exportar Relatório"}
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