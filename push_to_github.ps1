# Simple GitHub Push Script
# This script assumes you have manually created the repository on GitHub

Write-Host "=" * 70
Write-Host " PUSH TO GITHUB - my_stocks Repository"
Write-Host "=" * 70
Write-Host ""

# Step 1: Check if we have commits
$commitCount = git rev-list --count master 2>$null
if (-not $commitCount) {
    Write-Host "Error: No commits found!"
    exit 1
}

Write-Host "Total commits to push: $commitCount"
Write-Host ""

# Step 2: Check if remote exists
$remoteExists = git remote get-url origin 2>$null

if ($remoteExists) {
    Write-Host "Remote 'origin' already configured: $remoteExists"
    Write-Host ""
} else {
    Write-Host "Adding remote 'origin'..."
    git remote add origin https://github.com/eyadgad/my_stocks.git
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Remote added successfully"
        Write-Host ""
    } else {
        Write-Host "✗ Failed to add remote"
        exit 1
    }
}

# Step 3: Show what we're about to push
Write-Host "Recent commits:"
git log --oneline -10
Write-Host ""

# Step 4: Push to GitHub
Write-Host "=" * 70
Write-Host "IMPORTANT: Before running this, please ensure you have:"
Write-Host "1. Created the repository 'my_stocks' on GitHub at:"
Write-Host "   https://github.com/eyadgad/my_stocks"
Write-Host "2. Configured git credentials (GitHub will prompt if needed)"
Write-Host "=" * 70
Write-Host ""

$response = Read-Host "Ready to push all $commitCount commits? (yes/no)"

if ($response -eq "yes") {
    Write-Host ""
    Write-Host "Pushing to GitHub..."
    Write-Host ""
    
    git push -u origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=" * 70
        Write-Host " SUCCESS! Repository pushed to GitHub"
        Write-Host "=" * 70
        Write-Host ""
        Write-Host "View your repository at:"
        Write-Host "https://github.com/eyadgad/my_stocks"
        Write-Host ""
        Write-Host "Total commits pushed: $commitCount"
        Write-Host "=" * 70
    } else {
        Write-Host ""
        Write-Host "✗ Push failed!"
        Write-Host ""
        Write-Host "Possible reasons:"
        Write-Host "1. Repository doesn't exist on GitHub"
        Write-Host "   → Create it at: https://github.com/new"
        Write-Host "2. Authentication required"
        Write-Host "   → GitHub will prompt for credentials"
        Write-Host "3. Network issues"
        Write-Host ""
        Write-Host "You can try again by running:"
        Write-Host "  git push -u origin master"
    }
} else {
    Write-Host ""
    Write-Host "Push cancelled. You can push manually later with:"
    Write-Host "  git push -u origin master"
}
