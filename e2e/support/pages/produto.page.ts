import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object para o modal "Novo Produto".
 *
 * Observações de mapeamento (DevTools):
 * - Nenhum input tem data-testid, e os <label> NÃO têm atributo "for"
 *   (nem o input tem "id") -> getByLabel() do Playwright NÃO funciona aqui,
 *   pois depende de associação formal label/input. Por isso os campos de
 *   texto usam um locator estrutural: acha o <div class="grid gap-2"> que
 *   contém o texto do label, e pega o <input> de dentro dele.
 * - Categoria é um Radix Select (role="combobox"), não <select> nativo
 * - Toggle "Combo" é um Radix Switch (role="switch"), não checkbox nativo
 * - Botão "Criar" é type="button" (submissão via onClick + JS, não form nativo)
 */
export class ProdutoPage {
  readonly page: Page;

  readonly inputNome: Locator;
  readonly inputSku: Locator;
  readonly comboboxCategoria: Locator;
  readonly inputPrecoCusto: Locator;
  readonly inputPrecoVenda: Locator;
  readonly inputEstoqueAtual: Locator;
  readonly inputEstoqueMinimo: Locator;
  readonly switchCombo: Locator;
  readonly botaoAdicionarComponente: Locator;
  readonly botaoCriar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputNome = this.campoPorLabel('Nome do Produto');
    this.inputSku = this.campoPorLabel('SKU');
    this.comboboxCategoria = page.getByRole('combobox', { name: 'Categoria' });
    this.inputPrecoCusto = this.campoPorLabel('Preço de Custo (R$)');
    this.inputPrecoVenda = this.campoPorLabel('Preço de Venda (R$)');
    this.inputEstoqueAtual = this.campoPorLabel('Estoque Atual');
    this.inputEstoqueMinimo = this.campoPorLabel('Estoque Mínimo (Alerta)');
    this.switchCombo = page.getByRole('switch');
    this.botaoAdicionarComponente = page.getByRole('button', { name: '+ Adicionar componente' });
    this.botaoCriar = page.getByRole('button', { name: 'Criar' });
  }

  /**
   * Localiza o input correspondente a um label, mesmo sem associação
   * formal for/id. Assume a estrutura: <div class="grid gap-2"><label>texto</label><input/></div>
   */
  private campoPorLabel(textoLabel: string): Locator {
    return this.page
      .locator('div.grid.gap-2', { hasText: textoLabel })
      .locator('input')
      .first();
  }

  async preencherNome(valor: string) {
    await this.inputNome.fill(valor);
  }

  async preencherSku(valor: string) {
    await this.inputSku.fill(valor);
  }

  async selecionarCategoria(nomeCategoria: string) {
    await this.comboboxCategoria.click();
    // Radix Select abre um listbox associado via aria-controls
    await this.page.getByRole('option', { name: nomeCategoria }).click();
  }

  async preencherPrecoCusto(valor: string) {
    // fill() ignora restrições HTML5 (min/step) — importante para casos CE-01/CE-05
    await this.inputPrecoCusto.fill(valor);
  }

  async preencherPrecoVenda(valor: string) {
    await this.inputPrecoVenda.fill(valor);
  }

  async preencherEstoqueAtual(valor: string) {
    await this.inputEstoqueAtual.fill(valor);
  }

  async preencherEstoqueMinimo(valor: string) {
    await this.inputEstoqueMinimo.fill(valor);
  }

  async ativarCombo() {
    const estado = await this.switchCombo.getAttribute('aria-checked');
    if (estado !== 'true') {
      await this.switchCombo.click();
    }
  }

  async clicarCriar() {
    await this.botaoCriar.click();
  }

  async esperarMensagem(textoEsperado: string) {
    // Confirmado via investigação de código: toast shadcn/ui (Radix Toast).
    // Sucesso: "Produto criado." (sem role="status" no <li>, só role="region"
    // no viewport pai) -> getByText com exact match é o locator mais estável.
    // Erro: título "Erro ao salvar" + descrição dinâmica (mensagem da API),
    // variante "destructive".
    await expect(this.page.getByText(textoEsperado, { exact: true })).toBeVisible();
  }

  async esperarModalFechado() {
    // No sucesso, o modal fecha (confirmado via código: chamada a setOpen(false)).
    // Útil como assert complementar ao toast.
    await expect(this.page.getByRole('dialog')).not.toBeVisible();
  }
}