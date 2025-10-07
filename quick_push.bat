@echo off
REM Quick setup script for GitHub repository

echo ========================================
echo MY_STOCKS GITHUB SETUP
echo ========================================
echo.

REM Check if repository exists on GitHub
echo STEP 1: Create GitHub Repository
echo Please ensure you have created the repository at:
echo https://github.com/eyadgad/my_stocks
echo.
pause

REM Add remote
echo.
echo STEP 2: Adding remote...
git remote add origin https://github.com/eyadgad/my_stocks.git
if %ERRORLEVEL% NEQ 0 (
    echo Remote might already exist, checking...
    git remote -v
)

REM Push all commits
echo.
echo STEP 3: Pushing all commits...
echo This will push all 48 commits to GitHub
echo.
pause

git push -u origin master

if %ERRORLEVEL% EQ 0 (
    echo.
    echo ========================================
    echo SUCCESS! All commits pushed!
    echo ========================================
    echo.
    echo View your repository at:
    echo https://github.com/eyadgad/my_stocks
    echo.
) else (
    echo.
    echo Push failed. Please check:
    echo 1. Repository exists on GitHub
    echo 2. You have proper authentication
    echo 3. Internet connection is working
    echo.
    echo You can try manually with:
    echo git push -u origin master
)

pause
