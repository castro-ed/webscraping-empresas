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
 * Faz scroll na lista de resultados do Google Maps para carregar mais itens até atingir a meta.
 */
async function scrollResultsList(page: Page, targetCount: number): Promise<void> {
  console.log(`[Scraper] Iniciando scroll dinâmico para atingir ${targetCount} resultados...`);
  const feedSelector = 'div[role="feed"]';

  try {
    await page.waitForSelector(feedSelector, { timeout: 10000 });
  } catch (error) {
    console.warn('[Scraper] Seletor de feed não encontrado:', error);
    return;
  }

  let lastCount = 0;
  let stagnantCycles = 0;
  const maxStagnantCycles = 5;

  while (true) {
    const currentCount = await page.locator('div[role="feed"] > div > div > a').count();
    console.log(`[Scraper] Resultados carregados: ${currentCount}/${targetCount}`);

    if (currentCount >= targetCount) {
      console.log('[Scraper] Limite de resultados atingido.');
      break;
    }

    if (currentCount === lastCount) {
      stagnantCycles++;
      if (stagnantCycles >= maxStagnantCycles) {
        console.log('[Scraper] Fim da lista ou carregamento travado.');
        break;
      }
    } else {
      stagnantCycles = 0;
      lastCount = currentCount;
    }

    await page.evaluate((sel) => {
      const feed = document.querySelector(sel);
      if (feed) {
        feed.scrollTop = feed.scrollHeight;
      }
    }, feedSelector);

    // Espera dinâmica baseada no volume para evitar bloqueios
    const waitTime = currentCount > 200 ? 2000 : 1500;
    await page.waitForTimeout(waitTime);

    const endOfList = await page.evaluate((sel) => {
      const feed = document.querySelector(sel);
      if (!feed) return true;
      return feed.textContent?.includes('Você chegou ao final da lista') ?? false;
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
    const items: Array<{ name: string; address: string; phone: string; email?: string; website?: string }> = [];
    const cards = document.querySelectorAll('div[role="feed"] > div > div > a');

    cards.forEach((card) => {
      const container = card.closest('div[role="feed"] > div');
      if (!container) return;

      const ariaLabel = card.getAttribute('aria-label') || '';
      const textContent = container.textContent || '';
      
      // Busca o link do Website no card — heurística aprimorada
      const websiteLink = container.querySelector('a[data-item-id="authority"], a.lcr4fd, a[aria-label*="site"], a[aria-label*="Website"]');
      const website = websiteLink ? (websiteLink as HTMLAnchorElement).href : undefined;

      // Extrai telefone — padrões brasileiros
      const phoneMatch = textContent.match(
        /\(?\d{2}\)?\s*\d{4,5}[-.\s]?\d{4}/
      );

      // Extrai e-mail se disponível no texto do card
      const emailMatch = textContent.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      );

      // Extrai endereço
      const allText = container.querySelectorAll('div');
      let address = '';
      
      allText.forEach((div) => {
        const text = div.textContent?.trim() || '';
        if (
          !address &&
          (text.match(/\b(R\.|Rua|Av\.|Avenida|Al\.|Alameda|Praça|Rod\.|Rodovia|Setor|St\.|Qd\.|Quadra|Lt\.|Lote)/i) ||
           text.match(/\d{5}-?\d{3}/)) &&
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
          email: emailMatch ? emailMatch[0] : 'N/A',
          website: website || 'N/A',
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
    email: r.email !== 'N/A' ? r.email?.toLowerCase() : 'N/A',
    website: r.website || 'N/A',
  }));
}

/**
 * Tenta encontrar um e-mail dentro do site oficial da empresa.
 */
async function findEmailInWebsite(browser: Browser, url: string): Promise<string | null> {
  if (!url || url === 'N/A' || url.includes('google.com')) return null;

  console.log(`[Scraper] Crawling website: ${url}`);
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  // Otimização: bloqueia recursos pesados
  await page.route('**/*', (route) => {
    const type = route.request().resourceType();
    if (['image', 'media', 'font', 'stylesheet'].includes(type)) {
      route.abort();
    } else {
      route.continue();
    }
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
    const content = await page.content();
    
    // Regex de e-mail para crawling
    const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    
    return emailMatch ? emailMatch[0].toLowerCase() : null;
  } catch (err) {
    console.warn(`[Scraper] Falha ao acessar ${url}:`, (err as Error).message);
    return null;
  } finally {
    await context.close();
  }
}

/**
 * Busca empresas no Google Maps por termo e localidade.
 */
export async function scrapeGoogleMaps(
  query: string,
  location: string,
  maxResults = 60
): Promise<{ companies: Company[]; isPartial: boolean }> {
  const startTime = Date.now();
  const TIME_LIMIT = 290000;
  
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

    // Scroll para carregar mais resultados dinamicamente
    await scrollResultsList(page, maxResults);

    // Verifica tempo após scroll
    if (Date.now() - startTime > TIME_LIMIT) {
      console.warn('[Scraper] Tempo limite atingido após scroll. Retornando dados parciais.');
      const companies = await extractCompanies(page);
      await context.close();
      return { companies, isPartial: true };
    }

    // Extrai dados iniciais (Mapa)
    let companies = await extractCompanies(page);
    console.log(`[Scraper] Mapas finalizados. Iniciando descoberta de e-mails em websites...`);

    // Descoberta de e-mails via Websites (Passo 1: Revelar URLs se necessário)
    console.log(`[Scraper] Iniciando revelação de sites e descoberta de e-mails...`);
    
    // NOVO: Lógica para clicar em itens que não têm Website no card e pegar do painel lateral
    // Limitamos para performance se o volume for muito alto
    const maxClicks = maxResults <= 100 ? companies.length : 100;

    for (let i = 0; i < Math.min(companies.length, maxClicks); i++) {
        // Verifica tempo limite em cada iteração de "reveal"
        if (Date.now() - startTime > TIME_LIMIT) {
            console.warn('[Scraper] Tempo limite atingido durante reveal. Interrompendo e retornando o que foi coletado.');
            await context.close();
            return { companies, isPartial: true };
        }

        const company = companies[i];
        if (!company.website || company.website === 'N/A') {
            console.log(`[Scraper] Revelando detalhes para: ${company.name}`);
            try {
                const card = page.locator('div[role="feed"] > div > div > a').nth(i);
                await card.click();
                // Espera curta para animação
                await page.waitForTimeout(500); 

                const websiteLink = page.locator('a[data-item-id="authority"]').first();
                if (await websiteLink.isVisible({ timeout: 2000 })) {
                  const href = await websiteLink.getAttribute('href');
                  if (href) {
                    company.website = href;
                    console.log(`[Scraper] Website encontrado no painel: ${href}`);
                  }
                }
            } catch (err) {
                console.warn(`[Scraper] Falha ao revelar website de ${company.name}`);
            }
        }
    }

    // Descoberta de e-mails via Websites (Passo 2: Crawling)
    const companiesToCrawl = companies.filter(c => c.website && c.website !== 'N/A' && (!c.email || c.email === 'N/A'));
    
    if (companiesToCrawl.length > 0) {
      console.log(`[Scraper] Processando ${companiesToCrawl.length} websites em paralelo...`);
      
      const batchSize = 10;
      for (let i = 0; i < companiesToCrawl.length; i += batchSize) {
        // Verifica tempo limite em cada lote de crawling
        if (Date.now() - startTime > TIME_LIMIT) {
            console.warn('[Scraper] Tempo limite atingido durante crawling. Interrompendo.');
            await context.close();
            return { companies, isPartial: true };
        }

        const batch = companiesToCrawl.slice(i, i + batchSize);
        await Promise.all(batch.map(async (company) => {
          if (company.website) {
            const email = await findEmailInWebsite(browser, company.website);
            if (email) {
              company.email = email;
            }
          }
        }));
      }
    }

    console.log(`[Scraper] Extração finalizada. Total de empresas: ${companies.length}`);

    await context.close();
    return { companies, isPartial: false };
  } catch (error) {
    console.error('[Scraper] Erro fatal durante o processo:', error);
    throw error;
  } finally {
    console.log('[Scraper] Fechando browser...');
    if (browser) await browser.close();
  }
}
