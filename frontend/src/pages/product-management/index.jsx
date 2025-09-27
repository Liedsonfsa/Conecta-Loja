import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

import Button from '../../components/ui/ButtonDash';

// Import API services
import { productService, categoryService } from '../../api';

// Import confirmation dialog
import ConfirmDialog from '../../components/ui/ConfirmDialog';

// Import toast system
import { useToast } from '../../hooks/use-toast';

// Import components
import ProductTable from './components/ProductTable';
import ProductFilters from './components/ProductFilters';
import ProductForm from './components/ProductForm';
import StatsCards from './components/StatsCards';
import CategoryManager from './components/CategoryManager';

const ProductManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({}); // Mapeamento ID -> Nome

  // Loading states
  const [loading, setLoading] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);

  // Toast system
  const { toast } = useToast();

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    variant: 'default',
    onConfirm: () => {},
    onClose: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stockFilter, setStockFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Helper function to show confirmation dialog
  const showConfirmDialog = (title, description, onConfirm, options = {}) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      variant: options.variant || 'default',
      onConfirm,
      onClose: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
    });
  };

  // Função para carregar categorias da API
  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.categories) {
        const categoryNames = response.categories.map(cat => cat.name);
        const categoryMapping = {};
        response.categories.forEach(cat => {
          categoryMapping[cat.id] = cat.name;
        });
        setCategories(categoryNames);
        setCategoryMap(categoryMapping);
      }
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);

      // Mensagens específicas baseadas no tipo de erro
      let errorTitle = "Erro ao carregar categorias";
      let errorDescription = err.message || "Não foi possível carregar as categorias.";

      // Verificar tipos específicos de erro
      if (err.message && err.message.includes("conexão")) {
        errorTitle = "Problema de conexão";
        errorDescription = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
      } else if (err.message && err.message.includes("não autorizado")) {
        errorTitle = "Acesso negado";
        errorDescription = "Você não tem permissão para acessar as categorias.";
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorDescription,
      });
    }
  };

  // Função para carregar produtos da API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      if (response.success && response.products) {
        // Converter produtos da API para formato do frontend
        const formattedProducts = response.products.map(product => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          category: categoryMap[product.categoryId] || 'Categoria não encontrada',
          stock: product.estoque || 0,
          isAvailable: product.available,
          image: product.image || '',
          images: product.image ? [product.image] : [],
          discount: product.discount || 0,
          discountType: product.discountType === 'FIXED_VALUE' ? 'fixed' : 'percentage',
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));
        setProducts(formattedProducts);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);

      // Mensagens específicas baseadas no tipo de erro
      let errorTitle = "Erro ao carregar produtos";
      let errorDescription = err.message || "Não foi possível carregar os produtos.";

      // Verificar tipos específicos de erro
      if (err.message && err.message.includes("conexão")) {
        errorTitle = "Problema de conexão";
        errorDescription = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
      } else if (err.message && err.message.includes("não autorizado")) {
        errorTitle = "Acesso negado";
        errorDescription = "Você não tem permissão para acessar os produtos.";
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorDescription,
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadCategories();
  }, []);

  // Carregar produtos quando as categorias estiverem disponíveis
  useEffect(() => {
    if (Object.keys(categoryMap).length > 0) {
      loadProducts();
    }
  }, [categoryMap]);

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

  const handleSaveProduct = async (productData) => {
    try {
      setSavingProduct(true);

      // Converter dados do frontend para formato da API
      const apiData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        categoryId: productData.categoryId, // Já vem como ID do ProductForm
        available: productData.available !== undefined ? productData.available : true,
        estoque: productData.stock || 0,
        image: productData.image || null,
        discount: productData.discount || 0,
        discountType: productData.discountType === 'fixed' ? 'FIXED_VALUE' : 'PERCENTAGE'
      };

    if (editingProduct) {
      // Update existing product
        await productService.updateProduct(parseInt(editingProduct.id), apiData);
    } else {
      // Add new product
        await productService.createProduct(apiData);
    }

      // Recarregar produtos após operação
      await loadProducts();
    setShowProductForm(false);
    setEditingProduct(null);
    } catch (err) {
      console.error('Erro ao salvar produto:', err);

      // Mensagens específicas baseadas no tipo de erro
      let errorTitle = "Erro ao salvar produto";
      let errorDescription = err.message || "Não foi possível salvar o produto.";

      // Verificar tipos específicos de erro
      if (err.message && err.message.includes("obrigatório")) {
        errorTitle = "Dados obrigatórios";
        errorDescription = err.message; // Já contém mensagem específica
      } else if (err.message && err.message.includes("inválido")) {
        errorTitle = "Dados inválidos";
        errorDescription = err.message; // Já contém mensagem específica
      } else if (err.message && err.message.includes("não encontrada")) {
        errorTitle = "Categoria não encontrada";
        errorDescription = "A categoria selecionada não foi encontrada. Selecione uma categoria válida.";
      } else if (err.message && err.message.includes("não autorizado")) {
        errorTitle = "Sem permissão";
        errorDescription = "Você não tem permissão para salvar produtos.";
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorDescription,
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const product = products.find(p => p.id === productId?.toString());
    const productName = product?.name || 'este produto';

    showConfirmDialog(
      'Excluir Produto',
      `Tem certeza que deseja excluir "${productName}"? Esta ação não pode ser desfeita.`,
      async () => {
      try {
        setDeletingProduct(true);

        await productService.deleteProduct(parseInt(productId));

          // Recarregar produtos após exclusão
          await loadProducts();
        } catch (err) {
          console.error('Erro ao excluir produto:', err);

          // Mensagens específicas baseadas no tipo de erro
          let errorTitle = "Erro ao excluir produto";
          let errorDescription = err.message || "Não foi possível excluir o produto.";

          // Verificar tipos específicos de erro
          if (err.message && err.message.includes("não encontrado")) {
            errorTitle = "Produto não encontrado";
            errorDescription = "O produto que você tentou excluir não foi encontrado.";
          } else if (err.message && err.message.includes("não autorizado")) {
            errorTitle = "Sem permissão";
            errorDescription = "Você não tem permissão para excluir este produto.";
          }

          toast({
            variant: "destructive",
            title: errorTitle,
            description: errorDescription,
          });
        } finally {
          setDeletingProduct(false);
        }
      },
      { variant: 'destructive', confirmText: 'Excluir' }
    );
  };




  const handleAddCategory = async (categoryName) => {
    try {
    if (!categories?.includes(categoryName)) {
        await categoryService.createCategory({ name: categoryName });

        // Recarregar categorias após criação
        await loadCategories();
        await loadProducts(); // Recarregar produtos para atualizar mapeamento
      }
    } catch (err) {
      console.error('Erro ao criar categoria:', err);

      // Mensagens específicas baseadas no tipo de erro
      let errorTitle = "Erro ao criar categoria";
      let errorDescription = err.message || "Não foi possível criar a categoria.";

      // Verificar tipos específicos de erro
      if (err.message && err.message.includes("já existe")) {
        errorTitle = "Categoria já existe";
        errorDescription = "Já existe uma categoria com este nome. Escolha um nome diferente.";
      } else if (err.message && err.message.includes("obrigatório")) {
        errorTitle = "Nome obrigatório";
        errorDescription = "O nome da categoria é obrigatório.";
      } else if (err.message && err.message.includes("não autorizado")) {
        errorTitle = "Sem permissão";
        errorDescription = "Você não tem permissão para criar categorias.";
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorDescription,
      });
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    try {
      // Encontrar o ID da categoria pelo nome
      const categoryId = Object.keys(categoryMap).find(key => categoryMap[key] === categoryName);
      if (!categoryId) return;

      await categoryService.deleteCategory(parseInt(categoryId));

      // Recarregar categorias após exclusão
      await loadCategories();
      await loadProducts(); // Recarregar produtos para atualizar mapeamento
    } catch (err) {
      console.error('Erro ao excluir categoria:', err);
      // Tratamento de erro específico já é feito no CategoryManager.jsx
      throw err; // Relançar para que o CategoryManager trate
    }
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
              disabled={loading || savingProduct}
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

          {/* Loading State */}
          {loading && (
            <div className="mb-6 flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando produtos...</p>
              </div>
            </div>
          )}

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
                loading={savingProduct}
                categoryMap={categoryMap}
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

          {/* Product Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
              <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                priceRange={priceRange}
                stockFilter={stockFilter}
                availabilityFilter={availabilityFilter}
              />
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.onClose}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
      />
    </div>
  );
};

export default ProductManagement;