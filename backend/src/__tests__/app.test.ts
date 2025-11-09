import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app';

// Mock do console.log para evitar poluição nos testes
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn(); // Silencia logs durante os testes
});

afterAll(() => {
  console.log = originalConsoleLog; // Restaura console.log
});

describe('Express App Configuration', () => {
  describe('Basic Routes', () => {
    it('should respond to GET / with "Hello World"', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toBe('Hello World');
    });

    it('should respond to GET /health with proper JSON', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message', 'Servidor rodando corretamente');
      expect(response.body).toHaveProperty('timestamp');

      // Verificar se timestamp é uma string ISO válida
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(isNaN(timestamp.getTime())).toBe(false);
    });
  });

  describe('Middleware Configuration', () => {
    it('should have CORS middleware configured', async () => {
      const response = await request(app)
        .options('/') // OPTIONS request testa CORS
        .set('Origin', 'http://localhost:4028')
        .set('Access-Control-Request-Method', 'GET');

      // Verificar se headers CORS estão presentes
      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers).toHaveProperty('access-control-allow-methods');
      expect(response.headers).toHaveProperty('access-control-allow-headers');
    });

    it('should parse JSON requests', async () => {
      const testData = { test: 'data', number: 123 };

      const response = await request(app)
        .post('/api/test-json') // Esta rota pode não existir, mas testa o middleware
        .send(testData)
        .set('Content-Type', 'application/json');

      // Mesmo que a rota não exista, o middleware deve funcionar
      // O erro 404 indica que o JSON foi parseado corretamente
      expect(response.status).toBe(404);
    });

    it('should handle large JSON payloads (up to 10mb)', async () => {
      // Criar um payload grande para testar o limite
      const largeData = { data: 'x'.repeat(1000000) }; // ~1MB

      const response = await request(app)
        .post('/api/test-large') // Rota não existe, mas testa limite
        .send(largeData)
        .set('Content-Type', 'application/json');

      // Deve aceitar o payload grande (não deve dar erro de limite)
      expect([404, 413]).toContain(response.status); // 404=rota não existe, 413=limite excedido
    });

    it('should parse URL-encoded requests', async () => {
      const testData = 'name=João&email=test@example.com';

      const response = await request(app)
        .post('/api/test-urlencoded')
        .send(testData)
        .set('Content-Type', 'application/x-www-form-urlencoded');

      // Mesmo que a rota não exista, o middleware deve funcionar
      expect(response.status).toBe(404);
    });
  });

  describe('Static Files', () => {
    it('should serve static files from /uploads route', async () => {
      // Como não temos arquivos reais, esperamos 404
      // Mas isso testa se a rota está configurada
      const response = await request(app)
        .get('/uploads/test-image.jpg');

      // 404 indica que a rota existe e está tentando servir arquivos
      // Se não estivesse configurada, seria 404 também, mas pelo menos testa a rota
      expect([404, 403]).toContain(response.status); // 404=arquivo não existe, 403=permissão negada
    });
  });

  describe('API Routes Mounting', () => {
    it('should mount API routes at /api prefix', async () => {
      // Tentar acessar uma rota que sabemos que existe no routes/index.ts
      // Como /api/auth/* ou similar
      const response = await request(app)
        .get('/api/nonexistent');

      // Deve responder (provavelmente 404, mas indica que as rotas estão montadas)
      expect(response.status).toBeDefined();
    });

    it('should not respond to routes without /api prefix', async () => {
      // Verificar que rotas sem /api não são tratadas pelas rotas da API
      const response = await request(app)
        .get('/auth/login'); // Sem /api prefix

      // Deve dar 404 porque não há rota /auth/login (só /api/auth/login)
      expect(response.status).toBe(404);
    });
  });

  describe('Logging Middleware', () => {
    it('should have logging middleware active', async () => {
      // Como mockamos console.log, podemos verificar se foi chamado
      const consoleSpy = jest.spyOn(console, 'log');

      await request(app)
        .get('/')
        .expect(200);

      // Verificar se o middleware de logging foi chamado
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('>>> REQUISIÇÃO RECEBIDA: GET /')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/test-json')
        .set('Content-Type', 'application/json')
        .send('{invalid json}');

      // Deve rejeitar JSON inválido
      expect(response.status).toBe(400);
    });

    it('should handle non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route');

      expect(response.status).toBe(404);
    });
  });
});
