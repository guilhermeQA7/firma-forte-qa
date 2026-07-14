import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './support/world';
import { CategoriaPage } from './support/pages/CategoriaPage';

let categoriaPage: CategoriaPage;

Given('acesso a tela de categorias', async function (this: CustomWorld) {
  categoriaPage = new CategoriaPage(this.page);
  await this.page.goto('/categorias');
});

When('defino o nome da categoria como {string}', async function (this: CustomWorld, nome: string) {
  await categoriaPage.preencherNome(nome);
});

When('confirmo a criação da categoria', async function (this: CustomWorld) {
  await categoriaPage.clicarCriarCategoria();
});

When('confirmo a criação da categoria sem preencher o nome', async function (this: CustomWorld) {
  await categoriaPage.clicarCriarCategoria();
});

Then('devo ver {string} na lista de categorias', async function (this: CustomWorld, nome: string) {
  await expect(this.page.getByRole('row', { name: nome }).first()).toBeVisible();
});

Then('o modal de nova categoria continua aberto', async function (this: CustomWorld) {
  await expect(this.page.getByRole('heading', { name: 'Nova Categoria' })).toBeVisible();
});

Given('já existe uma categoria chamada {string}', async function (this: CustomWorld, nome: string) {
  categoriaPage = new CategoriaPage(this.page);
  await this.page.goto('/categorias');
  await categoriaPage.abrirModalNovaCategoria();
  await categoriaPage.preencherNome(nome);
  await categoriaPage.clicarCriarCategoria();
});

When('clico em editar a categoria {string}', async function (this: CustomWorld, nome: string) {
  await categoriaPage.clicarEditar(nome);
});

When('altero o nome para {string}', async function (this: CustomWorld, novoNome: string) {
  await categoriaPage.preencherNome(novoNome);
});

When('salvo as alterações', async function (this: CustomWorld) {
  await categoriaPage.clicarSalvarAlteracoes();
});

When('clico em excluir a categoria {string} e confirmo', async function (this: CustomWorld, nome: string) {
  await categoriaPage.excluirCategoria(nome);
});

Then('{string} não deve mais aparecer na lista', async function (this: CustomWorld, nome: string) {
  await expect(this.page.getByRole('row', { name: nome })).toHaveCount(0);
});