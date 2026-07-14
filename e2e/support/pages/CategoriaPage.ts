import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoriaPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async abrirModalNovaCategoria() {
    await this.page.getByRole('button', { name: 'Nova Categoria' }).click();
  }

  async preencherNome(nome: string) {
    await this.page.getByLabel('Nome da Categoria').fill(nome);
  }

  async clicarCriarCategoria() {
    await this.page.getByRole('button', { name: 'Criar Categoria' }).click();
  }

  async clicarEditar(nomeCategoria: string) {
    const linha = this.page.getByRole('row', { name: nomeCategoria }).first();
    await linha.locator('button:has(svg.lucide-pen)').click();
  }

  async clicarSalvarAlteracoes() {
    await this.page.getByRole('button', { name: 'Salvar Alterações' }).click();
  }

  async excluirCategoria(nomeCategoria: string) {
    this.page.once('dialog', (dialog) => dialog.accept());
    const linha = this.page.getByRole('row', { name: nomeCategoria }).first();
    await linha.locator('button:has(svg.lucide-trash2)').click();
  }

  async cancelarExclusao(nomeCategoria: string) {
    this.page.once('dialog', (dialog) => dialog.dismiss());
    const linha = this.page.getByRole('row', { name: nomeCategoria }).first();
    await linha.locator('button:has(svg.lucide-trash2)').click();
  }

  async contarLinhasComNome(nomeCategoria: string): Promise<number> {
    return this.page.getByRole('row', { name: nomeCategoria }).count();
  }
}