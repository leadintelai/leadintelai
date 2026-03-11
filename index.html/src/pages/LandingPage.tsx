import React from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Mail, 
  Users, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Play,
  Globe,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-ocean rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Leadintel AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-ocean transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-ocean transition-colors">How it Works</a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-ocean transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-ocean transition-colors">Login</Link>
          <Link to="/signup" className="bg-ocean text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-ocean/90 transition-all shadow-lg shadow-ocean/20">
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-32 pb-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean/10 text-ocean text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ocean"></span>
            </span>
            New: AI-Powered Lead Scoring
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
            Automate WhatsApp & Email Campaigns <span className="text-ocean">with AI</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg">
            Send personalized WhatsApp broadcasts, mass email campaigns, and manage leads from one intelligent platform. Scale your outreach without losing the human touch.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/signup" className="bg-ocean text-white px-8 py-4 rounded-full font-semibold hover:bg-ocean/90 transition-all shadow-xl shadow-ocean/20 flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-semibold hover:bg-slate-50 transition-all flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Book Demo
            </button>
          </div>
          <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
              ))}
            </div>
            <span>Trusted by 2,000+ businesses worldwide</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-float">
            <img 
              src="https://picsum.photos/seed/dashboard/1200/800" 
              alt="Dashboard Preview" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-fresh/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-ocean/20 rounded-full blur-3xl"></div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    { icon: <Smartphone className="w-6 h-6" />, title: "WhatsApp API Broadcast", desc: "Send bulk messages to thousands of customers via official WhatsApp Business API." },
    { icon: <Mail className="w-6 h-6" />, title: "Bulk Email Marketing", desc: "Design and send beautiful email campaigns with high deliverability rates." },
    { icon: <Zap className="w-6 h-6" />, title: "AI Lead Management", desc: "Automatically qualify and tag leads based on their responses and behavior." },
    { icon: <Users className="w-6 h-6" />, title: "Smart Segmentation", desc: "Group your contacts based on custom attributes for highly targeted messaging." },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Campaign Analytics", desc: "Track open rates, clicks, and conversions with detailed real-time reports." },
    { icon: <CheckCircle2 className="w-6 h-6" />, title: "Automation Workflows", desc: "Build complex multi-channel automation flows with our visual builder." },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to scale outreach</h2>
          <p className="text-slate-600">Powerful tools designed for modern marketing teams. One platform, infinite possibilities.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-ocean/10 text-ocean rounded-xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Get started in 4 simple steps</h2>
      </div>
      <div className="grid md:grid-cols-4 gap-8">
        {[
          { step: "01", title: "Import Contacts", desc: "Upload your CSV or sync from your CRM seamlessly." },
          { step: "02", title: "Create Campaign", desc: "Use our drag-and-drop builder for WhatsApp or Email." },
          { step: "03", title: "Send & Automate", desc: "Launch instantly or schedule for the perfect time." },
          { step: "04", title: "Track Analytics", desc: "Monitor performance and optimize for better results." },
        ].map((s, i) => (
          <div key={i} className="relative text-center">
            <div className="text-6xl font-black text-slate-100 absolute -top-4 left-1/2 -translate-x-1/2 -z-10">{s.step}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">{s.title}</h3>
            <p className="text-slate-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section id="pricing" className="py-20 bg-slate-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-slate-400">Choose the plan that's right for your business growth.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Starter", price: "₹3,999", features: ["2,000 Contacts", "5,000 Messages/mo", "Basic Analytics", "Email Support"] },
          { name: "Growth", price: "₹7,999", features: ["10,000 Contacts", "Unlimited Messages", "Advanced AI Scoring", "Priority Support"], highlighted: true },
          { name: "Enterprise", price: "Custom", features: ["Unlimited Everything", "Dedicated Manager", "Custom API Integration", "24/7 Phone Support"] },
        ].map((p, i) => (
          <div key={i} className={`p-8 rounded-3xl border ${p.highlighted ? 'border-ocean bg-slate-800' : 'border-slate-700 bg-slate-900'} flex flex-col`}>
            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
            <div className="text-4xl font-bold mb-6">{p.price}<span className="text-sm font-normal text-slate-400">{p.price !== 'Custom' ? '/mo' : ''}</span></div>
            <ul className="space-y-4 mb-8 flex-grow">
              {p.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-fresh" /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-full font-bold transition-all ${p.highlighted ? 'bg-ocean text-white hover:bg-ocean/90 shadow-lg shadow-ocean/20' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 border-t border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-ocean rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Leadintel AI</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            The world's most intelligent multi-channel marketing platform for growing businesses.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-ocean">WhatsApp API</a></li>
            <li><a href="#" className="hover:text-ocean">Email Marketing</a></li>
            <li><a href="#" className="hover:text-ocean">AI Lead Scoring</a></li>
            <li><a href="#" className="hover:text-ocean">Integrations</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-ocean">About Us</a></li>
            <li><a href="#" className="hover:text-ocean">Careers</a></li>
            <li><a href="#" className="hover:text-ocean">Blog</a></li>
            <li><a href="#" className="hover:text-ocean">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-ocean">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-ocean">Terms of Service</a></li>
            <li><a href="#" className="hover:text-ocean">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-xs">© 2026 Leadintel AI. All rights reserved.</p>
        <div className="flex gap-6">
          <Globe className="w-5 h-5 text-slate-400 hover:text-ocean cursor-pointer" />
          <ShieldCheck className="w-5 h-5 text-slate-400 hover:text-ocean cursor-pointer" />
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}
