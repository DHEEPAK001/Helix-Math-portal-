import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Play } from 'lucide-react';

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Engineering Mathematics'];
const TOPICS = {
  '1': ['Addition', 'Subtraction', 'Counting'],
  '5': ['Fractions', 'Decimals', 'Basic Geometry'],
  '10': ['Algebra', 'Trigonometry', 'Statistics'],
  'Engineering Mathematics': ['Calculus', 'Linear Algebra', 'Differential Equations']
};
const DEFAULT_TOPICS = ['Algebra', 'Geometry', 'Arithmetic'];

const QuizConfig = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('MODERATE');
  const [activeTab, setActiveTab] = useState('practice');
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  const currentTopics = TOPICS[selectedGrade] || DEFAULT_TOPICS;

  React.useEffect(() => {
    if (activeTab === 'assigned') {
      import('../utils/axiosInstance').then(({ default: axiosInstance }) => {
        axiosInstance.get('/student/assessments')
          .then(res => setAssessments(res.data))
          .catch(err => console.error('Failed to fetch assessments', err));
      });
    }
  }, [activeTab]);

  const handleStart = () => {
    if (selectedGrade && selectedTopic) {
      localStorage.setItem('quizConfig', JSON.stringify({
        grade: selectedGrade,
        topic: selectedTopic,
        difficulty: selectedDifficulty
      }));
      localStorage.removeItem('assessmentId'); // Ensure it's a practice quiz
      navigate('/quiz/session');
    }
  };

  const handleStartAssessment = (assessmentId) => {
    localStorage.setItem('assessmentId', assessmentId);
    navigate('/quiz/session');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 w-full max-w-xl"
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Quiz Configuration</h1>
            <p className="text-slate-400 text-sm">Setup your practice environment</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setActiveTab('practice')} 
            className={`flex-1 py-2 rounded-lg font-bold transition-colors ${activeTab === 'practice' ? 'bg-accent text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Practice Mode
          </button>
          <button 
            onClick={() => setActiveTab('assigned')} 
            className={`flex-1 py-2 rounded-lg font-bold transition-colors ${activeTab === 'assigned' ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Assigned Assessments
          </button>
        </div>

        {activeTab === 'practice' ? (
        <div className="space-y-6">
          <div>
            <label className="label-text">Select Grade</label>
            <select 
              className="input-field" 
              value={selectedGrade} 
              onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setSelectedTopic('');
              }}
            >
              <option value="">-- Choose Grade --</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          
          <div>
            <label className="label-text">Select Topic</label>
            <select 
              className="input-field" 
              value={selectedTopic} 
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedGrade}
            >
              <option value="">-- Choose Topic --</option>
              {currentTopics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="label-text">Difficulty Level</label>
            <div className="flex rounded-xl overflow-hidden border border-slate-700 h-[50px]">
              {['EASY', 'MODERATE', 'HARD'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`flex-1 text-sm font-medium transition-colors ${
                    selectedDifficulty === level 
                      ? 'bg-accent text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
             <button 
                onClick={handleStart}
                disabled={!selectedGrade || !selectedTopic}
                className="btn-primary w-full flex items-center justify-center space-x-2"
             >
                <Play className="w-5 h-5" />
                <span>Start Assessment</span>
             </button>
          </div>
        </div>
        ) : (
          <div className="space-y-4">
            {assessments.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                You have no assigned assessments at the moment.
              </div>
            ) : (
              assessments.map(a => (
                <div key={a.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white">{a.title}</h3>
                    <p className="text-sm text-slate-400 mb-2">{a.description}</p>
                    <div className="text-xs text-slate-500">
                      Due: {a.deadline ? new Date(a.deadline).toLocaleString() : 'No deadline'}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartAssessment(a.id)}
                    className="btn-primary py-2 px-4 whitespace-nowrap"
                  >
                    Start
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizConfig;
