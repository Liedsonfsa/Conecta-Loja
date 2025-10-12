import Button from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, MessageCircle, Trash } from "lucide-react";

const CartSidebar = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const formatPrice = (price) => {
    // Se o preço já é um número, usa diretamente
    const numericPrice =
      typeof price === "number"
        ? price
        : parseFloat(
            price
              .toString()
              .replace(/[^\d,.-]/g, "")
              .replace(",", ".")
          );

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericPrice);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleQuantityChange = (productId, delta) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + delta);
      if (newQuantity === 0) {
        onRemoveItem(productId);
      } else {
        onUpdateQuantity(productId, newQuantity);
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle>Carrinho de Compras</SheetTitle>
              {totalItems > 0 && (
                <Badge variant="secondary">
                  {totalItems} {totalItems === 1 ? "item" : "itens"}
                </Badge>
              )}
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja limpar todo o carrinho?')) {
                    onClearCart();
                  }
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Limpar carrinho"
              >
                <Trash className="h-3 w-3" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}
          </div>
          <SheetDescription>
            Revise seus itens antes de finalizar o pedido
          </SheetDescription>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
              <Button onClick={onClose}>Continuar Comprando</Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items - Scrollable Area */}
            <div className="flex-1 overflow-y-auto py-4 min-h-0">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {item.product.description}
                      </p>
                      <p className="font-semibold text-orange-600">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="h-6 w-6 text-red-500 hover:text-red-600 flex items-center justify-center"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.product.id, -1)
                          }
                          className="h-6 w-6 border border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="text-sm font-semibold min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(item.product.id, 1)
                          }
                          className="h-6 w-6 border border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary - Fixed at Bottom */}
            <div className="shrink-0 border-t bg-white pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"}
                    )
                  </span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega</span>
                  <span className="text-green-600">Grátis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-lg"
                onClick={onCheckout}
              >
                <MessageCircle className="h-4 w-4" />
                Finalizar no WhatsApp
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
