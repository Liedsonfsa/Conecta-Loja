import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../auth';

// Mock do axios
vi.mock('../config', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import api from '../config';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call api.post with correct parameters', async () => {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: { id: 1, email: 'test@example.com' },
        },
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when login fails', async () => {
      const error = new Error('Login failed');
      api.post.mockRejectedValue(error);

      await expect(
        authService.login('invalid@example.com', 'wrongpassword')
      ).rejects.toThrow('Login failed');
    });
  });

  describe('register', () => {
    it('should call api.post with user data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        contact: '11999999999',
      };
      const mockResponse = {
        data: {
          id: 1,
          ...userData,
          password: undefined, // Password should not be returned
        },
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await authService.register(userData);

      expect(api.post).toHaveBeenCalledWith('/user/cadastrar', userData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when registration fails', async () => {
      const error = new Error('Registration failed');
      api.post.mockRejectedValue(error);

      await expect(
        authService.register({
          name: 'Test',
          email: 'test@example.com',
          password: 'pass',
          contact: '11111111111',
        })
      ).rejects.toThrow('Registration failed');
    });
  });

  describe('verifyToken', () => {
    it('should call api.get to verify token', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            userType: 'cliente',
          },
        },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await authService.verifyToken();

      expect(api.get).toHaveBeenCalledWith('/auth/verify');
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when token verification fails', async () => {
      const error = new Error('Token invalid');
      api.get.mockRejectedValue(error);

      await expect(authService.verifyToken()).rejects.toThrow('Token invalid');
    });
  });

  describe('logout', () => {
    it('should remove authToken from localStorage', () => {
      // Mock localStorage
      const localStorageMock = {
        removeItem: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });

      authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
    });
  });
});



