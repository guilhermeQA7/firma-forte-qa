import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CriarContaPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selecionarUsuario(usuario: 'admin' | 'vendedor') {
    await this.page.locator(`#role-${usuario}`).click();
  }

  async preencherSenha(senha: string) {
    await this.page.getByLabel('Senha', { exact: true }).fill(senha);
  }

  async confirmarSenha(senha: string) {
    await this.page.locator('#confirmarSenha').fill(senha);
  }

  async clicarCriarConta() {
    await this.page.getByRole('button', { name: 'Criar conta' }).click();
  }
  
}