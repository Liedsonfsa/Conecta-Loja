import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../hooks/use-toast';

const CategoryManager = ({ categories, onAddCategory, onDeleteCategory, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Toast system
  const { toast } = useToast();

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    variant: 'default',
    onConfirm: () => {},
    onClose: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
  });

  const getCategoryStats = (category) => {
    const categoryProducts = products?.filter(p => p?.category === category);
    return {
      total: categoryProducts?.length,
      active: categoryProducts?.filter(p => p?.isAvailable)?.length,
      totalValue: categoryProducts?.reduce((sum, p) => sum + (p?.price * p?.stock), 0)
    };
  };

  // Helper function to show confirmation dialog
  const showConfirmDialog = (title, description, onConfirm, options = {}) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      variant: options.variant || 'default',
      onConfirm,
      onClose: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleAddCategory = async () => {
    if (!newCategory?.trim()) return;

    setIsAdding(true);
    try {
      await onAddCategory(newCategory?.trim());
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    const stats = getCategoryStats(category);

    if (stats?.total > 0) {
      showConfirmDialog(
        'Excluir Categoria',
        `Esta categoria possui ${stats?.total} produto(s). Tem certeza que deseja excluí-la? Os produtos ficarão sem categoria.`,
        async () => {
          try {
            await onDeleteCategory(category);
          } catch (error) {
            console.error('Error deleting category:', error);

            // Mensagens específicas baseadas no tipo de erro
            let errorTitle = "Erro ao excluir categoria";
            let errorDescription = error.message || "Não foi possível excluir a categoria.";

            // Verificar se é erro específico de categoria com produtos
            if (error.message && error.message.includes("produtos associados")) {
              errorTitle = "Não é possível excluir categoria";
              errorDescription = "Esta categoria possui produtos associados. Remova ou mova os produtos para outra categoria antes de excluí-la.";
            } else if (error.message && error.message.includes("não encontrada")) {
              errorTitle = "Categoria não encontrada";
              errorDescription = "A categoria que você tentou excluir não foi encontrada.";
            }

            toast({
              variant: "destructive",
              title: errorTitle,
              description: errorDescription,
            });
          }
        },
        { variant: 'destructive', confirmText: 'Excluir' }
      );
    } else {
      showConfirmDialog(
        'Excluir Categoria',
        `Tem certeza que deseja excluir a categoria "${category}"?`,
        async () => {
          try {
            await onDeleteCategory(category);
          } catch (error) {
            console.error('Error deleting category:', error);

            // Mensagens específicas baseadas no tipo de erro
            let errorTitle = "Erro ao excluir categoria";
            let errorDescription = error.message || "Não foi possível excluir a categoria.";

            // Verificar se é erro específico de categoria com produtos
            if (error.message && error.message.includes("produtos associados")) {
              errorTitle = "Não é possível excluir categoria";
              errorDescription = "Esta categoria possui produtos associados. Remova ou mova os produtos para outra categoria antes de excluí-la.";
            } else if (error.message && error.message.includes("não encontrada")) {
              errorTitle = "Categoria não encontrada";
              errorDescription = "A categoria que você tentou excluir não foi encontrada.";
            }

            toast({
              variant: "destructive",
              title: errorTitle,
              description: errorDescription,
            });
          }
        },
        { variant: 'destructive', confirmText: 'Excluir' }
      );
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Tag" size={20} />
          <span>Gerenciar Categorias</span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          iconName={isOpen ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isOpen ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>
      {isOpen && (
        <div className="space-y-4">
          {/* Add New Category */}
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                label="Nova Categoria"
                type="text"
                placeholder="Ex: Bebidas, Sobremesas..."
                value={newCategory}
                onChange={(e) => setNewCategory(e?.target?.value)}
                onKeyPress={(e) => e?.key === 'Enter' && handleAddCategory()}
              />
            </div>
            <Button
              onClick={handleAddCategory}
              disabled={!newCategory?.trim() || isAdding}
              loading={isAdding}
              iconName="Plus"
              iconPosition="left"
            >
              Adicionar
            </Button>
          </div>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((category) => {
              const stats = getCategoryStats(category);
              return (
                <div
                  key={category}
                  className="bg-background rounded-lg border border-border p-4 hover:shadow-elevation-1 transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{category}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                      title="Excluir categoria"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Produtos:</span>
                      <span className="text-foreground">{stats?.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ativos:</span>
                      <span className="text-success">{stats?.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="text-foreground">
                        R$ {stats?.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {categories?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Tag" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma categoria criada</h3>
              <p className="text-muted-foreground">
                Adicione categorias para organizar melhor seus produtos.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.onClose}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
      />
    </div>
  );
};

export default CategoryManager;