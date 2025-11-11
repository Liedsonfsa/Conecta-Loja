import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SalesChart, { formatCurrency } from '../SalesChart';

// Mock do Recharts
vi.mock('recharts', () => ({
  BarChart: ({ children, data }) => (
    <div data-testid="bar-chart" data-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  LineChart: ({ children, data }) => (
    <div data-testid="line-chart" data-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: ({ dataKey }) => <div data-testid={`bar-${dataKey}`} />,
  Line: ({ dataKey }) => <div data-testid={`line-${dataKey}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: ({ content }) => <div data-testid="tooltip" data-content={content} />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

// Mock do Button
vi.mock('../../../../components/ui/ButtonDash', () => ({
  default: ({ children, onClick, variant, iconName }) => (
    <button
      data-testid={`button-${iconName}`}
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe('SalesChart Component', () => {
  const mockData = [
    { date: '01/11', sales: 1500.00, orders: 15 },
    { date: '02/11', sales: 2200.50, orders: 22 },
    { date: '03/11', sales: 1800.75, orders: 18 },
  ];

  it('should render with default bar chart', () => {
    render(<SalesChart data={mockData} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-sales')).toBeInTheDocument();
    expect(screen.getByTestId('bar-orders')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should display chart toggle buttons', () => {
    render(<SalesChart data={mockData} />);

    expect(screen.getByTestId('button-BarChart3')).toBeInTheDocument();
    expect(screen.getByTestId('button-LineChart')).toBeInTheDocument();
  });

  it('should switch to line chart when line button is clicked', () => {
    render(<SalesChart data={mockData} />);

    const lineButton = screen.getByTestId('button-LineChart');
    fireEvent.click(lineButton);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-sales')).toBeInTheDocument();
    expect(screen.getByTestId('line-orders')).toBeInTheDocument();
  });

  it('should switch back to bar chart when bar button is clicked', () => {
    render(<SalesChart data={mockData} />);

    // Switch to line first
    const lineButton = screen.getByTestId('button-LineChart');
    fireEvent.click(lineButton);

    // Switch back to bar
    const barButton = screen.getByTestId('button-BarChart3');
    fireEvent.click(barButton);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should pass data correctly to chart components', () => {
    render(<SalesChart data={mockData} />);

    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toHaveAttribute('data-data', JSON.stringify(mockData));
  });

  it('should handle empty data array', () => {
    render(<SalesChart data={[]} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toHaveAttribute('data-data', JSON.stringify([]));
  });

  it('should handle undefined data', () => {
    render(<SalesChart data={undefined} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should display buttons with correct variants', () => {
    render(<SalesChart data={mockData} />);

    const barButton = screen.getByTestId('button-BarChart3');
    const lineButton = screen.getByTestId('button-LineChart');

    // Bar button should be default (active) initially
    expect(barButton).toHaveAttribute('data-variant', 'default');
    expect(lineButton).toHaveAttribute('data-variant', 'outline');
  });

  it('should update button variants when switching chart types', () => {
    render(<SalesChart data={mockData} />);

    const lineButton = screen.getByTestId('button-LineChart');
    fireEvent.click(lineButton);

    // After switching to line, line button should be active
    expect(lineButton).toHaveAttribute('data-variant', 'default');

    const barButton = screen.getByTestId('button-BarChart3');
    expect(barButton).toHaveAttribute('data-variant', 'outline');
  });

  it('should format currency correctly', () => {
    expect(formatCurrency(1500.50)).toBe('R$\xa01.500,50');
    expect(formatCurrency(0)).toBe('R$\xa00,00');
    expect(formatCurrency(1000000)).toBe('R$\xa01.000.000,00');
  });

  it('should render tooltip component', () => {
    render(<SalesChart data={mockData} />);

    // Verificar se o tooltip está sendo renderizado
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });
});

