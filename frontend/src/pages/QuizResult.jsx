import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, XCircle, CheckCircle2, ChevronRight, PlayCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const QuizResult = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('quizResult');
    if (data) {
      setResult(JSON.parse(data));
    } else {
      navigate('/quiz');
    }
  }, [navigate]);

  if (!result) return <div className="min-h-screen bg-background text-white p-8">Loading Results...</div>;

  const chartData = [
    { name: 'Correct', value: result.correctAnswers, color: '#22c55e' },
    { name: 'Wrong', value: result.wrongAnswers, color: '#ef4444' },
    { name: 'Skipped', value: result.totalQuestions - (result.correctAnswers + result.wrongAnswers), color: '#64748b' }
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/30"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white">Assessment Complete!</h1>
          <p className="text-slate-400 text-lg">Here is how you performed on {result.topic} ({result.difficulty})</p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <StatCard icon={<Target className="text-accent" />} label="Score" value={`${result.score}/${result.totalQuestions}`} />
           <StatCard icon={<CheckCircle2 className="text-green-500" />} label="Accuracy" value={`${result.accuracy}%`} />
           <StatCard icon={<Clock className="text-purple-400" />} label="Avg. Time/Q" value={`${result.averageTime}s`} />
           <StatCard icon={<XCircle className="text-red-500" />} label="Wrong" value={result.wrongAnswers} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Chart Section */}
          <div className="glass-panel p-6 flex flex-col items-center">
             <h3 className="text-xl font-bold text-white mb-6">Performance Breakdown</h3>
             <div className="w-full h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={chartData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={90}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                     itemStyle={{ color: '#fff' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="flex justify-center space-x-6 w-full">
                {chartData.map(d => (
                  <div key={d.name} className="flex items-center space-x-2 text-sm text-slate-300">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span>{d.name} ({d.value})</span>
                  </div>
                ))}
             </div>
          </div>

          {/* AI Summary & Recommendations */}
          <div className="space-y-6">
            <div className="glass-panel p-6 bg-gradient-to-br from-primary-900/40 to-slate-900 border-primary-500/30">
               <h3 className="text-xl font-bold text-primary-400 mb-3 flex items-center space-x-2">
                 <SparklesIcon className="w-5 h-5" />
                 <span>AI Analysis</span>
               </h3>
               <p className="text-slate-300 leading-relaxed text-sm">
                 {result.aiSummary}
               </p>
            </div>

            <div className="glass-panel p-6">
               <h3 className="text-lg font-bold text-white mb-4">Recommended for You</h3>
               <div className="space-y-3">
                 <button onClick={() => navigate('/learn')} className="w-full p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 border border-slate-700 flex items-center justify-between group transition-colors">
                    <div className="flex items-center space-x-3">
                      <PlayCircle className="w-5 h-5 text-accent" />
                      <span className="text-slate-300 font-medium text-sm">Review {result.topic} Concepts</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                 </button>
                 <button onClick={() => navigate('/quiz')} className="w-full p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 border border-slate-700 flex items-center justify-between group transition-colors">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-purple-400" />
                      <span className="text-slate-300 font-medium text-sm">Try Another Quiz</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                 </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass-panel p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform">
    <div className="mb-3">{icon}</div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</div>
  </div>
);

// Simple sparkles icon component 
const SparklesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.5 1.5c-1.5 4.805-3.883 9.305-7.584 12.185a23.507 23.507 0 01-10.72 5.04c-.6.059-1.077-.45-1.01-1.05.512-4.57 2.21-8.794 5.129-12.09z" clipRule="evenodd" />
  </svg>
)

export default QuizResult;
