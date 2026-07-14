# language: pt
Funcionalidade: Gerenciamento de Categorias
  Como administrador do FirmaForte
  Quero criar, editar e excluir categorias de produtos
  Para organizar o catálogo da minha adega

  Cenário: Criar categoria com sucesso
    Dado que estou logado como "Admin"
    E acesso a tela de categorias
    Quando clico em "Nova Categoria"
    E defino o nome da categoria como "Vinhos Tintos"
    E confirmo a criação da categoria
    Então devo ver "Vinhos Tintos" na lista de categorias

  Cenário: Não deve criar categoria com nome vazio
    Dado que estou logado como "Admin"
    E acesso a tela de categorias
    Quando clico em "Nova Categoria"
    E confirmo a criação da categoria sem preencher o nome
    Então o modal de nova categoria continua aberto

  Cenário: Editar categoria existente
    Dado que estou logado como "Admin"
    E acesso a tela de categorias
    E já existe uma categoria chamada "Cervejas"
    Quando clico em editar a categoria "Cervejas"
    E altero o nome para "Cervejas Artesanais"
    E salvo as alterações
    Então devo ver "Cervejas Artesanais" na lista de categorias

  Cenário: Excluir categoria com confirmação
    Dado que estou logado como "Admin"
    E acesso a tela de categorias
    E já existe uma categoria chamada "Categoria Temporária"
    Quando clico em excluir a categoria "Categoria Temporária" e confirmo
    Então "Categoria Temporária" não deve mais aparecer na lista