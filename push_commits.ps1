# Script to push commits to GitHub in batches with delays
# This simulates a more realistic push pattern

param(
    [int]$BatchSize = 5,
    [int]$DelaySeconds = 120  # 2 minutes between batches
)

Write-Host "Checking if remote 'origin' exists..."
$remoteUrl = git remote get-url origin 2>$null

if (-not $remoteUrl) {
    Write-Host "Error: No remote 'origin' found."
    Write-Host "Please add the remote first:"
    Write-Host "  git remote add origin https://github.com/eyadgad/my_stocks.git"
    exit 1
}

Write-Host "Remote URL: $remoteUrl"
Write-Host ""

# Get total number of commits
$totalCommits = (git rev-list --count master)
Write-Host "Total commits to push: $totalCommits"
Write-Host "Batch size: $BatchSize commits"
Write-Host "Delay between batches: $DelaySeconds seconds"
Write-Host ""

# Get all commit hashes in order (oldest first)
$commits = git rev-list --reverse master

$batchNumber = 0
$pushedCount = 0

foreach ($commit in $commits) {
    $pushedCount++
    
    # Push every BatchSize commits or on the last commit
    if (($pushedCount % $BatchSize) -eq 0 -or $pushedCount -eq $totalCommits) {
        $batchNumber++
        Write-Host "[$batchNumber] Pushing commits up to: $(git log --oneline -1 $commit)"
        
        try {
            git push origin ${commit}:refs/heads/master 2>&1 | Out-String | Write-Host
            Write-Host "  ✓ Successfully pushed batch $batchNumber ($pushedCount/$totalCommits commits)"
            
            # Wait between batches (except for the last one)
            if ($pushedCount -lt $totalCommits) {
                Write-Host "  Waiting $DelaySeconds seconds before next batch..."
                Write-Host ""
                Start-Sleep -Seconds $DelaySeconds
            }
        }
        catch {
            Write-Host "  ✗ Error pushing batch $batchNumber : $_"
            Write-Host "  You may need to authenticate or check your connection."
            exit 1
        }
    }
}

Write-Host ""
Write-Host "=" * 60
Write-Host "All commits pushed successfully!"
Write-Host "Total commits: $totalCommits"
Write-Host "Total batches: $batchNumber"
Write-Host "Repository: $remoteUrl"
Write-Host "=" * 60
