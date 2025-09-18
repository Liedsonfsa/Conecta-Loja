import React, { useState } from 'react';
import Button from '../../components/ui/Button';

/**
 * MenuGrid - Componente de grade para exibição completa do cardápio
 *
 * Exibe todos os itens do menu em formato de grid responsivo,
 * com controles de quantidade individuais para cada item,
 * estados de seleção e disponibilidade. Inclui componentes
 * auxiliares para controle de quantidade e cards de produto.
 *
 * @returns {JSX.Element} Grade completa do menu com controles interativos
 *
 * @example
 * // Usado na página de menu
 * <MenuGrid />
 */

const MenuGrid = () => {
  const [quantities, setQuantities] = useState({});

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  const getQuantity = (itemId) => quantities?.[itemId] || 1;

  const menuItems = [
    {
      id: 'pizza-margherita-1',
      name: 'Pizza Margherita',
      description: 'Molho de tomate, mussarela, manjericão fresco e azeite de oliva',
      price: 'R$ 45,90',
      category: 'Pizzas',
      image: '/images/img_pizza_margherita.png',
      isSelected: false
    },
    {
      id: 'pizza-margherita-2',
      name: 'Pizza Margherita',
      description: 'Molho de tomate, mussarela, manjericão fresco e azeite de oliva',
      price: 'R$ 45,90',
      category: 'Pizzas',
      image: '/images/img_pizza_margherita_192x438.png',
      isSelected: true
    },
    {
      id: 'burger-classico-1',
      name: 'Burger Clássico',
      description: 'Hambúrguer artesanal, queijo, alface, tomate, cebola e molho especial',
      price: 'R$ 32,90',
      category: 'Burgers',
      image: '/images/img_burger_cl_ssico.png',
      isSelected: false
    },
    {
      id: 'burger-classico-2',
      name: 'Burger Clássico',
      description: 'Hambúrguer artesanal, queijo, alface, tomate, cebola e molho especial',
      price: 'R$ 32,90',
      category: 'Burgers',
      image: '/images/img_burger_cl_ssico_192x438.png',
      isSelected: true
    },
    {
      id: 'pizza-pepperoni-1',
      name: 'Pizza Pepperoni',
      description: 'Molho de tomate, mussarela e generosas fatias de pepperoni',
      price: 'R$ 52,90',
      category: 'Pizzas',
      image: null,
      isSelected: false
    },
    {
      id: 'pizza-pepperoni-2',
      name: 'Pizza Pepperoni',
      description: 'Molho de tomate, mussarela e generosas fatias de pepperoni',
      price: 'R$ 52,90',
      category: 'Pizzas',
      image: null,
      isSelected: true
    },
    {
      id: 'coca-cola-1',
      name: 'Coca-Cola 350ml',
      description: 'Refrigerante gelado',
      price: 'R$ 6,90',
      category: 'Bebidas',
      image: '/images/img_coca_cola_350ml.png',
      isSelected: false
    },
    {
      id: 'coca-cola-2',
      name: 'Coca-Cola 350ml',
      description: 'Refrigerante gelado',
      price: 'R$ 6,90',
      category: 'Bebidas',
      image: '/images/img_coca_cola_350ml_192x438.png',
      isSelected: true
    },
    {
      id: 'burger-bacon-1',
      name: 'Burger Bacon',
      description: 'Hambúrguer artesanal, queijo, bacon crocante, alface e molho barbecue',
      price: 'R$ 38,90',
      category: 'Burgers',
      image: null,
      isSelected: false
    },
    {
      id: 'burger-bacon-2',
      name: 'Burger Bacon',
      description: 'Hambúrguer artesanal, queijo, bacon crocante, alface e molho barbecue',
      price: 'R$ 38,90',
      category: 'Burgers',
      image: null,
      isSelected: true
    },
    {
      id: 'brownie-sorvete-1',
      name: 'Brownie com Sorvete',
      description: 'Brownie quentinho com sorvete de baunilha e calda de chocolate',
      price: 'R$ 18,90',
      category: 'Sobremesas',
      image: '/images/img_brownie_com_sorvete.png',
      isSelected: false,
      isUnavailable: true
    },
    {
      id: 'brownie-sorvete-2',
      name: 'Brownie com Sorvete',
      description: 'Brownie quentinho com sorvete de baunilha e calda de chocolate',
      price: 'R$ 18,90',
      category: 'Sobremesas',
      image: '/images/img_brownie_com_sorvete_192x438.png',
      isSelected: true,
      isUnavailable: true
    }
  ];

  const QuantityInput = ({ itemId, isSelected }) => {
    const quantity = getQuantity(itemId);
    
    return (
      <div className="flex items-center justify-between w-[136px] gap-4">
        <button
          onClick={() => updateQuantity(itemId, quantity - 1)}
          className="flex items-center justify-center w-10 h-10 bg-background-white-87 border border-border-light-87 rounded-md hover:bg-gray-100 transition-colors"
          disabled={quantity <= 1}
        >
          <img 
            src="/images/img_component_2_gray_900_16x16.svg" 
            alt="Decrease quantity" 
            className="w-4 h-4"
          />
        </button>
        
        <span className="text-2xl font-bold text-text-secondary text-center min-w-[22px]">
          {quantity}
        </span>
        
        <button
          onClick={() => updateQuantity(itemId, quantity + 1)}
          className="flex items-center justify-center w-10 h-10 bg-background-white border border-border-light rounded-md hover:bg-gray-100 transition-colors"
        >
          <img 
            src="/images/img_component_2_16x16.svg" 
            alt="Increase quantity" 
            className="w-4 h-4"
          />
        </button>
      </div>
    );
  };

  const MenuCard = ({ item }) => {
    const cardShadow = item?.isSelected ? 'shadow-[0px_8px_32px_#2a262233]' : 'shadow-[0px_1px_2px_#0000000c]';
    const titleColor = item?.isSelected ? 'text-primary-orange' : 'text-text-secondary';
    
    return (
      <div className={`bg-background-white border border-border-light rounded-lg w-full ${cardShadow}`}>
        {/* Image Section */}
        {item?.image ? (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <img 
              src={item?.image} 
              alt={item?.name}
              className="w-full h-full object-cover"
            />
            {item?.isUnavailable && (
              <div className="absolute inset-0 bg-background-overlay-dark flex flex-col items-center justify-center gap-[54px] p-2">
                <span className="bg-primary-orange text-text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                  {item?.category}
                </span>
                <span className="bg-primary-red text-text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                  Indisponível
                </span>
              </div>
            )}
            {!item?.isUnavailable && (
              <span className="absolute top-2 right-2 bg-primary-orange text-text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                {item?.category}
              </span>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-end justify-end p-2">
            <span className="bg-primary-orange text-text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
              {item?.category}
            </span>
          </div>
        )}
        {/* Content Section */}
        <div className="p-4 space-y-3">
          <div className="space-y-3">
            <h3 className={`text-xl font-bold ${titleColor}`}>
              {item?.name}
            </h3>
            
            <p className="text-base text-text-muted leading-5">
              {item?.description}
            </p>
            
            <p className="text-3xl font-bold text-primary-orange">
              {item?.price}
            </p>
            
            {!item?.isUnavailable && (
              <div className="flex justify-center mt-4">
                <QuantityInput itemId={item?.id} isSelected={item?.isSelected} />
              </div>
            )}
          </div>
          
          {!item?.isUnavailable && (
            <Button
              text="Adicionar ao Carrinho"
              text_font_size="13"
              text_font_family="Inter"
              text_font_weight="400"
              text_line_height="17px"
              text_text_align="center"
              text_color="#ffffff"
              fill_background_color="#ff6600"
              fill_background={{}}
              border_border_radius="10px"
              border_border={{}}
              effect_box_shadow="0px 2px 8px #2a262219"
              layout_width="100%"
              layout_gap={{}}
              padding="12px 34px"
              position="relative"
              variant="primary"
              size="medium"
              leftImage=""
              onClick={() => console.log(`Added ${getQuantity(item?.id)} ${item?.name} to cart`)}
              className="w-full mt-3"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1186px] mx-auto">
        {/* Variant Labels */}
        <div className="flex justify-between items-center mb-4 px-14">
          <span className="text-sm font-light text-text-white-85">default</span>
          <span className="text-sm font-light text-text-white-85">hover</span>
        </div>

        {/* Menu Grid */}
        <div className="flex gap-8">
          {/* Variant Labels Column */}
          <div className="flex flex-col justify-center items-start w-[10%] py-[268px] gap-[506px]">
            {[1, 2, 3, 4, 5, 6]?.map((variant) => (
              <div key={variant} className="text-sm font-light text-text-white leading-[14px]">
                <span className="text-text-white-85">variant</span>
                <br />
                <span className="text-text-white">{variant}</span>
              </div>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1 pr-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[78px]">
              {menuItems?.map((item) => (
                <MenuCard key={item?.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuGrid;