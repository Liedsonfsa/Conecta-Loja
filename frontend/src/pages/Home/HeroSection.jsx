import React from 'react';
import Button from '../../components/ui/Button';

/**
 * HeroSection - Seção principal/hero da página inicial
 *
 * Apresenta a mensagem principal da aplicação com fundo atrativo,
 * título chamativo, descrição e botões de ação para direcionar
 * o usuário para as funcionalidades principais (ver cardápio e fazer pedido).
 *
 * @returns {JSX.Element} Seção hero com fundo, título, descrição e botões
 *
 * @example
 * // Usado na página inicial
 * <HeroSection />
 */

const HeroSection = () => {
  return (
    <section 
      className="w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/img_background.png')" }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-start items-center py-[148px] sm:py-[200px] md:py-[250px] lg:py-[296px]">
          {/* Hero Title */}
          <h1 className="text-[30px] sm:text-[40px] md:text-[50px] lg:text-[59px] font-bold leading-[32px] sm:leading-[42px] md:leading-[52px] lg:leading-[60px] text-center text-white font-['Inter'] mb-6">
            <span className="block">Sabores que</span>
            <span 
              className="block bg-gradient-to-r from-[#fb923c] to-[#ef4444] bg-clip-text text-transparent"
              style={{ background: 'linear-gradient(90deg, #fb923c 0%, #ef4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              conquistam
            </span>
          </h1>

          {/* Hero Description */}
          <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[48%] flex flex-col gap-8 items-center mt-6">
            <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-[24px] sm:leading-[28px] md:leading-[30px] lg:leading-[32px] text-center text-[#ffffffe5] font-['Inter']">
              Deliciosos pratos frescos entregues rapidamente na sua casa.
              <br />
              Peça agora via WhatsApp!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-[14px] w-full px-4 sm:px-[60px] md:px-[80px] lg:px-[120px]">
              <Button
                text="Ver Cardápio"
                text_font_size="15"
                text_font_family="Inter"
                text_font_weight="700"
                text_line_height="19px"
                text_text_align="center"
                text_color="#ffffff"
                fill_background="linear-gradient(164deg, #ff6600 0%, #ff531a 100%)"
                border_border="none"
                border_border_radius="12px"
                layout_width="full"
                layout_gap="0px"
                position="relative"
                padding="16px 34px"
                variant="primary"
                size="medium"
                onClick={() => {}}
                leftImage=""
                className="w-full"
              />
              <Button
                text="Fazer Pedido"
                text_font_size="15"
                text_font_family="Inter"
                text_font_weight="400"
                text_line_height="19px"
                text_text_align="center"
                text_color="#000000"
                fill_background="#ffffff"
                border_border="1px solid #ffffff"
                border_border_radius="12px"
                layout_width="full"
                layout_gap="0px"
                position="relative"
                padding="16px 34px"
                variant="secondary"
                size="medium"
                onClick={() => {}}
                leftImage=""
                className="w-full"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;