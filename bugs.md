# Relatório de Bugs e Observações — FirmaForte

Documento gerado a partir de testes exploratórios manuais e automatizados (Playwright + Cucumber) durante a construção da suíte de testes E2E do FirmaForte.

---

## BUG-001: SKU duplicado permitido no cadastro de produtos

**Severidade:** Alta
**Módulo:** Produtos
**Status:** Aberto

### Descrição
O sistema permite cadastrar dois ou mais produtos com o mesmo SKU (código único de identificação do produto), sem nenhuma validação ou mensagem de erro.

### Passos para reproduzir
1. Acessar Produtos → Novo Produto
2. Preencher nome, SKU (ex: "1234"), categoria, preços
3. Clicar em "Criar"
4. Repetir os passos 1-3 usando o mesmo SKU "1234" para um produto diferente
5. Observar que ambos os produtos são criados com sucesso

### Resultado esperado
O sistema deveria impedir a criação de um segundo produto com SKU já existente, exibindo uma mensagem de erro (ex: "Este SKU já está em uso").

### Resultado atual
Ambos os produtos são criados normalmente, sem nenhum aviso.

### Impacto
SKU é geralmente usado como identificador único em sistemas de estoque/PDV. Duplicidade pode causar erros em: dedução de estoque, relatórios de produtos mais vendidos, buscas por código, e possíveis inconsistências em vendas futuras.

---

## BUG-002: Categoria duplicada permitida sem validação

**Severidade:** Média
**Módulo:** Categorias
**Status:** Aberto (a confirmar se é comportamento intencional)

### Descrição
É possível criar duas ou mais categorias com exatamente o mesmo nome.

### Passos para reproduzir
1. Acessar Categorias → Nova Categoria
2. Criar categoria "Whiskey"
3. Repetir o processo criando outra categoria "Whiskey"
4. Observar que ambas aparecem na listagem

### Resultado esperado
A definir com o time de produto — pode ser necessário impedir nomes duplicados, ou esse comportamento pode ser intencional (a confirmar).

### Resultado atual
Sistema permite categorias com nomes idênticos sem aviso.

### Impacto
Pode causar confusão na hora de selecionar categoria em produtos (usuário não sabe qual das duas categorias "Whiskey" escolher), e dificulta relatórios agrupados por categoria.

---

## BUG-003: Falta de feedback ao tentar criar categoria com nome vazio

**Severidade:** Média (UX)
**Módulo:** Categorias
**Status:** Aberto

### Descrição
Ao tentar criar uma categoria sem preencher o campo "Nome da Categoria" e clicar em "Criar Categoria", nada visível acontece — o botão é clicável, mas não há mensagem de erro nem indicação de que o campo é obrigatório.

### Passos para reproduzir
1. Acessar Categorias → Nova Categoria
2. Deixar o campo "Nome da Categoria" vazio
3. Clicar em "Criar Categoria"

### Resultado esperado
O sistema deveria exibir uma mensagem indicando que o campo é obrigatório (ex: "Nome da categoria é obrigatório"), e/ou destacar visualmente o campo com erro.

### Resultado atual
O modal permanece aberto e nenhuma categoria é criada, mas não há nenhum feedback visual ou textual para o usuário entender o motivo.

### Impacto
Usuário pode ficar confuso, achando que o sistema travou ou não funcionou, sem entender que precisa preencher o campo.

---

## BUG-004: Botões de ícone sem atributo de acessibilidade (aria-label)

**Severidade:** Baixa-Média
**Módulo:** Múltiplos (Logout, Editar Categoria, Excluir Categoria)
**Status:** Aberto

### Descrição
Diversos botões que contêm apenas um ícone SVG (sem texto visível) não possuem `aria-label` ou outro atributo de acessibilidade, o que impede leitores de tela de identificar sua função.

### Exemplos encontrados
- Botão de logout (ícone `lucide-log-out`) no painel do admin
- Botão de editar categoria (ícone `lucide-pen`)
- Botão de excluir categoria (ícone `lucide-trash2`)

### Resultado esperado
Cada botão de ícone deveria ter um `aria-label` descritivo (ex: `aria-label="Sair"`, `aria-label="Editar categoria"`, `aria-label="Excluir categoria"`).

### Resultado atual
Os SVGs internos possuem `aria-hidden="true"`, e os botões não têm nenhum texto alternativo, tornando a ação invisível para tecnologias assistivas.

