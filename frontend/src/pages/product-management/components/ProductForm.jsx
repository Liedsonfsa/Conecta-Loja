import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { Input } from '@/components/ui/input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/ButtonDash';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductForm = ({ product, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    isAvailable: true,
    images: [],
    discount: 0,
    discountType: 'percentage',
    hasScheduledAvailability: false,
    availableFrom: '',
    availableTo: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price?.toString() || '',
        category: product?.category || '',
        stock: product?.stock?.toString() || '',
        isAvailable: product?.isAvailable ?? true,
        images: product?.images || [product?.image],
        discount: product?.discount || 0,
        discountType: product?.discountType || 'percentage',
        hasScheduledAvailability: product?.hasScheduledAvailability || false,
        availableFrom: product?.availableFrom || '',
        availableTo: product?.availableTo || ''
      });
      setImagePreview(product?.images || [product?.image]);
    }
  }, [product]);

  const categoryOptions = categories?.map(cat => ({ value: cat, label: cat }));

  const discountTypeOptions = [
    { value: 'percentage', label: 'Porcentagem (%)' },
    { value: 'fixed', label: 'Valor Fixo (R$)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e?.target?.files);
    const newImages = [];
    const newPreviews = [];

    files?.forEach(file => {
      if (file?.type?.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews?.push(e?.target?.result);
          if (newPreviews?.length === files?.length) {
            setImagePreview(prev => [...prev, ...newPreviews]);
            setFormData(prev => ({ 
              ...prev, 
              images: [...prev?.images, ...newPreviews] 
            }));
          }
        };
        reader?.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev?.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev?.images?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData?.price || parseFloat(formData?.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (!formData?.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData?.stock || parseInt(formData?.stock) < 0) {
      newErrors.stock = 'Estoque deve ser um número válido';
    }

    if (formData?.images?.length === 0) {
      newErrors.images = 'Pelo menos uma imagem é obrigatória';
    }

    if (formData?.discount < 0 || formData?.discount > (formData?.discountType === 'percentage' ? 100 : parseFloat(formData?.price))) {
      newErrors.discount = formData?.discountType === 'percentage' ?'Desconto deve estar entre 0 e 100%' :'Desconto não pode ser maior que o preço';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData?.price),
        stock: parseInt(formData?.stock),
        discount: parseFloat(formData?.discount) || 0,
        image: formData?.images?.[0], // Primary image
        updatedAt: new Date()?.toISOString()
      };

      if (!product) {
        productData.id = Date.now()?.toString();
        productData.createdAt = new Date()?.toISOString();
      }

      await onSave(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name={product ? "Edit" : "Plus"} size={24} />
          <span>{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</span>
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <Icon name="X" size={20} />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Nome do Produto"
              type="text"
              placeholder="Ex: Pizza Margherita"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descrição
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows="4"
                placeholder="Descreva o produto..."
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />
              {errors?.description && (
                <p className="text-sm text-destructive mt-1">{errors?.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Preço (R$)"
                type="number"
                placeholder="0,00"
                value={formData?.price}
                onChange={(e) => handleInputChange('price', e?.target?.value)}
                error={errors?.price}
                min="0"
                step="0.01"
                required
              />

              <Input
                label="Estoque"
                type="number"
                placeholder="0"
                value={formData?.stock}
                onChange={(e) => handleInputChange('stock', e?.target?.value)}
                error={errors?.stock}
                min="0"
                required
              />
            </div>

            <Select
              label="Categoria"
              placeholder="Selecione uma categoria"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleInputChange('category', value)}
              error={errors?.category}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Imagens do Produto
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Icon name="Upload" size={32} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Clique para adicionar imagens
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG até 5MB cada
                  </span>
                </label>
              </div>
              {errors?.images && (
                <p className="text-sm text-destructive mt-1">{errors?.images}</p>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview?.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {imagePreview?.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="X" size={12} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Discount Settings */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Configurações de Desconto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Tipo de Desconto"
              options={discountTypeOptions}
              value={formData?.discountType}
              onChange={(value) => handleInputChange('discountType', value)}
            />

            <Input
              label={`Desconto ${formData?.discountType === 'percentage' ? '(%)' : '(R$)'}`}
              type="number"
              placeholder="0"
              value={formData?.discount}
              onChange={(e) => handleInputChange('discount', e?.target?.value)}
              error={errors?.discount}
              min="0"
              max={formData?.discountType === 'percentage' ? "100" : undefined}
              step={formData?.discountType === 'percentage' ? "1" : "0.01"}
            />

            <div className="flex items-end">
              <div className="bg-muted rounded-lg p-3 w-full">
                <span className="text-sm text-muted-foreground">Preço Final:</span>
                <div className="text-lg font-semibold text-foreground">
                  {formData?.price && formData?.discount ? (
                    <>
                      R$ {(parseFloat(formData?.price) - (formData?.discountType === 'percentage' ? parseFloat(formData?.price) * (parseFloat(formData?.discount) / 100) : parseFloat(formData?.discount)))?.toFixed(2)}
                    </>
                  ) : (
                    `R$ ${parseFloat(formData?.price || 0)?.toFixed(2)}`
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Settings */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Configurações de Disponibilidade</h3>
          <div className="space-y-4">
            <Checkbox
              label="Produto disponível para venda"
              checked={formData?.isAvailable}
              onChange={(e) => handleInputChange('isAvailable', e?.target?.checked)}
            />

            <Checkbox
              label="Configurar disponibilidade por horário"
              checked={formData?.hasScheduledAvailability}
              onChange={(e) => handleInputChange('hasScheduledAvailability', e?.target?.checked)}
            />

            {formData?.hasScheduledAvailability && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <Input
                  label="Disponível a partir de"
                  type="time"
                  value={formData?.availableFrom}
                  onChange={(e) => handleInputChange('availableFrom', e?.target?.value)}
                />

                <Input
                  label="Disponível até"
                  type="time"
                  value={formData?.availableTo}
                  onChange={(e) => handleInputChange('availableTo', e?.target?.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            iconName={product ? "Save" : "Plus"}
            iconPosition="left"
          >
            {product ? 'Salvar Alterações' : 'Adicionar Produto'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;