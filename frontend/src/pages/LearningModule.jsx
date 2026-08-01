import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, FileText, Target, Filter, Gamepad2, Sparkles, BookOpen } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Engineering Mathematics'];
const TOPICS = {
  '1': ['Addition', 'Subtraction', 'Counting'],
  '5': ['Fractions', 'Decimals', 'Basic Geometry'],
  '10': ['Algebra', 'Trigonometry', 'Statistics'],
  'Engineering Mathematics': ['Calculus', 'Linear Algebra', 'Differential Equations']
};
// Fallback topics for grades without specific mapping
const DEFAULT_TOPICS = ['Algebra', 'Geometry', 'Arithmetic'];

const LearningModule = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('EASY');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentTopics = TOPICS[selectedGrade] || DEFAULT_TOPICS;

  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedGrade || !selectedTopic) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/learning-resources?grade=${selectedGrade}&topic=${selectedTopic}`);
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [selectedGrade, selectedTopic]);

  const isJuniorGrade = ['1', '2', '3', '4', '5'].includes(selectedGrade);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent">
            Learning Hub
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore interactive lessons, watch tutorials, and practice to master mathematics at your own pace.
          </p>
        </div>

        {/* Filters Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center space-x-2 mb-6 text-white border-b border-slate-700 pb-4">
            <Filter className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Customize Your Path</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label-text">Select Grade</label>
              <select 
                className="input-field" 
                value={selectedGrade} 
                onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    setSelectedTopic(''); // reset topic when grade changes
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
          </div>
        </motion.div>

        {/* Content Area */}
        {selectedGrade && selectedTopic ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Learning Content (Video) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Play className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-bold text-white">Video Tutorial</h3>
                </div>
                <div className="aspect-video bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
                  <Play className="w-16 h-16 text-white/50 group-hover:text-white group-hover:scale-110 transition-all z-20 cursor-pointer drop-shadow-xl" />
                  <img 
                    src={`https://images.unsplash.com/photo-1632559646296-6d6f1a8e1e79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                    alt="Math Tutorial" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                     <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded font-medium">Concept Explained</span>
                     <h4 className="text-white font-bold mt-2 text-lg">Understanding {selectedTopic}</h4>
                  </div>
                </div>
              </div>

              {/* Dynamic Documentation / Games */}
              <div className="glass-panel p-6 border-l-4 border-l-accent">
                {isJuniorGrade ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <Sparkles className="w-6 h-6" />
                      <h3 className="text-lg font-bold text-white">Interactive Fun!</h3>
                    </div>
                    <p className="text-slate-300">Learn {selectedTopic} with our colorful interactive games and animations.</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                       <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
                          <Gamepad2 className="w-12 h-12 text-green-400 mb-2" />
                          <span className="text-white font-medium">Play Game</span>
                       </div>
                       <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
                          <Sparkles className="w-12 h-12 text-pink-400 mb-2" />
                          <span className="text-white font-medium">Watch Animation</span>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-accent">
                      <FileText className="w-6 h-6" />
                      <h3 className="text-lg font-bold text-white">Theory & Examples</h3>
                    </div>
                    <p className="text-slate-300">Dive deep into the mathematical proofs and detailed documentation for {selectedTopic}.</p>
                    <div className="bg-slate-800 p-4 rounded-xl font-mono text-sm text-slate-300">
                       {/* Mock documentation */}
                       <span className="text-purple-400">Definition:</span><br/>
                       Let A and B be mathematical objects...<br/><br/>
                       <span className="text-green-400">Example 1:</span><br/>
                       Solve for x: 2x + {selectedDifficulty === 'EASY' ? '5 = 15' : selectedDifficulty === 'MODERATE' ? '3x - 4 = 16' : 'x^2 = 25'}
                    </div>
                    <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                       <BookOpen className="w-4 h-4"/>
                       <span>Read Full Documentation</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar (Practice Section) */}
            <div className="space-y-6">
              <div className="glass-panel p-6 bg-gradient-to-br from-primary-900/40 to-slate-900 border-primary-500/30">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-bold text-white">Ready to Practice?</h3>
                </div>
                <p className="text-slate-300 mb-6 text-sm">
                  Test your understanding of {selectedTopic} at the {selectedDifficulty} level. AI will analyze your performance.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Questions:</span>
                    <span className="text-white font-medium">10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Estimated Time:</span>
                    <span className="text-white font-medium">15 mins</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/quiz')}
                  className="btn-primary w-full mt-6 shadow-primary-500/20"
                >
                  Start Practice Quiz
                </button>
              </div>

              {/* Resources List */}
              <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-white mb-4">Additional Resources</h3>
                {loading ? (
                   <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                   </div>
                ) : resources.length > 0 ? (
                  <ul className="space-y-3">
                    {resources.map(res => (
                      <li key={res.id} className="flex items-start space-x-3 text-sm">
                        <FileText className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <a href={res.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors">
                          {res.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic">No external resources found.</p>
                )}
              </div>
            </div>
            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 animate-pulse">
            <Filter className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">Select a Grade and Topic to view learning materials.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningModule;
