import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { UserPlus, ShieldCheck, User as UserIcon, Edit2, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function TeamView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user: currentUser } = useUser();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    role: 'cashier',
    status: 'active'
  });

  const fetchUsers = async () => {
    try {
      const data = await getUsers(currentUser?.role);
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    setShowPassword(false);
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        fullName: user.fullName,
        password: '', // Leave empty unless changing
        role: user.role,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        fullName: '',
        password: '',
        role: 'cashier',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser._id, formData, currentUser?.role);
        toast.success("Team member updated!");
      } else {
        await createUser(formData, currentUser?.role);
        toast.success("Team member added!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) return;
    try {
      await deleteUser(userId, currentUser?.role);
      toast.success("Member removed");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Management</h1>
          <p className="text-slate-500 font-medium">Manage staff accounts and access levels.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div key={u._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                  {u.role === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                </div>
                <div className="flex gap-1 transition-opacity">
                  <button onClick={() => handleOpenModal(u, true)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleOpenModal(u)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(u._id)} 
                    disabled={u._id === currentUser?.id}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-800">{u.fullName}</h3>
                <p className="text-sm font-bold text-slate-400">@{u.username}</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                  {u.role}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {u.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-slate-900 p-8 text-white relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black mb-1">
                {isViewMode ? "Member Profile" : editingUser ? "Edit Profile" : "New Team Member"}
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                {isViewMode ? "View staff account details." : "Give your staff access to NexFlow."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <input
                    type="text"
                    required
                    disabled={isViewMode}
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="block w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-60"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Username</label>
                  <input
                    type="text"
                    required
                    disabled={isViewMode}
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="block w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-60"
                    placeholder="johndoe"
                  />
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingUser && !isViewMode}
                      disabled={isViewMode}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="block w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-60 pr-14"
                      placeholder={isViewMode ? "••••••••" : editingUser ? "••••••••" : "Admin only"}
                    />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors focus:outline-none group/pass"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 group-hover/pass:scale-110 transition-transform" />
                        ) : (
                          <Eye className="w-4 h-4 group-hover/pass:scale-110 transition-transform" />
                        )}
                      </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role</label>
                  <select
                    disabled={isViewMode}
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="block w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-60"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
                  <select
                    disabled={isViewMode}
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="block w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-60"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {!isViewMode && (
                <button
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                  {editingUser ? "Update Profile" : "Create Account"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
