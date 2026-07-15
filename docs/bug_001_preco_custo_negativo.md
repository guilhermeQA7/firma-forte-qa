# BUG-001 — Preço de Custo aceita valores negativos

## Resumo
O campo "Preço de Custo" no cadastro de Produto exibe uma validação HTML5
(`min="0"`) que impede a digitação manual de números negativos no navegador,
mas essa validação é puramente cosmética: o backend (`POST /api/products`)
não valida a faixa do valor, apenas o tipo (via Zod). Um valor negativo
enviado diretamente à API é aceito e persistido normalmente.

## Como foi encontrado
Investigação de código + testes diretos na API (via Claude Code), como parte
do Charter Exploratório de `docs/charter_preco_custo.md`.

## Passos para reproduzir
1. Autenticar como admin
2. Enviar requisição `POST /api/products` com `costPrice: -5` (e demais
   campos obrigatórios válidos)
3. Observar resposta: `201 Created`
4. Consultar o produto criado: `costPrice` salvo e exibido como `-R$ 5,00`

## Comportamento esperado (a confirmar com o time/PO)
Preço de custo é, por natureza de negócio, um valor que não deveria ser
negativo. O esperado seria uma resposta `400` com mensagem de validação,
similar ao que já existe para tipo inválido (`invalid_type`).

## Comportamento atual
Aceito sem nenhuma validação de faixa (mínimo) no backend.

## Severidade sugerida
Média — não compromete segurança nem causa crash, mas permite dado de
negócio inconsistente (produto com custo negativo pode distorcer relatórios
financeiros/margem de lucro calculada a partir desse campo).

## Observação técnica adicional (não é o bug em si, mas relacionado)
O input do frontend possui uma particularidade: o valor exibido é
`costPrice || ""`, então sempre que o estado intermediário do campo é `0`
ou `NaN`, o campo é renderizado vazio. Isso impede digitar manualmente
(tecla por tecla) um valor como `0.001` — só funciona colando o valor
pronto. Não afeta os testes automatizados com Playwright (`fill()` seta o
valor de uma vez, sem digitação caractere a caractere), mas é um problema
de usabilidade real para um usuário humano. Vale reportar separadamente
como um segundo achado (UX), não como parte do BUG-001.

## Status
Aberto — pendente de validação com o time sobre se a correção é no
backend (adicionar validação de faixa) ou se negativo é intencional em
algum fluxo específico (ex: ajuste/estorno manual).