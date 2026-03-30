import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../services/api';

export function TeamManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', fullName: '', role: 'cashier' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/users', formData);
      setSuccess('Staff member added successfully!');
      setFormData({ username: '', password: '', fullName: '', role: 'cashier' });
      setIsAdding(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Team Management</h2>
          </div>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] pl-4">Manage your POS staff and permissions</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Add Staff Member
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-12 bg-slate-50/50 rounded-3xl p-8 border border-slate-100 animate-in zoom-in-95 duration-300">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Add New Personnel</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest">Cancel</button>
           </div>

           <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                 <input
                   type="text"
                   required
                   value={formData.fullName}
                   onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                   placeholder="e.g. Maria Khan"
                   className="w-full bg-white border border-transparent focus:border-blue-600/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 shadow-sm outline-none"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                 <input
                   type="text"
                   required
                   value={formData.username}
                   onChange={(e) => setFormData({...formData, username: e.target.value})}
                   placeholder="maria_nex"
                   className="w-full bg-white border border-transparent focus:border-blue-600/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 shadow-sm outline-none"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                 <input
                   type="password"
                   required
                   value={formData.password}
                   onChange={(e) => setFormData({...formData, password: e.target.value})}
                   placeholder="Create password"
                   className="w-full bg-white border border-transparent focus:border-blue-600/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 shadow-sm outline-none"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                 <select
                   value={formData.role}
                   onChange={(e) => setFormData({...formData, role: e.target.value})}
                   className="w-full bg-white border border-transparent focus:border-blue-600/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 shadow-sm outline-none cursor-pointer"
                 >
                   <option value="cashier">Cashier</option>
                   <option value="admin">Administrator</option>
                 </select>
              </div>
              <div className="md:col-span-2 lg:col-span-4 mt-2">
                 {error && (
                   <div className="mb-4 flex items-center gap-2 text-red-600 text-[10px] font-black uppercase"><AlertCircle className="w-3" /> {error}</div>
                 )}
                 <button type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all">
                    Register Personnel
                 </button>
              </div>
           </form>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div key={u._id} className="group relative bg-slate-50/50 hover:bg-white p-6 rounded-3xl border border-transparent hover:border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50">
               <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-white ${u.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                        {u.role === 'admin' ? <Shield className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                     </div>
                     <div className="min-w-0">
                        <h4 className="text-sm font-black text-slate-900 truncate tracking-tight">{u.fullName}</h4>
                        <p className="text-[10px] font-bold text-slate-400">@{u.username}</p>
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                        {u.role}
                     </span>
                     {u.username !== 'admin' && (
                        <button 
                          onClick={() => handleDelete(u._id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     )}
                  </div>
               </div>
               
               <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold text-slate-300">
                  <div className="flex items-center gap-1 uppercase tracking-widest">
                     <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                     {u.status}
                  </div>
                  <span className="uppercase">NexFlow Staff ID: {u._id.slice(-6).toUpperCase()}</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
