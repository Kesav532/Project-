
import React, { useState, useRef, useEffect } from 'react';
import { User, Complaint, ComplaintStatus, Role } from '../types';
import { MockDb } from '../services/mockDb';
import { GeminiService } from '../services/gemini.ts';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { 
  Plus, Mic, Image as ImageIcon, Loader2, Calendar, MapPin, 
  CheckCircle, Clock, AlertCircle, FileText, UserCircle, 
  Save, Camera, Mail, Phone, Fingerprint, MapPinned, Info,
  TrendingUp, Activity, CheckCircle2, PartyPopper
} from 'lucide-react';

interface Props {
  user: User;
  activeView: string;
  onProfileUpdate?: () => void;
}

export const CitizenDashboard: React.FC<Props> = ({ user, activeView, onProfileUpdate }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [dob, setDob] = useState(user.dob || '');
  const [mobile, setMobile] = useState(user.mobile || '');
  const [aadhaar, setAadhaar] = useState(user.aadhaar || '');
  const [address, setAddress] = useState(user.address || '');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    refreshData();
    if (activeView === 'profile') {
      setNewName(user.name);
      setNewEmail(user.email);
      setAvatarPreview(user.avatar);
      setDob(user.dob || '');
      setMobile(user.mobile || '');
      setAadhaar(user.aadhaar || '');
      setAddress(user.address || '');
    }
    setSuccessMessage(null);
  }, [user.id, activeView]);

  const refreshData = () => {
    const all = MockDb.getComplaints();
    setComplaints(all.filter(c => c.userId === user.id));
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const getChartData = () => {
    const data = [
      { name: 'Pending', value: complaints.filter(c => c.status === ComplaintStatus.PENDING).length, color: '#ef4444' },
      { name: 'In Progress', value: complaints.filter(c => c.status === ComplaintStatus.IN_PROGRESS).length, color: '#f59e0b' },
      { name: 'Resolved', value: complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length, color: '#10b981' }
    ].filter(d => d.value > 0);
    return data;
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (desc.length > 10 && !category) {
        setIsSuggesting(true);
        const suggested = await GeminiService.suggestCategory(desc);
        setCategory(suggested);
        setIsSuggesting(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [desc]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newComplaint: Complaint = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      userName: user.name,
      title,
      description: desc,
      category: category || 'General',
      status: ComplaintStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      image: previewUrl || undefined,
      voiceNote: audioUrl || undefined,
      logs: [{
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'Complaint Raised',
        byUser: user.name
      }]
    };
    MockDb.saveComplaint(newComplaint);
    refreshData();
    setLoading(false);
    showToast('Complaint Submitted Successfully!');
    setTitle(''); setDesc(''); setCategory(''); setPreviewUrl(null); setAudioUrl(null); setAudioBlob(null);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const updatedUser: User = { ...user, name: newName, email: newEmail, avatar: avatarPreview, dob, mobile, aadhaar, address };
      MockDb.saveUser(updatedUser);
      if (onProfileUpdate) onProfileUpdate();
      setLoading(false);
      showToast('Profile Updated Successfully!');
    }, 500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const SuccessToast = () => (
    <div className="fixed top-6 right-6 z-[60] animate-toast">
      <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
        <div className="bg-white/20 p-2 rounded-full animate-check"><CheckCircle2 size={24} /></div>
        <div>
          <p className="font-bold text-lg leading-none mb-1">Success!</p>
          <p className="text-emerald-50 text-sm opacity-90">{successMessage}</p>
        </div>
      </div>
    </div>
  );

  if (activeView === 'profile') {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-scale-in">
        {successMessage && <SuccessToast />}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center"><UserCircle className="mr-2 text-blue-600" /> My Account Details</h2>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase">Citizen Profile</span>
        </div>
        <form onSubmit={handleProfileSave} className="p-8 space-y-8">
          <div className="flex flex-col items-center mb-4">
            <div className="relative group cursor-pointer">
              <img src={avatarPreview} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-lg" />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Camera className="text-white" size={24} /><input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Full Name', value: newName, setter: setNewName, icon: UserCircle, type: 'text' },
              { label: 'Email Address', value: newEmail, setter: setNewEmail, icon: Mail, type: 'email' },
              { label: 'Date of Birth', value: dob, setter: setDob, icon: Calendar, type: 'date' },
              { label: 'Mobile Number', value: mobile, setter: setMobile, icon: Phone, type: 'tel' },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required={field.type !== 'date' && field.type !== 'tel'} />
                </div>
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Aadhaar Number</label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" value={aadhaar} maxLength={12} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="12-digit UID" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full font-bold py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex justify-center items-center">
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />} Save Changes
          </button>
        </form>
      </div>
    );
  }

  if (activeView === 'raise') {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-scale-in">
        {successMessage && <SuccessToast />}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Raise a New Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none" placeholder="Issue Title" />
          <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={4} className="w-full p-3 border border-slate-300 rounded-lg outline-none" placeholder="Describe the issue..." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg bg-white appearance-none">
                <option value="">Select Category</option>
                <option value="Roads">Roads</option><option value="Sanitation">Sanitation</option><option value="Water">Water</option><option value="Electricity">Electricity</option><option value="Safety">Safety</option><option value="Other">Other</option>
              </select>
              {isSuggesting && <div className="absolute right-3 top-3 text-[10px] text-blue-600">Suggesting...</div>}
            </div>
            <div className="relative border border-slate-300 rounded-lg p-2 bg-slate-50 flex items-center justify-center cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <span className="text-sm text-slate-500">Upload Photo</span>
            </div>
          </div>
          {previewUrl && <img src={previewUrl} className="h-20 rounded border" alt="preview" />}
          <div className="flex items-center gap-4">
            <button type="button" onClick={isRecording ? stopRecording : startRecording} className={`px-4 py-2 rounded-full flex items-center ${isRecording ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>
              <Mic size={18} className="mr-2" /> {isRecording ? 'Stop' : 'Voice'}
            </button>
            {audioUrl && <audio controls src={audioUrl} className="h-8" />}
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold">{loading ? 'Submitting...' : 'Submit Complaint'}</button>
        </form>
      </div>
    );
  }

  const chartData = getChartData();
  return (
    <div className="space-y-6 animate-fade-in">
      {successMessage && <SuccessToast />}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">My Dashboard</h2>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
          <Activity className="text-blue-500" size={20} />
          <p className="text-lg font-bold text-slate-800">{complaints.filter(c => c.status !== ComplaintStatus.RESOLVED).length} Active</p>
        </div>
      </div>
      {complaints.length === 0 ? (
         <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">No complaints yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {complaints.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 rounded">{c.status}</span>
                <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{c.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-2">{c.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
