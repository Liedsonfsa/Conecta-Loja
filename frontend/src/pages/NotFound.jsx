// Em: frontend/src/pages/NotFound.jsx

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * Componente de página 404 - Not Found
 *
 * Este componente é renderizado quando o usuário tenta acessar uma rota que não existe.
 * Exibe uma mensagem de erro amigável e um link para voltar à página inicial.
 *
 * @returns {JSX.Element} Componente React que renderiza a página 404
 */
const NotFoundPage = () => {
    const location = useLocation();

    /**
     * Hook useEffect para logging de erros 404
     *
     * Registra no console um erro sempre que o usuário acessa uma rota inexistente,
     * incluindo o caminho que foi tentado acessar. Útil para debugging e monitoramento.
     */
    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold">404</h1>
                <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
                <a href="/" className="text-blue-500 underline hover:text-blue-700">
                    Return to Home
                </a>
            </div>
        </div>
    );
};

// E atualizei o export
export default NotFoundPage;