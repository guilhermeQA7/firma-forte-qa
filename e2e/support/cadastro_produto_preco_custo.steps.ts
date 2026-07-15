import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './world';
import { ProdutoPage } from './pages/produto.page';

// NOTA: o login (Contexto) reaproveita o step "que estou logado como {string}"
// já implementado em autenticacao.steps.ts. Os dois steps abaixo (navegação
// até Produtos + abertura do modal) são específicos deste arquivo.

Given('estou na tela de cadastro de Produtos', async function (this: CustomWorld) {
  await this.page.goto('/produtos');
});

Given('abri o modal de {string}', async function (this: CustomWorld, nomeModal: string) {
  // { exact: false } tolera texto parcial (ex: botão real sendo "+ Novo Produto"
  // em vez de "Novo Produto" exato)
  await this.page.getByRole('button', { name: nomeModal, exact: false }).click();
});

Given('preencho o campo {string} com {string}', async function (this: CustomWorld, campo: string, valor: string) {
  const produtoPage = new ProdutoPage(this.page);

  switch (campo) {
    case 'Nome do Produto':
      await produtoPage.preencherNome(valor);
      break;
    case 'SKU':
      await produtoPage.preencherSku(valor);
      break;
    case 'Preço de Custo':
      await produtoPage.preencherPrecoCusto(valor);
      break;
    case 'Preço de Venda':
      await produtoPage.preencherPrecoVenda(valor);
      break;
    default:
      throw new Error(`Campo "${campo}" não mapeado nos steps.`);
  }
});

Given('preencho o campo {string} com um valor único gerado automaticamente', async function (this: CustomWorld, campo: string) {
  const produtoPage = new ProdutoPage(this.page);
  const skuUnico = `SKU-${Date.now()}`;

  if (campo === 'SKU') {
    await produtoPage.preencherSku(skuUnico);
  }
});

When('clico no botão {string}', async function (this: CustomWorld, nomeBotao: string) {
  const produtoPage = new ProdutoPage(this.page);

  if (nomeBotao === 'Criar') {
    await produtoPage.clicarCriar();
  }
});

Then('o resultado esperado deve ser {string}', async function (this: CustomWorld, resultado: string) {
  const produtoPage = new ProdutoPage(this.page);

  if (resultado === 'aceito') {
    await produtoPage.esperarModalFechado();
  }
  // 'rejeitado' não se aplica mais a este cenário (ver notas no .feature);
  // fica reservado para se algum novo caso de rejeição via UI for identificado.
});

Then('a mensagem exibida deve ser {string}', async function (this: CustomWorld, mensagem: string) {
  const produtoPage = new ProdutoPage(this.page);
  await produtoPage.esperarMensagem(mensagem);
});