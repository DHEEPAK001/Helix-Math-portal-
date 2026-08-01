import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import useAuthStore from '../store/authStore';
import { Clock, Flag, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const MOCK_QUESTIONS = Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    questionText: `Sample Question ${i + 1}: What is the solution to the equation?`,
    option1: 'Option A',
    option2: 'Option B',
    option3: 'Option C',
    option4: 'Option D'
}));

const QuizSession = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 mins
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isGuest } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const config = JSON.parse(localStorage.getItem('quizConfig'));
    const assessmentId = localStorage.getItem('assessmentId');
    
    if (!config && !assessmentId) {
      navigate('/quiz');
      return;
    }

    const fetchQuestions = async () => {
      try {
        if (assessmentId) {
          const response = await axiosInstance.get(`/student/assessments/${assessmentId}/questions`);
          setQuestions(response.data.length > 0 ? response.data : MOCK_QUESTIONS);
        } else {
          const response = await axiosInstance.get(`/quiz/questions?grade=${config.grade}&topic=${config.topic}&difficulty=${config.difficulty}`);
          setQuestions(response.data.length > 0 ? response.data : MOCK_QUESTIONS);
        }
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setQuestions(MOCK_QUESTIONS); // Fallback for UI testing
      }
    };
    fetchQuestions();
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [questions]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (optIndex) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: optIndex });
  };

  const toggleFlag = () => {
    setFlags({ ...flags, [questions[currentIndex].id]: !flags[questions[currentIndex].id] });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const config = JSON.parse(localStorage.getItem('quizConfig'));
    const assessmentId = localStorage.getItem('assessmentId');
    
    // Calculate time taken (mocked avg for now)
    const formattedAnswers = questions.map(q => ({
      questionId: q.id,
      selectedOption: answers[q.id] || null,
      timeTaken: 10 
    }));

    if (isGuest) {
      // Mock result for guest
      localStorage.setItem('quizResult', JSON.stringify({
         score: 8,
         accuracy: 80,
         correctAnswers: 8,
         wrongAnswers: 2,
         averageTime: 10,
         difficulty: config?.difficulty || 'N/A',
         topic: config?.topic || 'Assessment',
         aiSummary: "You did well! However, detailed AI feedback requires a registered account."
      }));
      navigate('/quiz/result');
      return;
    }

    try {
      if (assessmentId) {
        // Mocking submit for assessment since we don't have a submit assessment endpoint yet
        // In a real scenario, this would hit an endpoint to mark the AssessmentStudent as complete
        localStorage.setItem('quizResult', JSON.stringify({
           score: 10,
           accuracy: 100,
           correctAnswers: questions.length,
           wrongAnswers: 0,
           averageTime: 10,
           difficulty: 'N/A',
           topic: 'Assigned Assessment',
           aiSummary: "You have completed your assigned assessment."
        }));
      } else {
        const payload = {
          grade: config.grade,
          topic: config.topic,
          difficulty: config.difficulty,
          answers: formattedAnswers
        };
        const response = await axiosInstance.post('/quiz/submit', payload);
        localStorage.setItem('quizResult', JSON.stringify(response.data));
      }
      navigate('/quiz/result');
    } catch (error) {
      console.error('Submit error', error);
      alert('Error submitting quiz.');
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="bg-surface border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Assessment Session</h1>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono font-bold ${timeRemaining < 300 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-white'}`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Submitting...' : 'Finish Test'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
        
        {/* Question Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-8 min-h-[400px] flex flex-col">
            
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-700">
              <span className="text-slate-400 font-medium">Question {currentIndex + 1} of {questions.length}</span>
              <button 
                onClick={toggleFlag}
                className={`p-2 rounded-lg transition-colors flex items-center space-x-1 ${flags[currentQ.id] ? 'bg-yellow-500/20 text-yellow-500' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Flag className="w-4 h-4" />
                <span className="text-sm font-medium">{flags[currentQ.id] ? 'Flagged' : 'Flag for review'}</span>
              </button>
            </div>

            <div className="flex-1">
              <h2 className="text-xl text-white mb-8 leading-relaxed">
                {currentQ.questionText}
              </h2>
              
              <div className="space-y-4">
                {[1, 2, 3, 4].map(optIndex => {
                  const optText = currentQ[`option${optIndex}`];
                  const isSelected = answers[currentQ.id] === optIndex;
                  return (
                    <div 
                      key={optIndex}
                      onClick={() => handleSelectOption(optIndex)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-4 ${
                        isSelected 
                        ? 'border-accent bg-accent/10' 
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-accent' : 'border-slate-500'
                      }`}>
                         {isSelected && <div className="w-3 h-3 bg-accent rounded-full"></div>}
                      </div>
                      <span className="text-slate-200">{optText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
               <button 
                 onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                 disabled={currentIndex === 0}
                 className="btn-secondary flex items-center space-x-2"
               >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
               </button>
               <button 
                 onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                 disabled={currentIndex === questions.length - 1}
                 className="btn-primary flex items-center space-x-2"
               >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="hidden lg:block">
           <div className="glass-panel p-6 sticky top-24">
              <h3 className="text-white font-bold mb-4">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2">
                 {questions.map((q, idx) => {
                   const isAnswered = answers[q.id] !== undefined;
                   const isFlagged = flags[q.id];
                   const isCurrent = currentIndex === idx;
                   
                   let bg = 'bg-slate-800 border-slate-700'; // Unanswered
                   if (isAnswered) bg = 'bg-primary-600 border-primary-500';
                   if (isFlagged) bg = 'bg-yellow-500/20 border-yellow-500 text-yellow-500';
                   if (isCurrent) bg = 'bg-accent border-accent'; // Override if current

                   return (
                     <button
                       key={q.id}
                       onClick={() => setCurrentIndex(idx)}
                       className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-bold text-white transition-all ${bg}`}
                     >
                       {idx + 1}
                     </button>
                   );
                 })}
              </div>
              <div className="mt-8 space-y-3 text-xs text-slate-400">
                 <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-primary-600 rounded-sm"></div><span>Answered</span></div>
                 <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500 rounded-sm"></div><span>Flagged</span></div>
                 <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-slate-800 rounded-sm"></div><span>Unanswered</span></div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default QuizSession;
