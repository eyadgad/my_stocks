# Simple script to push to GitHub
Write-Host "============================================================"
Write-Host " PUSH TO GITHUB - my_stocks Repository"
Write-Host "============================================================"
Write-Host ""

# Check commits
$commitCount = git rev-list --count master 2>$null
Write-Host "Total commits to push: $commitCount"
Write-Host ""

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null

if ($remoteExists) {
    Write-Host "Remote origin configured: $remoteExists"
    Write-Host ""
} else {
    Write-Host "Adding remote origin..."
    git remote add origin https://github.com/eyadgad/my_stocks.git
    Write-Host "Remote added"
    Write-Host ""
}

# Show recent commits
Write-Host "Recent commits:"
git log --oneline -10
Write-Host ""

Write-Host "============================================================"
Write-Host "BEFORE PUSHING:"
Write-Host "1. Create repository my_stocks on GitHub"
Write-Host "2. Make sure GitHub credentials are configured"
Write-Host "============================================================"
Write-Host ""

$response = Read-Host "Push all $commitCount commits now? (yes/no)"

if ($response -eq "yes") {
    Write-Host ""
    Write-Host "Pushing to GitHub..."
    git push -u origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "============================================================"
        Write-Host " SUCCESS!"
        Write-Host "============================================================"
        Write-Host "View at: https://github.com/eyadgad/my_stocks"
    } else {
        Write-Host ""
        Write-Host "Push failed. Check GitHub repository exists."
    }
} else {
    Write-Host "Cancelled. Push manually with: git push -u origin master"
}
