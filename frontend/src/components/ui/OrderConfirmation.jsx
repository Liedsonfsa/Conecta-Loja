import React, { useEffect, useState } from 'react';

/**
 * OrderConfirmation - Componente de confirmação de pedido com animação
 *
 * Mostra um ícone animado de confirmação (tipo PicPay) com detalhes do pedido
 * enquanto redireciona para o WhatsApp.
 */
const OrderConfirmation = ({
  orderNumber,
  isVisible = false,
  onComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState('initial');

  useEffect(() => {
    if (isVisible) {
      // Sequência de animação
      const phases = [
        { phase: 'initial', duration: 100 },
        { phase: 'scaling', duration: 500 },
        { phase: 'checkmark', duration: 800 },
        { phase: 'complete', duration: 1000 }
      ];

      let totalDelay = 0;

      phases.forEach(({ phase, duration }) => {
        setTimeout(() => {
          setAnimationPhase(phase);
        }, totalDelay);
        totalDelay += duration;
      });

      // Chamar onComplete após toda a animação
      setTimeout(() => {
        if (onComplete) onComplete();
      }, totalDelay);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full p-8 text-center">
        {/* Ícone de confirmação animado */}
        <div className="relative mb-6">
          <div className={`w-24 h-24 mx-auto rounded-full bg-green-500 flex items-center justify-center transition-all duration-500 ${
            animationPhase === 'initial' ? 'scale-0 opacity-0' :
            animationPhase === 'scaling' ? 'scale-110 opacity-100 bg-green-500' :
            animationPhase === 'checkmark' ? 'scale-100 opacity-100 bg-green-500' :
            'scale-100 opacity-100 bg-green-600'
          }`}>
            {/* Círculo de progresso inicial */}
            {animationPhase === 'initial' && (
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            )}

            {/* Checkmark animado */}
            {(animationPhase === 'scaling' || animationPhase === 'checkmark' || animationPhase === 'complete') && (
              <svg
                className={`w-12 h-12 text-white transition-all duration-300 ${
                  animationPhase === 'scaling' ? 'scale-0 rotate-0' :
                  animationPhase === 'checkmark' ? 'scale-100 rotate-0' :
                  'scale-100 rotate-12'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  className={`transition-all duration-500 ${
                    animationPhase === 'scaling' ? 'stroke-dasharray-0 stroke-dashoffset-0' :
                    animationPhase === 'checkmark' ? 'stroke-dasharray-24 stroke-dashoffset-24 animate-draw-check' :
                    'stroke-dasharray-24 stroke-dashoffset-0'
                  }`}
                />
              </svg>
            )}
          </div>

          {/* Ondas de sucesso */}
          <div className={`absolute inset-0 rounded-full border-2 border-green-400 transition-all duration-1000 ${
            animationPhase === 'complete' ? 'animate-ping opacity-75' : 'opacity-0'
          }`}></div>
          <div className={`absolute inset-0 rounded-full border border-green-300 transition-all duration-1000 delay-200 ${
            animationPhase === 'complete' ? 'animate-ping opacity-50' : 'opacity-0'
          }`}></div>
        </div>

        {/* Conteúdo */}
        <div className={`transition-all duration-500 ${
          animationPhase === 'initial' ? 'opacity-0 transform translate-y-4' :
          'opacity-100 transform translate-y-0'
        }`}>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Pedido Confirmado!
          </h2>

          <p className="text-muted-foreground mb-4">
            Seu pedido foi realizado com sucesso
          </p>

          {orderNumber && (
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-1">Número do Pedido</p>
              <p className="text-2xl font-bold text-primary">#{orderNumber}</p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Redirecionando para WhatsApp...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
