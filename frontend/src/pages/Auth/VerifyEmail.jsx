/**
 * VerifyEmail - Página de verificação de email
 *
 * Permite que usuários verifiquem seu email através do link recebido.
 * Valida token de verificação e ativa a conta do usuário.
 *
 * Funcionalidades:
 * - Validação automática de token
 * - Feedback visual de sucesso/erro
 * - Reenvio de email de verificação
 * - Redirecionamento após verificação
 *
 * @returns {JSX.Element} Página de verificação de email
 */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/ButtonDash";
import { Card, CardContent } from "../../components/ui/card";
import Icon from "../../components/AppIcon";
import { useToast } from "../../hooks/use-toast";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [resending, setResending] = useState(false);

  /**
   * Verifica email ao carregar página
   */
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const email = searchParams.get("email");

    if (!tokenParam) {
      setError("Token de verificação não encontrado");
      setVerifying(false);
      return;
    }

    setToken(tokenParam);
    verifyEmail(tokenParam, email);
  }, [searchParams]);

  /**
   * Verifica o email com o token
   * @param {string} token - Token de verificação
   * @param {string} email - Email do usuário
   */
  const verifyEmail = async (token, email) => {
    setVerifying(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // await authService.verifyEmail({ token, email });

      // Simulação de API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular erro aleatório para teste (remover em produção)
      // if (Math.random() > 0.7) throw new Error('Token inválido ou expirado');

      setVerified(true);
      toast({
        title: "Email verificado!",
        description: "Sua conta foi ativada com sucesso.",
        variant: "success",
      });

      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      setError(error.message || "Não foi possível verificar o email");
      toast({
        title: "Erro na verificação",
        description: error.message || "Token inválido ou expirado",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  /**
   * Reenvia email de verificação
   */
  const handleResendEmail = async () => {
    const email = searchParams.get("email");

    if (!email) {
      toast({
        title: "Erro",
        description: "Email não encontrado. Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    setResending(true);

    try {
      // TODO: Integrar com API real
      // await authService.resendVerificationEmail(email);

      // Simulação de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Email reenviado!",
        description: "Verifique sua caixa de entrada.",
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao reenviar email:", error);
      toast({
        title: "Erro",
        description: "Não foi possível reenviar o email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  // Estado: Verificando
  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full mb-4">
              <Icon
                name="Mail"
                size={32}
                className="text-blue-600 animate-pulse"
              />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Verificando seu email...
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Por favor, aguarde enquanto confirmamos sua conta.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado: Verificado com sucesso
  if (verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full mb-4">
              <Icon name="CheckCircle" size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Email Verificado!
            </h1>
            <p className="text-muted-foreground">
              Sua conta foi ativada com sucesso
            </p>
          </div>

          <Card>
            <CardContent className="text-center py-8">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Parabéns! Seu email foi verificado e sua conta está ativa.
                  Você será redirecionado para o login em alguns segundos...
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Info" size={16} />
                  <span>Agora você pode acessar todos os recursos</span>
                </div>

                <Button
                  onClick={() => navigate("/")}
                  className="w-full mt-6"
                  iconName="LogIn"
                  iconPosition="left"
                >
                  Ir para Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Estado: Erro na verificação
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-950 rounded-full mb-4">
              <Icon name="XCircle" size={48} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Verificação Falhou
            </h1>
            <p className="text-muted-foreground">
              Não foi possível verificar seu email
            </p>
          </div>

          <Card>
            <CardContent className="py-8">
              <div className="space-y-6">
                {/* Error Message */}
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Icon
                      name="AlertCircle"
                      size={20}
                      className="text-red-600 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                        Erro na Verificação
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Possible Reasons */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Possíveis causas:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <Icon
                        name="Circle"
                        size={8}
                        className="mt-1.5 flex-shrink-0"
                      />
                      <span>
                        O link de verificação expirou (válido por 24 horas)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon
                        name="Circle"
                        size={8}
                        className="mt-1.5 flex-shrink-0"
                      />
                      <span>O link já foi usado anteriormente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon
                        name="Circle"
                        size={8}
                        className="mt-1.5 flex-shrink-0"
                      />
                      <span>Link inválido ou corrompido</span>
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="w-full"
                    iconName={resending ? "Loader2" : "Mail"}
                    iconPosition="left"
                  >
                    {resending
                      ? "Enviando..."
                      : "Reenviar Email de Verificação"}
                  </Button>

                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="w-full"
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Voltar para Login
                  </Button>
                </div>

                {/* Help Text */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Ainda com problemas?{" "}
                    <button
                      onClick={() => navigate("/contact")}
                      className="text-primary hover:underline"
                    >
                      Entre em contato com o suporte
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmail;
