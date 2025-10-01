import React from 'react';
//import Input from '../../../components/ui/Input';
import { Input } from 'src/components/ui/input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/ButtonDash';


const OrderFilters = ({
                          filters,
                          onFilterChange,
                          onClearFilters,
                          onExport
                      }) => {
    const statusOptions = [
        { value: '', label: 'Todos os Status' },
        { value: 'pending', label: 'Pendente' },
        { value: 'preparing', label: 'Preparando' },
        { value: 'ready', label: 'Pronto' },
        { value: 'en_route', label: 'A Caminho' },
        { value: 'delivered', label: 'Entregue' },
        { value: 'cancelled', label: 'Cancelado' }
    ];

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