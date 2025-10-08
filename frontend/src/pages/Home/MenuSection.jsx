import React, { useState } from "react";
import Button from "../../components/ui/Button";
import { useCart } from "../../hooks/useCart.jsx";
import { useToast } from "../../hooks/use-toast";

/**
 * MenuSection - Seção de apresentação do cardápio na página inicial
 *
 * Exibe uma prévia do cardápio com filtros por categoria,
 * mostrando itens organizados em grid responsivo. Permite
 * ao usuário explorar diferentes categorias de produtos
 * antes de acessar a página completa do menu.
 * Integra funcionalidade de adicionar itens ao carrinho.
 *
 * @returns {JSX.Element} Seção de menu com filtros e grid de produtos
 *
 * @example
 * // Usado na página inicial após a seção hero
 * <MenuSection />
 */

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [quantities, setQuantities] = useState({});

  // Hooks do carrinho e toast
  const { addItem } = useCart();
  const { toast } = useToast();

  const categories = ["Todos", "Pizzas", "Burgers", "Bebidas", "Sobremesas"];

  const menuItems = [
    {
      id: 1,
      name: "Pizza Margherita",
      description:
        "Molho de tomate, mussarela, manjericão fresco e azeite de oliva",
      price: 45.9,
      priceFormatted: "R$ 45,90",
      category: "Pizzas",
      image: "/images/img_pizza_margherita.png",
      available: true,
    },
    {
      id: 2,
      name: "Burger Clássico",
      description:
        "Hambúrguer artesanal, queijo, alface, tomate, cebola e molho especial",
      price: 32.9,
      priceFormatted: "R$ 32,90",
      category: "Burgers",
      image: "/images/img_burger_cl_ssico.png",
      available: true,
    },
    {
      id: 3,
      name: "Pizza Pepperoni",
      description: "Molho de tomate, mussarela e generosas fatias de pepperoni",
      price: 52.9,
      priceFormatted: "R$ 52,90",
      category: "Pizzas",
      image: "/images/img_pizza_margherita.png",
      available: true,
    },
    {
      id: 4,
      name: "Coca-Cola 350ml",
      description: "Refrigerante gelado",
      price: 6.9,
      priceFormatted: "R$ 6,90",
      category: "Bebidas",
      image: "/images/img_coca_cola_350ml.png",
      available: true,
    },
    {
      id: 5,
      name: "Burger Bacon",
      description:
        "Hambúrguer artesanal, queijo, bacon crocante, alface e molho barbecue",
      price: 38.9,
      priceFormatted: "R$ 38,90",
      category: "Burgers",
      image: "/images/img_burger_cl_ssico.png",
      available: true,
    },
    {
      id: 6,
      name: "Brownie com Sorvete",
      description:
        "Brownie quentinho com sorvete de baunilha e calda de chocolate",
      price: 18.9,
      priceFormatted: "R$ 18,90",
      category: "Sobremesas",
      image: "/images/img_brownie_com_sorvete.png",
      available: false,
    },
  ];

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
