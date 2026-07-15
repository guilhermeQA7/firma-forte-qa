# language: pt
Funcionalidade: Cadastro de Produto - Validação do campo Preço de Venda
  Como usuário administrador do FirmaForte
  Quero que o campo Preço de Venda valide corretamente os valores informados
  Para garantir a integridade dos dados cadastrados e evitar prejuízo

  Contexto:
    Dado que estou logado como "Admin"
    E estou na tela de cadastro de Produtos
    E abri o modal de "Novo Produto"

  @equivalencia @valor-limite @preco-venda
  Esquema do Cenário: Validar aceitação de valores no campo Preço de Venda (isolado)
    Dado preencho o campo "Nome do Produto" com "Produto Teste EP Venda"
    E preencho o campo "SKU" com um valor único gerado automaticamente
    E preencho o campo "Preço de Venda" com "<valor_informado>"
    Quando clico no botão "Criar"
    Então o resultado esperado deve ser "<resultado_esperado>"
    E a mensagem exibida deve ser "<mensagem>"

    Exemplos: Classes de Equivalência e Valores Limite (confirmados via investigação de código + API)
      | id     | valor_informado | resultado_esperado | mensagem        |
      | CE-V01 | -0.01           | aceito              | Produto criado. |
      | CE-V02 | 0               | aceito              | Produto criado. |
      | CE-V03 | 0.01            | aceito              | Produto criado. |
      | CE-V04 | 50.00           | aceito              | Produto criado. |

  # Mesmo comportamento do Preço de Custo (BUG-001): min="0" é só validação
  # HTML5 cosmética, backend aceita negativo sem restrição.

  @tabela-decisao @regra-negocio @preco-venda-vs-custo
  Esquema do Cenário: Regra de negócio entre Preço de Venda e Preço de Custo
    Dado preencho o campo "Nome do Produto" com "Produto Teste Regra Preco"
    E preencho o campo "SKU" com um valor único gerado automaticamente
    E preencho o campo "Preço de Custo" com "<preco_custo>"
    E preencho o campo "Preço de Venda" com "<preco_venda>"
    Quando clico no botão "Criar"
    Então o resultado esperado deve ser "<resultado_esperado>"
    E a mensagem exibida deve ser "<mensagem>"

    Exemplos: Combinações Custo x Venda (confirmadas via API - ver BUG-002)
      | id     | preco_custo | preco_venda | resultado_esperado | mensagem        |
      | RN-01  | 100.00      | 150.00      | aceito              | Produto criado. |
      | RN-02  | 100.00      | 100.00      | aceito              | Produto criado. |
      | RN-03  | 100.00      | 50.00       | aceito              | Produto criado. |
      | RN-04  | 10.00       | 0           | aceito              | Produto criado. |
      | RN-05  | 10.00       | -20.00      | aceito              | Produto criado. |

  # BUG-002: RN-03, RN-04 e RN-05 documentam que a aplicação aceita venda
  # com prejuízo (venda < custo), venda zerada e venda negativa, sem
  # nenhuma validação de negócio em nenhuma camada (frontend ou backend).
  # Ver docs/bug_002_preco_venda_sem_validacao.md para detalhes completos
  # e a ação recomendada.