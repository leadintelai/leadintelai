# LeadintelAI - Quick GitHub Upload Script
# Run this in PowerShell to prepare and upload to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LeadintelAI GitHub Upload Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version 2>&1
    Write-Host "[OK] Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/downloads" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Initialize Git repository
Write-Host "[Step 1/5] Initializing Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "[OK] Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "[INFO] Git repository already exists" -ForegroundColor Cyan
}

# Add all files
Write-Host ""
Write-Host "[Step 2/5] Adding all files to Git..." -ForegroundColor Yellow
git add .
$filesAdded = (git status --short).Count
Write-Host "[OK] Added $filesAdded files for commit" -ForegroundColor Green

# Commit changes
Write-Host ""
Write-Host "[Step 3/5] Committing changes..." -ForegroundColor Yellow
$message = "Complete LeadintelAI website with pricing page - $(Get-Date -Format 'yyyy-MM-dd')"
git commit -m $message
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Changes committed successfully" -ForegroundColor Green
} else {
    Write-Host "[INFO] Nothing to commit or already committed" -ForegroundColor Cyan
}

# Set default branch name
Write-Host ""
Write-Host "[Step 4/5] Setting up branch..." -ForegroundColor Yellow
git branch -M main 2>$null
Write-Host "[OK] Main branch configured" -ForegroundColor Green

# Instructions for GitHub remote
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps (Manual Action Required)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Create a repository named: leadintelai" -ForegroundColor White
Write-Host "3. DO NOT initialize with README" -ForegroundColor Yellow
Write-Host "4. Copy your repository URL from GitHub" -ForegroundColor White
Write-Host ""
Write-Host "Then run this command (replace YOUR_USERNAME):" -ForegroundColor Cyan
Write-Host ""
Write-Host "git remote add origin https://github.com/YOUR_USERNAME/leadintelai.git" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Files Ready for Upload:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# List all important files
$importantFiles = @(
    "index.html",
    "price.html",
    "login.html",
    "signup.html",
    "dashboard.html",
    "projects.html",
    "checkout.html",
    "logo.svg",
    "README.md",
    ".htaccess",
    "nginx.conf",
    "vercel.json"
)

foreach ($file in $importantFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length / 1KB
        Write-Host "  ✓ $file ($([math]::Round($size, 1)) KB)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (MISSING)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Total files ready: $($importantFiles.Count + 4) (including config files)" -ForegroundColor Green
Write-Host ""
Write-Host "Need more help? See GITHUB_UPLOAD_INSTRUCTIONS.md" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to finish"
