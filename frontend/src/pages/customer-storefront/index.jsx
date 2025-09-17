import React from 'react';

/**
 * CustomerStorefront - Página principal da vitrine do cliente
 *
 * Esta página representa a interface principal onde os clientes podem
 * visualizar e interagir com os produtos da loja. Atualmente contém
 * um layout básico que será expandido com funcionalidades de e-commerce.
 *
 * @returns {JSX.Element} Elemento JSX da página da vitrine
 *
 * @example
 * // Renderizado automaticamente na rota "/"
 * <Route path="/" element={<CustomerStorefront />} />
 */
const CustomerStorefront = () => {
  return (
    <div className="customer-storefront">
      <h1>Hello World</h1>
      <p>Bem-vindo à loja do cliente!</p>
    </div>
  );
};

export default CustomerStorefront;
