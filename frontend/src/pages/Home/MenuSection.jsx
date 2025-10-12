import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { useCart } from "../../hooks/useCart.jsx";
import { useToast } from "../../hooks/use-toast";
import { productService } from "../../api/products";
import { categoryService } from "../../api/categories";

/**
 * MenuSection - Seção dinâmica de apresentação do cardápio na página inicial
 *
 * Exibe uma prévia dinâmica do cardápio com filtros por categoria,
 * mostrando produtos organizados em grid responsivo. Carrega dados
 * diretamente da API, incluindo produtos disponíveis e categorias ativas.
 * Permite ao usuário explorar diferentes categorias de produtos antes
 * de acessar a página completa do menu. Integra funcionalidade de
 * adicionar itens ao carrinho com estados de loading e tratamento de erros.
 *
 * @returns {JSX.Element} Seção de menu dinâmica com filtros e grid de produtos
 *
 * @example
 * // Usado na página inicial após a seção hero
 * <MenuSection />
 *
 * @features
 * - Carregamento dinâmico de produtos da API
 * - Filtros por categoria dinâmicos
 * - Estados de loading com spinner
 * - Tratamento de erros com botão de retry
 * - Integração com sistema de carrinho
 * - Formatação automática de preços
 */

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [quantities, setQuantities] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hooks do carrinho e toast
  const { addItem } = useCart();
  const { toast } = useToast();

  /**
   * Busca produtos disponíveis da API
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAvailableProducts();
      if (response.success) {
        // Mapeia os dados da API para o formato esperado pelo componente
        const formattedProducts = response.products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          priceFormatted: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(product.price),
          category: product.category?.name || 'Sem categoria',
          categoryId: product.categoryId,
          image: product.image || '/images/placeholder.png',
          available: product.available,
        }));
        setMenuItems(formattedProducts);
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca categorias da API
   */
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success) {
        // Adiciona "Todos" no início da lista
        const formattedCategories = [
          "Todos",
          ...response.categories.map(category => category.name)
        ];
        setCategories(formattedCategories);
      }
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      // Mantém as categorias padrão em caso de erro
      setCategories(["Todos", "Pizzas", "Burgers", "Bebidas", "Sobremesas"]);
    }
  };

  // Busca dados ao montar o componente
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /**
   * Manipula a mudança de quantidade de um item do menu
   * @param {string|number} itemId - ID do item do menu
   * @param {number} change - Mudança na quantidade (+1 ou -1)
   */
  const handleQuantityChange = (itemId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev?.[itemId] || 1) + change),
    }));
  };

  /**
   * Adiciona item ao carrinho
   * @param {Object} item - Item do menu a ser adicionado
   */
  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;

    // Adiciona o item ao carrinho
    addItem(item, quantity);

    // Mostra toast de confirmação
    toast({
      title: "Item adicionado!",
      description: `${item.name} foi adicionado ao seu carrinho.`,
      duration: 3000,
    });

    // Reset da quantidade para 1
    setQuantities((prev) => ({
      ...prev,
      [item.id]: 1,
    }));
  };

  const filteredItems =
    selectedCategory === "Todos"
      ? menuItems
      : menuItems?.filter((item) => item?.category === selectedCategory);

  // Renderiza estado de loading
  if (loading) {
    return (
      <section className="w-full bg-[#f8f7f74c]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-[60px]">
          <div className="flex flex-col gap-[8px] items-center mb-11 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[35px] font-bold leading-[28px] sm:leading-[32px] md:leading-[38px] lg:leading-[44px] text-center text-[#2a2622] font-['Inter']">
              <span>Nosso </span>
              <span
                className="bg-gradient-to-r from-[#ff6600] to-[#ff531a] bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(166deg, #ff6600 0%, #ff531a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Cardápio
              </span>
            </h2>
            <p className="text-[16px] font-normal leading-[28px] text-center text-[#928c87] font-['Inter'] max-w-none">
              Carregando produtos deliciosos...
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6600]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Renderiza estado de erro
  if (error) {
    return (
      <section className="w-full bg-[#f8f7f74c]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-[60px]">
          <div className="flex flex-col gap-[8px] items-center mb-11 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[35px] font-bold leading-[28px] sm:leading-[32px] md:leading-[38px] lg:leading-[44px] text-center text-[#2a2622] font-['Inter']">
              <span>Nosso </span>
              <span
                className="bg-gradient-to-r from-[#ff6600] to-[#ff531a] bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(166deg, #ff6600 0%, #ff531a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Cardápio
              </span>
            </h2>
            <p className="text-[16px] font-normal leading-[28px] text-center text-[#928c87] font-['Inter'] max-w-none">
              {error}
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              text="Tentar Novamente"
              text_font_size="13"
              text_font_family="Inter"
              text_font_weight="400"
              text_line_height="17px"
              text_text_align="center"
              text_color="#ffffff"
              fill_background="#ff6600"
              fill_background_color="#ff6600"
              border_border="none"
              border_border_radius="10px"
              effect_box_shadow="0px 2px 8px #2a262219"
              layout_width="auto"
              layout_gap="0"
              position="relative"
              variant="default"
              size="medium"
              leftImage=""
              padding="12px 24px"
              onClick={() => {
                fetchProducts();
                fetchCategories();
              }}
              className="mt-8"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f8f7f74c]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-[60px]">
        {/* Section Header */}
        <div className="flex flex-col gap-[8px] items-center mb-11 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[35px] font-bold leading-[28px] sm:leading-[32px] md:leading-[38px] lg:leading-[44px] text-center text-[#2a2622] font-['Inter']">
            <span>Nosso </span>
            <span
              className="bg-gradient-to-r from-[#ff6600] to-[#ff531a] bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(166deg, #ff6600 0%, #ff531a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Cardápio
            </span>
          </h2>
          <p className="text-[16px] font-normal leading-[28px] text-center text-[#928c87] font-['Inter'] max-w-none">
            Escolha entre nossos deliciosos pratos preparados com ingredientes
            frescos e muito amor
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-20 w-full max-w-none mx-auto">
          {categories?.map((category) => (
            <Button
              key={category}
              text={category}
              text_font_size="13"
              text_font_family="Inter"
              text_font_weight="400"
              text_line_height={selectedCategory === category ? "16px" : "17px"}
              text_text_align="center"
              text_color={selectedCategory === category ? "#ffffff" : "#2a2622"}
              fill_background={
                selectedCategory === category ? "#ff6600" : "#ffffff"
              }
              fill_background_color={
                selectedCategory === category ? "#ff6600" : "#ffffff"
              }
              border_border={
                selectedCategory === category ? "none" : "1px solid #e8e6e3"
              }
              border_border_radius="10px"
              effect_box_shadow={
                selectedCategory === category ? "0px 2px 8px #2a262219" : "none"
              }
              padding="12px 24px"
              layout_width="auto"
              layout_gap="0"
              position="relative"
              variant="default"
              size="medium"
              leftImage=""
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            />
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full lg:w-[76%] mx-auto">
          {filteredItems?.map((item) => (
            <div
              key={item?.id}
              className="bg-white border border-[#e8e6e3] rounded-[12px] shadow-[0px_1px_2px_#0000000c] overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative w-full h-48">
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-full object-cover"
                />
                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <span className="text-[11px] font-bold leading-[14px] text-white bg-[#ff6600] rounded-[10px] px-[10px] py-[2px] font-['Inter']">
                    {item?.category}
                  </span>
                </div>
                {/* Unavailable Badge */}
                {!item?.available && (
                  <div className="absolute inset-0 bg-[#0000007f] flex items-center justify-center">
                    <span className="text-[11px] font-bold leading-[15px] text-white bg-[#dd3c3c] rounded-[10px] px-[10px] py-[2px] font-['Inter']">
                      Indisponível
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col gap-3">
                {/* Item Info */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[17px] font-bold leading-[21px] text-[#2a2622] font-['Inter']">
                    {item?.name}
                  </h3>
                  <p className="text-[13px] font-normal leading-[16px] text-[#928c87] font-['Inter']">
                    {item?.description}
                  </p>
                  <span className="text-[21px] font-bold leading-[27px] text-[#ff6600] font-['Inter']">
                    {item?.priceFormatted}
                  </span>
                </div>

                {/* Add to Cart Button */}
                {item?.available && (
                  <Button
                    text="Adicionar ao Carrinho"
                    text_font_size="13"
                    text_font_family="Inter"
                    text_font_weight="400"
                    text_line_height="17px"
                    text_text_align="center"
                    text_color="#ffffff"
                    fill_background="#ff6600"
                    fill_background_color="#ff6600"
                    border_border="none"
                    border_border_radius="10px"
                    effect_box_shadow="0px 2px 8px #2a262219"
                    layout_width="full"
                    layout_gap="0"
                    position="relative"
                    variant="default"
                    size="medium"
                    leftImage=""
                    padding="12px 34px"
                    onClick={() => handleAddToCart(item)}
                    className="w-full mt-3"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
