import React, { useState } from 'react';
import Button from '../ui/Button';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#ffffff99] shadow-[0px_4px_8px_#888888ff]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-[14px]">
          <div className="flex justify-between items-center w-full lg:w-[70%]">
            {/* Hamburger Menu Icon (Mobile only) */}
            <button 
              className="block lg:hidden p-2" 
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6 text-[#2a2622]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo/Brand Section */}
            <div className="flex items-center">
              <img 
                src="/images/img_component_2.svg" 
                alt="Conecta Loja" 
                className="w-[150px] h-auto"
              />
            </div>

            {/* Desktop Navigation Menu */}
            <nav className={`${menuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:gap-6 absolute lg:relative top-full lg:top-auto left-0 lg:left-auto w-full lg:w-auto bg-[#ffffff99] lg:bg-transparent shadow-lg lg:shadow-none z-50 lg:z-auto`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 p-4 lg:p-0">
                {/* Menu Items */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 mb-4 lg:mb-0">
                  <button 
                    role="menuitem"
                    className="text-[15px] font-normal leading-[19px] text-left text-[#2a2622] font-['Inter'] py-2 lg:py-0 hover:text-[#ff6600] transition-colors"
                  >
                    Cardápio
                  </button>
                  <button 
                    role="menuitem"
                    className="text-[15px] font-normal leading-[19px] text-left text-[#2a2622] font-['Inter'] py-2 lg:py-0 hover:text-[#ff6600] transition-colors"
                  >
                    Sobre
                  </button>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 mb-4 lg:mb-0">
                  <div className="flex items-center gap-2 py-2 lg:py-0">
                    <img src="/images/img_component_2.svg" alt="" className="w-4 h-4" />
                    <span className="text-[12px] font-normal leading-[16px] text-[#928c87] font-['Inter']">
                      (89) 99999-9999
                    </span>
                  </div>
                  <div className="flex items-center gap-2 py-2 lg:py-0">
                    <img src="/images/img_component_2_gray_500.svg" alt="" className="w-4 h-4" />
                    <span className="text-[13px] font-normal leading-[17px] text-[#928c87] font-['Inter']">
                      Picos, PI
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-3">
                  <button className="flex items-center justify-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-md transition-colors">
                    <img src="/images/img_component_2_gray_900.svg" alt="" className="w-4 h-4" />
                    <span className="text-[13px] font-normal leading-[17px] text-center text-[#2a2622] font-['Inter']">
                      Entrar
                    </span>
                  </button>
                  
                  <Button
                    text="Carrinho"
                    text_font_size="13"
                    text_font_family="Inter"
                    text_font_weight="400"
                    text_line_height="17px"
                    text_text_align="center"
                    text_color="#ffffff"
                    fill_background="#ff531a"
                    fill_background_color="#ff531a"
                    border_border=""
                    border_border_radius="10px"
                    layout_width="auto"
                    padding="10px 34px"
                    position="relative"
                    layout_gap="2"
                    variant="primary"
                    size="medium"
                    effect_box_shadow="0px 2px 8px #2a262219"
                    leftImage={{
                      src: "/images/img_component_2_white_a700.svg",
                      width: 16,
                      height: 16
                    }}
                    className="px-[34px] py-[10px] gap-2"
                    onClick={() => {}}
                  />
                </div>
              </div>
            </nav>

            {/* Mobile Cart Button */}
            <div className="lg:hidden">
              <Button
                text=""
                fill_background="#ff531a"
                fill_background_color="#ff531a"
                border_border=""
                border_border_radius="10px"
                layout_width="auto"
                padding="8px"
                position="relative"
                layout_gap="0"
                variant="primary"
                size="small"
                leftImage={{
                  src: "/images/img_component_2_white_a700.svg",
                  width: 16,
                  height: 16
                }}
                className="p-2"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;