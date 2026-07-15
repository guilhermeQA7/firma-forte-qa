# language: pt
Funcionalidade: Cadastro de Produto - Validação do campo Preço de Custo
  Como usuário administrador do FirmaForte
  Quero que o campo Preço de Custo valide corretamente os valores informados
  Para garantir a integridade dos dados cadastrados no estoque

  Contexto:
    Dado que estou logado como "Admin"
    E estou na tela de cadastro de Produtos
    E abri o modal de "Novo Produto"

  @equivalencia @valor-limite @preco-custo
  Esquema do Cenário: Validar aceitação/rejeição de valores no campo Preço de Custo
    Dado preencho o campo "Nome do Produto" com "Produto Teste EP"
    E preencho o campo "SKU" com um valor único gerado automaticamente
    E preencho o campo "Preço de Custo" com "<valor_informado>"
    Quando clico no botão "Criar"
    Então o resultado esperado deve ser "<resultado_esperado>"
    E a mensagem exibida deve ser "<mensagem>"

    Exemplos: Classes de Equivalência e Valores Limite (confirmados via investigação de código + API)
      | id     | valor_informado | resultado_esperado | mensagem        |
      | CE-01  | -0.01           | aceito              | Produto criado. |
      | CE-02  | 0               | aceito              | Produto criado. |
      | CE-03  | 0.01            | aceito              | Produto criado. |
      | CE-04  | 50.00           | aceito              | Produto criado. |
      | CE-07  | 0.001           | aceito              | Produto criado. |

  # # BUG-006 (severidade a classificar com o time): o campo Preço de Custo tem
  # min="0" apenas no HTML5 (validação "cosmética" do navegador). O backend
  # (POST /api/products) NÃO valida faixa - apenas tipo (via Zod, provavelmente
  # drizzle-zod). Testado diretamente via API: costPrice = -5 foi aceito (201)
  # e persistido/exibido como "-R$ 5,00". CE-01 documenta esse comportamento
  # real (não é o esperado do ponto de vista de negócio, mas é o que acontece).
  # Ação recomendada: reportar como bug e decidir com o time se a correção é
  # no backend (validação de negócio) ou se negativo é aceitável em algum fluxo
  # (ex: estorno/ajuste manual de custo) - não assumir, perguntar ao PO/dev.

  # Nota sobre CE-07: valor de entrada 0.001 é arredondado para 0.00 na
  # persistência (coerente com coluna decimal(x,2) no Postgres). Diferença
  # de 0.006 -> 0.01 confirmada via API mostra que é arredondamento padrão,
  # não truncamento.

  # Nota sobre CE-06 (campo vazio) e CE-05 (texto não-numérico): REMOVIDOS
  # deste cenário de UI porque não são alcançáveis pela interface:
  # - O onChange do campo faz Number(valor), então limpar o campo produz
  #   costPrice = 0 (equivalente ao CE-02), nunca um "vazio" real.
  # - O input é type="number", que impede nativamente a digitação/inserção
  #   de texto não numérico no próprio DOM.
  # Esses dois casos (vazio/null e tipo inválido) só são alcançáveis batendo
  # direto na API (retornam 400 com erro Zod de "Required"/"invalid_type").
  # Serão cobertos em um futuro cenário de teste de API dentro de e2e/, não aqui.