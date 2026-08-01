import React from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, User, Trophy, BarChart3, Settings } from 'lucide-react';

const Home = () => {
  const { user, isGuest, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardContent = () => {
    if (isGuest) {
      return (
        <div className="glass-panel p-8 text-center animate-fade-in">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Welcome, Guest Explorer!</h2>
          <p className="text-slate-300 mb-6 max-w-lg mx-auto">
            You can browse learning resources and take practice quizzes. However, your progress will not be saved permanently, and full AI feedback is restricted.
          </p>
          <button onClick={() => navigate('/signup')} className="btn-primary">
            Create an Account to Unlock Full Features
          </button>
        </div>
      );
    }

    switch (user?.role) {
      case 'STUDENT':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <DashboardCard onClick={() => navigate('/learn')} title="My Learning" icon={<BookOpen />} desc="Continue your math journey" color="bg-primary-500" />
            <DashboardCard onClick={() => navigate('/quiz')} title="Quizzes & Assessments" icon={<BarChart3 />} desc="Test your knowledge" color="bg-accent" />
            <DashboardCard title="Achievements" icon={<Trophy />} desc="View your earned badges" color="bg-yellow-500" />
          </div>
        );
      case 'TEACHER':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <DashboardCard onClick={() => navigate('/teacher')} title="Manage Students" icon={<User />} desc="View student progress" color="bg-primary-500" />
            <DashboardCard onClick={() => navigate('/teacher')} title="Question Bank" icon={<BookOpen />} desc="Create and edit questions" color="bg-accent" />
            <DashboardCard onClick={() => navigate('/teacher')} title="Analytics" icon={<BarChart3 />} desc="Class performance reports" color="bg-purple-500" />
          </div>
        );
      case 'ADMIN':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <DashboardCard onClick={() => navigate('/admin')} title="Approve Teachers" icon={<User />} desc="Pending approvals" color="bg-primary-500" />
            <DashboardCard onClick={() => navigate('/admin')} title="Platform Analytics" icon={<BarChart3 />} desc="Global usage stats" color="bg-accent" />
            <DashboardCard onClick={() => navigate('/admin')} title="Settings" icon={<Settings />} desc="System configurations" color="bg-slate-500" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-surface border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent">
                MathLMS
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-300">
                {isGuest ? 'Guest Mode' : user?.email}
              </span>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Here is what's happening with your learning today.</p>
        </div>
        
        {getDashboardContent()}
      </main>
    </div>
  );
};

const DashboardCard = ({ title, icon, desc, color, onClick }) => (
  <div onClick={onClick} className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${color} shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{desc}</p>
  </div>
);

export default Home;
