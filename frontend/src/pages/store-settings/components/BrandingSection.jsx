// Localização: frontend/src/pages/store-settings/components/BrandingSection.jsx

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/config'; // Importa sua instância configurada do Axios

const BrandingSection = () => {
    const { toast } = useToast();
    // Estado para os dados que vêm/vão para a API
    const [settings, setSettings] = useState({});
    // Estados separados para os arquivos de imagem selecionados
    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null); // Adicionado para o banner
    // Estados de controle de UI
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    // Busca as configurações da API quando o componente carrega
    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/store/config');
                setSettings(response.data || {});
            } catch (error) {
                toast({ title: 'Erro ao carregar configurações', description: error.message, variant: 'destructive' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

    // Manipula mudanças nos inputs de texto, cores e selects
    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    // Manipula a seleção de novos arquivos de imagem
    const handleLogoUpload = (event) => setLogoFile(event.target.files[0]);
    const handleBannerUpload = (event) => setBannerFile(event.target.files[0]); // Adicionado

    // Salva todas as configurações para o back-end
    const handleSave = async () => {
        setIsSaving(true);
        const formData = new FormData();

        // Adiciona todos os campos de texto do estado ao FormData
        for (const key in settings) {
            if (settings[key] !== null && settings[key] !== undefined) {
                formData.append(key, settings[key]);
            }
        }

        // Adiciona os arquivos de imagem se eles foram selecionados
        if (logoFile) formData.append('logo', logoFile);
        if (bannerFile) formData.append('bannerImage', bannerFile);

        try {
            // Envia os dados para a API
            const response = await api.put('/store/config', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Atualiza o estado com a resposta do servidor (que inclui as novas URLs das imagens)
            setSettings(response.data);
            setLogoFile(null); // Limpa os arquivos selecionados após o sucesso
            setBannerFile(null);

            toast({ title: 'Sucesso!', description: 'Configurações de marca salvas com sucesso.' });
        } catch (error) {
            toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    // Funções para gerar URLs de pré-visualização para as imagens
    const getPreviewUrl = (file, existingUrl) => {
        if (file) return URL.createObjectURL(file);
        return existingUrl;
    };

    // (Seu código para colorOptions e themeOptions continua o mesmo)
    const colorOptions = [{ value: "#2563EB", label: "Azul Clássico" }, /* ... */];
    const themeOptions = [{ value: "modern", label: "Moderno", description: "Design limpo" }, /* ... */];

    if (isLoading) return <p className="text-center">Carregando configurações...</p>;

    return (
        <div className="space-y-8">
            {/* Upload de Imagens */}
            <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Icon name="Image" size={24} className="text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Imagens da Marca</h3>
                </div>

                {/* Logo */}
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
                    <div className="flex-shrink-0"><div className="w-32 h-32 ..."><Image src={getPreviewUrl(logoFile, settings.logoUrl)} /></div></div>
                    <div className="flex-1 space-y-4"><label>Carregar Nova Logo</label><input type="file" onChange={handleLogoUpload} /></div>
                </div>

                {/* Banner */}
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex-shrink-0"><div className="w-full md:w-64 h-32 ..."><Image src={getPreviewUrl(bannerFile, settings.bannerImageUrl)} /></div></div>
                    <div className="flex-1 space-y-4"><label>Carregar Novo Banner</label><input type="file" onChange={handleBannerUpload} /></div>
                </div>
            </div>

            {/* Esquema de Cores (usando 'settings' e 'handleChange') */}
            <div className="bg-card ...">
                {/* ... seu JSX para cores, mas com values e onChanges atualizados ... */}
                <input type="color" value={settings.primaryColor || ''} onChange={(e) => handleChange('primaryColor', e.target.value)} />
                {/* ... etc ... */}
            </div>

            {/* (Restante do seu JSX para Temas, Mensagens, etc., conectando 'value' e 'onChange' da mesma forma) */}

            {/* Botões de Ação */}
            <div className="flex justify-end">
                <Button variant="default" onClick={handleSave} iconName="Save" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
        </div>
    );
};

export default BrandingSection;