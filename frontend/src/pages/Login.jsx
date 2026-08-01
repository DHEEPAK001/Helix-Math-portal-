import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, User } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { login, setGuestMode } = useAuthStore();
  const [apiError, setApiError] = React.useState('');

  const onSubmit = async (data) => {
    try {
      setApiError('');
      const response = await axiosInstance.post('/auth/login', data);
      login({
        id: response.data.id,
        email: response.data.email,
        role: response.data.role
      }, response.data.token);
      navigate('/');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGuestLogin = () => {
    setGuestMode();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl mix-blend-screen opacity-50"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent mb-2">MathLMS</h1>
          <p className="text-slate-400">Welcome back! Ready to learn?</p>
        </div>

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label-text">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="input-field"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label-text">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="input-field"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500/50" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-accent hover:text-blue-400 transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center space-x-2 group"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="grid grid-cols-2 gap-4">
            <Link to="/signup" className="btn-secondary flex items-center justify-center space-x-2 text-sm">
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </Link>
            <button onClick={handleGuestLogin} className="btn-secondary flex items-center justify-center space-x-2 text-sm hover:border-primary-500/50 hover:text-primary-400">
              <User className="w-4 h-4" />
              <span>Guest Mode</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
