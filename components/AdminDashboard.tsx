
import React, { useEffect, useState } from 'react';
import { User, Complaint, ComplaintStatus, Role } from '../types';
import { MockDb } from '../services/mockDb';
import { GeminiService } from '../services/gemini.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Users, FileText, CheckCircle, Clock, Search, ShieldAlert, Activity } from 'lucide-react';

interface Props {
  activeView?: string;
  onTabChange?: (tab: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ activeView = 'overview', onTabChange }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    refreshData();
  }, [activeView]);

  const refreshData = () => {
    setComplaints(MockDb.getComplaints());
    setUsers(MockDb.getUsers());
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    const report = await GeminiService.generateAdminReport(complaints);
    setAiReport(report);
    setGeneratingReport(false);
  };

  if (activeView === 'users' || activeView === 'complaints' || activeView === 'workload') {
    return <div className="p-20 text-center font-bold text-slate-400">Section details reverted to standard view.</div>;
  }

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length,
    pending: complaints.filter(c => c.status === ComplaintStatus.PENDING).length
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total', val: stats.total, color: 'text-blue-600', icon: FileText },
          { label: 'Resolved', val: stats.resolved, color: 'text-green-600', icon: CheckCircle },
          { label: 'Pending', val: stats.pending, color: 'text-red-600', icon: Clock }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div><p className="text-sm text-slate-500">{item.label}</p><h3 className={`text-3xl font-bold ${item.color}`}>{item.val}</h3></div>
            <item.icon size={24} className={item.color} />
          </div>
        ))}
      </div>

      <div className="bg-blue-900 text-white p-8 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center"><Sparkles className="mr-2" /> Executive AI Summary</h2>
          <button onClick={generateReport} disabled={generatingReport} className="px-4 py-2 bg-white/10 rounded-lg">{generatingReport ? 'Analyzing...' : 'Generate'}</button>
        </div>
        {aiReport ? <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: aiReport }} /> : <p>Click generate for insights.</p>}
      </div>
    </div>
  );
};
