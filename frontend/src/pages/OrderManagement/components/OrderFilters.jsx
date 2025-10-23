import React from 'react';
//import Input from '../../../components/ui/Input';
import { Input } from 'src/components/ui/input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/ButtonDash';

/**
 * OrderFilters - Componente de filtros para listagem de pedidos
 *
 * Fornece interface completa para filtragem e ordenação de pedidos,
 * incluindo busca por texto, filtro por status, período de datas,
 * ordenação e ações de limpar filtros e exportar dados.
 *
 * Funcionalidades principais:
 * - Busca por ID, nome do cliente ou telefone (com debounce)
 * - Filtro por status do pedido (todos os status disponíveis)
 * - Seleção de período por datas (de/até)
 * - Ordenação por diferentes critérios (data, valor)
 * - Botão para limpar todos os filtros aplicados
 * - Botão para exportar dados filtrados em CSV
 * - Layout responsivo (vertical mobile, horizontal desktop)
 *
 * Filtros disponíveis:
 * - Busca: Campo de texto para pesquisa geral
 * - Status: Dropdown com todos os status possíveis
 * - Data Inicial/Final: Campos de data para período
 * - Ordenação: Dropdown com critérios de ordenação
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.filters - Estado atual dos filtros
 * @param {string} props.filters.search - Termo de busca atual
 * @param {string} props.filters.status - Status selecionado para filtro
 * @param {string} props.filters.dateFrom - Data inicial do filtro
 * @param {string} props.filters.dateTo - Data final do filtro
 * @param {string} props.filters.sort - Critério de ordenação
 * @param {Function} props.onFilterChange - Callback para mudança de filtros
 * @param {Function} props.onClearFilters - Callback para limpar filtros
 * @param {Function} props.onExport - Callback para exportar dados
 *
 * @example
 * const filters = {
 *   search: '',
 *   status: '',
 *   dateFrom: '',
 *   dateTo: '',
 *   sort: 'newest'
 * };
 *
 * const handleFilterChange = (key, value) => {
 *   setFilters(prev => ({ ...prev, [key]: value }));
 * };
 *
 * <OrderFilters
 *   filters={filters}
 *   onFilterChange={handleFilterChange}
 *   onClearFilters={() => setFilters(initialFilters)}
 *   onExport={handleExport}
 * />
 */
const OrderFilters = ({
                          filters,
                          onFilterChange,
                          onClearFilters,
                          onExport
                      }) => {
    /**
     * Opções disponíveis para filtro de status dos pedidos
     * @type {Array<Object>} statusOptions
     */
    const statusOptions = [
        { value: '', label: 'Todos os Status' },
        { value: 'pending', label: 'Pendente' },
        { value: 'preparing', label: 'Preparando' },
        { value: 'ready', label: 'Pronto' },
        { value: 'en_route', label: 'A Caminho' },
        { value: 'delivered', label: 'Entregue' },
        { value: 'cancelled', label: 'Cancelado' }
    ];

    /**
     * Opções disponíveis para ordenação da lista de pedidos
     * @type {Array<Object>} sortOptions
     */
    const sortOptions = [
        { value: 'newest', label: 'Mais Recentes' },
        { value: 'oldest', label: 'Mais Antigos' },
        { value: 'highest_value', label: 'Maior Valor' },
        { value: 'lowest_value', label: 'Menor Valor' }
    ];

    return (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                {/* Search */}
                <div className="flex-1 min-w-0">
                    <Input
                        type="search"
                        placeholder="Buscar por ID, cliente ou telefone..."
                        value={filters?.search}
                        onChange={(e) => onFilterChange('search', e?.target?.value)}
                        className="w-full"
                    />
                </div>

                {/* Status Filter */}
                <div className="w-full lg:w-48">
                    <Select
                        options={statusOptions}
                        value={filters?.status}
                        onChange={(value) => onFilterChange('status', value)}
                        placeholder="Status"
                    />
                </div>

                {/* Date Range */}
                <div className="flex gap-2">
                    <Input
                        type="date"
                        value={filters?.dateFrom}
                        onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
                        className="w-full lg:w-40"
                    />
                    <Input
                        type="date"
                        value={filters?.dateTo}
                        onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
                        className="w-full lg:w-40"
                    />
                </div>

                {/* Sort */}
                <div className="w-full lg:w-48">
                    <Select
                        options={sortOptions}
                        value={filters?.sort}
                        onChange={(value) => onFilterChange('sort', value)}
                        placeholder="Ordenar por"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        iconName="X"
                        iconPosition="left"
                    >
                        Limpar
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onExport}
                        iconName="Download"
                        iconPosition="left"
                    >
                        Exportar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderFilters;