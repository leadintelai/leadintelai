import React from 'react';
import { motion } from 'motion/react';
import { Zap, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-ocean rounded-xl flex items-center justify-center">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Leadintel AI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-2">Enter your credentials to access your dashboard</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-ocean/20 focus:border-ocean outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-ocean hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-ocean/20 focus:border-ocean outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-ocean text-white py-3 rounded-lg font-semibold hover:bg-ocean/90 transition-all shadow-lg shadow-ocean/20 flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium text-slate-700">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium text-slate-700">
              <Github className="w-4 h-4" /> GitHub
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account? <Link to="/signup" className="text-ocean font-semibold hover:underline">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function SignUpPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-ocean rounded-xl flex items-center justify-center">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Leadintel AI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Start your free trial</h1>
          <p className="text-slate-500 mt-2">Join 2,000+ businesses scaling with AI</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-ocean/20 focus:border-ocean outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-ocean/20 focus:border-ocean outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-ocean/20 focus:border-ocean outline-none transition-all"
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Email</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-ocean/20 focus:border-ocean outline-none transition-all"
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-ocean/20 focus:border-ocean outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-start gap-2 py-2">
              <input type="checkbox" required className="mt-1 rounded border-slate-300 text-ocean focus:ring-ocean" />
              <span className="text-xs text-slate-500">I agree to the <a href="#" className="text-ocean">Terms of Service</a> and <a href="#" className="text-ocean">Privacy Policy</a>.</span>
            </div>
            <button 
              type="submit"
              className="w-full bg-ocean text-white py-3 rounded-lg font-semibold hover:bg-ocean/90 transition-all shadow-lg shadow-ocean/20"
            >
              Create Free Account
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-ocean font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
