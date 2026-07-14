import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('que estou na tela de criar conta', async function (this: CustomWorld) {
  await this.page.goto('/');
  // TODO: ajustar rota real da tela de criar conta
});

When('seleciono o usuário {string}', async function (this: CustomWorld, usuario: string) {
  // TODO: clicar no radio button correspondente
});

When('defino a senha {string} e confirmo', async function (this: CustomWorld, senha: string) {
  // TODO: preencher campo senha e confirmar senha
});

When('clico em {string}', async function (this: CustomWorld, texto: string) {
  await this.page.getByRole('button', { name: texto }).click();
});

Then('devo ser redirecionado para o painel do admin', async function (this: CustomWorld) {
  // TODO: verificar URL ou elemento da tela do admin
});