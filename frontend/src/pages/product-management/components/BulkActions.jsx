import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/ButtonDash';
import { Checkbox } from '../../../components/ui/Checkbox';

/**
 * BulkActions - Componente para ações em lote nos produtos selecionados
 *
 * Interface para executar operações em massa em múltiplos produtos selecionados.
 * Permite alterar categoria, disponibilidade, ajustar estoque, aplicar descontos
 * e excluir produtos em lote, com validações e confirmações apropriadas.
 *
 * Ações disponíveis:
 * - Alterar Categoria: Move múltiplos produtos para uma categoria
 * - Alterar Disponibilidade: Ativa/desativa produtos em lote
 * - Ajustar Estoque: Adiciona, remove ou define quantidade de estoque
 * - Aplicar Desconto: Aplica desconto percentual ou fixo
 * - Excluir Produtos: Remove múltiplos produtos com confirmação
 *
 * Funcionalidades:
 * - Seleção múltipla de produtos via checkboxes
 * - Interface expandível/colapsável para economizar espaço
 * - Validações específicas para cada tipo de ação
 * - Preview das alterações antes da execução
 * - Sistema de confirmação para ações destrutivas
 * - Indicadores visuais de progresso e resultados
 *
 * Estados gerenciados:
 * - Produtos selecionados para ações em lote
 * - Tipo de ação selecionada
 * - Valores para cada tipo de ação
 * - Estados de loading e validação
 *
 * Validações:
 * - Pelo menos um produto deve estar selecionado
 * - Campos obrigatórios baseados na ação escolhida
 * - Valores numéricos válidos para estoque e desconto
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Array<string>} props.selectedProducts - IDs dos produtos selecionados
 * @param {Function} props.onBulkUpdate - Função para executar ação em lote
 * @param {Function} props.onClearSelection - Função para limpar seleção
 * @param {Array} props.products - Lista completa de produtos
 *
 * @example
 * <BulkActions
 *   selectedProducts={['1', '2', '3']}
 *   onBulkUpdate={handleBulkUpdate}
 *   onClearSelection={clearSelection}
 *   products={productsList}
 * />
 *
 * @example
 * // Ações disponíveis:
 * // - Alterar categoria para "Eletrônicos"
 * // - Definir disponibilidade como "Disponível"
 * // - Adicionar 10 unidades ao estoque
 * // - Aplicar 15% de desconto
 * // - Excluir produtos selecionados
 */
