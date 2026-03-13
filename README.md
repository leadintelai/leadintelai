# LeadintelAI - India's #1 B2B Intelligence Platform

![LeadintelAI](logo.svg)

## 🌟 Overview

LeadintelAI is a powerful B2B intelligence platform that provides:
- **Data Intelligence Dashboard** - Access verified B2B contacts and company data
- **WhatsApp API Integration** - Run targeted WhatsApp marketing campaigns
- **Mass Mailing System** - Execute large-scale email marketing campaigns

## 🚀 Features

### Core Products
1. **B2B Data Selling**
   - 5,000+ to Unlimited B2B contacts/month
   - Advanced filtering (50+ filters)
   - Real-time data verification
   - CRM integration capabilities

2. **Mass Mailing & WhatsApp API**
   - Email campaign builder
   - WhatsApp message automation
   - Analytics and reporting
   - Template management

### Technical Features
- ✨ Deep Teal (#004E64) premium theme
- 🍎 Apple-style minimal typography (SF Pro Display)
- 🔐 Inline OTP verification on signup
- 💳 Razorpay payment integration
- 📱 Fully responsive design
- 🎨 Animated SVG logo
- 🤖 Intelligent chatbot assistant

## 📁 Project Structure

```
leadintelai/
├── index.html              # Landing page
├── price.html             # Pricing page (NEW!)
├── login.html             # Login page
├── signup.html            # Signup with OTP verification
├── dashboard.html         # Data Intelligence dashboard
├── projects.html          # Project selector page
├── checkout.html          # Payment checkout
├── logo.svg               # Animated brand logo
├── .htaccess              # Apache redirect rules
├── nginx.conf             # Nginx configuration
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Fonts**: Inter, Cormorant Garamond, SF Pro Display
- **Icons**: Custom SVG icons
- **Payment**: Razorpay (integrated in checkout flow)
- **Deployment**: Vercel / Netlify / Any static host

## 🎨 Design System

### Color Palette
```css
Deep Teal:    #004E64 (RGB: 0, 78, 100)
Mid Teal:     #005A73
Light Teal:   #006B85
Accent Teal:  #00879C
Mist Grey:    #E0E5E9 (RGB: 224, 229, 233)
Gold:         #D4AF37
White:        #F5F7FA
```

### Typography
- **Primary Font**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif`
- **Headings**: `'Cormorant Garamond', serif`
- **Style**: Minimal, clean, Apple-inspired

## 🚀 Getting Started

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/leadintelai.git
cd leadintelai
```

2. **Open locally**
```bash
# Using Live Server (VS Code extension)
# Or simply open index.html in your browser
```

### Demo Credentials

For testing purposes:
- **Email**: `leadintelai@gmail.com`
- **Password**: `Gaurav@20302`

*Note: Demo credentials are hidden from public view in production*

## 📱 User Flow

1. **Landing Page** (`index.html`)
   - Hero section with animated typing effect
   - Feature showcases
   - Testimonials
   - CTA buttons

2. **Pricing Page** (`/price`)
   - Two product categories:
     - Mass Mailing & WhatsApp API plans
     - B2B Data Selling plans
   - Plan selection → Login/Signup

3. **Authentication**
   - Login (`login.html`) or Signup (`signup.html`)
   - Inline OTP verification for new accounts
   - Session storage for user data

4. **Project Selection** (`projects.html`)
   - Choose between:
     - Data Intelligence
     - WhatsApp API
     - Mass Mailing

5. **Dashboard** (`dashboard.html`)
   - Full-featured workspace
   - "Switch Project" button to change products

6. **Checkout** (`checkout.html`)
   - Razorpay payment integration
   - Plan selection
   - Payment processing

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file if needed:
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
API_BASE_URL=your_backend_api_url
```

### Deployment

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
# Drag and drop folder to netlify.com
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy
```

#### Manual Hosting
Upload all files to any web server (Apache/Nginx):
- Ensure `.htaccess` is configured for Apache
- Use `nginx.conf` as reference for Nginx

## 📊 Pricing Plans

### Mass Mailing & WhatsApp API
- **Starter**: ₹2,999/mo (10K emails, 500 WhatsApp)
- **Growth**: ₹7,999/mo (50K emails, 5K WhatsApp) ⭐ Popular
- **Enterprise**: ₹19,999/mo (Unlimited)

### B2B Data Selling
- **Starter**: ₹4,999/mo (5K contacts)
- **Growth**: ₹12,999/mo (25K contacts) ⭐ Best Value
- **Enterprise**: ₹29,999/mo (Unlimited)

*All plans + 18% GST*

## 🔐 Security Features

- Client-side session management
- OTP verification for signup
- Secure password handling
- No sensitive data in public code
- CORS headers configured

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved to LeadintelAI.

## 👥 Team

**Founder**: Gaurav Yadav  
**Contact**: [support@leadintelai.in](mailto:support@leadintelai.in)

## 📞 Support

- **Email**: [support@leadintelai.in](mailto:support@leadintelai.in)
- **Website**: [leadintelai.in](https://leadintelai.in)
- **Documentation**: Coming soon

## 🙏 Acknowledgments

- Design inspired by Apple's minimal aesthetics
- Built with passion in India 🇮🇳
- Powered by verified B2B data intelligence

---

**Made with ❤️ by the LeadintelAI Team**

*Last Updated: March 2026*
