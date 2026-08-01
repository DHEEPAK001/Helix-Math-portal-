import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, UserCheck, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import useAuthStore from '../store/authStore';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    } else if (activeTab === 'approvals') {
      fetchPendingTeachers();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/admin/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPendingTeachers = async () => {
    try {
      const res = await axiosInstance.get('/admin/teachers/pending');
      setPendingTeachers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/admin/teachers/${id}/approve`);
      fetchPendingTeachers();
      fetchStats();
    } catch(e) {
      alert('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    if(window.confirm('Are you sure you want to reject this application?')) {
      try {
        await axiosInstance.put(`/admin/teachers/${id}/reject`);
        fetchPendingTeachers();
      } catch(e) {
        alert('Failed to reject');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="glass-panel p-6 mb-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
             <div className="flex items-center space-x-2 mb-2">
                <ShieldAlert className="text-red-500 w-5 h-5" />
                <h2 className="text-xl font-bold text-white">Admin Center</h2>
             </div>
             <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
          <nav className="flex flex-col space-y-2">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard />} label="Overview" />
            <TabButton 
              active={activeTab === 'approvals'} 
              onClick={() => setActiveTab('approvals')} 
              icon={<UserCheck />} 
              label="Teacher Approvals" 
              badge={stats?.pendingApprovals > 0 ? stats.pendingApprovals : null}
            />
            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users />} label="User Management" />
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel p-6 sm:p-8 min-h-[600px]">
          <AnimatePresence mode="wait">
            
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
                
                {stats ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <StatCard title="Total Users" value={stats.totalUsers} color="text-primary-400" />
                      <StatCard title="Total Students" value={stats.totalStudents} color="text-accent" />
                      <StatCard title="Total Teachers" value={stats.totalTeachers} color="text-purple-400" />
                      <StatCard title="Pending Approvals" value={stats.pendingApprovals} color="text-yellow-400" />
                      <StatCard title="Question Bank Size" value={stats.totalQuestions} color="text-green-400" />
                      <StatCard title="Assessments Created" value={stats.totalAssessments} color="text-pink-400" />
                   </div>
                ) : (
                   <div className="text-slate-400 animate-pulse">Loading analytics...</div>
                )}
              </motion.div>
            )}

            {activeTab === 'approvals' && (
              <motion.div key="approvals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-white">Pending Teacher Approvals</h2>
                </div>
                
                <div className="space-y-4">
                   {pendingTeachers.length === 0 ? (
                     <div className="text-slate-400 text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700/50">
                        No pending approvals. You're all caught up!
                     </div>
                   ) : pendingTeachers.map(profile => (
                     <div key={profile.id} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div>
                         <h3 className="text-white font-bold text-lg">{profile.name} <span className="text-sm font-normal text-slate-400">({profile.user.email})</span></h3>
                         <div className="text-sm text-slate-300 mt-1">
                            <span className="text-primary-400">Institution:</span> {profile.institutionName} ({profile.institutionType})
                         </div>
                         <div className="text-sm text-slate-300">
                            <span className="text-accent">Expertise:</span> {profile.expertise} • {profile.experience} years exp.
                         </div>
                         <p className="text-sm text-slate-400 italic mt-2">"{profile.bio}"</p>
                       </div>
                       <div className="flex space-x-3">
                          <button onClick={() => handleApprove(profile.id)} className="btn-primary flex items-center space-x-2 bg-green-600 hover:bg-green-500 shadow-green-500/20">
                             <CheckCircle className="w-4 h-4" />
                             <span>Approve</span>
                          </button>
                          <button onClick={() => handleReject(profile.id)} className="btn-secondary flex items-center space-x-2 text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
                             <XCircle className="w-4 h-4" />
                             <span>Reject</span>
                          </button>
                       </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-white">User Management</h2>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800 border-b border-slate-700">
                        <th className="p-4 text-slate-300 font-medium">ID</th>
                        <th className="p-4 text-slate-300 font-medium">Email</th>
                        <th className="p-4 text-slate-300 font-medium">Role</th>
                        <th className="p-4 text-slate-300 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td colSpan="4" className="p-8 text-center text-slate-400 animate-pulse">Loading users...</td></tr>
                      ) : users.map((u) => (
                        <tr key={u.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 text-slate-400">#{u.id}</td>
                          <td className="p-4 text-white font-medium">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                               u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                               u.role === 'TEACHER' ? 'bg-purple-500/20 text-purple-400' :
                               'bg-primary-500/20 text-primary-400'
                            }`}>
                               {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${
                               u.accountStatus === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                               u.accountStatus === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                               'bg-slate-500/20 text-slate-400'
                             }`}>
                                {u.accountStatus}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, icon, label, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
      active 
      ? 'bg-slate-800 text-white border border-slate-600' 
      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    <div className="flex items-center space-x-3">
       <div className={`${active ? 'scale-110 text-primary-400' : ''} transition-all`}>{icon}</div>
       <span className="font-medium">{label}</span>
    </div>
    {badge && (
       <div className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {badge}
       </div>
    )}
  </button>
);

const StatCard = ({ title, value, color }) => (
   <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center">
      <h4 className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">{title}</h4>
      <div className={`text-4xl font-extrabold ${color}`}>{value}</div>
   </div>
);

export default AdminDashboard;
