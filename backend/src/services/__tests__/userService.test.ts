import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';
import { UserService } from '../userService';
import { UserRepository } from '../../repositories/userRepository';
import { EmployeeRepository } from '../../repositories/employeeRepository';

// Mock dos repositórios
jest.mock('../../repositories/userRepository', () => ({
  UserRepository: {
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    findPrincipalAddressByUserId: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    findAddressByUserId: jest.fn(),
    updateAddress: jest.fn(),
  },
}));

jest.mock('../../repositories/employeeRepository', () => ({
  EmployeeRepository: {
    findEmployeeByEmail: jest.fn(),
  },
}));

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock do process.env
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('login', () => {
    it('should login successfully with valid customer credentials', async () => {
      const mockUser: any = {
        id: 1,
        email: 'customer@example.com',
        name: 'Customer User',
        password: 'hashed-password',
        contact: '123456789',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = 'jwt-token-123';

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      const mockCompare = require('bcrypt').compare as jest.MockedFunction<any>;
      const mockSign = require('jsonwebtoken').sign as jest.MockedFunction<any>;

      mockFindUserByEmail.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue(mockToken);

      const result = await UserService.login('customer@example.com', 'password123');

      expect(mockFindUserByEmail).toHaveBeenCalledWith('customer@example.com');
      expect(mockCompare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(mockSign).toHaveBeenCalledWith(
        {
          id: 1,
          email: 'customer@example.com',
          name: 'Customer User',
          contact: '123456789',
          userType: 'cliente',
          cargoId: null,
        },
        'test-secret',
        { expiresIn: '24h' }
      );
      expect(result).toHaveProperty('token', mockToken);
      expect(result).toHaveProperty('expiresIn', '24h');
      expect(result.user).toHaveProperty('id', 1);
      expect(result.user).toHaveProperty('email', 'customer@example.com');
      expect(result.user).toHaveProperty('userType', 'cliente');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should login successfully with valid employee credentials', async () => {
      const mockEmployee: any = {
        id: 2,
        email: 'employee@example.com',
        name: 'Employee User',
        password: 'hashed-password',
        cargoId: 1, // Not admin
        cargo: { id: 1, name: 'Funcionário', createdAt: new Date(), updatedAt: new Date(), description: null },
        loja: { id: 1, name: 'Loja Teste', email: 'loja@teste.com', contact: '123456789', description: 'Descrição', address: 'Endereço', city: 'Cidade', state: 'Estado', zipCode: '12345', createdAt: new Date(), updatedAt: new Date() },
      };

      const mockToken = 'jwt-token-456';

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      const mockFindEmployeeByEmail = EmployeeRepository.findEmployeeByEmail as jest.MockedFunction<typeof EmployeeRepository.findEmployeeByEmail>;
      const mockCompare = require('bcrypt').compare as jest.MockedFunction<any>;
      const mockSign = require('jsonwebtoken').sign as jest.MockedFunction<any>;

      mockFindUserByEmail.mockResolvedValue(null); // User not found
      mockFindEmployeeByEmail.mockResolvedValue(mockEmployee);
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue(mockToken);

      const result = await UserService.login('employee@example.com', 'password123');

      expect(mockFindUserByEmail).toHaveBeenCalledWith('employee@example.com');
      expect(mockFindEmployeeByEmail).toHaveBeenCalledWith('employee@example.com');
      expect(mockCompare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(mockSign).toHaveBeenCalledWith(
        {
          id: 2,
          email: 'employee@example.com',
          name: 'Employee User',
          contact: null,
          userType: 'funcionario',
          cargoId: 1,
        },
        'test-secret',
        { expiresIn: '24h' }
      );
      expect(result).toHaveProperty('token', mockToken);
      expect(result).toHaveProperty('expiresIn', '24h');
      expect(result.user).toHaveProperty('id', 2);
      expect(result.user).toHaveProperty('email', 'employee@example.com');
      expect(result.user).toHaveProperty('userType', 'funcionario');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should login successfully with valid admin credentials', async () => {
      const mockAdmin: any = {
        id: 3,
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'hashed-password',
        cargoId: 2, // Admin role
        cargo: { id: 2, name: 'Administrador', createdAt: new Date(), updatedAt: new Date(), description: null },
        loja: { id: 1, name: 'Loja Teste', email: 'loja@teste.com', contact: '123456789', description: 'Descrição', address: 'Endereço', city: 'Cidade', state: 'Estado', zipCode: '12345', createdAt: new Date(), updatedAt: new Date() },
      };

      const mockToken = 'jwt-token-789';

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      const mockFindEmployeeByEmail = EmployeeRepository.findEmployeeByEmail as jest.MockedFunction<typeof EmployeeRepository.findEmployeeByEmail>;
      const mockCompare = require('bcrypt').compare as jest.MockedFunction<any>;
      const mockSign = require('jsonwebtoken').sign as jest.MockedFunction<any>;

      mockFindUserByEmail.mockResolvedValue(null);
      mockFindEmployeeByEmail.mockResolvedValue(mockAdmin);
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue(mockToken);

      const result = await UserService.login('admin@example.com', 'password123');

      expect(mockSign).toHaveBeenCalledWith(
        {
          id: 3,
          email: 'admin@example.com',
          name: 'Admin User',
          contact: null,
          userType: 'admin',
          cargoId: 2,
        },
        'test-secret',
        { expiresIn: '24h' }
      );
      expect(result).toHaveProperty('token', mockToken);
      expect(result).toHaveProperty('expiresIn', '24h');
      expect(result.user).toHaveProperty('id', 3);
      expect(result.user).toHaveProperty('email', 'admin@example.com');
      expect(result.user).toHaveProperty('userType', 'admin');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error when user not found', async () => {
      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      const mockFindEmployeeByEmail = EmployeeRepository.findEmployeeByEmail as jest.MockedFunction<typeof EmployeeRepository.findEmployeeByEmail>;

      mockFindUserByEmail.mockResolvedValue(null);
      mockFindEmployeeByEmail.mockResolvedValue(null);

      await expect(UserService.login('nonexistent@example.com', 'password123'))
        .rejects
        .toThrow('Email ou senha incorretos');
    });

    it('should throw error when password is incorrect', async () => {
      const mockUser: any = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed-password',
        contact: '123456789',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      const mockCompare = require('bcrypt').compare as jest.MockedFunction<any>;

      mockFindUserByEmail.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(false); // Password doesn't match

      await expect(UserService.login('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow('Email ou senha incorretos');
    });

    it('should use fallback secret when JWT_SECRET is not set', async () => {
      delete process.env.JWT_SECRET;

      const mockUser: any = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed-password',
        contact: '123456789',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      const mockCompare = require('bcrypt').compare as jest.MockedFunction<any>;
      const mockSign = require('jsonwebtoken').sign as jest.MockedFunction<any>;

      mockFindUserByEmail.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue('token');

      await UserService.login('test@example.com', 'password123');

      expect(mockSign).toHaveBeenCalledWith(
        expect.any(Object),
        'fallback-secret-change-in-production',
        { expiresIn: '24h' }
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        contact: '123456789'
      };

      const mockCreatedUser: any = {
        id: 1,
        name: 'New User',
        email: 'newuser@example.com',
        contact: '123456789',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      const mockCreateUser = UserRepository.createUser as jest.MockedFunction<typeof UserRepository.createUser>;
      const mockBcrypt = require('bcrypt');
      mockBcrypt.hash.mockResolvedValue('hashed-password');

      mockFindUserByEmail.mockResolvedValue(null); // No existing user
      mockCreateUser.mockResolvedValue(mockCreatedUser);

      const result = await UserService.createUser(userData);

      expect(mockFindUserByEmail).toHaveBeenCalledWith('newuser@example.com');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'hashed-password',
        contact: '123456789',
      });
      expect(result).toEqual({
        id: 1,
        name: 'New User',
        email: 'newuser@example.com',
        contact: '123456789',
        createdAt: mockCreatedUser.createdAt,
        updatedAt: mockCreatedUser.updatedAt,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error when email already exists', async () => {
      const userData = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
        contact: '123456789'
      };

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      mockFindUserByEmail.mockResolvedValue({ id: 1, email: 'existing@example.com' } as any);

      await expect(UserService.createUser(userData))
        .rejects
        .toThrow('Email já está cadastrado');
    });

    it('should throw error when user creation fails', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        contact: '123456789'
      };

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      const mockBcrypt = require('bcrypt');

      mockFindUserByEmail.mockResolvedValue(null);
      mockBcrypt.hash.mockRejectedValue(new Error('Hash failed'));

      await expect(UserService.createUser(userData))
        .rejects
        .toThrow('Hash failed');
    });
  });

  describe('getProfile', () => {
    it('should return user profile with address', async () => {
      const mockUser: any = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'avatar.jpg',
      };

      const mockAddress: any = {
        id: 1,
        street: 'Rua Teste',
        city: 'São Paulo',
      };

      const mockFindUserById = UserRepository.findUserById as jest.MockedFunction<typeof UserRepository.findUserById>;
      const mockFindPrincipalAddressByUserId = UserRepository.findPrincipalAddressByUserId as jest.MockedFunction<typeof UserRepository.findPrincipalAddressByUserId>;

      mockFindUserById.mockResolvedValue(mockUser);
      mockFindPrincipalAddressByUserId.mockResolvedValue(mockAddress);

      const result = await UserService.getProfile(1);

      expect(mockFindUserById).toHaveBeenCalledWith(1);
      expect(mockFindPrincipalAddressByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        ...mockUser,
        address: mockAddress,
        avatar: 'avatar.jpg',
      });
    });

    it('should throw error when user not found', async () => {
      const mockFindUserById = UserRepository.findUserById as jest.MockedFunction<typeof UserRepository.findUserById>;
      mockFindUserById.mockResolvedValue(null);

      await expect(UserService.getProfile(1))
        .rejects
        .toThrow('Usuário não encontrado');
    });
  });

  describe('updatePersonalInfo', () => {
    it('should update personal info successfully', async () => {
      const personalData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
      };

      const mockUpdatedUser: any = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
      };

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      const mockUpdateUser = UserRepository.updateUser as jest.MockedFunction<typeof UserRepository.updateUser>;

      mockFindUserByEmail.mockResolvedValue(null); // No email conflict
      mockUpdateUser.mockResolvedValue(mockUpdatedUser);

      const result = await UserService.updatePersonalInfo(1, personalData);

      expect(mockFindUserByEmail).toHaveBeenCalledWith('updated@example.com');
      expect(mockUpdateUser).toHaveBeenCalledWith(1, personalData);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error for empty name', async () => {
      const personalData = { name: '' };

      await expect(UserService.updatePersonalInfo(1, personalData))
        .rejects
        .toThrow('Nome não pode ser vazio');
    });

    it('should throw error for empty email', async () => {
      const personalData = { email: '   ' };

      await expect(UserService.updatePersonalInfo(1, personalData))
        .rejects
        .toThrow('Email não pode ser vazio');
    });

    it('should throw error for invalid email format', async () => {
      const personalData = { email: 'invalid-email' };

      await expect(UserService.updatePersonalInfo(1, personalData))
        .rejects
        .toThrow('Formato de email inválido');
    });

    it('should throw error when email already exists', async () => {
      const personalData = { email: 'existing@example.com' };
      const mockExistingUser: any = { id: 2, email: 'existing@example.com' };

      const mockFindUserByEmail = UserRepository.findUserByEmail as jest.MockedFunction<typeof UserRepository.findUserByEmail>;
      mockFindUserByEmail.mockResolvedValue(mockExistingUser);

      await expect(UserService.updatePersonalInfo(1, personalData))
        .rejects
        .toThrow('Email já está em uso');
    });

    it('should handle null avatar correctly', async () => {
      const personalData = { avatar: null };
      const mockUpdatedUser: any = { id: 1, avatar: undefined };

      const mockUpdateUser = UserRepository.updateUser as jest.MockedFunction<typeof UserRepository.updateUser>;
      mockUpdateUser.mockResolvedValue(mockUpdatedUser);

      const result = await UserService.updatePersonalInfo(1, personalData);

      expect(mockUpdateUser).toHaveBeenCalledWith(1, { avatar: undefined });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error for empty contact', async () => {
      const personalData = { contact: '' };

      await expect(UserService.updatePersonalInfo(1, personalData))
        .rejects
        .toThrow('Telefone não pode ser vazio');
    });

    it('should throw error for whitespace-only contact', async () => {
      const personalData = { contact: '   ' };

      await expect(UserService.updatePersonalInfo(1, personalData))
        .rejects
        .toThrow('Telefone não pode ser vazio');
    });
  });

  describe('updateProfile', () => {
    it('should update profile without address successfully', async () => {
      const profileData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
      };

      const mockUpdatedUser: any = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
      };

      const mockUpdateUser = UserRepository.updateUser as jest.MockedFunction<typeof UserRepository.updateUser>;

      mockUpdateUser.mockResolvedValue(mockUpdatedUser);

      const result = await UserService.updateProfile(1, profileData);

      expect(mockUpdateUser).toHaveBeenCalledWith(1, {
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should update profile with address successfully', async () => {
      const profileData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
        address: {
          street: 'Rua Nova',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
        },
      };

      const mockUpdatedUser: any = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
      };

      const mockExistingAddress: any = { id: 1, street: 'Rua Antiga' };

      const mockUpdateUser = UserRepository.updateUser as jest.MockedFunction<typeof UserRepository.updateUser>;
      const mockFindAddressByUserId = UserRepository.findAddressByUserId as jest.MockedFunction<typeof UserRepository.findAddressByUserId>;
      const mockUpdateAddress = UserRepository.updateAddress as jest.MockedFunction<typeof UserRepository.updateAddress>;

      mockUpdateUser.mockResolvedValue(mockUpdatedUser);
      mockFindAddressByUserId.mockResolvedValue(mockExistingAddress);
      mockUpdateAddress.mockResolvedValue({} as any); // Mock successful update

      const result = await UserService.updateProfile(1, profileData);

      expect(mockUpdateUser).toHaveBeenCalledWith(1, {
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
      });
      expect(mockFindAddressByUserId).toHaveBeenCalledWith(1);
      expect(mockUpdateAddress).toHaveBeenCalledWith(1, profileData.address);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should handle profile update when no address exists', async () => {
      const profileData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
        address: {
          street: 'Rua Nova',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
        },
      };

      const mockUpdatedUser: any = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
      };

      const mockUpdateUser = UserRepository.updateUser as jest.MockedFunction<typeof UserRepository.updateUser>;
      const mockFindAddressByUserId = UserRepository.findAddressByUserId as jest.MockedFunction<typeof UserRepository.findAddressByUserId>;

      mockUpdateUser.mockResolvedValue(mockUpdatedUser);
      mockFindAddressByUserId.mockResolvedValue(null); // No existing address

      const result = await UserService.updateProfile(1, profileData);

      expect(mockUpdateUser).toHaveBeenCalledWith(1, {
        name: 'Updated Name',
        email: 'updated@example.com',
        contact: '987654321',
      });
      expect(mockFindAddressByUserId).toHaveBeenCalledWith(1);
      // Should not call updateAddress if no existing address
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should update profile with partial data', async () => {
      const profileData = {
        name: 'Updated Name',
        // email and contact not provided
      };

      const mockUpdatedUser: any = {
        id: 1,
        name: 'Updated Name',
        email: 'existing@example.com',
        contact: 'existing-contact',
      };

      const mockUpdateUser = UserRepository.updateUser as jest.MockedFunction<typeof UserRepository.updateUser>;

      mockUpdateUser.mockResolvedValue(mockUpdatedUser);

      const result = await UserService.updateProfile(1, profileData);

      expect(mockUpdateUser).toHaveBeenCalledWith(1, {
        name: 'Updated Name',
        email: undefined,
        contact: undefined,
      });
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const plainPassword = 'password123';
      const hashedPassword = 'hashed-password';

      const mockBcrypt = require('bcrypt');
      mockBcrypt.compare.mockResolvedValue(true);

      const result = await UserService.verifyPassword(plainPassword, hashedPassword);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const plainPassword = 'wrongpassword';
      const hashedPassword = 'hashed-password';

      const mockBcrypt = require('bcrypt');
      mockBcrypt.compare.mockResolvedValue(false);

      const result = await UserService.verifyPassword(plainPassword, hashedPassword);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(false);
    });

    it('should throw error when bcrypt compare fails', async () => {
      const plainPassword = 'password123';
      const hashedPassword = 'hashed-password';

      const mockBcrypt = require('bcrypt');
      mockBcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

      await expect(UserService.verifyPassword(plainPassword, hashedPassword))
        .rejects
        .toThrow('Bcrypt error');
    });
  });
});
