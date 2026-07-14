import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './support/world';
import { CriarContaPage } from './support/pages/CriarContaPage';
import { DashboardPage } from './support/pages/DashboardPage';
import { LoginPage } from './support/pages/LoginPage';


let criarContaPage: CriarContaPage;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;

Given('que estou na tela de criar conta', async function (this: CustomWorld) {
  criarContaPage = new CriarContaPage(this.page);
  await this.page.goto('/criar-conta');
});

When('seleciono o usuário {string}', async function (this: CustomWorld, usuario: string) {
  const usuarioNormalizado = usuario.toLowerCase() as 'admin' | 'vendedor';
  await criarContaPage.selecionarUsuario(usuarioNormalizado);
});

When('defino a senha {string} e confirmo', async function (this: CustomWorld, senha: string) {
  await criarContaPage.preencherSenha(senha);
  await criarContaPage.confirmarSenha(senha);
});

When('defino qualquer senha e confirmo', async function (this: CustomWorld) {
  await criarContaPage.preencherSenha('QualquerSenha123!');
  await criarContaPage.confirmarSenha('QualquerSenha123!');
});

When('clico em {string}', async function (this: CustomWorld, texto: string) {
  await this.page.getByRole('button', { name: texto }).click();
});

When('clico em sair do sistema', async function (this: CustomWorld) {
  dashboardPage = new DashboardPage(this.page);
  await dashboardPage.clicarSair();
});

Then('devo ver a mensagem {string}', async function (this: CustomWorld, mensagem: string) {
  await expect(this.page.getByText(mensagem).first()).toBeVisible();
});

Then('devo ver a mensagem de erro informando que a conta já existe', async function (this: CustomWorld) {
  await expect(this.page.getByText('Esse usuário já existe.').first()).toBeVisible();
});

Then('devo ser redirecionado para a tela de login', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/\/login/);
});

Then('devo ver o painel do admin', async function (this: CustomWorld) {
  dashboardPage = new DashboardPage(this.page);
  await expect(this.page).toHaveURL(/\/admin/);
  expect(await dashboardPage.estaVisivel()).toBeTruthy();
});

Then('não devo ser redirecionado para o painel', async function (this: CustomWorld) {
  await expect(this.page).not.toHaveURL(/\/admin/);
});

Given('que já existe uma conta {string} com senha válida', async function (this: CustomWorld, usuario: string) {
  // Assume-se que a conta já existe manualmente no ambiente de QA.
  // A senha real fica no .env (ADMIN_PASSWORD) e é usada no step de login.
});

Given('que já existe uma conta {string} com senha definida', async function (this: CustomWorld, usuario: string) {
  // Idem: assume-se que a conta "Admin" já existe no ambiente.
});

Given('que acesso a tela de login', async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await this.page.goto('/login');
});

When('acesso a tela de login', async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await this.page.goto('/login');
});

When('acesso a tela de criar conta', async function (this: CustomWorld) {
  criarContaPage = new CriarContaPage(this.page);
  await this.page.goto('/criar-conta');
});

When('informo o usuário {string} e a senha válida', async function (this: CustomWorld, usuario: string) {
  const senha = process.env.ADMIN_PASSWORD!;
  await loginPage.preencherUsuario(usuario);
  await loginPage.preencherSenha(senha);
});

When('informo o usuário {string} e a senha {string}', async function (this: CustomWorld, usuario: string, senha: string) {
  await loginPage.preencherUsuario(usuario);
  await loginPage.preencherSenha(senha);
});

Given('que estou logado como {string}', async function (this: CustomWorld, usuario: string) {
  await this.page.goto('/login');
  loginPage = new LoginPage(this.page);
  const senha = process.env.ADMIN_PASSWORD!;
  await loginPage.preencherUsuario(usuario);
  await loginPage.preencherSenha(senha);
  await loginPage.clicarEntrar();
  await expect(this.page).toHaveURL(/\/admin/);
});
