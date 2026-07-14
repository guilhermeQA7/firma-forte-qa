# language: pt
Funcionalidade: Autenticação de usuários
  Como usuário do FirmaForte
  Quero criar minha conta e fazer login
  Para acessar o sistema de acordo com meu perfil (admin ou vendedor)

  Cenário: Criar conta com sucesso no primeiro acesso
    Dado que estou na tela de criar conta
    Quando seleciono o usuário "Admin"
    E defino a senha "SenhaForte123!" e confirmo
    E clico em "Criar conta"
    Então devo ser redirecionado para o painel do admin

  Cenário: Login com credenciais corretas
    Dado que já existe uma conta "Admin" com senha "SenhaForte123!"
    Quando acesso a tela de login
    E informo o usuário "Admin" e a senha "SenhaForte123!"
    E clico em "Entrar"
    Então devo ver o painel do admin

  Cenário: Login com senha incorreta
    Dado que já existe uma conta "Admin" com senha "SenhaForte123!"
    Quando acesso a tela de login
    E informo o usuário "Admin" e a senha "SenhaErrada"
    E clico em "Entrar"
    Então devo ver a mensagem "Senha incorreta"
    E não devo ser redirecionado para o painel

  Cenário: Tentar criar conta para usuário que já tem senha definida
    Dado que já existe uma conta "Admin" com senha definida
    Quando acesso a tela de criar conta
    E seleciono o usuário "Admin"
    E defino qualquer senha e confirmo
    Então devo ver a mensagem de erro informando que a conta já existe

  Cenário: Logout
    Dado que estou logado como "Admin"
    Quando clico em "Sair"
    Então devo ser redirecionado para a tela de login