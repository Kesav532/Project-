
import React, { useState, useEffect } from 'react';
import { Role } from '../types';
import { MockDb } from '../services/mockDb';
import { UserPlus, LogIn, Mail, Lock, User, ShieldCheck, KeyRound, ArrowLeft, Send, CheckCircle, Phone, Fingerprint, MapPinned, UserCircle2, RefreshCw, Scale } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  onLogin: (user: any) => void;
  initialView?: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
  onBackToLanding?: () => void;
}

type AuthView = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

export const Auth: React.FC<Props> = ({ onLogin, initialView = 'LOGIN', onBackToLanding }) => {
  const [view, setView] = useState<AuthView>(initialView);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(result);
    setCaptchaInput('');
  };

  useEffect(() => {
    setView(initialView);
    if (initialView === 'REGISTER' || initialView === 'LOGIN') generateCaptcha();
  }, [initialView]);

  const resetForm = () => {
    setError('');
    setEmail('');
    setName('');
    setPassword('');
    setMobile('');
    setAddress('');
    setAadhaar('');
    setGender('');
    setEnteredOtp('');
    setOtpSent(false);
    setAcceptTerms(false);
    setCaptchaInput('');
  };

  const handleSwitchView = (newView: AuthView) => {
    resetForm();
    setView(newView);
    if (newView === 'REGISTER' || newView === 'LOGIN') generateCaptcha();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (captchaInput !== captchaValue) {
      setError('Invalid CAPTCHA code. Please try again.');
      generateCaptcha();
      return;
    }

    const user = MockDb.login(email);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password.');
      generateCaptcha();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !mobile || !address || !aadhaar || !gender) {
      setError('Please fill in all mandatory profile fields.');
      return;
    }

    if (captchaInput !== captchaValue) {
      setError('Invalid CAPTCHA code. Please try again.');
      generateCaptcha();
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the Terms and Conditions to proceed.');
      return;
    }

    const success = MockDb.register(name, email, mobile, address, aadhaar, gender);
    if (success) {
      const user = MockDb.login(email);
      if (user) onLogin(user);
    } else {
      setError('Email is already registered. Please login.');
      generateCaptcha();
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpSent) {
      const exists = MockDb.checkEmailExists(email);
      if (!exists) {
        setError('No account found with this email address.');
        return;
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      alert(`[DEMO] Verification code: ${code}`);
    } else {
      if (enteredOtp !== generatedOtp) {
        setError('Invalid verification code.');
        return;
      }
      alert('Password updated successfully!');
      handleSwitchView('LOGIN');
    }
  };

  const renderCaptchaSection = () => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <label className="block text-sm font-medium text-slate-700 mb-3">Security Verification</label>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white border-2 border-slate-300 px-6 py-2 rounded-lg font-mono text-2xl font-bold tracking-widest text-slate-700 shadow-inner">
            {captchaValue}
          </div>
          <button type="button" onClick={generateCaptcha} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition">
            <RefreshCw size={20} />
          </button>
        </div>
        <div className="flex-1 w-full">
          <input
            type="text"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Type code"
            required
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className={`bg-white p-8 rounded-2xl shadow-xl w-full border border-slate-200 transition-all duration-300 ${view === 'REGISTER' ? 'max-w-3xl' : 'max-w-md'}`}>
        <div className="text-center mb-8 relative">
          {onBackToLanding && (
            <button onClick={onBackToLanding} className="absolute -top-2 -left-2 p-2 text-slate-400 hover:text-slate-600 transition"><ArrowLeft size={20} /></button>
          )}
          <div className="flex justify-center mb-3"><Logo size="lg" showText={false} /></div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{view === 'LOGIN' ? 'Welcome Back' : view === 'REGISTER' ? 'Create Account' : 'Reset Password'}</h1>
        </div>

        <form onSubmit={view === 'LOGIN' ? handleLogin : view === 'REGISTER' ? handleRegister : handleForgotPassword} className="space-y-5">
           <div className={view === 'REGISTER' ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5' : 'space-y-5'}>
              {view === 'REGISTER' && (
                <div className="animate-slide-up stagger-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="John Doe" required />
                  </div>
                </div>
              )}

              <div className="animate-slide-up stagger-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="name@example.com" required readOnly={otpSent} />
                </div>
              </div>

              {view === 'REGISTER' && (
                <>
                  <div className="animate-slide-up stagger-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="+91 00000 00000" required />
                    </div>
                  </div>
                  <div className="animate-slide-up stagger-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <div className="relative">
                      <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white appearance-none" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {(view === 'LOGIN' || view === 'REGISTER') && (
                <div className="animate-slide-up stagger-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" required />
                  </div>
                </div>
              )}
           </div>

           {(view === 'LOGIN' || view === 'REGISTER') && renderCaptchaSection()}

           <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center">
             {view === 'LOGIN' ? 'Sign In' : view === 'REGISTER' ? 'Create Account' : 'Reset Password'}
           </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            {view === 'REGISTER' ? "Already have an account?" : "Don't have an account?"}
            <button onClick={() => handleSwitchView(view === 'REGISTER' ? 'LOGIN' : 'REGISTER')} className="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline">{view === 'REGISTER' ? "Sign In" : "Register Now"}</button>
          </p>
        </div>
      </div>
    </div>
  );
};
