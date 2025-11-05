/**
 * ResetPassword - Página de redefinição de senha
 *
 * Permite que usuários redefinam sua senha através do link recebido por email.
 * Valida token de recuperação e solicita nova senha com confirmação.
 *
 * Funcionalidades:
 * - Validação de token
 * - Campos de senha e confirmação
 * - Validação de força da senha
 * - Feedback visual de sucesso/erro
 * - Redirecionamento após sucesso
 *
 * @returns {JSX.Element} Página de redefinição de senha
 */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/ButtonDash";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import Icon from "../../components/AppIcon";
import { useToast } from "../../hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  /**
   * Valida token ao carregar página
   */
  useEffect(() => {
    const tokenParam = searchParams.get("token");

    if (!tokenParam) {
      setTokenValid(false);
      toast({
        title: "Link inválido",
        description: "Token de recuperação não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setToken(tokenParam);
    validateToken(tokenParam);
  }, [searchParams]);

  /**
   * Valida o token de recuperação
   * @param {string} token - Token a ser validado
   */
  const validateToken = async (token) => {
    try {
      // TODO: Validar token com API
      // await authService.validateResetToken(token);

      // Simulação
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTokenValid(true);
    } catch (error) {
      setTokenValid(false);
      toast({
        title: "Token inválido",
        description: "Este link de recuperação é inválido ou expirou.",
        variant: "destructive",
      });
    }
  };

  /**
   * Calcula força da senha
   * @param {string} password - Senha a ser analisada
   * @returns {Object} Objeto com score e texto da força
   */
  const getPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { score: 0, text: "Muito fraca", color: "text-red-600" },
      { score: 1, text: "Fraca", color: "text-orange-600" },
      { score: 2, text: "Regular", color: "text-yellow-600" },
      { score: 3, text: "Boa", color: "text-blue-600" },
      { score: 4, text: "Forte", color: "text-green-600" },
      { score: 5, text: "Muito forte", color: "text-green-700" },
    ];

    return levels[strength];
  };

  /**
   * Valida senha
   * @returns {boolean} True se senha é válida
   */
  const validatePassword = () => {
    if (!password) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma senha.",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "As senhas digitadas são diferentes.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  /**
   * Manipula envio do formulário
   * @param {Event} e - Evento de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setLoading(true);

    try {
      // TODO: Integrar com API real
      // await authService.resetPassword({ token, password });

      // Simulação de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setResetSuccess(true);
      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi alterada com sucesso.",
        variant: "success",
      });

      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast({
        title: "Erro",
        description:
          error.message ||
          "Não foi possível redefinir a senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  // Token inválido
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full mb-4">
              <Icon name="XCircle" size={32} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Link Inválido
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Este link de recuperação é inválido ou já expirou. Por favor,
              solicite um novo link.
            </p>
            <Button
              onClick={() => navigate("/forgot-password")}
              iconName="Mail"
              iconPosition="left"
            >
              Solicitar Novo Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sucesso
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Senha Redefinida!
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Sua senha foi alterada com sucesso. Você será redirecionado para o
              login...
            </p>
            <Button
              onClick={() => navigate("/")}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Icon
              name="KeyRound"
              size={32}
              className="text-primary-foreground"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Redefinir Senha
          </h1>
          <p className="text-muted-foreground">Digite sua nova senha abaixo</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nova Senha</CardTitle>
            <CardDescription>Escolha uma senha forte e segura</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Input */}
              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Nova Senha"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                  >
                    <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
                  </button>
                </div>

                {/* Password Strength */}
                {password && passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        Força da senha:
                      </span>
                      <span
                        className={`text-xs font-medium ${passwordStrength.color}`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrength.score <= 1
                            ? "bg-red-600"
                            : passwordStrength.score <= 2
                            ? "bg-yellow-600"
                            : passwordStrength.score <= 3
                            ? "bg-blue-600"
                            : "bg-green-600"
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirmar Senha"
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    error={
                      confirmPassword && password !== confirmPassword
                        ? "As senhas não conferem"
                        : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                  >
                    <Icon
                      name={showConfirmPassword ? "EyeOff" : "Eye"}
                      size={20}
                    />
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs font-medium text-foreground mb-2">
                  Requisitos da senha:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <Icon
                      name={password.length >= 8 ? "CheckCircle" : "Circle"}
                      size={14}
                      className={password.length >= 8 ? "text-green-600" : ""}
                    />
                    Mínimo de 8 caracteres
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon
                      name={
                        /[A-Z]/.test(password) && /[a-z]/.test(password)
                          ? "CheckCircle"
                          : "Circle"
                      }
                      size={14}
                      className={
                        /[A-Z]/.test(password) && /[a-z]/.test(password)
                          ? "text-green-600"
                          : ""
                      }
                    />
                    Letras maiúsculas e minúsculas
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon
                      name={/\d/.test(password) ? "CheckCircle" : "Circle"}
                      size={14}
                      className={/\d/.test(password) ? "text-green-600" : ""}
                    />
                    Pelo menos um número
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon
                      name={
                        /[^a-zA-Z0-9]/.test(password) ? "CheckCircle" : "Circle"
                      }
                      size={14}
                      className={
                        /[^a-zA-Z0-9]/.test(password) ? "text-green-600" : ""
                      }
                    />
                    Caractere especial (@, #, $, etc.)
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !password || password !== confirmPassword}
                iconName={loading ? "Loader2" : "Check"}
                iconPosition="left"
              >
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-sm text-primary hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                  <Icon name="ArrowLeft" size={16} />
                  Voltar para o login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
