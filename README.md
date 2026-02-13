# Suporgi - Prospecção Inteligente B2B

![Suporgi Logo](public/images/suporgi_logo.png)

> **Prospecção de leads qualificados direto do Google Maps. Rápido, eficiente e automatizado.**

O **Suporgi Comercial Webscraping** é uma aplicação web desenvolvida para automatizar a prospecção de empresas (B2B). Através de uma interface moderna e intuitiva, o usuário define um segmento (ex: "Materiais de Construção") e uma localidade (ex: "Goiânia"), e o sistema retorna uma lista organizada de potenciais clientes com **Nome, Endereço e Telefone**, prontos para exportação.

---

## 🚀 Objetivo e Solução

A prospecção manual no Google Maps é lenta, repetitiva e propensa a erros. Copiar e colar dados de dezenas de empresas consome horas preciosas da equipe comercial.

**O Suporgi resolve isso:**

- **Automação:** Extrai dezenas de leads em segundos.
- **Qualidade:** Filtra dados irrelevantes e formata telefones/endereços automaticamente.
- **Produtividade:** Exportação direta para Excel/CSV, integrando-se facilmente ao seu CRM ou planilha de controle.

---

## 🛠️ Stack Tecnológica

Este projeto foi construído com o que há de mais moderno no ecossistema web, garantindo performance e manutenibilidade.

- **Frontend & Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem estática rigorosa)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (Design System moderno e responsivo)
- **Web Scraping:** [Playwright](https://playwright.dev/) (Motor de automação de browser)
- **Manipulação de Dados:** `xlsx` (Geração de planilhas)
- **Ícones:** `Heroicons` / `Lucide React`

---

## 🏗️ Arquitetura e Decisões Técnicas

### 1. Server-Side Scraping com Playwright

Optamos por rodar o Playwright no **Server-Side** (API Routes do Next.js) ao invés do cliente.

- **Por que?** Navegadores comuns não permitem acesso direto ao DOM de outros sites (CORS/Segurança). O Playwright roda um browser "headless" (sem interface) no servidor, simula um usuário real e retorna apenas os dados JSON purificados para o frontend.

### 2. Estratégia de Conexão Híbrida (Local vs Browserless)

O sistema detecta automaticamente o ambiente:

- **Dev (Local):** Usa o Google Chrome instalado na máquina do desenvolvedor. Zero custo.
- **Produção (Vercel/Cloud):** Conecta-se via WebSocket ao [Browserless.io](https://www.browserless.io/). Isso evita bloqueios de IP e o "peso" de rodar um browser completo em ambientes serverless restritos.

### 3. Extração Heurística com RegEx

O Google Maps muda classes CSS frequentemente para quebrar scrapers.

- **Nossa Solução:** Ao invés de depender apenas de seletores frágeis (`.class-name`), usamos Expressões Regulares (RegEx) para encontrar padrões de telefone brasileiro (`(XX) 9XXXX-XXXX`) e endereços (`Rua`, `Av`, CEPs) dentro do texto bruto. Isso torna o scraper extremamente resiliente.

### 4. Cache Inteligente (In-Memory)

Implementamos um cache LRU simples em memória (TTL de 5 minutos).

- **Benefício:** Se dois usuários buscarem "Pizzaria em São Paulo" num curto intervalo, a segunda resposta é **instantânea** (0ms de scraping), economizando recursos e melhorando a UX.

### 5. Resiliência a Timeouts

O Google Maps carrega recursos infinitamente. Configuramos o Playwright para esperar eventos específicos (`domcontentloaded` + seletores chave) ao invés de esperar a rede ficar totalmente ociosa (`networkidle`), reduzindo drasticamente erros de _Timeout_.

---

## 📦 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+ instalado.
- Google Chrome instalado (para rodar localmente).

### Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/castro-ed/webscraping-empresas.git
   cd webscraping-empresas
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as Variáveis de Ambiente (Opcional):**
   Crie um arquivo `.env.local` na raiz se for usar o Browserless (para produção):

   ```env
   BROWSERLESS_API_KEY=sua_chave_aqui
   ```

   _Para rodar localmente, não é necessário configurar nada, ele usará seu Chrome local._

4. **Rode o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

5. **Acesse:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🚢 Deploy (Vercel)

Este projeto é otimizado para deploy na Vercel.

1. Dê push do código para o GitHub.
2. Importe o projeto na [Vercel](https://vercel.com).
3. Adicione a variável `BROWSERLESS_API_KEY` nas configurações do projeto na Vercel.
4. O Next.js cuidará do resto (Build, Serverless Functions, otimização de imagens).

---

## 📄 Licença

Este projeto é proprietário e desenvolvido para fins comerciais da **Suporgi**.
