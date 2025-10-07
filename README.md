# My Stocks Portfolio Tracker# My Stocks Portfolio Tracker



A real-time stock portfolio tracker with live price updates.A real-time stock portfolio tracker with live price updates.



## Features## Features

- Real-time stock price fetching from Yahoo Finance- Real-time stock price fetching from Yahoo Finance

- Stooq fallback for reliability- Stooq fallback for reliability

- Active holdings with unrealized P/L- Active holdings with unrealized P/L

- Sold positions with realized P/L- Sold positions with realized P/L

- Auto-refresh every 15 seconds- Auto-refresh every 15 seconds

- P/L computation CLI tool- P/L computation CLI tool

- Personal portfolio support (myportfolio.json)

## Usage

## Usage\\\ash

```bashnpm start          # Start the server

npm start          # Start the servernpm run pl         # Compute P/L summary

npm run pl         # Compute P/L summary\\\

```

## Technologies

## Portfolio Configuration- Node.js (ES Modules)

The application uses **myportfolio.json** for your personal data if it exists, otherwise it falls back to **portfolio.json** (demo data).- Vanilla JavaScript

- Yahoo Finance API

### Demo Data- Stooq CSV API

`portfolio.json` contains sample demonstration data with popular stocks (AAPL, MSFT, TSLA, etc.)

### Personal Portfolio
1. Create `myportfolio.json` in the project root
2. Add your portfolio data in the same format:
```json
[
  { "ticker": "AAPL", "name": "Apple Inc.", "bought": 150.00, "shares": 10, "sold": -1},
  { "ticker": "MSFT", "name": "Microsoft", "bought": 300.00, "shares": 5, "sold": -1}
]
```
3. `myportfolio.json` is automatically ignored by git (your data stays private)

**Note:** `sold: -1` means the position is still active. Any other value is the sale price.

## Technologies
- Node.js (ES Modules)
- Vanilla JavaScript
- Yahoo Finance API
- Stooq CSV API
