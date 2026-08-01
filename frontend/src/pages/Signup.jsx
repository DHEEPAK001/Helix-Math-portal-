import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setValue, trigger } = useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState('');
  const [teachers, setTeachers] = useState([]);

  const selectedRole = watch('role');

  React.useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get('/auth/teachers');
        setTeachers(response.data);
      } catch (error) {
        console.error('Failed to load teachers', error);
      }
    };
    fetchTeachers();
  }, []);

  const onNext = () => setStep(2);
  const onPrev = () => setStep(1);

  const onSubmit = async (data) => {
    try {
      setApiError('');
      // Transform grades array if student
      if (data.role === 'STUDENT' && data.grades) {
        data.gradesInterested = Array.isArray(data.grades) ? data.grades : [data.grades];
      }
      
      // Transform experience to number if teacher
      if (data.role === 'TEACHER' && data.experience) {
        data.experience = parseInt(data.experience, 10);
      }
      
      // Transform assignedTeacherId to number if student
      if (data.role === 'STUDENT' && data.assignedTeacherId) {
        data.assignedTeacherId = parseInt(data.assignedTeacherId, 10);
      } else {
        delete data.assignedTeacherId; // Remove if empty string
      }
      await axiosInstance.post('/auth/signup', data);
      navigate('/login');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join the next-generation Math LMS</p>
        </div>

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {apiError}
          </div>
        )}

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-slate-700 text-slate-400'}`}>1</div>
            <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-slate-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-slate-700 text-slate-400'}`}>2</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-all ${selectedRole === 'STUDENT' ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'}`}>
                    <input type="radio" value="STUDENT" {...register('role', { required: 'Please select a role' })} className="hidden" />
                    <GraduationCap className={`w-8 h-8 ${selectedRole === 'STUDENT' ? 'text-primary-400' : 'text-slate-400'}`} />
                    <span className="font-medium text-white">Student</span>
                  </label>
                  <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-all ${selectedRole === 'TEACHER' ? 'border-accent bg-accent/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'}`}>
                    <input type="radio" value="TEACHER" {...register('role', { required: 'Please select a role' })} className="hidden" />
                    <BookOpen className={`w-8 h-8 ${selectedRole === 'TEACHER' ? 'text-accent' : 'text-slate-400'}`} />
                    <span className="font-medium text-white">Teacher</span>
                  </label>
                </div>
                {errors.role && <p className="text-red-400 text-sm text-center -mt-4 mb-4">{errors.role.message}</p>}

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="label-text">Full Name</label>
                    <input type="text" {...register('name', { required: 'Name is required' })} className="input-field" placeholder="John Doe" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label-text">Email</label>
                    <input type="email" {...register('email', { required: 'Email is required' })} className="input-field" placeholder="john@example.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label-text">Password</label>
                  <input type="password" {...register('password', { required: 'Password is required' })} className="input-field" placeholder="Create a strong password" />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div className="flex justify-end pt-4">
                  <button type="button" onClick={async () => {
                    // Trigger validation for step 1
                    const isOk = await trigger(['role', 'name', 'email', 'password']);
                    if (isOk) {
                        onNext();
                    }
                  }} className="btn-primary flex items-center space-x-2">
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Institution Name</label>
                    <input type="text" {...register('institutionName', { required: 'Required' })} className="input-field" />
                  </div>
                  <div>
                    <label className="label-text">Location</label>
                    <input type="text" {...register('location', { required: 'Required' })} className="input-field" />
                  </div>
                </div>

                {selectedRole === 'STUDENT' && (
                  <div className="animate-fade-in space-y-4">
                    <label className="label-text">Grades Interested In</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['1','2','3','4','5','6','7','8','9','10','11','12','Engineering Mathematics'].map((g) => (
                        <label key={g} className="flex items-center space-x-2 text-sm text-slate-300">
                           <input type="checkbox" value={g} {...register('grades')} className="rounded border-slate-700 bg-slate-800 text-primary-500" />
                           <span className={g === 'Engineering Mathematics' ? 'text-xs' : ''}>{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedRole === 'STUDENT' && (
                  <div className="animate-fade-in space-y-4">
                     <label className="label-text">Select Faculty (Optional)</label>
                     <select {...register('assignedTeacherId')} className="input-field appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_1rem_center]">
                       <option value="">-- No Faculty --</option>
                       {teachers.map(t => (
                         <option key={t.id} value={t.id}>{t.name} ({t.expertise.replace('_', ' ')})</option>
                       ))}
                     </select>
                  </div>
                )}

                {selectedRole === 'TEACHER' && (
                  <div className="animate-fade-in space-y-4">
                     <div>
                        <label className="label-text">Expertise</label>
                        <select {...register('expertise')} className="input-field appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_1rem_center]">
                          <option value="PRIMARY">Primary (Grades 1-5)</option>
                          <option value="SECONDARY">Secondary (Grades 6-10)</option>
                          <option value="HIGHER_SECONDARY">Higher Secondary (Grades 11-12)</option>
                          <option value="ENGINEERING">Engineering Mathematics</option>
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="label-text">Bio</label>
                          <textarea {...register('bio')} className="input-field min-h-[100px]"></textarea>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="label-text">Years of Experience</label>
                          <input type="number" {...register('experience')} className="input-field" min="0" />
                        </div>
                     </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button type="button" onClick={onPrev} className="btn-secondary flex items-center space-x-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 ml-1">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
