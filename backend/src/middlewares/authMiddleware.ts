import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extender a interface Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        userType: 'cliente' | 'funcionario' | 'admin';
        cargoId?: number | null; // ID do cargo (para funcionários)
      };
    }
  }
}

/**
 * Middleware para verificar autenticação JWT
 *
 * Verifica se o token JWT fornecido no header Authorization é válido.
 * Extrai e valida o token, adiciona os dados do usuário à requisição
 * se válido, ou retorna erro apropriado se inválido/ausente.
 *
 * @param req - Requisição Express com possível token JWT no header Authorization
 * @param res - Resposta Express
 * @param next - Função para continuar o fluxo da requisição
 * @returns void - Chama next() se válido, ou retorna resposta de erro
 *
 * @example
 * // Uso em rota protegida
 * app.get('/protected', authenticateToken, (req, res) => {
 *   // req.user estará disponível com dados do usuário autenticado
 *   res.json({ user: req.user });
 * });
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acesso não fornecido',
      code: 'MISSING_TOKEN'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
      name: string;
      userType: 'cliente' | 'funcionario' | 'admin';
      cargoId?: number | null;
      iat: number;
      exp: number;
    };

    // Adicionar dados do usuário à requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      userType: decoded.userType,
      cargoId: decoded.cargoId
    };

    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};
/**
 * Middleware para verificar se o usuário é um administrador.
 * DEVE ser usado DEPOIS do middleware authenticateToken.
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user && user.userType === 'admin') {
        // Se o usuário existe e é um admin, continue.
        next();
    } else {
        // Se não, retorne um erro de Acesso Proibido.
        return res.status(403).json({
            success: false,
            error: 'Acesso negado. Rota exclusiva para administradores.',
            code: 'FORBIDDEN_ACCESS'
        });
    }
};
