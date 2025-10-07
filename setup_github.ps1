# Complete GitHub Setup and Push Script
# Run this after creating the repository on GitHub

Write-Host "=" * 70
Write-Host " GITHUB REPOSITORY SETUP FOR MY_STOCKS"
Write-Host "=" * 70
Write-Host ""

# Step 1: Verify we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Error: Not in a git repository!"
    exit 1
}

# Step 2: Check current branch
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch"
Write-Host ""

# Step 3: Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Remote 'origin' already exists: $existingRemote"
    $response = Read-Host "Do you want to remove it and add new remote? (y/n)"
    if ($response -eq 'y') {
        git remote remove origin
        Write-Host "Removed existing remote."
    }
    else {
        Write-Host "Keeping existing remote."
    }
}

# Step 4: Add GitHub remote if not exists
if (-not (git remote get-url origin 2>$null)) {
    Write-Host "Adding GitHub remote..."
    git remote add origin https://github.com/eyadgad/my_stocks.git
    Write-Host "✓ Remote added: https://github.com/eyadgad/my_stocks.git"
}

# Step 5: Verify remote
Write-Host ""
Write-Host "Verifying remote..."
git remote -v
Write-Host ""

# Step 6: Show commit summary
$commitCount = git rev-list --count $currentBranch
Write-Host "Total commits ready to push: $commitCount"
Write-Host ""

# Step 7: Ask for push method
Write-Host "How would you like to push?"
Write-Host "1. Push all commits at once (fast)"
Write-Host "2. Push in small batches with 2-min delays (realistic pattern)"
Write-Host "3. Exit (I will push manually later)"
Write-Host ""
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Pushing all $commitCount commits to GitHub..."
        git push -u origin $currentBranch
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "=" * 70
            Write-Host " SUCCESS! All commits pushed to GitHub"
            Write-Host "=" * 70
            Write-Host " View your repository at:"
            Write-Host " https://github.com/eyadgad/my_stocks"
            Write-Host "=" * 70
        }
        else {
            Write-Host ""
            Write-Host "Push failed. You may need to:"
            Write-Host "1. Create the repository on GitHub first"
            Write-Host "2. Authenticate with GitHub (git credential helper)"
            Write-Host "3. Check your internet connection"
        }
    }
    "2" {
        Write-Host ""
        Write-Host "Pushing commits in batches..."
        Write-Host "This will take approximately $([math]::Ceiling($commitCount / 5) * 2) minutes"
        Write-Host ""
        
        # Run the batch push script
        if (Test-Path "push_commits.ps1") {
            powershell -ExecutionPolicy Bypass -File push_commits.ps1 -BatchSize 5 -DelaySeconds 120
        }
        else {
            Write-Host "Error: push_commits.ps1 not found"
        }
    }
    "3" {
        Write-Host ""
        Write-Host "Setup complete. You can push manually with:"
        Write-Host "  git push -u origin $currentBranch"
    }
    default {
        Write-Host "Invalid choice. Exiting."
    }
}

Write-Host ""
Write-Host "Setup script completed."
