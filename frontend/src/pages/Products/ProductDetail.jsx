import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
} from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Página de Detalhes do Produto - Conecta-Loja
 *
 * Exibe informações completas de um produto específico,
 * permite adicionar ao carrinho, favoritar e compartilhar.
 */

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { currentProduct, loading, error, fetchProductById } = useProducts();
  const { addItem, formatPrice } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Carrega produto ao montar componente
  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  // Atualiza imagem selecionada quando produto muda
  useEffect(() => {
    if (currentProduct?.images?.length > 0) {
      setSelectedImage(0);
    }
  }, [currentProduct]);

  /**
   * Manipula mudança de quantidade
   */
  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (currentProduct?.estoque || 1)) {
      setQuantity(newQuantity);
    }
  };

  /**
   * Adiciona produto ao carrinho
   */
  const handleAddToCart = async () => {
    if (!currentProduct) return;

    try {
      await addItem(currentProduct, quantity);
      toast({
        title: "Produto adicionado!",
        description: `${quantity}x ${currentProduct.name} foi adicionado ao carrinho.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  /**
   * Alterna favorito
   */
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite
        ? `${currentProduct?.name} foi removido dos seus favoritos.`
        : `${currentProduct?.name} foi adicionado aos seus favoritos.`,
    });
  };

  /**
   * Compartilhar produto
   */
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentProduct?.name,
          text: `Confira este produto: ${currentProduct?.name}`,
          url: url,
        });
      } catch (error) {
        console.log("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description:
          "O link do produto foi copiado para a área de transferência.",
      });
    }
  };

  /**
   * Calcula preço com desconto
   */
  const calculateDiscountedPrice = (product) => {
    if (!product.discount || product.discount <= 0) return product.price;

    if (product.discountType === "PERCENTAGE") {
      return product.price * (1 - product.discount / 100);
    } else {
      return Math.max(0, product.price - product.discount);
    }
  };

  /**
   * Renderiza estrelas de avaliação
   */
  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-gray-300" />
          <Star
            className="w-5 h-5 fill-yellow-400 text-yellow-400 absolute top-0 left-0"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  /**
   * Renderiza imagens do produto
   */
  const renderProductImages = () => {
    if (!currentProduct) return null;

    // Simula múltiplas imagens se só tiver uma
    const images = currentProduct.images || [currentProduct.image];

    return (
      <div className="space-y-4">
        {/* Imagem principal */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {images[selectedImage] ? (
            <img
              src={images[selectedImage]}
              alt={currentProduct.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${currentProduct.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/products")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos produtos
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? "Erro ao carregar produto" : "Produto não encontrado"}
          </h1>
          <p className="text-gray-600">
            {error ||
              "O produto que você está procurando não existe ou foi removido."}
          </p>
        </div>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(currentProduct);
  const hasDiscount = currentProduct.discount && currentProduct.discount > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botão voltar */}
      <Button
        variant="outline"
        onClick={() => navigate("/products")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar aos produtos
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Imagens do produto */}
        <div>{renderProductImages()}</div>

        {/* Informações do produto */}
        <div className="space-y-6">
          {/* Título e categoria */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                {currentProduct.category?.name || "Categoria"}
              </Badge>
              {!currentProduct.available && (
                <Badge variant="destructive">Indisponível</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentProduct.name}
            </h1>
            <div className="flex items-center gap-2">
              {renderStars(4.5)}
              <span className="text-sm text-gray-600">(127 avaliações)</span>
            </div>
          </div>

          {/* Preço */}
          <div className="flex items-center gap-4">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(currentProduct.price)}
                </span>
                <Badge className="bg-red-100 text-red-800">
                  -
                  {currentProduct.discountType === "PERCENTAGE"
                    ? `${currentProduct.discount}%`
                    : formatPrice(currentProduct.discount)}
                </Badge>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(currentProduct.price)}
              </span>
            )}
          </div>

          {/* Descrição */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
            <p className="text-gray-600 leading-relaxed">
              {currentProduct.description}
            </p>
          </div>

          {/* Estoque */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Estoque:</span>
            {currentProduct.estoque > 0 ? (
              <span className="text-green-600">
                {currentProduct.estoque} unidade
                {currentProduct.estoque !== 1 ? "s" : ""} disponível
                {currentProduct.estoque !== 1 ? "is" : ""}
              </span>
            ) : (
              <span className="text-red-600">Fora de estoque</span>
            )}
          </div>

          {/* Quantidade e adicionar ao carrinho */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-900">Quantidade:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="rounded-r-none border-r-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= currentProduct.estoque}
                  className="rounded-l-none border-l-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={
                  !currentProduct.available || currentProduct.estoque <= 0
                }
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleFavorite}
                className={isFavorite ? "text-red-600" : ""}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Frete Grátis</h4>
                <p className="text-sm text-gray-600">
                  Para compras acima de R$ 100
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Compra Segura</h4>
                <p className="text-sm text-gray-600">Garantia de 30 dias</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-8 h-8 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900">Devolução Fácil</h4>
                <p className="text-sm text-gray-600">
                  Até 7 dias após recebimento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs com informações adicionais */}
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          <TabsTrigger value="specifications">Especificações</TabsTrigger>
          <TabsTrigger value="shipping">Frete e Prazo</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Avaliações dos Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Avaliação média */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">4.5</div>
                    <div className="flex justify-center mb-1">
                      {renderStars(4.5)}
                    </div>
                    <div className="text-sm text-gray-600">127 avaliações</div>
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 mb-1">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${
                                stars === 5
                                  ? 60
                                  : stars === 4
                                  ? 25
                                  : stars === 3
                                  ? 10
                                  : 5
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {stars === 5
                            ? 76
                            : stars === 4
                            ? 32
                            : stars === 3
                            ? 12
                            : stars === 2
                            ? 6
                            : 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lista de avaliações */}
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      name: "João Silva",
                      rating: 5,
                      date: "2024-01-15",
                      comment:
                        "Produto excelente! Chegou antes do prazo e a qualidade é incrível.",
                    },
                    {
                      id: 2,
                      name: "Maria Santos",
                      rating: 4,
                      date: "2024-01-10",
                      comment:
                        "Muito bom, atendeu minhas expectativas. Recomendo!",
                    },
                  ].map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Categoria:</span>
                    <span>{currentProduct.category?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Peso:</span>
                    <span>500g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Dimensões:</span>
                    <span>30x20x10 cm</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Material:</span>
                    <span>Plástico ABS</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Cor:</span>
                    <span>Preto</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Garantia:</span>
                    <span>1 ano</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Frete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Opções de Entrega</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>PAC</span>
                        <span>5-10 dias úteis</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SEDEX</span>
                        <span>2-3 dias úteis</span>
                      </div>
                      <div className="flex justify-between font-medium text-green-600">
                        <span>Transportadora</span>
                        <span>1-2 dias úteis</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Frete Grátis</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Frete grátis para compras acima de R$ 100,00
                    </p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        🎉 Este produto qualifica para frete grátis!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
