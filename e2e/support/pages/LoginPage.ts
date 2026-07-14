import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async preencherUsuario(usuario: string) {
    await this.page.getByLabel('Usuário', { exact: true }).fill(usuario);
  }

  async preencherSenha(senha: string) {
    await this.page.getByLabel('Senha', { exact: true }).fill(senha);
  }

  async clicarEntrar() {
    await this.page.getByRole('button', { name: 'Entrar' }).click();
  }
}