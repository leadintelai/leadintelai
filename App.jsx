import { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import {
  MessageCircle, Mail, Bot, Zap, BarChart2, Link2,
  ArrowRight, CheckCircle, Menu, X
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ─── DATA ───────────────────────────────────────────────────────────────
const features = [
  {
    icon: <MessageCircle size={22} />,
    title: 'WhatsApp API Automation',
    desc: 'Send personalized WhatsApp messages at scale via the official Business API. Trigger flows from lead actions, replies, or CRM events.',
  },
  {
    icon: <Mail size={22} />,
    title: 'Bulk Email Campaigns',
    desc: 'Design, schedule and deliver millions of emails with advanced segmentation, A/B testing and real-time analytics.',
  },
  {
    icon: <Bot size={22} />,
    title: 'AI Lead Scoring',
    desc: 'Our AI model analyses behaviour across channels and scores intent in real time — so your team closes hot leads first.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Workflow Automation',
    desc: 'Build multi-step drip sequences spanning WhatsApp, email and SMS with a visual no-code builder.',
  },
  {
    icon: <BarChart2 size={22} />,
    title: 'Unified Analytics',
    desc: 'Track opens, clicks, replies and ROI across all channels from one dashboard. Export to any BI tool.',
  },
  {
    icon: <Link2 size={22} />,
    title: 'CRM & API Integrations',
    desc: 'Plug into Salesforce, HubSpot, Zoho, and 50+ tools via native integrations or REST API.',
  },
];

const waData = [
  { day: 'Mon', replies: 420 },
  { day: 'Tue', replies: 580 },
  { day: 'Wed', replies: 360 },
  { day: 'Thu', replies: 720 },
  { day: 'Fri', replies: 510 },
  { day: 'Sat', replies: 840 },
  { day: 'Sun', replies: 680 },
];

const emailData = [
  { day: 'Mon', opens: 310 },
  { day: 'Tue', opens: 460 },
  { day: 'Wed', opens: 590 },
  { day: 'Thu', opens: 520 },
  { day: 'Fri', opens: 680 },
  { day: 'Sat', opens: 750 },
  { day: 'Sun', opens: 620 },
];

const plans = [
  {
    name: 'Starter',
    price: '₹3,999',
    period: '/mo',
    desc: 'Perfect for small teams just getting started.',
    features: ['5,000 WhatsApp msgs/mo', '50,000 emails/mo', 'AI lead scoring (basic)', '3 automation workflows', 'Email support'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Growth',
    price: '₹12,499',
    period: '/mo',
    desc: 'For scaling teams that need more power.',
    features: ['25,000 WhatsApp msgs/mo', '500,000 emails/mo', 'Advanced AI lead scoring', 'Unlimited workflows', 'CRM integrations', 'Priority support'],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Tailored for large organisations.',
    features: ['Unlimited messages', 'Dedicated IP & infra', 'Custom AI model training', 'SLA & uptime guarantee', 'Dedicated account manager'],
    cta: 'Contact Sales',
    featured: false,
  },
];

// ─── HOOKS ──────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useCounter(target, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          setValue(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return [value, ref];
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────
const s = {
  // common inline style helpers
  accent: { color: 'var(--accent)' },
  accent2: { color: 'var(--accent2)' },
  muted: { color: 'var(--muted)' },
};

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1.1rem 3rem',
      background: 'rgba(7,9,15,0.88)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={logo} alt="Leadintel AI" style={{ height: 38, width: 'auto', filter: 'invert(1) brightness(2)' }} />
      </a>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '2rem' }} className="nav-links">
        {['Features','Dashboard','Pricing'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{l}</a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <Button ghost>Log in</Button>
        <Button primary>Get Started <ArrowRight size={15} /></Button>
      </div>
    </nav>
  );
}

function Button({ children, primary, ghost, style = {}, onClick }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.6rem 1.4rem', borderRadius: '6px',
    fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.9rem',
    cursor: 'pointer', textDecoration: 'none', border: 'none',
    transition: 'all 0.2s',
  };
  if (primary) return (
    <button onClick={onClick} style={{ ...base, background: 'var(--accent)', color: '#07090f', ...style }}>{children}</button>
  );
  return (
    <button onClick={onClick} style={{ ...base, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', ...style }}>{children}</button>
  );
}

function Badge({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.35rem 1rem', borderRadius: '999px',
      border: '1px solid rgba(0,229,160,0.3)',
      background: 'rgba(0,229,160,0.06)',
      fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '1.8rem',
      animation: 'fadeUp 0.6s ease both',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
      {children}
    </div>
  );
}

function SectionTag({ children }) {
  return <div style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.8rem' }}>{children}</div>;
}

function Hero() {
  const [leadsVal, leadsRef] = useCounter(24817);
  const [msgsVal, msgsRef] = useCounter(1842390);
  const [convVal, convRef] = useCounter(3241);

  const stats = [
    { label: 'Delivery Rate', value: '98%', highlight: true },
    { label: 'Messages Sent', value: '10M+', highlight: false },
    { label: 'Avg Reply Rate', value: '3.5×', highlight: true },
    { label: 'Enterprise Clients', value: '500+', highlight: false },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '8rem 2rem 4rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glows */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(0,229,160,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '60%', left: '30%', width: 400, height: 300, background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Badge>AI-Powered Lead Automation</Badge>

      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800, lineHeight: 1.08,
        letterSpacing: '-0.03em', fontSize: 'clamp(2.8rem, 6vw, 5rem)',
        maxWidth: 780, marginBottom: '1.5rem',
        animation: 'fadeUp 0.6s 0.1s ease both', opacity: 0, animationFillMode: 'forwards',
      }}>
        Turn Leads into Revenue with{' '}
        <span style={s.accent}>WhatsApp</span> &amp;{' '}
        <span style={s.accent2}>Email AI</span>
      </h1>

      <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: 520, lineHeight: 1.7, marginBottom: '2.5rem', animation: 'fadeUp 0.6s 0.2s ease both', opacity: 0, animationFillMode: 'forwards' }}>
        Enterprise SaaS for WhatsApp API automation, bulk email marketing, and intelligent AI lead management — all in one platform.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.6s 0.3s ease both', opacity: 0, animationFillMode: 'forwards' }}>
        <Button primary style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>Start Free Trial <ArrowRight size={16} /></Button>
        <Button ghost style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>See Features</Button>
      </div>

      {/* Stats */}
      <div ref={leadsRef} style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '5rem', animation: 'fadeUp 0.6s 0.4s ease both', opacity: 0, animationFillMode: 'forwards' }}>
        {stats.map((st) => (
          <div key={st.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: st.highlight ? 'var(--accent)' : 'var(--text)', lineHeight: 1 }}>{st.value}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.3rem' }}>{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const ref = useReveal();
  return (
    <section id="features" style={{ padding: '6rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div ref={ref} className="reveal">
        <SectionTag>Platform Features</SectionTag>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1rem' }}>
          Everything you need to<br />automate lead conversion
        </h2>
        <p style={{ color: 'var(--muted)', maxWidth: 480, lineHeight: 1.7, marginBottom: '3rem' }}>
          From first contact to closed deal — automate every touchpoint with AI-powered intelligence.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card)', border: `1px solid ${hovered ? 'rgba(0,229,160,0.25)' : 'var(--border)'}`,
        borderRadius: 12, padding: '2rem', transition: 'all 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'none', position: 'relative', overflow: 'hidden',
      }}>
      {hovered && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />}
      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,229,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '1.2rem' }}>{icon}</div>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

