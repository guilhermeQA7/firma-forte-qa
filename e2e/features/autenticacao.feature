# language: pt
Funcionalidade: Autenticação de usuários
  Como usuário do FirmaForte
  Quero criar minha conta e fazer login
  Para acessar o sistema de acordo com meu perfil (admin ou vendedor)

# Este cenário só pode ser executado uma vez por ambiente, pois o FirmaForte
  # não permite recriar contas com o mesmo perfil (admin/vendedor).
  # Após a primeira execução bem-sucedida, requer reset manual do banco de QA
  # para ser executado novamente. Ambiente atual: já validado e "gasto".

  @manual-reset-required
  Cenário: Criar conta com sucesso no primeiro acesso
    Dado que estou na tela de criar conta
    Quando seleciono o usuário "Vendedor"
    E defino a senha "SenhaForte123!" e confirmo
    E clico em "Criar conta"
    Então devo ver a mensagem "Conta criada com sucesso"
    E devo ser redirecionado para a tela de login

  Cenário: Login com credenciais corretas
    Dado que já existe uma conta "Admin" com senha válida
    Quando acesso a tela de login
    E informo o usuário "Admin" e a senha válida
    E clico em "Entrar"
    Então devo ver o painel do admin

  Cenário: Login com senha incorreta
    Dado que já existe uma conta "Admin" com senha válida
    Quando acesso a tela de login
    E informo o usuário "Admin" e a senha "SenhaErrada"
    E clico em "Entrar"
    Então devo ver a mensagem "Usuário ou senha inválidos."
    E não devo ser redirecionado para o painel

  Cenário: Tentar criar conta para usuário que já tem senha definida
  Dado que já existe uma conta "Admin" com senha definida
  Quando acesso a tela de criar conta
  E seleciono o usuário "Admin"
  E defino qualquer senha e confirmo
  E clico em "Criar conta"
  Então devo ver a mensagem de erro informando que a conta já existe

  Cenário: Logout
    Dado que estou logado como "Admin"
    Quando clico em sair do sistema
    Então devo ser redirecionado para a tela de login