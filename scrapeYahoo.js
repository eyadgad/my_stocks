const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0',
  'Referer': 'https://finance.yahoo.com/'
};

async function getWithRetries(url, { maxTries = 3, timeoutMs = 10000, headers = HEADERS } = {}) {
  let last;
  for (let i = 0; i < maxTries; i++) {
    try {
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), timeoutMs);
      const res = await fetch(url, { headers, signal: ctrl.signal });
      clearTimeout(tm);
      if (res.ok) return res;
      last = res;
    } catch (e) {
      last = e;
    }
    await new Promise(r => setTimeout(r, 800 * (i + 1)));
  }
  if (last?.status) throw new Error(`${last.status} ${last.statusText} for ${url}`);
  throw new Error(`Request failed for ${url}: ${String(last)}`);
}


export async function fetchYahooPrice(ticker, opts = {}) {
  const tkr = String(ticker).trim().toUpperCase();

  // 1) Yahoo JSON API (smaller headers)
  try {
    const apiUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(tkr)}`;
    const res = await getWithRetries(apiUrl, {
      ...opts,
      headers: {
        'User-Agent': HEADERS['User-Agent'],
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
    });
    const data = await res.json();
    const items = data?.quoteResponse?.result ?? [];
    if (items.length) {
      const q = items[0];
      const price = q?.regularMarketPrice;
      if (price != null) {
        return {
          ticker: tkr,
          price: Number(price),
          change: q?.regularMarketChange ?? null,
          change_percent: q?.regularMarketChangePercent ?? null,
          updated_text: '',
          source: 'json-fallback',
          url: apiUrl
        };
      }
    }
  } catch (e) {
    // swallow and try stooq
  }

  // 2) Stooq CSV fallback (no auth, lightweight)
  try {
    const syms = [ `${tkr.toLowerCase()}.us`, tkr.toLowerCase() ];
    for (const sym of syms) {
      const stooqUrl = `https://stooq.com/q/l/?s=${encodeURIComponent(sym)}&f=sd2t2ohlcv&h&e=csv`;
      const res = await getWithRetries(stooqUrl, {
        ...opts,
        headers: {
          'User-Agent': HEADERS['User-Agent'],
          'Accept': 'text/csv,*/*;q=0.8'
        }
      });
      const text = await res.text();
      const lines = text.trim().split(/\r?\n/);
      if (lines.length >= 2) {
        const hdr = lines[0].split(',').map(s => s.trim().toLowerCase());
        const row = lines[1].split(',').map(s => s.trim());
        const idx = (name) => hdr.indexOf(name);
        const closeIdx = idx('close');
        const symIdx = idx('symbol');
        const close = closeIdx >= 0 ? row[closeIdx] : null;
        const symbolOut = symIdx >= 0 ? row[symIdx] : sym;
        if (close && close !== 'N/D') {
          const price = Number(close);
          if (!Number.isNaN(price)) {
            return {
              ticker: tkr,
              price,
              change: null,
              change_percent: null,
              updated_text: '',
              source: 'stooq',
              url: stooqUrl,
              symbol: symbolOut
            };
          }
        }
      }
    }
  } catch (e) {
    // swallow to throw unified error below
  }

  throw new Error(`Could not get quote for ${tkr} (Yahoo JSON+HTML and Stooq all failed).`);
}
