# My Stocks Portfolio Tracker# My Stocks Portfolio Tracker# My Stocks Portfolio Tracker



A real-time stock portfolio tracker with live price updates.



## FeaturesA real-time stock portfolio tracker with live price updates.A real-time stock portfolio tracker with live price updates.

- Real-time stock price fetching from Yahoo Finance

- Stooq fallback for reliability

- Active holdings with unrealized P/L

- Sold positions with realized P/L## Features## Features

- Auto-refresh every 15 seconds

- P/L computation CLI tool- Real-time stock price fetching from Yahoo Finance- Real-time stock price fetching from Yahoo Finance

- Personal portfolio support (myportfolio.json)

- Centralized configuration via config.js- Stooq fallback for reliability- Stooq fallback for reliability



## Usage- Active holdings with unrealized P/L- Active holdings with unrealized P/L

```bash

npm start          # Start the server- Sold positions with realized P/L- Sold positions with realized P/L

npm run pl         # Compute P/L summary

```- Auto-refresh every 15 seconds- Auto-refresh every 15 seconds



## Portfolio Configuration- P/L computation CLI tool- P/L computation CLI tool



The application uses **myportfolio.json** for your personal data if it exists, otherwise it falls back to **portfolio.json** (demo data).- Personal portfolio support (myportfolio.json)



### Demo Data## Usage

`portfolio.json` contains sample demonstration data with popular stocks (AAPL, MSFT, TSLA, etc.)

## Usage\\\ash

### Personal Portfolio

1. Create `myportfolio.json` in the project root```bashnpm start          # Start the server

2. Add your portfolio data in the same format:

```jsonnpm start          # Start the servernpm run pl         # Compute P/L summary

[

  { "ticker": "AAPL", "name": "Apple Inc.", "bought": 150.00, "shares": 10, "sold": -1},npm run pl         # Compute P/L summary\\\

  { "ticker": "MSFT", "name": "Microsoft", "bought": 300.00, "shares": 5, "sold": -1}

]```

```

3. `myportfolio.json` is automatically ignored by git (your data stays private)## Technologies



**Note:** `sold: -1` means the position is still active. Any other value is the sale price.## Portfolio Configuration- Node.js (ES Modules)



## ArchitectureThe application uses **myportfolio.json** for your personal data if it exists, otherwise it falls back to **portfolio.json** (demo data).- Vanilla JavaScript

- **config.js** - Centralized portfolio file selection (myportfolio.json → portfolio.json)

- **server.js** - HTTP server with `/api/portfolio` and `/api/quotes` endpoints- Yahoo Finance API

- **web.js** - Frontend logic for data fetching and rendering

- **computePL.js** - CLI tool for profit/loss calculation### Demo Data- Stooq CSV API

- **scrapeYahoo.js** - Stock price fetcher with Yahoo Finance and Stooq APIs

`portfolio.json` contains sample demonstration data with popular stocks (AAPL, MSFT, TSLA, etc.)

## Technologies

- Node.js (ES Modules)### Personal Portfolio

- Vanilla JavaScript1. Create `myportfolio.json` in the project root

- Yahoo Finance API2. Add your portfolio data in the same format:

- Stooq CSV API```json

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
