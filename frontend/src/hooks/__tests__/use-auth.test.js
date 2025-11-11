import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { act } from 'react';
import { useAuth } from '../use-auth';

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
  });

  it('should initialize with default state', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    // Verificar estado inicial (pode ser true ou false dependendo da implementação)
    expect(result.current.userType).toBe(null);
    expect(result.current.user).toBe(null);
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should handle no token in localStorage', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userType).toBe(null);
    expect(result.current.user).toBe(null);
  });

  it('should decode valid JWT token and set user data', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      userType: 'cliente'
    };

    // Criar um JWT mock (header.payload.signature)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(mockUser));
    const signature = 'mock_signature';
    const mockToken = `${header}.${payload}.${signature}`;

    localStorageMock.getItem.mockReturnValue(mockToken);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userType).toBe('cliente');
    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle invalid JWT token', async () => {
    localStorageMock.getItem.mockReturnValue('invalid-token');

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userType).toBe(null);
    expect(result.current.user).toBe(null);
  });

  it('should handle malformed JWT token', async () => {
    localStorageMock.getItem.mockReturnValue('malformed.jwt.token');

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userType).toBe(null);
    expect(result.current.user).toBe(null);
  });

  it('should handle admin user type', async () => {
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
      name: 'Admin User',
      userType: 'admin'
    };

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(mockUser));
    const mockToken = `${header}.${payload}.signature`;

    localStorageMock.getItem.mockReturnValue(mockToken);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userType).toBe('admin');
    expect(result.current.user).toEqual(mockUser);
  });
});

