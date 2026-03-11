import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Send, 
  Smartphone, 
  Mail, 
  FileText, 
  Zap, 
  BarChart3, 
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Plus,
  Filter,
  Download,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// --- Types ---
type View = 'dashboard' | 'contacts' | 'campaigns' | 'whatsapp' | 'email' | 'templates' | 'automation' | 'analytics' | 'settings';

// --- Mock Data ---
const performanceData = [
  { name: 'Mon', sent: 4000, delivered: 2400 },
  { name: 'Tue', sent: 3000, delivered: 1398 },
  { name: 'Wed', sent: 2000, delivered: 9800 },
  { name: 'Thu', sent: 2780, delivered: 3908 },
  { name: 'Fri', sent: 1890, delivered: 4800 },
  { name: 'Sat', sent: 2390, delivered: 3800 },
  { name: 'Sun', sent: 3490, delivered: 4300 },
];

const contacts = [
  { id: 1, name: 'Alex Johnson', phone: '+1 234 567 890', email: 'alex@example.com', company: 'TechFlow', tag: 'Lead', status: 'Active' },
  { id: 2, name: 'Sarah Miller', phone: '+1 987 654 321', email: 'sarah@design.co', company: 'CreativeLab', tag: 'Customer', status: 'Active' },
  { id: 3, name: 'Michael Chen', phone: '+1 555 012 345', email: 'm.chen@global.com', company: 'GlobalLogistics', tag: 'Enterprise', status: 'Inactive' },
  { id: 4, name: 'Emma Wilson', phone: '+1 444 987 654', email: 'emma@startup.io', company: 'NextGen', tag: 'Lead', status: 'Active' },
  { id: 5, name: 'David Brown', phone: '+1 333 222 111', email: 'david@corp.com', company: 'MegaCorp', tag: 'Partner', status: 'Active' },
];

// --- Components ---

const Sidebar = ({ activeView, setView }: { activeView: View, setView: (v: View) => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'contacts', icon: <Users className="w-5 h-5" />, label: 'Contacts' },
    { id: 'campaigns', icon: <Send className="w-5 h-5" />, label: 'Campaigns' },
    { id: 'whatsapp', icon: <Smartphone className="w-5 h-5" />, label: 'WhatsApp API' },
    { id: 'email', icon: <Mail className="w-5 h-5" />, label: 'Email Campaigns' },
    { id: 'templates', icon: <FileText className="w-5 h-5" />, label: 'Templates' },
    { id: 'automation', icon: <Zap className="w-5 h-5" />, label: 'Automation' },
    { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden lg:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-ocean rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Leadintel AI</span>
        </div>
      </div>
      <nav className="flex-grow px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeView === item.id 
                ? "bg-ocean text-white shadow-lg shadow-ocean/20" 
                : "text-slate-600 hover:bg-slate-50 hover:text-ocean"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Usage Plan</p>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600">Messages</span>
            <span className="font-bold text-slate-900">4,230 / 5,000</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div className="bg-ocean h-1.5 rounded-full" style={{ width: '84%' }}></div>
          </div>
          <button className="w-full mt-3 text-xs font-bold text-ocean hover:underline">Upgrade Plan</button>
        </div>
      </div>
    </aside>
  );
};

const TopNav = () => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
    <div className="flex items-center gap-4 flex-grow max-w-xl">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search contacts, campaigns..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean/10 focus:border-ocean outline-none transition-all"
        />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <div className="h-8 w-px bg-slate-200 mx-2"></div>
      <button className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-lg transition-all">
        <img src="https://i.pravatar.cc/100?u=me" className="w-8 h-8 rounded-full" alt="User" />
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-slate-900 leading-none">Gaurav Rao</p>
          <p className="text-[10px] text-slate-500">Admin</p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  </header>
);

