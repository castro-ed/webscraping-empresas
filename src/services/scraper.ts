import { chromium, type Browser, type Page } from 'playwright';
import type { Company } from '@/types';
import { sanitize, formatPhone, formatAddress } from '@/utils/formatters';

const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;

/**
 * Conecta ao browser: Browserless.io em produção, Chrome local em dev.
 */
async function connectBrowser(): Promise<Browser> {
  console.log('[Scraper] Iniciando conexão com o browser...');
  if (BROWSERLESS_API_KEY) {
    console.log('[Scraper] Usando Browserless.io');
    return chromium.connectOverCDP(
      `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}`
    );
  }

  console.log('[Scraper] Usando Chrome local');
  return chromium.launch({
    headless: true,
    channel: 'chrome',
  });
}

/**
 * Faz scroll na lista de resultados do Google Maps para carregar mais itens.
 */
async function scrollResultsList(page: Page, maxScrolls = 5): Promise<void> {
  console.log(`[Scraper] Iniciando scroll (max: ${maxScrolls})...`);
  const feedSelector = 'div[role="feed"]';

  try {
    await page.waitForSelector(feedSelector, { timeout: 10000 });
  } catch (error) {
    console.warn('[Scraper] Seletor de feed não encontrado:', error);
    return;
  }

  for (let i = 0; i < maxScrolls; i++) {
    console.log(`[Scraper] Scroll ${i + 1}/${maxScrolls}`);
    await page.evaluate((sel) => {
      const feed = document.querySelector(sel);
      if (feed) {
        feed.scrollTop = feed.scrollHeight;
      }
    }, feedSelector);

    await page.waitForTimeout(1500);

    const endOfList = await page.evaluate((sel) => {
      const feed = document.querySelector(sel);
      if (!feed) return true;
      const lastChild = feed.lastElementChild;
      return lastChild?.textContent?.includes('Você chegou ao final da lista') ?? false;
    }, feedSelector);

    if (endOfList) {
      console.log('[Scraper] Fim da lista atingido.');
      break;
    }
  }
}

/**
 * Extrai dados das empresas listadas nos resultados do Google Maps.
 */
async function extractCompanies(page: Page): Promise<Company[]> {
  console.log('[Scraper] Extraindo dados das empresas...');
  const results = await page.evaluate(() => {
    const items: Array<{ name: string; address: string; phone: string }> = [];
    const cards = document.querySelectorAll('div[role="feed"] > div > div > a');

    cards.forEach((card) => {
      const container = card.closest('div[role="feed"] > div');
      if (!container) return;

      const ariaLabel = card.getAttribute('aria-label') || '';
      const textContent = container.textContent || '';

      // Extrai telefone — padrões brasileiros
      const phoneMatch = textContent.match(
        /\(?\d{2}\)?\s*\d{4,5}[-.\s]?\d{4}/
      );

      // Extrai endereço — geralmente no texto após o nome
      const allText = container.querySelectorAll('div');
      let address = '';
      
      allText.forEach((div) => {
        const text = div.textContent?.trim() || '';
        // Heurística: endereços contêm padrões como "R.", "Av.", "Rua", etc.
        if (
          !address &&
          (text.match(/\b(R\.|Rua|Av\.|Avenida|Al\.|Alameda|Praça|Rod\.|Rodovia|Setor|St\.|Qd\.|Quadra|Lt\.|Lote)/i) ||
           text.match(/\d{5}-?\d{3}/)) && // CEP
          text.length > 10 &&
          text.length < 200
        ) {
          address = text;
        }
      });

      if (ariaLabel) {
        items.push({
          name: ariaLabel,
          address: address || 'N/A',
          phone: phoneMatch ? phoneMatch[0] : 'N/A',
        });
      }
    });

    return items;
  });

  console.log(`[Scraper] Encontrados ${results.length} itens brutos.`);

  return results.map((r) => ({
    name: sanitize(r.name),
    address: formatAddress(r.address),
    phone: r.phone !== 'N/A' ? formatPhone(r.phone) : 'N/A',
  }));
}

/**
 * Busca empresas no Google Maps por termo e localidade.
 */
export async function scrapeGoogleMaps(
  query: string,
  location: string
): Promise<Company[]> {
  console.log(`[Scraper] Iniciando busca: "${query}" em "${location}"`);
  const browser = await connectBrowser();

  try {
    const context = await browser.newContext({
      locale: 'pt-BR',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    const searchTerm = encodeURIComponent(`${query} em ${location}`);
    const url = `https://www.google.com/maps/search/${searchTerm}`;
    console.log(`[Scraper] Navegando para: ${url}`);
    
    await page.goto(
      url,
      { waitUntil: 'domcontentloaded', timeout: 60000 }
    );

    // Espera um pouco para garantir que scripts de hidratação rodem
    await page.waitForTimeout(2000);

    // Tenta aceitar cookies se houver popup
    try {
      const acceptButton = page.locator('button:has-text("Aceitar"), button:has-text("Accept")');
      // Aumentado timeout para verificar botão
      if (await acceptButton.isVisible({ timeout: 5000 })) {
        console.log('[Scraper] Aceitando cookies...');
        await acceptButton.click();
        await page.waitForTimeout(1000);
      }
    } catch {
      // Sem popup de cookies
    }

    // Scroll para carregar mais resultados
    await scrollResultsList(page, 8);

    // Extrai dados
    const companies = await extractCompanies(page);
    console.log(`[Scraper] Extração finalizada. Total de empresas: ${companies.length}`);

    await context.close();
    return companies;
  } catch (error) {
    console.error('[Scraper] Erro fatal durante o processo:', error);
    throw error;
  } finally {
    console.log('[Scraper] Fechando browser...');
    await browser.close();
  }
}
