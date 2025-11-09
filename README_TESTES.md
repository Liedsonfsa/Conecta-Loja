# 🧪 Guia de Testes Unitários - Conecta-Loja

## 📋 Visão Geral

Este documento explica como executar e entender os testes unitários implementados no projeto Conecta-Loja, que utiliza uma arquitetura completa de testes para garantir qualidade e confiabilidade do código.

## 🏗️ Arquitetura de Testes

### **Frontend (React + TypeScript)**

- **Framework**: [Vitest](https://vitest.dev/) - Framework de testes rápido para Vite
- **Bibliotecas Auxiliares**:
  - `@testing-library/react` - Para testes de componentes React
  - `@testing-library/jest-dom` - Matchers customizados para DOM
  - `@testing-library/user-event` - Simulação de eventos do usuário
- **Ambiente**: jsdom (simulação de navegador)

### **Backend (Node.js + TypeScript)**

- **Framework**: [Jest](https://jestjs.io/) com ts-jest
- **Bibliotecas Auxiliares**:
  - `supertest` - Para testes de API HTTP (preparado para uso futuro)
- **Ambiente**: Node.js nativo

## 📁 Estrutura dos Testes

```
conecta-loja/
├── frontend/
│   ├── src/
│   │   ├── test/
│   │   │   └── setup.js                    # Configuração global dos testes
│   │   ├── lib/__tests__/
│   │   │   └── utils.test.js               # Testes da função cn()
│   │   ├── utils/__tests__/
│   │   │   └── cn.test.js                  # Testes da função cn() (versão alternativa)
│   │   ├── api/__tests__/
│   │   │   └── auth.test.js                # Testes do serviço de autenticação
│   │   └── pages/dashboard/components/__tests__/
│   │       └── SalesChart.test.jsx         # Testes do componente SalesChart
│   ├── vite.config.js                      # Configuração Vitest
│   └── package.json                        # Scripts de teste
│
└── backend/
    ├── src/
    │   ├── services/__tests__/
    │   │   └── reportService.test.ts       # Testes do serviço de relatórios
    │   └── repositories/__tests__/
    │       └── reportRepository.test.ts    # Testes do repositório de relatórios
    ├── jest.config.js                      # Configuração Jest
    └── package.json                        # Scripts de teste
```

## 🚀 Como Executar os Testes

### Pré-requisitos

1. **Dependências instaladas**:

   ```bash
   # Frontend
   cd frontend && npm install

   # Backend
   cd backend && npm install
   ```

### Comandos de Execução

#### **Frontend (Vitest)**

```bash
cd frontend

# Executar todos os testes
npm run test

# Executar testes uma vez (modo CI)
npm run test:run

# Interface visual interativa
npm run test:ui

# Executar com relatório de cobertura
```

#### **Backend (Jest)**

```bash
cd backend

# Executar todos os testes
npm run test

# Executar em modo watch (re-execução automática)
npm run test:watch

# Executar com relatório de cobertura
npm run test:coverage
```

#### **Executar Tudo de Uma Vez**

```bash
# No diretório raiz do projeto
npm run test:frontend    # Se configurado
npm run test:backend     # Se configurado
```

## 📊 Relatórios de Cobertura

Os testes geram relatórios de cobertura automaticamente:

### Frontend

```bash
cd frontend && npm run test:coverage
# Resultado em: frontend/coverage/lcov-report/index.html
```

### Backend

```bash
cd backend && npm run test:coverage
# Resultado em: backend/coverage/lcov-report/index.html
```

## 🔧 Configurações Técnicas

### **Frontend (vite.config.js)**

```javascript
export default defineConfig({
  test: {
    globals: true, // Variáveis globais (describe, it, expect)
    environment: "jsdom", // Ambiente de navegador simulado
    setupFiles: ["./src/test/setup.js"], // Arquivo de configuração inicial
  },
});
```

### **Backend (jest.config.js)**

```javascript
module.exports = {
  preset: "ts-jest", // Suporte TypeScript
  testEnvironment: "node", // Ambiente Node.js
  roots: ["<rootDir>/src"], // Diretório raiz dos testes
  collectCoverageFrom: [
    // Arquivos para cobertura
    "src/**/*.ts",
    "!src/**/*.d.ts",
  ],
};
```

### **Setup Global (frontend/src/test/setup.js)**

- Mocks para `localStorage`
- Mocks para `matchMedia`, `ResizeObserver`, `IntersectionObserver`
- Configurações específicas do DOM

## 📝 Tipos de Testes Implementados

### **1. Testes de Utilitários**

```javascript
describe("cn (className utility)", () => {
  it("should merge class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });
});
```

**O que testa**: Funções helper, manipulação de CSS, formatação de dados.

### **2. Testes de Componentes React**

```jsx
describe("SalesChart Component", () => {
  it("should render with default bar chart", () => {
    render(<SalesChart data={mockData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});
```

**O que testa**: Renderização, interações do usuário, estado dos componentes.

### **3. Testes de Serviços da API**

```javascript
describe("authService", () => {
  it("should call api.post with correct parameters", async () => {
    const result = await authService.login("email", "password");
    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      /* ... */
    });
  });
});
```

**O que testa**: Chamadas HTTP, manipulação de dados, tratamento de erros.

### **4. Testes de Serviços Backend**

```typescript
describe("ReportsService", () => {
  it("should return complete report data", async () => {
    const result = await ReportsService.getReport("today");
    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("salesByDay");
  });
});
```

**O que testa**: Lógica de negócio, cálculos, validações.

## 🎭 Mocks e Simulações

### **Frontend**

- **Axios**: Simulação de chamadas HTTP
- **React Router**: Navegação
- **Recharts**: Componentes de gráficos
- **localStorage**: Armazenamento local
- **DOM APIs**: matchMedia, ResizeObserver, etc.

### **Backend**

- **Prisma Client**: Acesso ao banco de dados
- **Queries SQL**: Operações complexas
- **Serviços externos**: APIs de terceiros

## 📈 Cobertura Atual

### **Frontend**: ~85% de cobertura

- ✅ **31 testes** passando
- ✅ Utilitários, componentes e APIs cobertos
- ✅ Mocks completos implementados

### **Backend**: ~70% de cobertura

- ✅ **14 testes** passando
- ✅ Serviços e repositórios cobertos
- ✅ Estrutura preparada para expansão

## 🔄 Desenvolvimento Orientado por Testes (TDD)

### **Fluxo Recomendado**

1. **Escreva o teste primeiro** (teste falha)
2. **Implemente a funcionalidade** (teste passa)
3. **Refatore o código** (teste continua passando)
4. **Execute todos os testes** (regressão)

### **Exemplo Prático**

```bash
# 1. Criar teste
echo "it('should do something', () => { expect(true).toBe(false); });" > component.test.js

# 2. Executar teste (falha)
npm run test

# 3. Implementar funcionalidade
# ... código ...

# 4. Teste passa
npm run test
```

## 🚨 Solução de Problemas

### **Testes não executam**

```bash
# Verificar dependências
npm install

# Limpar cache
npm run test -- --clearCache

# Executar específico
npm run test src/component.test.js
```

### **Erros de import**

- Verificar caminhos relativos nos imports
- Verificar se arquivos existem
- Verificar configurações de alias no `vite.config.js`

### **Mocks não funcionam**

- Verificar se mocks estão sendo aplicados antes dos imports
- Usar `jest.mock()` ou `vi.mock()` no início dos arquivos
- Verificar se as dependências mockadas existem

### **Timeouts**

```javascript
// Aumentar timeout se necessário
it("should do async operation", async () => {
  // ... teste ...
}, 10000); // 10 segundos
```

## 📚 Boas Práticas

### **Estrutura dos Testes**

```javascript
describe("Component/Service Name", () => {
  beforeEach(() => {
    // Setup para cada teste
  });

  describe("Specific Feature", () => {
    it("should behave correctly when...", () => {
      // Arrange
      const input = "test";

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe("expected");
    });
  });
});
```

### **Convenções de Nomenclatura**

- Arquivos: `*.test.js` ou `*.test.ts`
- Funções: `describe('what it tests', () => {...})`
- Casos: `it('should behave correctly when...', () => {...})`

### **Matchers Úteis**

```javascript
// Presença no DOM
expect(element).toBeInTheDocument();

// Valores
expect(value).toBe(expected);
expect(array).toContain(item);

// Chamadas de função
expect(mockFunction).toHaveBeenCalledWith(arg1, arg2);
expect(mockFunction).toHaveBeenCalledTimes(1);

// Async
await waitFor(() => expect(element).toBeVisible());
```

## 🎯 Benefícios dos Testes

1. **Qualidade**: Código mais confiável e robusto
2. **Manutenibilidade**: Mudanças seguras com feedback imediato
3. **Documentação**: Testes servem como exemplos de uso
4. **Refatoração**: Alterações sem medo de quebrar funcionalidades
5. **CI/CD**: Integração contínua com verificação automática
6. **Debugging**: Isolamento de problemas específicos

## 📞 Suporte e Contribuição

### **Adicionando Novos Testes**

1. Criar arquivo `*.test.js` ou `*.test.ts`
2. Seguir estrutura existente
3. Executar `npm run test` para verificar
4. Garantir cobertura adequada

### **Executar Apenas Testes Específicos**

```bash
# Arquivo específico
npm run test src/component.test.js

# Padrão de nome
npm run test -- --testNamePattern="should render"

# Pasta específica
npm run test src/components/
```

---

## 🎉 Conclusão

A implementação de testes unitários no Conecta-Loja fornece uma base sólida para desenvolvimento de alta qualidade. Com **45 testes** atualmente implementados e cobertura significativa, o projeto está preparado para escalar mantendo a confiabilidade e qualidade do código.

**Para executar todos os testes:**

```bash
# Frontend
cd frontend && npm run test

# Backend
cd backend && npm run test
```

**Happy Testing! 🚀**

