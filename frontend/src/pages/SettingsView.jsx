import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useUser } from '../contexts/UserContext';
import { Save, Shield, Store, Phone, Mail, MapPin, Calculator, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsView() {
  const { settings, updateSettings, getSecureSettings } = useSettings();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    phone: '',
    email: '',
    currency: '',
    taxRate: 0,
    ownerPassword: ''
  });
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  // Auto-authorize admins
  useEffect(() => {
    const role = user?.role?.toLowerCase();
    const isSystemAdmin = ['admin', 'system admin'].includes(role);
    
    if (isSystemAdmin && !isAuthorized) {
       getSecureSettings('', user.role)
        .then(data => {
          setFormData(data);
          setIsAuthorized(true);
        })
        .catch(err => console.error("Auto-auth failed:", err));
    }
  }, [user, isAuthorized]);

  const handleAuthorize = async (e) => {
    e.preventDefault();
    try {
      const secureData = await getSecureSettings(currentPwd, user?.role);
      setFormData(secureData);
      setIsAuthorized(true);
      toast.success("Authorized successfully!");
    } catch (err) {
      toast.error(err.message || "Invalid password");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updates = { ...formData };
      if (newPwd) {
        if (newPwd !== confirmPwd) {
          toast.error("New passwords do not match");
          return;
        }
        updates.ownerPassword = newPwd;
      }
      
      await updateSettings(updates, currentPwd, user?.role);
      toast.success("Settings updated successfully!");
      setNewPwd('');
      setConfirmPwd('');
      // Refresh secure data if password changed
      if (newPwd) {
        setIsAuthorized(false);
        setCurrentPwd('');
      }
    } catch (err) {
      toast.error(err.message || "Failed to update settings");
    }
  };

  const role = user?.role?.toLowerCase();
  const isSystemAdmin = ['admin', 'system admin'].includes(role);

  if (!isAuthorized && !isSystemAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Owner Authorization</h2>
          <p className="text-slate-500 text-sm mt-2">Enter the owner password to access system settings.</p>
        </div>
        
        <form onSubmit={handleAuthorize} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
              <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg group-focus-within:text-blue-500 transition-colors">
                <Key className="w-4 h-4" />
              </div>
            </div>
            <input
              type={showPwd ? "text" : "password"}
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="block w-full pl-11 pr-12 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="Owner Password"
              required
              autoFocus
            />
            <button
               type="button"
               onClick={() => setShowPwd(!showPwd)}
               className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            Verify Password
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium">Configure your shop details and security policies.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shop Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Shop Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Shop Name</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500">
                     <Store className="w-4 h-4" />
                   </div>
                   <input
                    type="text"
                    value={formData.shopName}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="Enter Shop Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500">
                     <Mail className="w-4 h-4" />
                   </div>
                   <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="shop@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500">
                     <Phone className="w-4 h-4" />
                   </div>
                   <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Currency Symbol</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 font-bold">
                     {formData.currency || '$'}
                   </div>
                   <input
                    type="text"
                    maxLength={3}
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-center"
                    placeholder="$"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Physical Address</label>
                <div className="relative group">
                   <div className="absolute top-3 left-3 flex items-start pointer-events-none text-slate-300 group-focus-within:text-indigo-500">
                     <MapPin className="w-4 h-4" />
                   </div>
                   <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all font-medium resize-none"
                    placeholder="Enter complete shop address for receipts..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Finances & Taxes</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Default Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value)})}
                    className="block w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                    placeholder="0.00"
                  />
                </div>
            </div>
          </div>
        </div>

        {/* Security / Password */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white">
             <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-red-500/20 text-red-500 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Security</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Owner Access</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm text-slate-400 leading-relaxed italic">
                Change the master password used to authorize sensitive actions like price edits, stock adjustments, and sale deletions.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500 transition-colors focus:outline-none group/pass"
                    >
                      {showPwd ? (
                        <EyeOff className="w-4 h-4 group-hover/pass:scale-110 transition-transform" />
                      ) : (
                        <Eye className="w-4 h-4 group-hover/pass:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium pr-14"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500 transition-colors focus:outline-none group/pass"
                    >
                      {showPwd ? (
                        <EyeOff className="w-4 h-4 group-hover/pass:scale-110 transition-transform" />
                      ) : (
                        <Eye className="w-4 h-4 group-hover/pass:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                <p className="text-[10px] text-red-400 font-bold leading-tight">
                  <span className="text-red-500 uppercase block mb-1">Warning:</span>
                  Changing the owner password will invalidate any currently active authorization. You will need to re-log with the new password.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
