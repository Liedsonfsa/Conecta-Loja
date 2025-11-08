import { useState, useEffect, useCallback } from "react";
import { productService } from "@/api/products";
import { categoryService } from "@/api/categories";
import { useToast } from "./use-toast";

/**
 * Hook personalizado para gerenciar produtos
 * Conecta-Loja - Frontend
 *
 * Fornece funcionalidades para:
 * - Buscar produtos com filtros e paginação
 * - Buscar produto específico por ID
 * - Gerenciar estado de loading e erros
 * - Cache de produtos para otimização
 */

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    categoryId: null,
    available: true,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { toast } = useToast();

  /**
   * Busca produtos com filtros aplicados
   */
  const fetchProducts = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = {
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          search: params.search || filters.search,
          categoryId: params.categoryId || filters.categoryId,
          available:
            params.available !== undefined
              ? params.available
              : filters.available,
        };

        const response = await productService.getAllProducts(searchParams);

        if (response.success) {
          setProducts(response.data || []);
          setPagination({
            page: response.page || 1,
            limit: response.limit || 12,
            total: response.total || 0,
            totalPages: response.totalPages || 0,
          });
        } else {
          throw new Error(response.message || "Erro ao buscar produtos");
        }
      } catch (err) {
        const errorMessage = err.message || "Erro ao carregar produtos";
        setError(errorMessage);
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, filters, toast]
  );

  /**
   * Busca produto específico por ID
   */
  const fetchProductById = useCallback(
    async (productId) => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await productService.getProductById(productId);

        if (response.success) {
          setCurrentProduct(response.data);
          return response.data;
        } else {
          throw new Error(response.message || "Produto não encontrado");
        }
      } catch (err) {
        const errorMessage = err.message || "Erro ao carregar produto";
        setError(errorMessage);
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Busca todas as categorias
   */
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  }, []);

  /**
   * Atualiza filtros e busca produtos
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Limpa filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      categoryId: null,
      available: true,
      sortBy: "name",
      sortOrder: "asc",
    });
  }, []);

  /**
   * Muda página
   */
  const changePage = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  /**
   * Busca produtos quando filtros mudam
   */
  useEffect(() => {
    fetchProducts();
  }, [filters, fetchProducts]);

  /**
   * Busca categorias na inicialização
   */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    // Estado
    products,
    categories,
    currentProduct,
    loading,
    error,
    pagination,
    filters,

    // Ações
    fetchProducts,
    fetchProductById,
    fetchCategories,
    updateFilters,
    clearFilters,
    changePage,

    // Utilitários
    hasNextPage: pagination.page < pagination.totalPages,
    hasPrevPage: pagination.page > 1,
    isEmpty: products.length === 0 && !loading,
  };
};

export default useProducts;
