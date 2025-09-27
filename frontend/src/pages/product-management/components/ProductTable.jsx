import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/ButtonDash';

const ProductTable = ({ products, onEdit, onDelete, searchTerm, selectedCategory, priceRange, stockFilter, availabilityFilter }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         product?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product?.category === selectedCategory;
    const matchesPrice = product?.price >= priceRange?.[0] && product?.price <= priceRange?.[1];
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low' && product?.stock <= 10) ||
                        (stockFilter === 'out' && product?.stock === 0) ||
                        (stockFilter === 'in' && product?.stock > 0);
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && product?.isAvailable) ||
                               (availabilityFilter === 'unavailable' && !product?.isAvailable);

    return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesAvailability;
  });

  const sortedProducts = React.useMemo(() => {
    if (!sortConfig?.key) return filteredProducts;

    return [...filteredProducts]?.sort((a, b) => {
      if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Esgotado', color: 'text-destructive bg-destructive/10' };
    if (stock <= 10) return { label: 'Baixo', color: 'text-warning bg-warning/10' };
    return { label: 'Em Estoque', color: 'text-success bg-success/10' };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(price);
  };

  const calculateFinalPrice = (product) => {
    const basePrice = parseFloat(product?.price);
    const discount = parseFloat(product?.discount) || 0;

    if (discount > 0) {
      if (product?.discountType === 'percentage') {
        return basePrice * (1 - discount / 100);
      } else {
        return Math.max(0, basePrice - discount);
      }
    }

    return basePrice;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">Produto</th>
              <th 
                className="text-left p-4 font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center space-x-1">
                  <span>Preço</span>
                  <Icon 
                    name={sortConfig?.key === 'price' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className={sortConfig?.key === 'price' ? 'text-primary' : 'text-muted-foreground'}
                  />
                </div>
              </th>
              <th 
                className="text-left p-4 font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Categoria</span>
                  <Icon 
                    name={sortConfig?.key === 'category' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className={sortConfig?.key === 'category' ? 'text-primary' : 'text-muted-foreground'}
                  />
                </div>
              </th>
              <th 
                className="text-left p-4 font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center space-x-1">
                  <span>Estoque</span>
                  <Icon 
                    name={sortConfig?.key === 'stock' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className={sortConfig?.key === 'stock' ? 'text-primary' : 'text-muted-foreground'}
                  />
                </div>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Disponibilidade</th>
              <th className="text-left p-4 font-medium text-foreground">Última Atualização</th>
              <th className="text-right p-4 font-medium text-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts?.map((product) => {
              const stockStatus = getStockStatus(product?.stock);
              return (
                <tr key={product?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={product?.image}
                          alt={product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground truncate">{product?.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{product?.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="font-medium text-foreground">{formatPrice(calculateFinalPrice(product))}</span>
                      {product?.discount > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="line-through">{formatPrice(product?.price)}</span>
                          <span className="ml-2 text-success font-medium">
                            {product?.discountType === 'percentage' ? `${product?.discount}% OFF` : `R$ ${product?.discount} OFF`}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                      {product?.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus?.color}`}>
                        {stockStatus?.label}
                      </span>
                      <span className="text-sm text-muted-foreground">({product?.stock})</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product?.isAvailable
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {product?.isAvailable ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(product?.updatedAt)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                        title="Editar produto"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product?.id)}
                        title="Excluir produto"
                        className="text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedProducts?.map((product) => {
          const stockStatus = getStockStatus(product?.stock);
          return (
            <div key={product?.id} className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1">{product?.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product?.description}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{formatPrice(calculateFinalPrice(product))}</span>
                      {product?.discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(product?.price)}</span>
                      )}
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                      {product?.category}
                    </span>
                  </div>
                  {product?.discount > 0 && (
                    <div className="text-xs text-success font-medium">
                      {product?.discountType === 'percentage' ? `${product?.discount}% OFF` : `R$ ${product?.discount} OFF`}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus?.color}`}>
                      {stockStatus?.label}
                    </span>
                    <span className="text-sm text-muted-foreground">({product?.stock})</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product?.isAvailable
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}>
                    {product?.isAvailable ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Atualizado: {formatDate(product?.updatedAt)}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(product?.id)}
                    iconName="Trash2"
                    iconPosition="left"
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {sortedProducts?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou adicionar novos produtos ao catálogo.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;