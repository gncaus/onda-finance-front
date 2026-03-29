# Onda Finance — Desafio Front-End

Aplicação web simulando um app bancário com foco em organização, UX e boas práticas. Desenvolvida como parte do processo seletivo da Onda Finance.

## Acesso rápido

- **Aplicação:**  https://onda-finance-front.vercel.app
- **Credenciais de teste:** `gabriel@email.com` / `123456`

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/onda-finance-front.git
cd onda-finance-front

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Scripts disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
npm run test       # Testes em modo watch
npm run test:run   # Testes em execução única
```

---

## Decisões técnicas

### Estrutura de pastas

O projeto segue uma separação clara por responsabilidade:

```
src/
├── components/   # Componentes reutilizáveis (PrivateRoute)
├── lib/          # Infraestrutura (axios, queryClient, queryKeys)
├── mocks/        # Dados e funções de API simuladas
├── pages/        # Telas da aplicação
├── router/       # Configuração de rotas
├── store/        # Estado global com Zustand
└── tests/        # Testes automatizados
```

### Gerenciamento de estado

Optei por separar o estado em duas camadas com responsabilidades distintas:

- **Zustand** para estado de cliente — dados que pertencem à sessão do usuário (autenticação e saldo). O `authStore` usa o middleware `persist` para manter a sessão ativa após recarregar a página, sem depender de lógica manual com `localStorage`.
- **TanStack Query** para estado de servidor — dados que vêm de uma API (transações). Gerencia cache, loading, erro e re-fetch automaticamente, eliminando a necessidade de `useEffect` + `useState` para busca de dados.

### Axios com interceptors

A instância do Axios foi configurada com dois interceptors:

- **Request:** injeta o token `Bearer` em todas as requisições automaticamente, lendo do Zustand via `getState()` (forma correta de acessar o store fora de componentes React).
- **Response:** trata o erro `401` globalmente fazendo logout automático, evitando que o usuário fique em estado inconsistente com sessão inválida.

### Validação de formulários

React Hook Form com Zod para validação em schema. A separação entre erros de validação (Zod, disparam antes do submit) e erros de servidor (disparam após a resposta da API) foi intencional — garante feedback preciso ao usuário em cada etapa do fluxo.

### queryKeys centralizado

Todas as chaves do React Query ficam em `src/lib/queryKeys.ts`. Isso evita typos e facilita invalidações de cache — por exemplo, após uma transferência bem-sucedida, `invalidateQueries` atualiza a lista de transações automaticamente sem gerenciamento manual de estado.

### CVA para variantes de componentes

A stack exige CVA (Class Variance Authority) para compor classes do Tailwind de forma tipada e segura. Os componentes do shadcn/ui já utilizam CVA internamente, e o padrão foi mantido nos componentes customizados.

### Mocks com delay intencional

As funções mock em `src/mocks/api.ts` simulam latência real (600–1000ms). Isso garante que os estados de `isLoading` do React Query sejam visíveis durante a demonstração, comprovando que o tratamento de estados assíncronos está implementado corretamente.

---

## Melhorias futuras

- **Autenticação real com JWT** — substituir o mock por um endpoint real, armazenando o token em memória (Zustand) em vez de `localStorage` para maior segurança contra XSS.
- **Refresh token** — implementar rotação automática de tokens expirados via interceptor do Axios.
- **Histórico de transações paginado** — cursor-based pagination com React Query para listas longas.
- **Suporte a múltiplos saldos** — exibir saldo por moeda (BRL, USD, USDT, USDC) refletindo a proposta multi-moeda da Onda.
- **WebSocket para saldo em tempo real** — substituir o polling por conexão persistente para atualizações instantâneas.
- **Internacionalização (i18n)** — suporte a múltiplos idiomas com `react-i18next`.
- **PWA** — tornar a aplicação instalável com suporte offline via Service Worker.
- **Testes E2E com Playwright** — cobrir fluxos completos de navegação além dos testes unitários.

---

## Segurança

> Esta seção descreve como a aplicação seria protegida em um ambiente de produção. As medidas abaixo não estão implementadas neste protótipo, mas representam as decisões que seriam tomadas em um produto real.

### Proteção contra engenharia reversa

**Ofuscação e minificação do bundle**
Em produção, o Vite gera um bundle minificado com nomes de variáveis e funções ofuscados. Para um nível adicional de proteção, ferramentas como `javascript-obfuscator` podem ser integradas ao pipeline de build para dificultar a leitura do código compilado.

**Lógica de negócio no servidor**
Nenhuma regra de negócio sensível deve existir no cliente. Validações críticas (limite de transferência, verificação de saldo real, autenticação) precisam ser executadas exclusivamente no backend. O front-end apenas apresenta resultados — nunca toma decisões de segurança.

**Variáveis de ambiente**
Chaves de API, URLs de serviços internos e qualquer configuração sensível devem ser injetadas via variáveis de ambiente em tempo de build (`VITE_*`), nunca hardcoded no código-fonte.

**Desabilitar DevTools em produção**
Para produtos com alto risco de fraude, é possível detectar e bloquear a abertura do DevTools via event listeners, adicionando uma camada extra de dificuldade para análise do bundle em runtime.

### Proteção contra vazamento de dados

**HTTPS obrigatório**
Toda comunicação entre cliente e servidor deve ocorrer via HTTPS com TLS 1.2+. Certificados devem ser renovados automaticamente (ex: Let's Encrypt via Certbot).

**Tokens em memória, não em localStorage**
`localStorage` é acessível por qualquer script na página, tornando-o vulnerável a ataques XSS. O token de autenticação deve ser armazenado em memória (Zustand sem `persist`) e renovado via `httpOnly cookie` — inacessível por JavaScript.

**Content Security Policy (CSP)**
Headers CSP restringem quais origens podem carregar scripts, estilos e outros recursos, bloqueando injeção de scripts maliciosos de terceiros.

```
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
```

**Sanitização de inputs**
Todos os dados enviados pelo usuário devem ser sanitizados antes de serem enviados à API ou renderizados na tela, prevenindo XSS e injeção.

**Rate limiting e throttling**
O backend deve limitar o número de requisições por IP/usuário em endpoints sensíveis (login, transferência), prevenindo ataques de força bruta e abuso da API.

**Logs sem dados sensíveis**
Sistemas de logging (Sentry, Datadog) não devem capturar valores de campos sensíveis como senhas, tokens ou números de conta. Mascaramento de dados deve ser configurado explicitamente.

---

## Stack

| Tecnologia | Uso |
|---|---|
| React 19 + TypeScript | Interface e tipagem |
| Vite | Bundler e servidor de desenvolvimento |
| Tailwind CSS + CVA | Estilização e variantes de componentes |
| shadcn/ui + Radix | Componentes acessíveis |
| React Router v6 | Navegação e rotas protegidas |
| TanStack Query v5 | Cache e estado de servidor |
| Zustand | Estado global de cliente |
| React Hook Form + Zod | Formulários e validação |
| Axios | Cliente HTTP com interceptors |
| Vitest + Testing Library | Testes automatizados |
