# BUG-002 — Preço de Venda sem validação de negócio (aceita prejuízo)

## Resumo
O campo "Preço de Venda" aceita qualquer valor numérico sem nenhuma
validação de regra de negócio: aceita zero, aceita negativo, e aceita
valores menores que o Preço de Custo do mesmo produto (ou seja, permite
cadastrar um produto configurado para dar prejuízo em cada venda, sem
nenhum aviso ou bloqueio).

## Como foi encontrado
Investigação de código + testes diretos na API (via Claude Code),
seguindo o mesmo processo usado no BUG-001 (Preço de Custo).

## Passos para reproduzir
1. Autenticar como admin
2. Enviar `POST /api/products` com `costPrice: 100, salePrice: 50`
   (venda 50% abaixo do custo)
3. Observar resposta: `201 Created`
4. Produto criado normalmente, sem nenhum toast de aviso/confirmação

Outras variações confirmadas com o mesmo resultado (aceitas sem restrição):
- `costPrice: 10, salePrice: -20` (venda negativa)
- `costPrice: 10, salePrice: 0` (venda zerada)

## Comportamento esperado (a confirmar com o time/PO)
Do ponto de vista de negócio, seria razoável ter ao menos um aviso
(não necessariamente um bloqueio) quando o Preço de Venda for menor ou
igual ao Preço de Custo, já que isso indica prejuízo ou operação sem
margem. Hoje não existe nenhum tratamento - nem no frontend, nem no
backend.

## Comportamento atual
Nenhuma validação cruzada entre `costPrice` e `salePrice` em nenhuma
camada da aplicação.

## Severidade sugerida
Média/Alta a discutir com o time - diferente do BUG-001 (dado
inconsistente), aqui o impacto é potencialmente financeiro direto: um
erro de digitação no cadastro (ex: trocar uma casa decimal) pode gerar
vendas com prejuízo sistemático sem qualquer alerta.

## Relação com BUG-001
Reforça um padrão: a camada de preços (Preço de Custo e Preço de Venda)
não tem nenhuma validação de regra de negócio em nenhum dos dois campos,
apenas checagem de tipo (Zod). Vale considerar reportar os dois bugs
juntos como um único apontamento sobre "ausência de validação de negócio
na camada de preços", já que a causa raiz provavelmente é a mesma decisão
de design (ou lacuna) no backend.

## Status
Aberto - pendente de validação com o time.