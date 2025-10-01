import React from 'react';

/**
 * HeroSection - Seção principal/hero da página inicial
 *
 * Apresenta a mensagem principal da aplicação com fundo atrativo,
 * título chamativo e descrição que destacam a proposta de valor.
 *
 * @returns {JSX.Element} Seção hero com fundo, título e descrição
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
        <div className="flex flex-col justify-start items-center py-[80px] sm:py-[100px] md:py-[120px] lg:py-[140px]">
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
          <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[48%] flex flex-col items-center mt-6">
            <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-[24px] sm:leading-[28px] md:leading-[30px] lg:leading-[32px] text-center text-[#ffffffe5] font-['Inter']">
              Deliciosos pratos frescos entregues rapidamente na sua casa.
              <br />
              Peça agora via WhatsApp!
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;