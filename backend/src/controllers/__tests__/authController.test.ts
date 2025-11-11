import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import { AuthController } from '../authController';
import { UserService } from '../../services/userService';

// Mock do UserService
jest.mock('../../services/userService', () => ({
  UserService: {
    login: jest.fn(),
  },
}));

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.MockedFunction<any>;
  let mockStatus: jest.MockedFunction<any>;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {};
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return success when login is successful', async () => {
      const loginData = { token: 'jwt-token', user: { id: 1, email: 'test@example.com', name: 'Test User', userType: 'cliente' as const, contact: '123', avatar: null, createdAt: new Date(), updatedAt: new Date() }, expiresIn: '24h' };
      mockRequest.body = { email: 'test@example.com', password: 'password123' };

      const mockLogin = UserService.login as jest.MockedFunction<typeof UserService.login>;
      mockLogin.mockResolvedValue(loginData);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Login realizado com sucesso',
        data: loginData,
      });
    });

    it('should return 400 when email is missing', async () => {
      mockRequest.body = { password: 'password123' };

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Email e senha são obrigatórios',
        code: 'MISSING_CREDENTIALS',
      });
    });

    it('should return 400 when password is missing', async () => {
      mockRequest.body = { email: 'test@example.com' };

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Email e senha são obrigatórios',
        code: 'MISSING_CREDENTIALS',
      });
    });

    it('should return 401 when credentials are invalid', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'wrongpassword' };

      const mockLogin = UserService.login as jest.MockedFunction<typeof UserService.login>;
      mockLogin.mockRejectedValue(new Error('Email ou senha incorretos'));

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Email ou senha incorretos',
        code: 'INVALID_CREDENTIALS',
      });
    });

    it('should return 500 when unexpected error occurs', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'password123' };

      const mockLogin = UserService.login as jest.MockedFunction<typeof UserService.login>;
      mockLogin.mockRejectedValue(new Error('Unexpected error'));

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
      });
    });
  });

  describe('verifyToken', () => {
    it('should return user data when token is valid', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User', userType: 'cliente' as const };
      mockRequest.user = mockUser;

      await AuthController.verifyToken(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Token válido',
        user: mockUser,
      });
    });

    it('should handle errors during token verification', async () => {
      // Mock console.error to avoid test output pollution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Force an error by making req.user throw an error when accessed
      Object.defineProperty(mockRequest, 'user', {
        get: () => { throw new Error('Database connection error'); },
        configurable: true
      });

      await AuthController.verifyToken(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
      });

      consoleSpy.mockRestore();
    });
  });
});
