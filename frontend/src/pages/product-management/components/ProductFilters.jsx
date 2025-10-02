import React from 'react';
import Icon from '../../../components/AppIcon';
import { Input } from '@/components/ui/input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/ButtonDash';

/**
 * ProductFilters - Componente de filtros avançados para produtos
 *
 * Interface de filtros completa para pesquisa e segmentação de produtos,
 * incluindo busca textual, categoria, faixa de preço, estoque e disponibilidade.
 * Fornece feedback visual sobre filtros ativos e opção de limpar todos os filtros.
 *
 * Funcionalidades:
 * - Busca textual por nome ou descrição do produto
 * - Filtro por categoria específica ou todas
 * - Faixa de preço configurável (range slider)
 * - Filtros de estoque (todos, em estoque, baixo, esgotado)
 * - Filtros de disponibilidade (todos, disponível, indisponível)
 * - Detecção automática de filtros ativos
 * - Botão para limpar todos os filtros
 *
 * Estados dos filtros:
 * - searchTerm: Termo de busca textual
 * - selectedCategory: Categoria selecionada ('all' para todas)
 * - priceRange: Array [min, max] da faixa de preço
 * - stockFilter: Filtro de estoque ('all', 'in', 'low', 'out')
 * - availabilityFilter: Filtro de disponibilidade ('all', 'available', 'unavailable')
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {string} props.searchTerm - Termo de busca atual
 * @param {Function} props.onSearchChange - Função para alterar termo de busca
 * @param {string} props.selectedCategory - Categoria selecionada
 * @param {Function} props.onCategoryChange - Função para alterar categoria
 * @param {Array<number>} props.priceRange - Faixa de preço [min, max]
 * @param {Function} props.onPriceRangeChange - Função para alterar faixa de preço
 * @param {string} props.stockFilter - Filtro de estoque atual
 * @param {Function} props.onStockFilterChange - Função para alterar filtro de estoque
 * @param {string} props.availabilityFilter - Filtro de disponibilidade atual
 * @param {Function} props.onAvailabilityFilterChange - Função para alterar filtro de disponibilidade
 * @param {Function} props.onClearFilters - Função para limpar todos os filtros
 * @param {Array<string>} props.categories - Lista de categorias disponíveis
 *
 * @example
 * <ProductFilters
 *   searchTerm="camiseta"
 *   onSearchChange={setSearchTerm}
 *   selectedCategory="Roupas"
 *   onCategoryChange={setSelectedCategory}
 *   priceRange={[0, 100]}
 *   onPriceRangeChange={setPriceRange}
 *   stockFilter="in"
 *   onStockFilterChange={setStockFilter}
 *   availabilityFilter="available"
 *   onAvailabilityFilterChange={setAvailabilityFilter}
 *   onClearFilters={clearAllFilters}
 *   categories={['Eletrônicos', 'Roupas', 'Casa']}
 * />
 */
const ProductFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  stockFilter,
  onStockFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  onClearFilters,
  categories
}) => {
  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    ...categories?.map(cat => ({ value: cat, label: cat }))
  ];

  const stockOptions = [
    { value: 'all', label: 'Todos os Estoques' },
    { value: 'in', label: 'Em Estoque' },
    { value: 'low', label: 'Estoque Baixo (≤10)' },
    { value: 'out', label: 'Esgotado' }
  ];

  const availabilityOptions = [
    { value: 'all', label: 'Todas as Disponibilidades' },
    { value: 'available', label: 'Disponível' },
    { value: 'unavailable', label: 'Indisponível' }
  ];

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || 
                          priceRange?.[0] > 0 || priceRange?.[1] < 1000 || 
                          stockFilter !== 'all' || availabilityFilter !== 'all';

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={20} />
          <span>Filtros</span>
        </h2>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <Select
          placeholder="Categoria"
          options={categoryOptions}
          value={selectedCategory}
          onChange={onCategoryChange}
        />

        {/* Stock Filter */}
        <Select
          placeholder="Estoque"
          options={stockOptions}
          value={stockFilter}
          onChange={onStockFilterChange}
        />

        {/* Availability Filter */}
        <Select
          placeholder="Disponibilidade"
          options={availabilityOptions}
          value={availabilityFilter}
          onChange={onAvailabilityFilterChange}
        />
      </div>
      {/* Price Range */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Faixa de Preço: R$ {priceRange?.[0]?.toFixed(2)} - R$ {priceRange?.[1]?.toFixed(2)}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              type="number"
              placeholder="Preço mínimo"
              value={priceRange?.[0]}
              onChange={(e) => onPriceRangeChange([parseFloat(e?.target?.value) || 0, priceRange?.[1]])}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Preço máximo"
              value={priceRange?.[1]}
              onChange={(e) => onPriceRangeChange([priceRange?.[0], parseFloat(e?.target?.value) || 1000])}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Busca: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-2 hover:text-primary/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                Categoria: {selectedCategory}
                <button
                  onClick={() => onCategoryChange('all')}
                  className="ml-2 hover:text-secondary/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {(priceRange?.[0] > 0 || priceRange?.[1] < 1000) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                Preço: R$ {priceRange?.[0]?.toFixed(2)} - R$ {priceRange?.[1]?.toFixed(2)}
                <button
                  onClick={() => onPriceRangeChange([0, 1000])}
                  className="ml-2 hover:opacity-70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {stockFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                Estoque: {stockOptions?.find(opt => opt?.value === stockFilter)?.label}
                <button
                  onClick={() => onStockFilterChange('all')}
                  className="ml-2 hover:text-warning/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {availabilityFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                Disponibilidade: {availabilityOptions?.find(opt => opt?.value === availabilityFilter)?.label}
                <button
                  onClick={() => onAvailabilityFilterChange('all')}
                  className="ml-2 hover:text-success/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;