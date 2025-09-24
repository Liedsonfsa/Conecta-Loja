// Em: frontend/src/pages/NotFound.jsx

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

// Ícone SVG que representa busca ou um item não encontrado.
// É universal e se encaixa em qualquer contexto de e-commerce.
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 14.5L19 19" />
    </svg>
);


/**
 * Componente de página 404 - Not Found
 *
 * Renderiza uma página de erro amigável e profissional para um sistema de vendas genérico.
 * A mensagem é adequada para qualquer tipo de loja online.
 *
 * @returns {JSX.Element} Componente React que renderiza a página 404.
 */
const NotFoundPage = () => {
    const location = useLocation();

    /**
     * Hook useEffect para logging de erros 404.
     * Registra no console a tentativa de acesso a uma rota inexistente,
     * o que é útil para fins de debugging e monitoramento.
     */
    useEffect(() => {
        console.error(`Erro 404: Tentativa de acesso à rota inexistente: ${location.pathname}`);
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">

                {/* Ícone para reforçar a mensagem de busca */}
                <SearchIcon />

                {/* Título principal da página 404 */}
                <h1 className="mt-6 text-2xl font-bold text-gray-800 md:text-3xl">
                    Página Não Encontrada
                </h1>

                {/* Texto explicativo e amigável */}
                <p className="mt-4 text-gray-600">
                    Procuramos em todos os lugares, mas não conseguimos encontrar o que você busca.
                    O link pode estar quebrado ou a página pode ter sido removida.
                </p>

                {/* Botões de Ação para guiar o usuário */}
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        to="/"
                        className="w-full rounded-lg bg-orange-500 px-6 py-3 text-center font-semibold text-white shadow-md transition-colors hover:bg-orange-600 sm:w-auto"
                    >
                        Ir para o Início
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;