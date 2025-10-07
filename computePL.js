import fs from 'fs/promises';
import path from 'path';

function fmtMoney(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
}

async function main() {
  const argv = process.argv.slice(2);
  const writeSold = argv.includes('--write-sold');

  
  const myPortfolioPath = path.resolve('./myportfolio.json');
  const defaultPortfolioPath = path.resolve('./portfolio.json');
  
  let portfolioPath = defaultPortfolioPath;
  try {
    await fs.access(myPortfolioPath);
    const stat = await fs.stat(myPortfolioPath);
    if (stat.size > 0) {
      portfolioPath = myPortfolioPath;
      console.log('Using myportfolio.json\n');
    }
  } catch (e) {
    console.log('Using portfolio.json (demo data)\n');
  }

  const raw = await fs.readFile(portfolioPath, 'utf8');
  const portfolio = JSON.parse(raw);

  const active = portfolio.filter(x => x.sold === -1);
  const sold = portfolio.filter(x => x.sold != null && x.sold !== -1);

  let activeCost = 0, activeValue = 0; // value unknown without live prices
  console.log('Active holdings (realized P/L requires live price):');
  for (const a of active) {
    const cost = a.bought * a.shares;
    activeCost += cost;
    console.log(`- ${a.ticker} ${a.name} | shares=${a.shares} bought=${fmtMoney(a.bought)} cost=${fmtMoney(cost)} sold=Not sold`);
  }
  console.log(`Active cost basis total: ${fmtMoney(activeCost)}\n`);

  let soldCost = 0, soldProceeds = 0;
  console.log('Sold positions (realized P/L):');
  for (const s of sold) {
    const cost = s.bought * s.shares;
    const proceeds = s.sold * s.shares;
    const pl = proceeds - cost;
    soldCost += cost;
    soldProceeds += proceeds;
    const plPct = cost > 0 ? (pl / cost) * 100 : 0;
    console.log(`- ${s.ticker} ${s.name} | shares=${s.shares} bought=${fmtMoney(s.bought)} sold=${fmtMoney(s.sold)} cost=${fmtMoney(cost)} proceeds=${fmtMoney(proceeds)} P/L=${fmtMoney(pl)} (${plPct.toFixed(2)}%)`);
  }

  const soldPL = soldProceeds - soldCost;
  const soldPLPct = soldCost > 0 ? (soldPL / soldCost) * 100 : 0;
  console.log('\nRealized totals:');
  console.log(`  Cost basis: ${fmtMoney(soldCost)}`);
  console.log(`  Proceeds : ${fmtMoney(soldProceeds)}`);
  console.log(`  Realized P/L: ${fmtMoney(soldPL)} (${soldPLPct.toFixed(2)}%)`);

  if (writeSold) {
    const outPath = path.resolve('./sold.json');
    await fs.writeFile(outPath, JSON.stringify(sold, null, 2), 'utf8');
    console.log(`\nWrote ${sold.length} sold positions to ${outPath}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
