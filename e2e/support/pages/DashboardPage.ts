import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async estaVisivel() {
    return this.page.getByRole('heading', { name: 'Visão Geral' }).isVisible();
  }

  async clicarSair() {
    await this.page.locator('button:has(svg.lucide-log-out)').click();
  }
}