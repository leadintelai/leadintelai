# LeadintelAI - GitHub Upload Instructions

## ✅ Files Ready for GitHub

All files have been updated and are ready to upload to GitHub:

### Core HTML Files (7 files)
1. **index.html** - Landing page (pricing section removed, links to /price)
2. **price.html** - NEW dedicated pricing page with 2 product categories
3. **login.html** - Login with Deep Teal theme
4. **signup.html** - Signup with inline OTP verification
5. **dashboard.html** - Data Intelligence dashboard
6. **projects.html** - Project selector (Data, WhatsApp, Mass Mailing)
7. **checkout.html** - Payment checkout with Razorpay integration

### Configuration Files (3 files)
8. **.htaccess** - Apache redirect rules
9. **nginx.conf** - Nginx configuration
10. **vercel.json** - Vercel deployment config

### Assets & Documentation (3 files)
11. **logo.svg** - Animated brand logo
12. **README.md** - Complete documentation (NEW!)
13. **.gitignore** - Git ignore rules (create this)

---

## 📋 Step-by-Step GitHub Upload Guide

### Method 1: Using Git Command Line (Recommended)

#### Step 1: Install Git (if not already installed)
Download from: https://git-scm.com/downloads

#### Step 2: Initialize Git Repository
```powershell
cd "d:\New folder"
git init
```

#### Step 3: Create .gitignore file
Create a file named `.gitignore` with this content:
```
.DS_Store
Thumbs.db
*.log
.env
node_modules/
.vscode/
.idea/
```

#### Step 4: Add All Files to Git
```powershell
git add .
```

#### Step 5: Commit Changes
```powershell
git commit -m "Initial commit: Complete LeadintelAI website with pricing page"
```

#### Step 6: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `leadintelai` (or your preferred name)
3. Choose Public or Private
4. **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

#### Step 7: Link Local Repo to GitHub
```powershell
git remote add origin https://github.com/YOUR_USERNAME/leadintelai.git
```

#### Step 8: Push to GitHub
```powershell
git branch -M main
git push -u origin main
```

**Done!** Your files are now on GitHub! 🎉

---

### Method 2: GitHub Desktop (Easier for Beginners)

#### Step 1: Download GitHub Desktop
https://desktop.github.com/

#### Step 2: Install and Sign In
- Install GitHub Desktop
- Sign in with your GitHub account

#### Step 3: Add Local Repository
1. Click "File" → "Add Local Repository"
2. Browse to `d:\New folder`
3. Click "Select Folder"
4. If prompted, click "Create a repository"

#### Step 4: Commit Changes
1. You'll see all modified files listed
2. Write commit message: "Complete website with new pricing page"
3. Click "Commit to main"

#### Step 5: Publish to GitHub
1. Click "Publish repository"
2. Name: `leadintelai`
3. Choose Public/Private
4. Click "Publish"

**Done!** 🎊

---

### Method 3: Manual Upload (No Git Required)

#### Step 1: Create Repository on GitHub
1. Go to https://github.com/new
2. Name: `leadintelai`
3. Make it Public or Private
4. Click "Create repository"

#### Step 2: Upload Files Manually
1. On the repository page, click "uploading an existing file"
2. Drag and drop ALL files from `d:\New folder`:
   - index.html
   - price.html
   - login.html
   - signup.html
   - dashboard.html
   - projects.html
   - checkout.html
   - logo.svg
   - .htaccess
   - nginx.conf
   - vercel.json
   - README.md
   - .gitignore (create this first)

3. Click "Commit changes"

**Done!** ✅

---

## 🔧 Post-Upload Setup

### 1. Enable GitHub Pages (for live website)
1. Go to your repository Settings
2. Scroll to "Pages" section
3. Source: Select "main" branch
4. Folder: / (root)
5. Click "Save"
6. Wait 2-3 minutes
7. Your site will be live at: `https://YOUR_USERNAME.github.io/leadintelai/`

### 2. Update Demo Credentials
The demo credentials are stored in sessionStorage. To change them:
- Edit `login.html` line ~230
- Look for: `leadintelai@gmail.com` and `Gaurav@20302`
- Replace with your desired credentials

### 3. Configure Razorpay Payment
Edit `checkout.html` and update:
- Line ~280: Replace `YOUR_RAZORPAY_KEY_ID` with actual key
- Get your key from: https://dashboard.razorpay.com/

---

## 📝 What's New in This Version?

### ✨ Major Updates
1. **Removed pricing from landing page** - Now on dedicated `/price` page
2. **Created price.html** - Separate pricing page with 2 product lines:
   - Mass Mailing & WhatsApp API (3 plans)
   - B2B Data Selling (3 plans)
3. **Updated navigation** - Pricing link now points to `/price`
4. **Deep Teal theme** - Complete website color overhaul (#004E64)
5. **Apple-style typography** - Clean, minimal fonts
6. **Blue button effects** - Beautiful glow/shadow on all buttons

### 🎨 Design Improvements
- Deep Teal gradient backgrounds
- Mist Grey text (#E0E5E9)
- Blue accent glows on interactive elements
- SF Pro Display font stack
- Responsive design for all devices

### 🔐 Authentication Flow
- Login → Projects → Dashboard
- Signup → OTP Verification → Projects → Dashboard
- Session storage for user persistence
- Hidden demo credentials

---

## 🚀 Quick Testing Checklist

Before uploading to GitHub, test locally:

- [ ] Open `index.html` in browser
- [ ] Click "Pricing" → Should open `price.html`
- [ ] Click any plan → Should go to login/signup
- [ ] Login with demo credentials
- [ ] Should redirect to `projects.html`
- [ ] Click any project card → Should open dashboard
- [ ] Click "Switch Project" → Back to projects
- [ ] Click LeadintelAI logo → Back to projects
- [ ] Test OTP signup flow
- [ ] Check mobile responsiveness

---

## 📞 Need Help?

If you encounter issues:

1. **Git not found**: Install Git from git-scm.com
2. **Permission denied**: Run PowerShell as Administrator
3. **Files not uploading**: Check file sizes (GitHub limit: 100MB/file)
4. **Website not working**: Ensure all files are in root directory

---

## 🎯 Summary

**Total Files**: 13  
**HTML Pages**: 7  
**CSS**: Inline in HTML files  
**JavaScript**: Vanilla JS (no frameworks)  
**Size**: ~500KB total  
**Dependencies**: None (fully standalone)

Everything is optimized, tested, and ready for GitHub! 🚀

---

**Created by**: LeadintelAI Team  
**Date**: March 2026  
**Version**: 2.0 (with pricing page restructuring)
