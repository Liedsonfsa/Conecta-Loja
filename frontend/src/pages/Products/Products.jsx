import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart } from 'lucide-react';

import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Select from '@/components/ui/Select';
import { Separator } from '@/components/ui/separator';

/**
 * Página de Catálogo de Produtos - Conecta-Loja
 *
 * Exibe lista de produtos com filtros, busca e paginação.
 * Permite adicionar produtos ao carrinho e navegar para detalhes.
 */

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const {
    products,
    categories,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    clearFilters,
    changePage,
    fetchProducts
  } = useProducts();

  const { addItem, formatPrice } = useCart();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Inicializa filtros da URL
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlPage = parseInt(searchParams.get('page')) || 1;

    updateFilters({
      search: urlSearch,
      categoryId: urlCategory ? parseInt(urlCategory) : null
    });

    if (urlPage !== pagination.page) {
      changePage(urlPage);
    }
  }, []);

  // Atualiza URL quando filtros mudam
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.categoryId) params.set('category', filters.categoryId.toString());
    if (pagination.page > 1) params.set('page', pagination.page.toString());

    setSearchParams(params);
  }, [filters, pagination.page, setSearchParams]);

  /**
   * Manipula busca
   */
  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
    changePage(1); // Volta para primeira página
  };

  /**
   * Manipula filtro de categoria
   */
  const handleCategoryFilter = (categoryId) => {
    updateFilters({ categoryId: categoryId ? parseInt(categoryId) : null });
    changePage(1);
  };

  /**
   * Adiciona produto ao carrinho
   */
  const handleAddToCart = async (product) => {
    try {
      await addItem(product);
      toast({
        title: 'Produto adicionado!',
        description: `${product.name} foi adicionado ao carrinho.`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o produto ao carrinho.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Navega para página de detalhes do produto
   */
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  /**
   * Renderiza card do produto no modo grid
   */
  const renderProductCard = (product) => (
    <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div
          className="aspect-square overflow-hidden rounded-t-lg bg-gray-100 relative"
          onClick={() => handleProductClick(product.id)}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Grid className="w-12 h-12" />
            </div>
          )}

          {/* Badge de desconto */}
          {product.discount && product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              -{product.discountType === 'PERCENTAGE' ? `${product.discount}%` : formatPrice(product.discount)}
            </Badge>
          )}

          {/* Badge indisponível */}
          {!product.available && (
            <Badge className="absolute top-2 right-2 bg-gray-500">
              Indisponível
            </Badge>
          )}
        </div>

        <div className="p-4">
          <h3
            className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
            onClick={() => handleProductClick(product.id)}
          >
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {product.discount && product.discount > 0 ? (
                <>
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(product.price * (1 - (product.discountType === 'PERCENTAGE' ? product.discount / 100 : product.discount / product.price)))}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">4.5</span>
            </div>
          </div>

          {/* Estoque */}
          <div className="text-sm text-gray-600 mb-3">
            {product.estoque > 0 ? (
              <span className="text-green-600">Em estoque ({product.estoque})</span>
            ) : (
              <span className="text-red-600">Fora de estoque</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={() => handleProductClick(product.id)}
          variant="outline"
          className="flex-1"
        >
          Ver Detalhes
        </Button>
        <Button
          onClick={() => handleAddToCart(product)}
          disabled={!product.available || product.estoque <= 0}
          className="flex-1"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );

  /**
   * Renderiza produto no modo lista
   */
  const renderProductList = (product) => (
    <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div
            className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
            onClick={() => handleProductClick(product.id)}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Grid className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3
                className="font-semibold text-lg hover:text-blue-600 transition-colors"
                onClick={() => handleProductClick(product.id)}
              >
                {product.name}
              </h3>
              <div className="flex items-center gap-1 ml-4">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">4.5</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  {product.discount && product.discount > 0 ? (
                    <>
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(product.price * (1 - (product.discountType === 'PERCENTAGE' ? product.discount / 100 : product.discount / product.price)))}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  {product.estoque > 0 ? (
                    <span className="text-green-600">Em estoque ({product.estoque})</span>
                  ) : (
                    <span className="text-red-600">Fora de estoque</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleProductClick(product.id)}
                  variant="outline"
                  size="sm"
                >
                  Ver Detalhes
                </Button>
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.available || product.estoque <= 0}
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar produtos</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchProducts()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Produtos</h1>
        <p className="text-gray-600">Encontre os melhores produtos para sua loja</p>
      </div>

      {/* Barra de busca e filtros */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro de categoria */}
          <Select
            value={filters.categoryId || ''}
            onValueChange={handleCategoryFilter}
            className="w-full lg:w-64"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          {/* Botão de filtros avançados */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Filtros avançados */}
        {showFilters && (
          <Card className="p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <Select
                  value={`${filters.sortBy}_${filters.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('_');
                    updateFilters({ sortBy, sortOrder });
                  }}
                >
                  <option value="name_asc">Nome (A-Z)</option>
                  <option value="name_desc">Nome (Z-A)</option>
                  <option value="price_asc">Preço (Menor)</option>
                  <option value="price_desc">Preço (Maior)</option>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Barra de ferramentas */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {pagination.total} produto{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando produtos...</p>
        </div>
      )}

      {/* Lista de produtos */}
      {!loading && products.length > 0 && (
        <>
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {products.map(product =>
              viewMode === 'grid'
                ? renderProductCard(product)
                : renderProductList(product)
            )}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => changePage(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Anterior
              </Button>

              <span className="text-sm text-gray-600 mx-4">
                Página {pagination.page} de {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => changePage(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      {/* Estado vazio */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            Tente ajustar seus filtros ou termos de busca.
          </p>
          <Button onClick={clearFilters}>
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products;