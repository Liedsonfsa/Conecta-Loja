# Padrões de commits e Pull Requests

Esse arquivo especifica como devem ser feitos os commits e pull requests da aplicação.


## Padrões dos commits

Todos os commits devem conter a estrutura abaixo.

`prefixo do tipo de commit: descrição do commit`

Ex:

`feat: adiciona a rota de dadastrar produtos`

### Tabela dos padrões dos commits

| Prefixo     | Descrição | Exemplo |
|-------------|-----------|---------|
| `feat:`     | Nova funcionalidade | `feat: adiciona login com Google` |
| `fix:`      | Correção de bugs | `fix: corrige validação de CPF` |
| `docs:`     | Mudanças na documentação | `docs: atualiza README.md` |
| `style:`    | Formatação (CSS, código sem lógica alterada) | `style: ajuste de cores do botão` |
| `refactor:` | Refatoração (sem mudança de funcionalidade) | `refactor: simplifica função X` |
| `test:`     | Adição/ajuste de testes | `test: cria teste para componente Y` |
| `chore:`    | Tarefas auxiliares (build, dependências) | `chore: atualiza dependências` |
| `perf:`     | Melhorias de performance | `perf: otimiza renderização de lista` |


## Pull Requests

Cada PR deve conter a estrutura abaixo, caso contrário, não será aceito.

`tipo do PR/nome da branch`

Ex:

`feature/autenticacao`


### Tabela dos padrões dos PR's

| Prefixo     | Nome da branch |
|-------------|-----------|
| `feature/`  |  `feature/realizar-pagamento` |
| `fixing/`    | `fixing/cadastro` |
| `docs/`     | `docs/diagramas` |
| `style/`    | `style/home` |
| `refactor/` | `refactor/logica-de-negocio` |
| `testing/`     | `testing/login` |
| `performance/`     | `performance/database` |


## Modelo do Pull Request

Além de conter as informações acima, a descrição do PR também deve conter uma lista com as alterações que foram feitas

Ex:

- criei a tela de login
- criei a tela de cadastro
- adicionei a validação dos campos das duas telas

