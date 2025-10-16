import React from 'react';
import { useStore } from '../../contexts/StoreContext'; // 1. Vamos criar este contexto a seguir
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
    // 2. Consome os dados do contexto da loja
    const { storeConfig, isLoading } = useStore();

    // 3. Define a imagem de fundo dinamicamente
    const heroStyle = {
        // Se a configuração estiver carregando ou não houver imagem, usa a imagem padrão
        backgroundImage: `url(${storeConfig?.bannerImageUrl || '/images/img_background.png'})`,
    };

    // Enquanto as configurações carregam, podemos mostrar um placeholder simples
    if (isLoading) {
        return <section className="w-full h-[400px] bg-gray-200 animate-pulse"></section>;
    }
    return (
        <section
            className="w-full bg-cover bg-center bg-no-repeat relative"
            style={heroStyle} // 4. Aplica o estilo dinâmico
        ><div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
