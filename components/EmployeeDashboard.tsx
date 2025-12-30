
import React, { useState, useEffect } from 'react';
import { User, Complaint, ComplaintStatus } from '../types';
import { MockDb } from '../services/mockDb';
import { 
  CheckCircle, Clock, MapPin, MessageSquare, 
  Save, Calendar, LayoutList, CheckCircle2, ListFilter, Loader2, ListChecks, BarChart3, Activity
} from 'lucide-react';

interface Props {
  user: User;
  activeView: string;
  onProfileUpdate: () => void;
}

export const EmployeeDashboard: React.FC<Props> = ({ user, activeView, onProfileUpdate }) => {
  const [tasks, setTasks] = useState<Complaint[]>([]);
  const [selectedTask, setSelectedTask] = useState<Complaint | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    refreshTasks();
  }, [user.id, activeView]);

  const refreshTasks = () => {
    const all = MockDb.getComplaints();
    let myTasks = all.filter(c => c.assignedTo === user.id || (!c.assignedTo && c.category === user.department));
    if (activeView === 'completed') myTasks = myTasks.filter(c => c.status === ComplaintStatus.RESOLVED);
    else if (activeView === 'tasks') myTasks = myTasks.filter(c => c.status !== ComplaintStatus.RESOLVED);
    setTasks(myTasks);
    setSelectedTask(null);
  };

  const updateStatus = (status: ComplaintStatus) => {
    if (!selectedTask) return;
    setLoading(true);
    setTimeout(() => {
      const updated = { ...selectedTask, status, assignedTo: user.id };
      MockDb.saveComplaint(updated);
      MockDb.addLog(selectedTask.id, `Status updated to ${status}`, user.name, note);
      setSelectedTask(null); setNote(''); refreshTasks(); setLoading(false);
      setSuccessMessage('Updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 500);
  };

  if (activeView === 'overview') {
    const all = MockDb.getComplaints().filter(c => c.assignedTo === user.id || (c.category === user.department && !c.assignedTo));
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Workload Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-blue-50 p-6 rounded-xl border border-white shadow-sm">
             <p className="text-xs uppercase font-bold text-slate-400">Total Assigned</p>
             <p className="text-2xl font-black text-blue-600">{all.length}</p>
           </div>
           <div className="bg-emerald-50 p-6 rounded-xl border border-white shadow-sm">
             <p className="text-xs uppercase font-bold text-slate-400">Resolved</p>
             <p className="text-2xl font-black text-emerald-600">{all.filter(c => c.status === ComplaintStatus.RESOLVED).length}</p>
           </div>
           <div className="bg-yellow-50 p-6 rounded-xl border border-white shadow-sm">
             <p className="text-xs uppercase font-bold text-slate-400">Active</p>
             <p className="text-2xl font-black text-yellow-600">{all.filter(c => c.status !== ComplaintStatus.RESOLVED).length}</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-fade-in">
      <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b bg-slate-50 font-bold">Queue</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {tasks.map(task => (
            <div key={task.id} onClick={() => setSelectedTask(task)} className={`p-4 rounded-xl border cursor-pointer ${selectedTask?.id === task.id ? 'bg-indigo-50 border-indigo-400' : 'bg-white hover:border-indigo-200'}`}>
              <h4 className="text-sm font-bold truncate">{task.title}</h4>
              <p className="text-[10px] text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-y-auto p-8">
        {selectedTask ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-black">{selectedTask.title}</h2>
            <p className="text-slate-600 p-6 bg-slate-50 rounded-xl">{selectedTask.description}</p>
            <div className="bg-slate-900 text-white p-6 rounded-xl">
              <textarea className="w-full bg-white/10 p-4 rounded-lg mb-4" placeholder="Resolution notes..." value={note} onChange={e => setNote(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => updateStatus(ComplaintStatus.IN_PROGRESS)} className="px-4 py-2 bg-white/20 rounded-lg">WIP</button>
                <button onClick={() => updateStatus(ComplaintStatus.RESOLVED)} className="px-4 py-2 bg-indigo-500 rounded-lg">Resolve</button>
              </div>
            </div>
          </div>
        ) : <p className="text-center text-slate-400 py-20">Select an item.</p>}
      </div>
    </div>
  );
};