### Impacto
Prejudica a acessibilidade do sistema para usuários que dependem de leitores de tela.

---

## BUG-005: Exclusão de categoria usa diálogo nativo do navegador, inconsistente com o design do sistema

**Severidade:** Baixa
**Módulo:** Categorias
**Status:** Aberto (melhoria de consistência)

### Descrição
Ao excluir uma categoria, o sistema utiliza a função nativa `window.confirm()` do navegador, que tem aparência genérica e não segue o design visual (cores, tipografia, componentes) do restante da aplicação.

### Resultado esperado
Um modal customizado, consistente com os demais modais do sistema (como o de "Nova Categoria"), pedindo confirmação de exclusão.

### Resultado atual
Um alerta padrão do navegador é exibido, quebrando a identidade visual do produto.

### Impacto
Impacto estético/consistência de marca — não afeta funcionalidade, mas passa uma impressão menos polida ao usuário.

---

## BUG-006: Preço de Custo aceita valores negativos

**Severidade:** Média
**Módulo:** Produtos
**Status:** Aberto

### Descrição
O campo "Preço de Custo" no cadastro de produto exibe uma validação HTML5
(`min="0"`) que impede a digitação manual de números negativos no
navegador, mas essa validação é puramente cosmética: o backend não valida
a faixa do valor, apenas o tipo. Um valor negativo enviado diretamente à
API é aceito e persistido normalmente.

### Passos para reproduzir
1. Autenticar como admin
2. Enviar requisição `POST /api/products` com `costPrice: -5` (e demais
   campos obrigatórios válidos)
3. Observar resposta: `201 Created`
4. Consultar o produto criado: `costPrice` salvo e exibido como `-R$ 5,00`

### Resultado esperado
O backend deveria rejeitar valores negativos de Preço de Custo, retornando
erro de validação (ex: `400` com mensagem clara).

### Resultado atual
Aceito sem nenhuma validação de faixa (mínimo) no backend.

### Impacto
Permite dado de negócio inconsistente (produto com custo negativo pode
distorcer relatórios financeiros/margem de lucro calculada a partir
desse campo).

---

## BUG-007: Preço de Venda sem validação de negócio (aceita prejuízo)

**Severidade:** Média/Alta
**Módulo:** Produtos
**Status:** Aberto

### Descrição
O campo "Preço de Venda" aceita qualquer valor numérico sem nenhuma
validação de regra de negócio: aceita zero, aceita negativo, e aceita
valores menores que o Preço de Custo do mesmo produto (ou seja, permite
cadastrar um produto configurado para dar prejuízo em cada venda, sem
nenhum aviso ou bloqueio).

### Passos para reproduzir
1. Autenticar como admin
2. Enviar `POST /api/products` com `costPrice: 100, salePrice: 50`
   (venda 50% abaixo do custo)
3. Observar resposta: `201 Created`
4. Produto criado normalmente, sem nenhum toast de aviso/confirmação

Outras variações confirmadas com o mesmo resultado (aceitas sem restrição):
- `costPrice: 10, salePrice: -20` (venda negativa)
- `costPrice: 10, salePrice: 0` (venda zerada)

### Resultado esperado
Seria razoável ter ao menos um aviso quando o Preço de Venda for menor ou
igual ao Preço de Custo, já que isso indica prejuízo ou operação sem
margem.

### Resultado atual
Nenhuma validação cruzada entre `costPrice` e `salePrice` em nenhuma
camada da aplicação (nem frontend, nem backend).

### Impacto
Diferente do BUG-006 (apenas dado inconsistente), aqui o impacto é
potencialmente financeiro direto: um erro de digitação no cadastro pode
gerar vendas com prejuízo sistemático sem qualquer alerta. Reforça o
mesmo padrão do BUG-006: a camada de preços não tem validação de regra
de negócio, apenas checagem de tipo.

## Resumo

| ID | Módulo | Severidade | Status |
|---|---|---|---|
| BUG-001 | Produtos | Alta | Aberto |
| BUG-002 | Categorias | Média | A confirmar |
| BUG-003 | Categorias | Média | Aberto |
| BUG-004 | Múltiplos | Baixa-Média | Aberto |
| BUG-005 | Categorias | Baixa | Aberto |
| BUG-006 | Produtos | Média | Aberto |
| BUG-007 | Produtos | Média/Alta | Aberto |