function Dashboard() {
  const ref = useReveal();
  const [leadsVal, leadsRef] = useCounter(24817);
  const [msgsVal, msgsRef] = useCounter(1842390);
  const [convVal] = useCounter(3241);

  return (
    <section id="dashboard" style={{ padding: '0 2rem 6rem', maxWidth: 1100, margin: '0 auto' }}>
      <div ref={ref} className="reveal">
        <SectionTag>Live Dashboard</SectionTag>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '2rem' }}>
          Real-time visibility across<br />every campaign
        </h2>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
          {/* Window dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: '1.2rem', alignItems: 'center' }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
            <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>Leadintel AI — Campaign Overview</span>
          </div>

          {/* Metrics */}
          <div ref={leadsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <Metric label="Total Leads" value={leadsVal.toLocaleString()} color="var(--accent)" />
            <Metric label="Messages Sent" value={msgsVal.toLocaleString()} color="var(--accent2)" />
            <Metric label="Open Rate" value="68.4%" color="var(--accent)" />
            <Metric label="Conversions" value={convVal.toLocaleString()} color="var(--accent2)" />
          </div>

          {/* Charts */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 2 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>WhatsApp Replies (7d)</div>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={waData} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
                  <Bar dataKey="replies" fill="var(--accent)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 2 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Email Opens (7d)</div>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={emailData} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
                  <Bar dataKey="opens" fill="var(--accent2)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Top Channel</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>WhatsApp</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.3rem' }}>3.5× higher reply vs email</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function Pricing() {
  const ref = useReveal();
  return (
    <section id="pricing" style={{ padding: '6rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div ref={ref} className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <SectionTag>Pricing</SectionTag>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Simple, transparent pricing</h2>
        <p style={{ color: 'var(--muted)' }}>Start free. Scale as you grow. No hidden fees.</p>
      </div>
      <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {plans.map(p => <PlanCard key={p.name} {...p} />)}
      </div>
    </section>
  );
}

function PlanCard({ name, price, period, desc, features: feats, cta, featured }) {
  return (
    <div style={{
      background: featured ? 'linear-gradient(135deg, rgba(0,229,160,0.05), var(--card))' : 'var(--card)',
      border: `1px solid ${featured ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 14, padding: '2rem', position: 'relative',
      transition: 'transform 0.25s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      {featured && (
        <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#07090f', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.8rem', borderRadius: 999 }}>
          Most Popular
        </div>
      )}
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>{name}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.3rem' }}>
        {price}<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--muted)' }}>{period}</span>
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>{desc}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '2rem' }}>
        {feats.map(f => (
          <li key={f} style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={15} color="var(--accent)" />{f}
          </li>
        ))}
      </ul>
      <Button primary={featured} ghost={!featured} style={{ width: '100%', justifyContent: 'center' }}>{cta}</Button>
    </div>
  );
}

function CTA() {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ textAlign: 'center', padding: '6rem 2rem', borderTop: '1px solid var(--border)', background: 'linear-gradient(180deg, transparent, rgba(0,229,160,0.03))' }}>
      <SectionTag>Get Started Today</SectionTag>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, maxWidth: 600, margin: '0 auto 1rem', letterSpacing: '-0.02em' }}>
        Ready to automate your lead pipeline?
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2.5rem' }}>Join 500+ enterprises already growing with Leadintel AI.</p>
      <Button primary style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>Start Your Free Trial <ArrowRight size={16} /></Button>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={logo} alt="Leadintel AI" style={{ height: 30, width: 'auto', filter: 'invert(1) brightness(2)' }} />
      </a>
      <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>© 2025 Leadintel AI. All rights reserved.</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>WhatsApp · Email · AI · Automation</p>
    </footer>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <Dashboard />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
