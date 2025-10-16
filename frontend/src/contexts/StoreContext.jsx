// Localização: frontend/src/contexts/StoreContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/config'; // Importa sua instância configurada do Axios

// 1. Cria o contexto
const StoreContext = createContext();

// 2. Cria o Provedor do contexto
export const StoreProvider = ({ children }) => {
    const [storeConfig, setStoreConfig] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStoreConfig = async () => {
            try {
                // Busca os dados da rota PÚBLICA que planejamos
                const response = await api.get('/store/public-config');
                setStoreConfig(response.data);
            } catch (error) {
                console.error("Falha ao buscar configurações da loja:", error);
                // Em caso de erro, a aplicação continuará com os valores padrão
            } finally {
                setIsLoading(false);
            }
        };

        fetchStoreConfig();
    }, []); // O array vazio garante que a busca aconteça apenas uma vez

    const value = { storeConfig, isLoading };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

// 3. Cria um hook customizado para facilitar o uso do contexto
export const useStore = () => {
    return useContext(StoreContext);
};