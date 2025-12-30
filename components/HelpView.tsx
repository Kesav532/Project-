
import React from 'react';
import { 
  Smartphone, Wifi, WifiOff, Download, 
  CheckCircle2, AlertCircle, HardDrive, Cpu, 
  Globe, Layout
} from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Smartphone size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">Offline & Installation Guide</h2>
            <p className="text-slate-500">CivicConnect is a Progressive Web App (PWA) designed to work anywhere.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Installation Instructions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Download size={20} className="text-blue-500" /> How to Install
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0">1</div>
                <div>
                  <p className="font-bold text-slate-800">Mobile (iOS/Android)</p>
                  <p className="text-sm text-slate-600">Open this site in Safari or Chrome. Tap the <span className="font-bold">Share</span> or <span className="font-bold">Menu</span> button and select <span className="font-bold">"Add to Home Screen"</span>.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0">2</div>
                <div>
                  <p className="font-bold text-slate-800">Desktop (Chrome/Edge)</p>
                  <p className="text-sm text-slate-600">Look for the <span className="font-bold">Install Icon</span> in the right side of your address bar or click the "Install App" button in the menu.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-xs text-blue-800 leading-relaxed italic">
                "Once installed, CivicConnect will appear in your app drawer and can be launched without opening a browser."
              </p>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <WifiOff size={20} className="text-amber-500" /> What Works Offline?
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'View Reports', status: 'works', icon: CheckCircle2, color: 'text-emerald-500' },
                { label: 'Submit Complaints', status: 'works', icon: CheckCircle2, color: 'text-emerald-500' },
                { label: 'Edit Profile', status: 'works', icon: CheckCircle2, color: 'text-emerald-500' },
                { label: 'AI Category Suggest', status: 'needs-net', icon: AlertCircle, color: 'text-amber-500' },
                { label: 'Admin AI Reports', status: 'needs-net', icon: AlertCircle, color: 'text-amber-500' },
                { label: 'Real-time Sync', status: 'needs-net', icon: AlertCircle, color: 'text-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className={item.color} />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${item.status === 'works' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {item.status === 'works' ? 'Local Storage' : 'Needs Internet'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <HardDrive className="text-blue-500 mb-4" size={24} />
           <h4 className="font-bold text-slate-800 mb-2">Local Storage</h4>
           <p className="text-xs text-slate-500 leading-relaxed">
             All your data is saved locally on your device's storage. It remains safe even if you close the browser or restart your device.
           </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <Cpu className="text-indigo-500 mb-4" size={24} />
           <h4 className="font-bold text-slate-800 mb-2">Smart Offline Mode</h4>
           <p className="text-xs text-slate-500 leading-relaxed">
             The app automatically detects your connection state. When offline, it switches to a local-first mode to preserve your progress.
           </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <Globe className="text-emerald-500 mb-4" size={24} />
           <h4 className="font-bold text-slate-800 mb-2">Auto-Sync</h4>
           <p className="text-xs text-slate-500 leading-relaxed">
             Once you regain internet access, the app is ready to communicate with AI services for advanced analytics and reporting.
           </p>
        </div>
      </div>
    </div>
  );
};
