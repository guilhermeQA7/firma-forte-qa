# Charter Exploratório — Cadastro de Produto: Campo Preço de Custo

## Missão
Explorar o comportamento real do campo **Preço de Custo** no modal "Novo Produto"
para destravar 3 casos de teste que ficaram marcados como "a_definir" no
Scenario Outline de Equivalência + Valor Limite, e mapear como a aplicação
sinaliza sucesso/erro (necessário para os asserts do Playwright).

## Escopo
- Modal "Novo Produto" → campo Preço de Custo (R$)
- Tempo-alvo: 25-40 minutos (sessão exploratória curta e focada)
- Fora de escopo nesta sessão: outros campos do form, fluxo de edição/exclusão

## Perguntas a responder (guiam a exploração, não são passo a passo fixo)

### Q1 — Como a aplicação sinaliza sucesso e erro?
- Ao criar produto com sucesso: o modal fecha? Aparece toast? Aparece o produto na lista?
- Ao ter erro de validação: aparece mensagem embaixo do campo? Toast vermelho?
  Borda do input muda de cor? O modal permanece aberto?
- **Anotar**: texto exato da mensagem, se existe `role="alert"` ou `aria-invalid`
  no DevTools (isso define o locator que vou usar no `esperarMensagem()`)

### Q2 — CE-02: Preço de Custo = 0 é aceito?
- Preencher manualmente "0" no campo e tentar criar o produto
- Se aceito: registrar se o produto aparece com R$ 0,00 na listagem
- Se rejeitado: capturar a mensagem exata de erro
- **Testar também**: o que acontece se digitar "0" e sair do campo (blur) —
  aparece validação antes mesmo de clicar em Criar?

### Q3 — CE-06: Preço de Custo vazio é aceito?
- Deixar o campo em branco e tentar criar o produto (preenchendo os demais campos)
- O campo é obrigatório? Existe algum indicador visual de campo obrigatório
  (asterisco, borda vermelha) que eu não tenha capturado ainda no DevTools?
- Se aceito vazio: qual valor fica salvo? `null`? `0`? Undefined quebra a listagem?

### Q4 — CE-07: Três casas decimais (ex: 0.001) são aceitas?
- Digitar manualmente "0.001" no campo (mesmo com `step="0.01"`)
- O navegador bloqueia a digitação, ou só valida no submit?
- Se enviado: o valor salvo trunca pra "0.00"? Arredonda pra "0.01"? Salva como veio?
- **Bônus**: testar colar (Ctrl+V) o valor "0.001" — às vezes paste contorna
  validações que bloqueiam digitação

### Q5 (bônus, se sobrar tempo) — O campo aceita valores digitados fora da faixa,
mesmo com `min="0"` no HTML?
- Tentar digitar "-5" diretamente no campo numérico (spinner do número)
- Testar colar "-5" via Ctrl+V
- Isso indica se a validação `min="0"` do HTML é a única barreira, ou se
  existe alguma segunda camada (JS) antes do envio

## Como registrar as observações
Pra cada pergunta, anotar rapidamente:
- **O que fiz** (ação exata)
- **O que aconteci** (comportamento observado)
- **Evidência** (print ou trecho do DevTools se relevante)

Não precisa ser formal — pode ser bullet points direto num bloco de notas
ou arquivo `.md` mesmo. O objetivo é eu conseguir travar os `resultado_esperado`
no `.feature` com base em fato, não suposição.

## Próximo passo após esta sessão
Com as respostas de Q1-Q4, eu:
1. Atualizo o `.feature` trocando "a_definir" pelo resultado real
2. Implemento o assert real no step `esperarMensagem()` (hoje é placeholder)
3. Seguimos para Preço de Venda (reaproveitando o que aprendemos aqui sobre
   como a app sinaliza erro/sucesso — não precisa repetir a exploração do zero)