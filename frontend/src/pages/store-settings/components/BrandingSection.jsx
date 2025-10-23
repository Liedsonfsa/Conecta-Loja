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
    const [branding, setBranding] = useState({
        logo: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop&crop=center",
        primaryColor: "#2563EB",
        secondaryColor: "#059669",
        accentColor: "#F59E0B",
        theme: "modern",
        welcomeMessage: "Bem-vindos à Pizzaria Bella Vista!",
        footerMessage: "Obrigado pela preferência. Volte sempre!",
        customCSS: ""
    });

    const [previewMode, setPreviewMode] = useState(false);

    const colorOptions = [
        { value: "#2563EB", label: "Azul Clássico" },
        { value: "#059669", label: "Verde Esmeralda" },
        { value: "#DC2626", label: "Vermelho Vibrante" },
        { value: "#7C3AED", label: "Roxo Moderno" },
        { value: "#EA580C", label: "Laranja Energético" },
        { value: "#0891B2", label: "Ciano Profissional" }
    ];

    const themeOptions = [
        { value: "modern", label: "Moderno", description: "Design limpo e minimalista" },
        { value: "classic", label: "Clássico", description: "Estilo tradicional e elegante" },
        { value: "vibrant", label: "Vibrante", description: "Cores vivas e chamativas" },
        { value: "dark", label: "Escuro", description: "Tema escuro sofisticado" }
    ];

    const handleBrandingChange = (field, value) => {
        setBranding(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogoUpload = (event) => {
        const file = event?.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setBranding(prev => ({
                    ...prev,
                    logo: e?.target?.result
                }));
            };
            reader?.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        console.log('Saving branding:', branding);
        alert('Configurações de marca salvas com sucesso!');
    };

    const resetToDefault = () => {
        setBranding({
            logo: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop&crop=center",
            primaryColor: "#2563EB",
            secondaryColor: "#059669",
            accentColor: "#F59E0B",
            theme: "modern",
            welcomeMessage: "Bem-vindos à Pizzaria Bella Vista!",
            footerMessage: "Obrigado pela preferência. Volte sempre!",
            customCSS: ""
        });
    };

    return (
        <div className="space-y-8">
            {/* Logo Upload */}
            <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Icon name="Image" size={24} className="text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Logo do Estabelecimento</h3>
                </div>

                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                            {branding?.logo ? (
                                <Image
                                    src={branding?.logo}
                                    alt="Logo atual"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Icon name="ImagePlus" size={32} className="text-muted-foreground" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Carregar Nova Logo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Formatos aceitos: JPG, PNG, SVG. Tamanho máximo: 2MB
                            </p>
                        </div>

                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.querySelector('input[type="file"]')?.click()}
                                iconName="Upload"
                                iconPosition="left"
                            >
                                Escolher Arquivo
                            </Button>

                            {branding?.logo && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleBrandingChange('logo', '')}
                                    iconName="Trash2"
                                    iconPosition="left"
                                >
                                    Remover
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Color Scheme */}
            <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Icon name="Palette" size={24} className="text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Esquema de Cores</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Cor Primária
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={branding?.primaryColor}
                                onChange={(e) => handleBrandingChange('primaryColor', e?.target?.value)}
                                className="w-12 h-10 rounded border border-border cursor-pointer"
                            />
                            <Select
                                options={colorOptions}
                                value={branding?.primaryColor}
                                onChange={(value) => handleBrandingChange('primaryColor', value)}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Cor Secundária
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={branding?.secondaryColor}
                                onChange={(e) => handleBrandingChange('secondaryColor', e?.target?.value)}
                                className="w-12 h-10 rounded border border-border cursor-pointer"
                            />
                            <Select
                                options={colorOptions}
                                value={branding?.secondaryColor}
                                onChange={(value) => handleBrandingChange('secondaryColor', value)}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Cor de Destaque
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={branding?.accentColor}
                                onChange={(e) => handleBrandingChange('accentColor', e?.target?.value)}
                                className="w-12 h-10 rounded border border-border cursor-pointer"
                            />
                            <Select
                                options={colorOptions}
                                value={branding?.accentColor}
                                onChange={(value) => handleBrandingChange('accentColor', value)}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Color Preview */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="text-sm font-medium text-foreground mb-3">Prévia das Cores</h4>
                    <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: branding?.primaryColor }}
                            />
                            <span className="text-sm text-muted-foreground">Primária</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: branding?.secondaryColor }}
                            />
                            <span className="text-sm text-muted-foreground">Secundária</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: branding?.accentColor }}
                            />
                            <span className="text-sm text-muted-foreground">Destaque</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Theme Selection */}
            <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Icon name="Layout" size={24} className="text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Tema da Loja</h3>
                </div>

                <Select
                    label="Selecionar Tema"
                    options={themeOptions}
                    value={branding?.theme}
                    onChange={(value) => handleBrandingChange('theme', value)}
                    description="Escolha o estilo visual da sua loja online"
                />
            </div>
            {/* Custom Messages */}
            <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Icon name="MessageSquare" size={24} className="text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Mensagens Personalizadas</h3>
                </div>

                <div className="space-y-6">
                    <Input
                        label="Mensagem de Boas-vindas"
                        type="text"
                        value={branding?.welcomeMessage}
                        onChange={(e) => handleBrandingChange('welcomeMessage', e?.target?.value)}
                        description="Mensagem exibida no topo da loja"
                        placeholder="Bem-vindos ao nosso estabelecimento!"
                    />

                    <Input
                        label="Mensagem de Rodapé"
                        type="text"
                        value={branding?.footerMessage}
                        onChange={(e) => handleBrandingChange('footerMessage', e?.target?.value)}
                        description="Mensagem exibida no final da página"
                        placeholder="Obrigado pela preferência!"
                    />

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            CSS Personalizado (Avançado)
                        </label>
                        <textarea
                            value={branding?.customCSS}
                            onChange={(e) => handleBrandingChange('customCSS', e?.target?.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-mono text-sm"
                            placeholder="/* Adicione seu CSS personalizado aqui */&#10;.custom-class {&#10;  color: #333;&#10;}"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Para usuários avançados. Use com cuidado para não quebrar o layout.
                        </p>
                    </div>
                </div>
            </div>
            {/* Preview Toggle */}
            <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Icon name="Eye" size={24} className="text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Prévia em Tempo Real</h3>
                            <p className="text-sm text-muted-foreground">
                                Visualize as alterações antes de salvar
                            </p>
                        </div>
                    </div>

                    <Button
                        variant={previewMode ? "default" : "outline"}
                        onClick={() => setPreviewMode(!previewMode)}
                        iconName={previewMode ? "EyeOff" : "Eye"}
                        iconPosition="left"
                    >
                        {previewMode ? "Ocultar Prévia" : "Mostrar Prévia"}
                    </Button>
                </div>

                {previewMode && (
                    <div className="mt-6 p-4 border border-border rounded-lg bg-background">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-lg overflow-hidden bg-muted">
                                {branding?.logo && (
                                    <Image
                                        src={branding?.logo}
                                        alt="Logo preview"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            <div
                                className="text-lg font-semibold px-4 py-2 rounded"
                                style={{
                                    backgroundColor: branding?.primaryColor,
                                    color: 'white'
                                }}
                            >
                                {branding?.welcomeMessage}
                            </div>

                            <div className="text-sm text-muted-foreground">
                                {branding?.footerMessage}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Action Buttons */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={resetToDefault}
                    iconName="RotateCcw"
                    iconPosition="left"
                >
                    Restaurar Padrão
                </Button>

                <Button
                    variant="default"
                    onClick={handleSave}
                    iconName="Save"
                    iconPosition="left"
                    className="px-8"
                >
                    Salvar Alterações
                </Button>
            </div>
        </div>
    );
};

export default BrandingSection;