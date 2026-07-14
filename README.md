# FirmaForte QA — Testes E2E

![CI](https://github.com/guilhermeQA7/firma-forte-qa/actions/workflows/e2e.yml/badge.svg)

Suíte de testes end-to-end para o sistema **FirmaForte** (POS e gestão de estoque para adegas/tabacarias), usando **Playwright**, **Cucumber (BDD/Gherkin)** e o padrão **Page Object Model (POM)**, escrita em TypeScript.

## Stack utilizada

- [Playwright](https://playwright.dev/) — automação de navegador
- [Cucumber.js](https://cucumber.io/) — BDD com Gherkin em português
- TypeScript
- GitHub Actions — pipeline de CI
- pnpm — gerenciador de pacotes

## Estrutura do projeto
e2e/
├── features/              # Arquivos .feature (cenários em Gherkin)
├── autenticacao.steps.ts  # Step definitions
├── support/
│   ├── world.ts           # CustomWorld (contexto compartilhado do Playwright)
│   └── pages/              # Page Objects (BasePage, LoginPage, CriarContaPage, DashboardPage)
└── report/                # Relatório HTML gerado após execução

## Como rodar localmente

1. Instale as dependências:
```bash
   pnpm install
```

2. Instale os navegadores do Playwright (primeira vez):
```bash
   pnpm exec playwright install --with-deps chromium
```

3. Crie um arquivo `.env` na raiz do projeto com a senha da conta de teste:
ADMIN_PASSWORD=sua_senha_aqui
> Esse arquivo nunca é commitado (está no `.gitignore`).

4. Rode os testes:
```bash
   npx cucumber-js
```

5. Veja o relatório HTML gerado em `e2e/report/cucumber-report.html`.

## CI/CD

Os testes rodam automaticamente via **GitHub Actions** a cada push ou pull request na branch `main`. O workflow instala as dependências, os navegadores do Playwright, e executa a suíte completa num ambiente Ubuntu limpo. A senha de teste é injetada via GitHub Secret (`ADMIN_PASSWORD`), nunca exposta no código.

## Cenários cobertos

- ✅ Criar conta com sucesso no primeiro acesso
- ✅ Login com credenciais corretas
- ✅ Login com senha incorreta
- ✅ Tentar criar conta para usuário que já tem senha definida
- ✅ Logout

## Limitações conhecidas

O cenário **"Criar conta com sucesso no primeiro acesso"** está marcado com a tag `@manual-reset-required` e é ignorado nas execuções normais do CI. Isso porque o ambiente de QA (`firma-forte-qa.up.railway.app`) não permite recriar contas com os mesmos perfis fixos (`admin`/`vendedor`), e não há acesso a um endpoint de reset de banco de dados nesse ambiente compartilhado. Esse cenário já foi validado manualmente e via execução automatizada em ambiente limpo; para reexecutá-lo, é necessário resetar o banco de QA e rodar:
```bash
npx cucumber-js --tags "@manual-reset-required"
```

## Autor

Guilherme Martins