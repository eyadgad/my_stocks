async function loadPortfolio() {
  const res = await fetch('/portfolio.json');
  if (!res.ok) throw new Error('failed to load portfolio');
  return res.json();
}

async function getQuotes(tickers) {
  const url = `${window.API_QUOTES}?tickers=${encodeURIComponent(tickers.join(','))}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('failed to fetch quotes');
  return res.json();
}

function fmtMoney(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: window.CURRENCY || 'USD' }).format(n);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function render(rows) {
  // Render active holdings
  const activeTbody = document.querySelector('#activeTable tbody');
  activeTbody.innerHTML = '';
  let activeTotCost = 0, activeTotValue = 0;
  for (const r of rows.active) {
    const tr = document.createElement('tr');
    const cost = r.bought * r.shares;
    const value = (r.price ?? 0) * r.shares;
    const pl = value - cost;
    const plPct = cost > 0 ? (pl / cost) * 100 : 0;
    activeTotCost += cost;
    activeTotValue += value;
    tr.innerHTML = `
      <td style="text-align:left">${r.ticker}</td>
      <td style="text-align:left">${r.name}</td>
      <td>${r.shares}</td>
      <td>${fmtMoney(r.bought)}</td>
      <td>${fmtMoney(cost)}</td>
      <td>${r.price != null ? fmtMoney(r.price) : '-'}</td>
      <td>${fmtMoney(value)}</td>
      <td class="${pl >= 0 ? 'gain' : 'loss'}">${fmtMoney(pl)}</td>
      <td class="${pl >= 0 ? 'gain' : 'loss'}">${plPct.toFixed(2)}%</td>
    `;
    activeTbody.appendChild(tr);
  }
  const activeTotPL = activeTotValue - activeTotCost;
  const activeTotPLPct = activeTotCost > 0 ? (activeTotPL / activeTotCost) * 100 : 0;
  setText('activeTotCost', fmtMoney(activeTotCost));
  setText('activeTotValue', fmtMoney(activeTotValue));
  setText('activeTotPL', fmtMoney(activeTotPL));
  setText('activeTotPLPct', `${activeTotPLPct.toFixed(2)}%`);

  // Render sold positions (realized P/L)
  const soldTbody = document.querySelector('#soldTable tbody');
  soldTbody.innerHTML = '';
  let soldTotCost = 0, soldTotProceeds = 0;
  for (const s of rows.sold) {
    const tr = document.createElement('tr');
    const cost = s.bought * s.shares;
    const proceeds = s.sold * s.shares;
    const pl = proceeds - cost;
    const plPct = cost > 0 ? (pl / cost) * 100 : 0;
    soldTotCost += cost;
    soldTotProceeds += proceeds;
    tr.innerHTML = `
      <td style="text-align:left">${s.ticker}</td>
      <td style="text-align:left">${s.name}</td>
      <td>${s.shares}</td>
      <td>${fmtMoney(s.bought)}</td>
      <td>${fmtMoney(cost)}</td>
      <td>${fmtMoney(s.sold)}</td>
      <td>${fmtMoney(proceeds)}</td>
      <td class="${pl >= 0 ? 'gain' : 'loss'}">${fmtMoney(pl)}</td>
      <td class="${pl >= 0 ? 'gain' : 'loss'}">${plPct.toFixed(2)}%</td>
    `;
    soldTbody.appendChild(tr);
  }
  const soldTotPL = soldTotProceeds - soldTotCost;
  const soldTotPLPct = soldTotCost > 0 ? (soldTotPL / soldTotCost) * 100 : 0;
  setText('soldTotCost', fmtMoney(soldTotCost));
  setText('soldTotProceeds', fmtMoney(soldTotProceeds));
  setText('soldTotPL', fmtMoney(soldTotPL));
  setText('soldTotPLPct', `${soldTotPLPct.toFixed(2)}%`);
}

async function refresh() {
  const status = document.getElementById('status');
  try {
    status.textContent = 'Loading...';
    const portfolio = await loadPortfolio();
    // Split portfolio into active (sold === -1) and sold positions
    const active = portfolio.filter(p => p.sold === -1);
    const sold = portfolio.filter(p => p.sold != null && p.sold !== -1);

    // Fetch quotes only for active tickers
    const tickers = Array.from(new Set(active.map(p => p.ticker)));
    const quotes = tickers.length ? await getQuotes(tickers) : {};

    const rows = {
      active: active.map(p => ({
        ticker: p.ticker,
        name: p.name,
        shares: p.shares,
        bought: p.bought ?? p.boughtPrice,
        price: quotes[p.ticker]?.price ?? null,
        source: quotes[p.ticker]?.source ?? null
      })),
      sold: sold.map(p => ({
        ticker: p.ticker,
        name: p.name,
        shares: p.shares,
        bought: p.bought ?? p.boughtPrice,
        sold: p.sold
      }))
    };
    render(rows);
    status.textContent = tickers.length ? `Updated via ${Object.values(quotes)[0]?.source || 'n/a'}` : 'Updated (no active tickers)';
  } catch (e) {
    status.textContent = 'Update failed';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('refreshMs').textContent = Math.round((window.REFRESH_MS || 15000) / 1000);
  document.getElementById('refreshBtn').addEventListener('click', refresh);
  refresh();
  setInterval(refresh, window.REFRESH_MS || 15000);
});