const DashboardHome = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Contacts', value: '12,482', change: '+12%', up: true },
        { label: 'Active Campaigns', value: '24', change: '+4', up: true },
        { label: 'Messages Sent', value: '84,230', change: '-2%', up: false },
        { label: 'Open Rate', value: '64.2%', change: '+5.4%', up: true },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            <div className={cn(
              "flex items-center text-xs font-bold px-2 py-1 rounded-full",
              stat.up ? "text-fresh bg-fresh/10" : "text-red-500 bg-red-50/10"
            )}>
              {stat.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {stat.change}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900">Campaign Performance</h3>
          <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0A66C2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="sent" stroke="#0A66C2" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" />
              <Area type="monotone" dataKey="delivered" stroke="#22C55E" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-6">Channel Distribution</h3>
        <div className="space-y-6">
          {[
            { label: 'WhatsApp', value: 65, color: 'bg-fresh' },
            { label: 'Email', value: 25, color: 'bg-ocean' },
            { label: 'SMS', value: 10, color: 'bg-slate-400' },
          ].map((channel, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">{channel.label}</span>
                <span className="font-bold text-slate-900">{channel.value}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={cn("h-2 rounded-full", channel.color)} style={{ width: `${channel.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 p-4 bg-ocean/5 rounded-xl border border-ocean/10">
          <p className="text-xs text-ocean font-bold mb-1">Pro Tip</p>
          <p className="text-xs text-slate-600 leading-relaxed">WhatsApp campaigns have 4x higher response rates than email this month.</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Recent Activity</h3>
        <button className="text-xs font-bold text-ocean hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Campaign</th>
              <th className="px-6 py-4 font-semibold">Channel</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Sent</th>
              <th className="px-6 py-4 font-semibold">Open Rate</th>
              <th className="px-6 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Summer Sale Blast', channel: 'WhatsApp', status: 'Completed', sent: '4,200', open: '92%', date: 'Oct 12, 2025' },
              { name: 'Newsletter Oct', channel: 'Email', status: 'Active', sent: '12,000', open: '24%', date: 'Oct 10, 2025' },
              { name: 'Welcome Series', channel: 'Automation', status: 'Active', sent: '142', open: '88%', date: 'Ongoing' },
              { name: 'Product Update', channel: 'Email', status: 'Draft', sent: '-', open: '-', date: 'Oct 08, 2025' },
            ].map((row, i) => (
              <tr key={i} className="text-sm hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                    row.channel === 'WhatsApp' ? "bg-fresh/10 text-fresh" : "bg-ocean/10 text-ocean"
                  )}>
                    {row.channel === 'WhatsApp' ? <Smartphone className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                    {row.channel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    row.status === 'Completed' ? "bg-slate-100 text-slate-600" : row.status === 'Active' ? "bg-fresh/10 text-fresh" : "bg-orange-100 text-orange-600"
                  )}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{row.sent}</td>
                <td className="px-6 py-4 text-slate-600">{row.open}</td>
                <td className="px-6 py-4 text-slate-500">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ContactsView = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Contacts</h2>
        <p className="text-sm text-slate-500">Manage your leads and customer database</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all">
          <Download className="w-4 h-4" /> Import CSV
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-all shadow-lg shadow-ocean/20">
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter contacts..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Selected: <span className="font-bold text-slate-900">0</span></span>
          <button className="text-xs font-bold text-ocean disabled:opacity-50" disabled>Bulk Actions</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Contact Info</th>
              <th className="px-6 py-4 font-semibold">Company</th>
              <th className="px-6 py-4 font-semibold">Tag</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.map((contact) => (
              <tr key={contact.id} className="text-sm hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ocean/10 text-ocean flex items-center justify-center font-bold text-xs">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-slate-900">{contact.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs">
                    <p className="text-slate-900">{contact.phone}</p>
                    <p className="text-slate-500">{contact.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{contact.company}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {contact.tag}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", contact.status === 'Active' ? "bg-fresh" : "bg-slate-300")}></div>
                    <span className="text-slate-600">{contact.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-slate-200 rounded">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Showing 1-5 of 12,482 contacts</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  </div>
);

const CampaignsView = () => {
  const [step, setStep] = useState(1);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Create Campaign</h2>
          <p className="text-sm text-slate-500">Launch a new multi-channel outreach</p>
        </div>
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                step >= s ? "bg-ocean border-ocean text-white" : "bg-white border-slate-200 text-slate-400"
              )}>
                {s}
              </div>
              {s < 5 && <div className={cn("w-8 h-0.5", step > s ? "bg-ocean" : "bg-slate-200")}></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Select Campaign Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-6 border-2 border-ocean bg-ocean/5 rounded-2xl text-left transition-all">
                    <Smartphone className="w-8 h-8 text-ocean mb-4" />
                    <h4 className="font-bold text-slate-900">WhatsApp Broadcast</h4>
                    <p className="text-xs text-slate-500 mt-1">Send bulk messages via official WhatsApp API</p>
                  </button>
                  <button className="p-6 border-2 border-slate-100 hover:border-ocean/30 rounded-2xl text-left transition-all">
                    <Mail className="w-8 h-8 text-slate-400 mb-4" />
                    <h4 className="font-bold text-slate-900">Email Campaign</h4>
                    <p className="text-xs text-slate-500 mt-1">Design beautiful emails with high deliverability</p>
                  </button>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">Campaign Name</label>
                  <input type="text" placeholder="e.g. Summer Sale 2026" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-ocean/10 focus:border-ocean" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Select Audience</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-ocean bg-ocean/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-ocean" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">All Contacts</p>
                        <p className="text-xs text-slate-500">12,482 recipients</p>
                      </div>
                    </div>
                    <input type="radio" name="audience" defaultChecked className="text-ocean" />
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Filter className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Segment: High Value Leads</p>
                        <p className="text-xs text-slate-500">1,240 recipients</p>
                      </div>
                    </div>
                    <input type="radio" name="audience" className="text-ocean" />
                  </div>
                  <button className="text-xs font-bold text-ocean flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Create New Segment
                  </button>
                </div>
              </motion.div>
            )}

            {step >= 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Configure Content</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Message Template</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                      <option>Select a template...</option>
                      <option>Summer Sale Blast</option>
                      <option>Welcome Message</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Personalization</label>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-200">{"{{first_name}}"}</span>
                      <span className="px-3 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-200">{"{{company}}"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="pt-6 border-t border-slate-100 flex justify-between">
              <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900"
                disabled={step === 1}
              >
                Back
              </button>
              <button 
                onClick={() => setStep(Math.min(5, step + 1))}
                className="px-8 py-2 bg-ocean text-white rounded-xl text-sm font-bold hover:bg-ocean/90 transition-all shadow-lg shadow-ocean/20"
              >
                {step === 5 ? 'Launch Campaign' : 'Next Step'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-4 border-[8px] border-slate-800 shadow-2xl aspect-[9/19] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-slate-800 flex items-center justify-center">
              <div className="w-20 h-4 bg-slate-900 rounded-full"></div>
            </div>
            <div className="mt-12 h-full bg-[#E5DDD5] rounded-b-3xl overflow-y-auto p-3 space-y-3">
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                <p className="text-[10px] text-slate-800">Hello Alex! 👋</p>
                <p className="text-[10px] text-slate-800 mt-1">Our Summer Sale is now LIVE. Get up to 50% off on all items.</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-center">
                  <span className="text-[10px] font-bold text-ocean">Shop Now</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500">Live Preview</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Layout ---

export default function DashboardLayout() {
  const [activeView, setView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const TemplatesView = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Message Templates</h2>
        <p className="text-sm text-slate-500">Manage your WhatsApp and Email templates</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-all shadow-lg shadow-ocean/20">
        <Plus className="w-4 h-4" /> Create Template
      </button>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { name: 'Welcome Message', type: 'WhatsApp', category: 'Marketing', status: 'Approved' },
        { name: 'Order Confirmation', type: 'WhatsApp', category: 'Utility', status: 'Approved' },
        { name: 'Monthly Newsletter', type: 'Email', category: 'Marketing', status: 'Draft' },
        { name: 'Password Reset', type: 'Email', category: 'Authentication', status: 'Approved' },
      ].map((t, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className={cn(
              "p-2 rounded-lg",
              t.type === 'WhatsApp' ? "bg-fresh/10 text-fresh" : "bg-ocean/10 text-ocean"
            )}>
              {t.type === 'WhatsApp' ? <Smartphone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            </div>
            <span className={cn(
              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              t.status === 'Approved' ? "bg-fresh/10 text-fresh" : "bg-slate-100 text-slate-500"
            )}>
              {t.status}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 mb-1">{t.name}</h4>
          <p className="text-xs text-slate-500 mb-4">{t.category}</p>
          <div className="flex gap-2">
            <button className="flex-grow py-2 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50">Edit</button>
            <button className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AutomationView = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Automation Workflows</h2>
        <p className="text-sm text-slate-500">Visual flow builder for multi-channel journeys</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-all shadow-lg shadow-ocean/20">
        <Plus className="w-4 h-4" /> New Workflow
      </button>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      {[
        { name: 'Welcome Journey', status: 'Active', triggers: 'New Lead', steps: 4 },
        { name: 'Abandoned Cart', status: 'Paused', triggers: 'Cart Inactive', steps: 3 },
        { name: 'Post-Purchase', status: 'Active', triggers: 'Order Placed', steps: 5 },
      ].map((flow, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-ocean/10 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-ocean" />
            </div>
            <span className={cn(
              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              flow.status === 'Active' ? "bg-fresh/10 text-fresh" : "bg-slate-100 text-slate-500"
            )}>
              {flow.status}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 mb-1">{flow.name}</h4>
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> {flow.triggers}
            </div>
            <div className="flex items-center gap-1">
              <LayoutDashboard className="w-3 h-3" /> {flow.steps} Steps
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 flex gap-2">
            <button className="flex-grow py-2 text-xs font-bold bg-slate-50 text-slate-900 rounded-lg hover:bg-slate-100">Edit Flow</button>
            <button className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50">
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      ))}
      
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
          <Plus className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm font-bold text-slate-900">Create Custom Workflow</p>
        <p className="text-xs text-slate-500 mt-1">Start from scratch or use a template</p>
      </div>
    </div>
  </div>
);

const AnalyticsView = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Advanced Analytics</h2>
        <p className="text-sm text-slate-500">Deep dive into your campaign performance</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>
    </div>

    <div className="grid lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Sent', value: '124.5k', change: '+14%', up: true },
        { label: 'Delivered', value: '118.2k', change: '+12%', up: true },
        { label: 'Opened', value: '84.2k', change: '+18%', up: true },
        { label: 'Clicked', value: '12.4k', change: '-2%', up: false },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            <span className={cn("text-xs font-bold", stat.up ? "text-fresh" : "text-red-500")}>{stat.change}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-6">Engagement Over Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="sent" stroke="#0A66C2" fill="#0A66C2" fillOpacity={0.1} />
            <Area type="monotone" dataKey="delivered" stroke="#22C55E" fill="#22C55E" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="max-w-4xl space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
      <p className="text-sm text-slate-500">Manage your account and platform configurations</p>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Profile Settings</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-6">
          <img src="https://i.pravatar.cc/100?u=me" className="w-20 h-20 rounded-full border-4 border-slate-50" alt="Avatar" />
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50">Change Photo</button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input type="text" defaultValue="Gaurav Rao" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-ocean" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" defaultValue="gaurav@leadintel.ai" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-ocean" />
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">API & Integrations</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-fresh/10 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-fresh" />
            </div>
            <div>
              <p className="font-bold text-slate-900">WhatsApp Business API</p>
              <p className="text-xs text-slate-500">Connected to +91 98765 43210</p>
            </div>
          </div>
          <button className="text-xs font-bold text-red-500 hover:underline">Disconnect</button>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-ocean/10 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-ocean" />
            </div>
            <div>
              <p className="font-bold text-slate-900">SMTP Settings</p>
              <p className="text-xs text-slate-500">Verified: Amazon SES</p>
            </div>
          </div>
          <button className="text-xs font-bold text-ocean hover:underline">Configure</button>
        </div>
      </div>
    </div>
  </div>
);

const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardHome />;
      case 'contacts': return <ContactsView />;
      case 'campaigns': return <CampaignsView />;
      case 'templates': return <TemplatesView />;
      case 'automation': return <AutomationView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Coming Soon</h3>
          <p className="text-slate-500 max-w-xs mt-2">The {activeView} module is currently under development. Stay tuned!</p>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeView={activeView} setView={setView} />
      
      <div className="flex-grow flex flex-col min-w-0">
        <TopNav />
        
        <main className="p-8 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-ocean text-white rounded-full shadow-2xl flex items-center justify-center z-50"
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="w-64 bg-white h-full"
              onClick={e => e.stopPropagation()}
            >
              <Sidebar activeView={activeView} setView={(v) => { setView(v); setIsMobileMenuOpen(false); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
