// Centralized portfolio configuration
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Determines which portfolio file to use
 * Priority: myportfolio.json > portfolio.json
 */
function getPortfolioFile() {
  const myPortfolio = path.join(__dirname, 'myportfolio.json');
  const defaultPortfolio = path.join(__dirname, 'portfolio.json');
  
  // Check if myportfolio.json exists and has content
  if (fs.existsSync(myPortfolio)) {
    const stat = fs.statSync(myPortfolio);
    if (stat.size > 0) {
      return {
        path: myPortfolio,
        name: 'myportfolio.json',
        isPersonal: true
      };
    }
  }
  
  // Fallback to portfolio.json
  return {
    path: defaultPortfolio,
    name: 'portfolio.json',
    isPersonal: false
  };
}

// Export the portfolio configuration
export const portfolioConfig = getPortfolioFile();

// Export the full path for file operations
export const PORTFOLIO_PATH = portfolioConfig.path;
