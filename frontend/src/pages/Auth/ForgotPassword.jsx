/**
 * ForgotPassword - Página de recuperação de senha
 * 
 * Permite que usuários solicitem a redefinição de senha através do email.
 * Envia um link de recuperação para o email cadastrado.
 * 
 * Funcionalidades:
 * - Validação de email
 * - Envio de link de recuperação
 * - Feedback visual de sucesso/erro
 * - Redirecionamento após envio
 * 
 * @returns {JSX.Element} Página de recuperação de senha
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/ButtonDash';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import Icon from '../../components/AppIcon';
import { useToast } from '../../hooks/use-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  /**
   * Valida formato de email
   * @param {string} email - Email a ser validado
   * @returns {boolean} True se email é válido
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Manipula envio do formulário
   * @param {Event} e - Evento de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação
    if (!email) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira seu email.',
        variant: 'destructive'
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um email válido.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Integrar com API real
      // await authService.forgotPassword(email);
      
      // Simulação de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast({
        title: 'Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
        variant: 'success'
      });

    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar o email. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Icon name="Lock" size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Esqueceu sua senha?
          </h1>
          <p className="text-muted-foreground">
            Não se preocupe! Digite seu email e enviaremos instruções para redefinir sua senha.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recuperar Senha</CardTitle>
            <CardDescription>
              Informe o email cadastrado em sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <Input
                    type="email"
                    label="Email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  iconName={loading ? 'Loader2' : 'Mail'}
                  iconPosition="left"
                >
                  {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-sm text-primary hover:underline flex items-center justify-center gap-2 mx-auto"
                  >
                    <Icon name="ArrowLeft" size={16} />
                    Voltar para o login
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full">
                  <Icon name="CheckCircle" size={32} className="text-green-600" />
                </div>

                {/* Success Message */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Email Enviado!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enviamos um link de recuperação para <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Não recebeu o email? Verifique sua caixa de spam ou tente novamente em alguns minutos.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full"
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Voltar para o Login
                  </Button>
                  
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full"
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Reenviar Email
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda?{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-primary hover:underline"
            >
              Entre em contato
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
