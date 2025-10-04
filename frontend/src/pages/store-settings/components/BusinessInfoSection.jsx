import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const BusinessInfoSection = () => {
  const [businessInfo, setBusinessInfo] = useState({
    name: "Pizzaria Bella Vista",
    email: "contato@pizzariabellavista.com.br",
    phone: "(11) 99999-8888",
    whatsapp: "(11) 99999-8888",
    address: "Rua das Flores, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    cnpj: "12.345.678/0001-90",
    description: `Pizzaria tradicional com mais de 20 anos de experiência.\nEspecializada em pizzas artesanais com ingredientes frescos e selecionados.\nAtendimento de qualidade e entrega rápida em toda a região.`
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: "18:00", close: "23:00", closed: false },
    tuesday: { open: "18:00", close: "23:00", closed: false },
    wednesday: { open: "18:00", close: "23:00", closed: false },
    thursday: { open: "18:00", close: "23:00", closed: false },
    friday: { open: "18:00", close: "00:00", closed: false },
    saturday: { open: "18:00", close: "00:00", closed: false },
    sunday: { open: "18:00", close: "23:00", closed: false }
  });

  const [deliverySettings, setDeliverySettings] = useState({
    deliveryFee: "5,00",
    freeDeliveryMinimum: "50,00",
    maxDeliveryDistance: "10",
    estimatedDeliveryTime: "45"
  });

  const dayLabels = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira", 
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  const handleBusinessInfoChange = (field, value) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev?.[day],
        [field]: value
      }
    }));
  };

  const handleDeliverySettingsChange = (field, value) => {
    setDeliverySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving business info:', { businessInfo, operatingHours, deliverySettings });
    // Mock save success
    alert('Informações salvas com sucesso!');
  };

  return (
    <div className="space-y-8">
      {/* Business Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Building2" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Informações do Negócio</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome do Estabelecimento"
            type="text"
            value={businessInfo?.name}
            onChange={(e) => handleBusinessInfoChange('name', e?.target?.value)}
            required
            className="col-span-1 md:col-span-2"
          />

          <Input
            label="E-mail"
            type="email"
            value={businessInfo?.email}
            onChange={(e) => handleBusinessInfoChange('email', e?.target?.value)}
            required
          />

          <Input
            label="Telefone"
            type="tel"
            value={businessInfo?.phone}
            onChange={(e) => handleBusinessInfoChange('phone', e?.target?.value)}
            placeholder="(11) 99999-9999"
            required
          />

          <Input
            label="WhatsApp"
            type="tel"
            value={businessInfo?.whatsapp}
            onChange={(e) => handleBusinessInfoChange('whatsapp', e?.target?.value)}
            placeholder="(11) 99999-9999"
            description="Número usado para receber pedidos"
            required
          />

          <Input
            label="CNPJ"
            type="text"
            value={businessInfo?.cnpj}
            onChange={(e) => handleBusinessInfoChange('cnpj', e?.target?.value)}
            placeholder="00.000.000/0000-00"
          />

          <Input
            label="Endereço"
            type="text"
            value={businessInfo?.address}
            onChange={(e) => handleBusinessInfoChange('address', e?.target?.value)}
            className="col-span-1 md:col-span-2"
            required
          />

          <Input
            label="Bairro"
            type="text"
            value={businessInfo?.neighborhood}
            onChange={(e) => handleBusinessInfoChange('neighborhood', e?.target?.value)}
            required
          />

          <Input
            label="Cidade"
            type="text"
            value={businessInfo?.city}
            onChange={(e) => handleBusinessInfoChange('city', e?.target?.value)}
            required
          />

          <Input
            label="Estado"
            type="text"
            value={businessInfo?.state}
            onChange={(e) => handleBusinessInfoChange('state', e?.target?.value)}
            placeholder="SP"
            required
          />

          <Input
            label="CEP"
            type="text"
            value={businessInfo?.zipCode}
            onChange={(e) => handleBusinessInfoChange('zipCode', e?.target?.value)}
            placeholder="00000-000"
            required
          />

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Descrição do Estabelecimento
            </label>
            <textarea
              value={businessInfo?.description}
              onChange={(e) => handleBusinessInfoChange('description', e?.target?.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Descreva seu estabelecimento..."
            />
          </div>
        </div>
      </div>
      {/* Operating Hours */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Clock" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Horário de Funcionamento</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(operatingHours)?.map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
              <div className="w-32">
                <span className="text-sm font-medium text-foreground">
                  {dayLabels?.[day]}
                </span>
              </div>

              <Checkbox
                label="Fechado"
                checked={hours?.closed}
                onChange={(e) => handleOperatingHoursChange(day, 'closed', e?.target?.checked)}
                className="mr-4"
              />

              {!hours?.closed && (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    type="time"
                    value={hours?.open}
                    onChange={(e) => handleOperatingHoursChange(day, 'open', e?.target?.value)}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">às</span>
                  <Input
                    type="time"
                    value={hours?.close}
                    onChange={(e) => handleOperatingHoursChange(day, 'close', e?.target?.value)}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Delivery Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Truck" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Configurações de Entrega</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Taxa de Entrega (R$)"
            type="text"
            value={deliverySettings?.deliveryFee}
            onChange={(e) => handleDeliverySettingsChange('deliveryFee', e?.target?.value)}
            placeholder="5,00"
            description="Valor cobrado pela entrega"
          />

          <Input
            label="Valor Mínimo para Frete Grátis (R$)"
            type="text"
            value={deliverySettings?.freeDeliveryMinimum}
            onChange={(e) => handleDeliverySettingsChange('freeDeliveryMinimum', e?.target?.value)}
            placeholder="50,00"
            description="Pedidos acima deste valor têm frete grátis"
          />

          <Input
            label="Distância Máxima de Entrega (km)"
            type="number"
            value={deliverySettings?.maxDeliveryDistance}
            onChange={(e) => handleDeliverySettingsChange('maxDeliveryDistance', e?.target?.value)}
            placeholder="10"
            description="Raio máximo para entregas"
          />

          <Input
            label="Tempo Estimado de Entrega (min)"
            type="number"
            value={deliverySettings?.estimatedDeliveryTime}
            onChange={(e) => handleDeliverySettingsChange('estimatedDeliveryTime', e?.target?.value)}
            placeholder="45"
            description="Tempo médio de entrega"
          />
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
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

export default BusinessInfoSection;