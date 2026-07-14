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

## Resumo

| ID | Módulo | Severidade | Status |
|---|---|---|---|
| BUG-001 | Produtos | Alta | Aberto |
| BUG-002 | Categorias | Média | A confirmar |
| BUG-003 | Categorias | Média | Aberto |
| BUG-004 | Múltiplos | Baixa-Média | Aberto |
| BUG-005 | Categorias | Baixa | Aberto |