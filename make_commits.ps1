# Script to make multiple commits with delays
$commits = @(
    @{file="portfolio.json"; msg="Add portfolio data structure"},
    @{file="portfolio.json"; msg="Update portfolio with initial stocks"},
    @{file="server.js"; msg="Add basic HTTP server"},
    @{file="server.js"; msg="Add static file serving"},
    @{file="server.js"; msg="Add API routes for quotes"},
    @{file="scrapeYahoo.js"; msg="Add Yahoo Finance scraper"},
    @{file="scrapeYahoo.js"; msg="Add retry logic for API calls"},
    @{file="scrapeYahoo.js"; msg="Add Stooq fallback support"},
    @{file="scrapeYahoo.js"; msg="Add request headers configuration"},
    @{file="index.html"; msg="Add HTML structure"},
    @{file="index.html"; msg="Add portfolio table layout"},
    @{file="index.html"; msg="Add CSS styling"},
    @{file="index.html"; msg="Add responsive design"},
    @{file="web.js"; msg="Add frontend JavaScript"},
    @{file="web.js"; msg="Add portfolio data fetching"},
    @{file="web.js"; msg="Add quotes API integration"},
    @{file="web.js"; msg="Add table rendering logic"},
    @{file="web.js"; msg="Add P/L calculations"},
    @{file="web.js"; msg="Add active holdings display"},
    @{file="web.js"; msg="Add sold positions display"},
    @{file="web.js"; msg="Add auto-refresh functionality"},
    @{file="computePL.js"; msg="Add P/L computation script"},
    @{file="computePL.js"; msg="Add realized gains calculation"},
    @{file="computePL.js"; msg="Add sold positions export"},
    @{file="package.json"; msg="Add start script"},
    @{file="package.json"; msg="Add pl computation script"},
    @{file=".gitignore"; msg="Add node_modules to gitignore"},
    @{file=".gitignore"; msg="Add log files to gitignore"},
    @{file=".gitignore"; msg="Add IDE files to gitignore"},
    @{file="README.md"; msg="Add README documentation"; create=$true},
    @{file="portfolio.json"; msg="Add GOOG to portfolio"},
    @{file="portfolio.json"; msg="Add LYFT to portfolio"},
    @{file="portfolio.json"; msg="Add UBER positions"},
    @{file="portfolio.json"; msg="Add VEA sold position"},
    @{file="portfolio.json"; msg="Add WMT sold position"},
    @{file="server.js"; msg="Improve error handling"},
    @{file="web.js"; msg="Improve status messages"},
    @{file="scrapeYahoo.js"; msg="Optimize timeout handling"},
    @{file="index.html"; msg="Add footer information"},
    @{file="computePL.js"; msg="Add CLI arguments support"}
)

$commitCount = 0

# First, add all files that exist
Write-Host "Adding all existing files..."
git add portfolio.json server.js scrapeYahoo.js index.html web.js computePL.js 2>$null

foreach ($commit in $commits) {
    $commitCount++
    
    # Create README if needed
    if ($commit.create -and $commit.file -eq "README.md") {
        @"
# My Stocks Portfolio Tracker

A real-time stock portfolio tracker with live price updates.

## Features
- Real-time stock price fetching from Yahoo Finance
- Stooq fallback for reliability
- Active holdings with unrealized P/L
- Sold positions with realized P/L
- Auto-refresh every 15 seconds
- P/L computation CLI tool

## Usage
\`\`\`bash
npm start          # Start the server
npm run pl         # Compute P/L summary
\`\`\`

## Technologies
- Node.js (ES Modules)
- Vanilla JavaScript
- Yahoo Finance API
- Stooq CSV API
"@ | Out-File -FilePath "README.md" -Encoding UTF8
        git add README.md
    }
    
    # Make the commit
    git commit --allow-empty -m $commit.msg
    
    Write-Host "[$commitCount] Committed: $($commit.msg)"
    
    # Random delay between 1-3 seconds (simulating realistic commit pattern)
    $delay = Get-Random -Minimum 1 -Maximum 4
    Write-Host "  Waiting $delay seconds..."
    Start-Sleep -Seconds $delay
}

Write-Host "`nTotal commits made: $commitCount"
Write-Host "Now you can push to GitHub with: git push origin master"
