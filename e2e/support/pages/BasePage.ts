import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async getErrorMessage(): Promise<string | null> {
    return this.page.locator('[role="alert"]').textContent();
  }
  async getSuccessMessage(texto: string) {
  return this.page.getByText(texto);
}
}