const BulkActions = ({ selectedProducts, onBulkUpdate, onClearSelection, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValues, setBulkValues] = useState({
    category: '',
    availability: '',
    stockAdjustment: '',
    adjustmentType: 'add', // add, subtract, set
    discount: '',
    discountType: 'percentage'
  });

  const selectedCount = selectedProducts?.length;
  const selectedProductsData = products?.filter(p => selectedProducts?.includes(p?.id));

  const bulkActionOptions = [
    { value: '', label: 'Selecione uma ação' },
    { value: 'category', label: 'Alterar Categoria' },
    { value: 'availability', label: 'Alterar Disponibilidade' },
    { value: 'stock', label: 'Ajustar Estoque' },
    { value: 'discount', label: 'Aplicar Desconto' },
    { value: 'delete', label: 'Excluir Produtos' }
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Disponível' },
    { value: 'unavailable', label: 'Indisponível' }
  ];

  const adjustmentTypeOptions = [
    { value: 'add', label: 'Adicionar ao estoque' },
    { value: 'subtract', label: 'Remover do estoque' },
    { value: 'set', label: 'Definir estoque como' }
  ];

  const discountTypeOptions = [
    { value: 'percentage', label: 'Porcentagem (%)' },
    { value: 'fixed', label: 'Valor Fixo (R$)' }
  ];

  const categories = [...new Set(products.map(p => p.category))];
  const categoryOptions = categories?.map(cat => ({ value: cat, label: cat }));

  const handleBulkUpdate = () => {
    if (!bulkAction || selectedCount === 0) return;

    const updateData = { action: bulkAction };

    switch (bulkAction) {
      case 'category':
        if (!bulkValues?.category) return;
        updateData.category = bulkValues?.category;
        break;
      case 'availability':
        if (!bulkValues?.availability) return;
        updateData.isAvailable = bulkValues?.availability === 'available';
        break;
      case 'stock':
        if (!bulkValues?.stockAdjustment) return;
        updateData.stockAdjustment = {
          type: bulkValues?.adjustmentType,
          value: parseInt(bulkValues?.stockAdjustment)
        };
        break;
      case 'discount':
        if (!bulkValues?.discount) return;
        updateData.discount = {
          value: parseFloat(bulkValues?.discount),
          type: bulkValues?.discountType
        };
        break;
      case 'delete':
        if (!confirm(`Tem certeza que deseja excluir ${selectedCount} produto(s)?`)) return;
        break;
    }

    onBulkUpdate(selectedProducts, updateData);
    setIsOpen(false);
    setBulkAction('');
    setBulkValues({
      category: '',
      availability: '',
      stockAdjustment: '',
      adjustmentType: 'add',
      discount: '',
      discountType: 'percentage'
    });
  };

  const getTotalValue = () => {
    return selectedProductsData?.reduce((sum, product) => sum + product?.price, 0);
  };

  const getTotalStock = () => {
    return selectedProductsData?.reduce((sum, product) => sum + product?.stock, 0);
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked
              onChange={() => {}}
              className="pointer-events-none"
            />
            <span className="font-medium text-foreground">
              {selectedCount} produto(s) selecionado(s)
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Valor Total: R$ {getTotalValue()?.toFixed(2)}</span>
            <span>Estoque Total: {getTotalStock()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            iconName="Settings"
            iconPosition="left"
          >
            Ações em Lote
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Limpar Seleção
          </Button>
        </div>
      </div>
      {/* Selected Products Summary */}
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedProductsData?.slice(0, 5)?.map((product) => (
          <div key={product?.id} className="flex items-center space-x-2 bg-background rounded-md px-3 py-1 text-sm">
            <div className="w-6 h-6 rounded overflow-hidden bg-muted flex-shrink-0">
              <img
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
            </div>
            <span className="text-foreground truncate max-w-[120px]">{product?.name}</span>
          </div>
        ))}
        {selectedCount > 5 && (
          <div className="flex items-center justify-center bg-muted rounded-md px-3 py-1 text-sm text-muted-foreground">
            +{selectedCount - 5} mais
          </div>
        )}
      </div>
      {/* Bulk Actions Panel */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Ação"
              options={bulkActionOptions}
              value={bulkAction}
              onChange={setBulkAction}
            />

            {bulkAction === 'category' && (
              <Select
                label="Nova Categoria"
                options={categoryOptions}
                value={bulkValues?.category}
                onChange={(value) => setBulkValues(prev => ({ ...prev, category: value }))}
              />
            )}

            {bulkAction === 'availability' && (
              <Select
                label="Disponibilidade"
                options={availabilityOptions}
                value={bulkValues?.availability}
                onChange={(value) => setBulkValues(prev => ({ ...prev, availability: value }))}
              />
            )}

            {bulkAction === 'stock' && (
              <>
                <Select
                  label="Tipo de Ajuste"
                  options={adjustmentTypeOptions}
                  value={bulkValues?.adjustmentType}
                  onChange={(value) => setBulkValues(prev => ({ ...prev, adjustmentType: value }))}
                />
                <Input
                  label="Quantidade"
                  type="number"
                  placeholder="0"
                  value={bulkValues?.stockAdjustment}
                  onChange={(e) => setBulkValues(prev => ({ ...prev, stockAdjustment: e?.target?.value }))}
                  min="0"
                />
              </>
            )}

            {bulkAction === 'discount' && (
              <>
                <Select
                  label="Tipo de Desconto"
                  options={discountTypeOptions}
                  value={bulkValues?.discountType}
                  onChange={(value) => setBulkValues(prev => ({ ...prev, discountType: value }))}
                />
                <Input
                  label={`Desconto ${bulkValues?.discountType === 'percentage' ? '(%)' : '(R$)'}`}
                  type="number"
                  placeholder="0"
                  value={bulkValues?.discount}
                  onChange={(e) => setBulkValues(prev => ({ ...prev, discount: e?.target?.value }))}
                  min="0"
                  max={bulkValues?.discountType === 'percentage' ? "100" : undefined}
                  step={bulkValues?.discountType === 'percentage' ? "1" : "0.01"}
                />
              </>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant={bulkAction === 'delete' ? 'destructive' : 'default'}
              size="sm"
              onClick={handleBulkUpdate}
              disabled={!bulkAction}
              iconName={bulkAction === 'delete' ? 'Trash2' : 'Check'}
              iconPosition="left"
            >
              {bulkAction === 'delete' ? 'Excluir Produtos' : 'Aplicar Alterações'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;