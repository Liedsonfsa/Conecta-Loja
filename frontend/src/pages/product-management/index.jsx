import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

import Button from '../../components/ui/ButtonDash';
import { Checkbox } from '../../components/ui/Checkbox';

// Import components
import ProductTable from './components/ProductTable';
import ProductFilters from './components/ProductFilters';
import ProductForm from './components/ProductForm';
import BulkActions from './components/BulkActions';
import StatsCards from './components/StatsCards';
import CategoryManager from './components/CategoryManager';

const ProductManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stockFilter, setStockFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Mock data
  useEffect(() => {
    const mockProducts = [
      {
        id: '1',
        name: 'Pizza Margherita',
        description: 'Pizza clássica com molho de tomate, mussarela e manjericão fresco',
        price: 32.90,
        category: 'Pizzas',
        stock: 25,
        isAvailable: true,
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
        images: ['https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'],
        discount: 0,
        discountType: 'percentage',
        createdAt: '2025-01-05T10:00:00Z',
        updatedAt: '2025-01-09T14:30:00Z'
      },
      {
        id: '2',
        name: 'Hambúrguer Artesanal',
        description: 'Hambúrguer 180g com queijo cheddar, alface, tomate e molho especial',
        price: 28.50,
        category: 'Hambúrgueres',
        stock: 8,
        isAvailable: true,
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
        images: ['https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'],
        discount: 10,
        discountType: 'percentage',
        createdAt: '2025-01-06T09:15:00Z',
        updatedAt: '2025-01-09T16:45:00Z'
      },
      {
        id: '3',
        name: 'Refrigerante Coca-Cola',
        description: 'Coca-Cola gelada 350ml',
        price: 5.50,
        category: 'Bebidas',
        stock: 0,
        isAvailable: false,
        image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg',
        images: ['https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg'],
        discount: 0,
        discountType: 'percentage',
        createdAt: '2025-01-07T11:20:00Z',
        updatedAt: '2025-01-09T12:10:00Z'
      },
      {
        id: '4',
        name: 'Lasanha Bolonhesa',
        description: 'Lasanha tradicional com molho bolonhesa e queijo gratinado',
        price: 24.90,
        category: 'Massas',
        stock: 15,
        isAvailable: true,
        image: 'https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg',
        images: ['https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg'],
        discount: 5.00,
        discountType: 'fixed',
        createdAt: '2025-01-08T13:45:00Z',
        updatedAt: '2025-01-09T18:20:00Z'
      },
      {
        id: '5',
        name: 'Salada Caesar',
        description: 'Salada fresca com alface romana, croutons, parmesão e molho caesar',
        price: 18.90,
        category: 'Saladas',
        stock: 12,
        isAvailable: true,
        image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
        images: ['https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg'],
        discount: 0,
        discountType: 'percentage',
        createdAt: '2025-01-08T15:30:00Z',
        updatedAt: '2025-01-09T19:15:00Z'
      },
      {
        id: '6',
        name: 'Brownie com Sorvete',
        description: 'Brownie de chocolate quente com sorvete de baunilha e calda',
        price: 15.90,
        category: 'Sobremesas',
        stock: 20,
        isAvailable: true,
        image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
        images: ['https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'],
        discount: 0,
        discountType: 'percentage',
        createdAt: '2025-01-09T08:00:00Z',
        updatedAt: '2025-01-09T20:00:00Z'
      }
    ];

    const mockCategories = ['Pizzas', 'Hambúrgueres', 'Bebidas', 'Massas', 'Saladas', 'Sobremesas'];

    setProducts(mockProducts);
    setCategories(mockCategories);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev?.map(p => 
        p?.id === editingProduct?.id ? { ...productData, id: editingProduct?.id } : p
      ));
    } else {
      // Add new product
      setProducts(prev => [...prev, productData]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(prev => prev?.filter(p => p?.id !== productId));
      setSelectedProducts(prev => prev?.filter(id => id !== productId));
    }
  };

  const handleToggleAvailability = (productId) => {
    setProducts(prev => prev?.map(p => 
      p?.id === productId ? { ...p, isAvailable: !p?.isAvailable, updatedAt: new Date()?.toISOString() } : p
    ));
  };

  const handleProductSelection = (productId, isSelected) => {
    if (isSelected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev?.filter(id => id !== productId));
    }
  };

  const handleSelectAllProducts = (isSelected) => {
    if (isSelected) {
      setSelectedProducts(products?.map(p => p?.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleBulkUpdate = (productIds, updateData) => {
    setProducts(prev => prev?.map(product => {
      if (!productIds?.includes(product?.id)) return product;

      const updatedProduct = { ...product, updatedAt: new Date()?.toISOString() };

      switch (updateData?.action) {
        case 'category':
          updatedProduct.category = updateData?.category;
          break;
        case 'availability':
          updatedProduct.isAvailable = updateData?.isAvailable;
          break;
        case 'stock':
          const { type, value } = updateData?.stockAdjustment;
          if (type === 'add') {
            updatedProduct.stock += value;
          } else if (type === 'subtract') {
            updatedProduct.stock = Math.max(0, updatedProduct?.stock - value);
          } else if (type === 'set') {
            updatedProduct.stock = value;
          }
          break;
        case 'discount':
          updatedProduct.discount = updateData?.discount?.value;
          updatedProduct.discountType = updateData?.discount?.type;
          break;
        case 'delete':
          return null; // Will be filtered out
      }

      return updatedProduct;
    })?.filter(Boolean));

    if (updateData?.action === 'delete') {
      setSelectedProducts([]);
    }
  };

  const handleAddCategory = (categoryName) => {
    if (!categories?.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
    }
  };

  const handleDeleteCategory = (categoryName) => {
    setCategories(prev => prev?.filter(cat => cat !== categoryName));
    // Update products that had this category
    setProducts(prev => prev?.map(p => 
      p?.category === categoryName ? { ...p, category: '', updatedAt: new Date()?.toISOString() } : p
    ));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setStockFilter('all');
    setAvailabilityFilter('all');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleSidebarToggle} isSidebarCollapsed={isSidebarCollapsed} />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleSidebarToggle}
        className="lg:block hidden"
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Gestão de Produtos</h1>
              <p className="text-muted-foreground">
                Gerencie seu catálogo de produtos, estoque e disponibilidade
              </p>
            </div>
            <Button
              onClick={handleAddProduct}
              iconName="Plus"
              iconPosition="left"
              size="lg"
            >
              Novo Produto
            </Button>
          </div>

          {/* Stats Cards */}
          <StatsCards products={products} />

          {/* Category Manager */}
          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            products={products}
          />

          {/* Product Form */}
          {showProductForm && (
            <div className="mb-6">
              <ProductForm
                product={editingProduct}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                categories={categories}
              />
            </div>
          )}

          {/* Filters */}
          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            stockFilter={stockFilter}
            onStockFilterChange={setStockFilter}
            availabilityFilter={availabilityFilter}
            onAvailabilityFilterChange={setAvailabilityFilter}
            onClearFilters={clearFilters}
            categories={categories}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedProducts={selectedProducts}
            onBulkUpdate={handleBulkUpdate}
            onClearSelection={() => setSelectedProducts([])}
            products={products}
          />

          {/* Product Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Table Header with Select All */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedProducts?.length === products?.length && products?.length > 0}
                  onChange={(e) => handleSelectAllProducts(e?.target?.checked)}
                />
                <span className="text-sm font-medium text-foreground">
                  {selectedProducts?.length > 0 
                    ? `${selectedProducts?.length} de ${products?.length} selecionados`
                    : `${products?.length} produtos`
                  }
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                >
                  Exportar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Upload"
                  iconPosition="left"
                >
                  Importar
                </Button>
              </div>
            </div>

            {/* Enhanced Product Table with Selection */}
            <div className="relative">
              <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onToggleAvailability={handleToggleAvailability}
                onDelete={handleDeleteProduct}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                priceRange={priceRange}
                stockFilter={stockFilter}
                availabilityFilter={availabilityFilter}
                selectedProducts={selectedProducts}
                onProductSelection={handleProductSelection}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductManagement;