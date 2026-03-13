# LeadintelAI

India's #1 B2B Intelligence Platform - A modern static website with clean URLs and responsive design.

## Project Structure

```
.
├── index.html          # Main landing page
├── login.html          # Login page
├── signup.html         # Signup page
├── .htaccess           # Apache URL rewriting rules
├── _redirects          # Netlify redirect rules
├── vercel.json         # Vercel deployment configuration
├── nginx.conf          # Nginx server configuration
└── .gitignore          # Git ignore rules
```

## Features

- Clean URLs (e.g., `/login` instead of `/login.html`)
- Responsive design
- Modern UI with dark theme
- Deployment ready for multiple platforms

## Deployment Options

### Option 1: GitHub Pages
1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select source: Deploy from a branch
4. Select branch: `main` / `root`
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Option 2: Vercel
1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will automatically detect the `vercel.json` configuration
4. Your site will be deployed instantly

### Option 3: Netlify
1. Push this repository to GitHub
2. Go to [netlify.com](https://netlify.com) and connect your repository
3. The `_redirects` file will handle clean URLs automatically
4. Your site will be deployed

### Option 4: Apache Server
Upload files to your Apache server. The `.htaccess` file will handle URL rewriting.

### Option 5: Nginx Server
Use the provided `nginx.conf` as a reference for your Nginx server block configuration.

## How to Upload to GitHub

### Step 1: Install Git
Download and install Git from [git-scm.com](https://git-scm.com/)

### Step 2: Open Terminal in Project Folder
Right-click in the folder → "Open in Terminal" or use Command Prompt/PowerShell

### Step 3: Run These Commands

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit"

# Create a new repository on GitHub (go to github.com and create one)
# Then connect your local repo to GitHub (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Local Development

Simply open `index.html` in your browser to view the site locally.

## License

All rights reserved.
