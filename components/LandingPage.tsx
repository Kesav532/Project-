
import React from 'react';
import { ArrowRight, Mic, BarChart3, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onGetStarted: (view: 'LOGIN' | 'REGISTER') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b h-20 flex items-center px-8 justify-between">
        <div className="flex items-center gap-2"><Logo size="sm" showText={false} /><span className="text-2xl font-bold">CivicConnect</span></div>
        <div className="flex gap-4">
          <button onClick={() => onGetStarted('LOGIN')} className="font-medium text-slate-600">Login</button>
          <button onClick={() => onGetStarted('REGISTER')} className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold">Register</button>
        </div>
      </nav>

      <section className="pt-20 pb-24 text-center">
        <Logo size="xl" className="mb-10 mx-auto" />
        <h1 className="text-6xl font-black text-slate-900 mb-6">Connect with Governance</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">Direct citizen-to-administration communication with smart issue tracking.</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => onGetStarted('REGISTER')} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center">Start Now <ArrowRight className="ml-2" /></button>
          <button onClick={() => onGetStarted('LOGIN')} className="px-8 py-4 bg-white border rounded-xl font-bold">Sign In</button>
        </div>
      </section>

      <section className="py-20 bg-white grid md:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto">
        {[
          { title: 'Voice Support', desc: 'Record and submit complaints via voice notes.', icon: Mic },
          { title: 'Smart Tracking', desc: 'Real-time updates on your complaint status.', icon: CheckCircle2 },
          { title: 'Admin Analytics', desc: 'Powerful tools for city management.', icon: BarChart3 }
        ].map((f, i) => (
          <div key={i} className="p-8 bg-slate-50 rounded-2xl border">
            <f.icon className="text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
