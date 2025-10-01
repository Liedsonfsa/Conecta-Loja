import React from 'react';

/**
 * Footer - Rodapé da página inicial
 *
 * Componente que exibe informações da empresa no rodapé
 * da página inicial, incluindo nome, CNPJ, endereço e contato.
 *
 * @returns {JSX.Element} Rodapé com informações da empresa
 *
 * @example
 * // Usado na página inicial
 * <Footer />
 */

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informações da Empresa */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#fb923c]">Sabor & Arte Restaurante</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              © 2025. Todos os direitos reservados
            </p>
            <p className="text-gray-400 text-xs">
              CNPJ: 12.345.678/0001-90
            </p>
          </div>

          {/* Endereço e Contato */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Localização</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Rua Pedro Claro, 123 - Junco</p>
              <p>Picos/PI - CEP: 64607-710</p>
              <p className="flex items-center">
                <span className="mr-2">📞</span>
                (89) 98115-6819
              </p>
            </div>
          </div>

          {/* Plataforma */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Sobre</h4>
            <p className="text-gray-300 text-sm">
              Plataforma fornecida por
            </p>
            <p className="text-primary font-medium">
              Conecta Loja
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
