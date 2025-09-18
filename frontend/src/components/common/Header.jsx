import React, { useState } from "react";
import Button from "../ui/Button";
import { FiPhone, FiMapPin, FiUser, FiMenu, FiX } from "react-icons/fi";

/**
 * Header - Componente de cabeçalho principal da aplicação
 *
 * Exibe o cabeçalho responsivo da aplicação Conecta-Loja contendo:
 * - Logo da empresa
 * - Menu de navegação para desktop
 * - Informações de contato (telefone e localização)
 * - Botões de ação (entrar e carrinho)
 * - Menu mobile responsivo
 *
 * @returns {JSX.Element} Componente de cabeçalho renderizado
 *
 * @example
 * // Uso em uma página
 * <Header />
 */

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand Section */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-orange-500">Conecta Loja</h1>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Menu Items */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                Cardápio
              </button>
              <button className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                Sobre
              </button>
            </div>

            {/* Contact Info */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FiPhone className="w-4 h-4" />
                <span>(85) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiMapPin className="w-4 h-4" />
                <span>Picos, PI</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors">
                <FiUser className="w-4 h-4" />
                <span>Entrar</span>
              </button>

              <Button
                text="Carrinho"
                text_font_size="14"
                text_font_family="Inter"
                text_font_weight="500"
                text_color="#ffffff"
                fill_background_color="#ff531a"
                border_border_radius="8px"
                padding="8px 16px"
                variant="primary"
                size="medium"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => {}}
              />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <FiX className="w-6 h-6 text-gray-700" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Menu Items */}
              <div className="flex flex-col space-y-3">
                <button className="text-left text-gray-700 hover:text-orange-500 transition-colors font-medium">
                  Cardápio
                </button>
                <button className="text-left text-gray-700 hover:text-orange-500 transition-colors font-medium">
                  Sobre
                </button>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col space-y-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <FiPhone className="w-4 h-4" />
                  <span>(85) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMapPin className="w-4 h-4" />
                  <span>Picos, PI</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                  <FiUser className="w-4 h-4" />
                  <span>Entrar</span>
                </button>

                <Button
                  text="Carrinho"
                  text_font_size="14"
                  text_font_family="Inter"
                  text_font_weight="500"
                  text_color="#ffffff"
                  fill_background_color="#ff531a"
                  border_border_radius="8px"
                  padding="8px 16px"
                  variant="primary"
                  size="medium"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors w-fit"
                  onClick={() => {}}
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
