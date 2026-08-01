import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, FileText, BarChart3, Plus, Edit2, Trash2, Settings, X } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import useAuthStore from '../store/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  
  // Assessment Creation State
  const [isCreateAssessmentOpen, setIsCreateAssessmentOpen] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(1);
  const [assessmentForm, setAssessmentForm] = useState({
    title: '', description: '', 
    availableFromDate: '', availableFromHour: '12', availableFromMinute: '00', availableFromAmPm: 'AM',
    deadlineDate: '', deadlineHour: '11', deadlineMinute: '59', deadlineAmPm: 'PM',
    grade: '1', topic: '', difficulty: 'EASY', limit: 10
  });
  const [availableTopics, setAvailableTopics] = useState([]);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);

  // Edit Assessment State
  const [isEditAssessmentSettingsOpen, setIsEditAssessmentSettingsOpen] = useState(false);
  const [editAssessmentId, setEditAssessmentId] = useState(null);
  const [editAssessmentStudentIds, setEditAssessmentStudentIds] = useState([]);

  const GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "Engineering Mathematics"];
  
  // Removed dynamic grade fetch to always show all grades

  useEffect(() => {
    if (assessmentForm.grade && assessmentForm.difficulty) {
      axiosInstance.get(`/teacher/topics?grade=${encodeURIComponent(assessmentForm.grade)}&difficulty=${assessmentForm.difficulty}`)
        .then(res => {
          setAvailableTopics(res.data);
          if (res.data.length > 0 && !res.data.includes(assessmentForm.topic)) {
            setAssessmentForm(prev => ({...prev, topic: res.data[0]}));
          } else if (res.data.length === 0) {
            setAssessmentForm(prev => ({...prev, topic: ''}));
          }
        })
        .catch(err => console.error('Failed to fetch topics', err));
    }
  }, [assessmentForm.grade, assessmentForm.difficulty]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [selectedAssessmentStudentIds, setSelectedAssessmentStudentIds] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    grade: '', topic: '', subTopic: '', difficulty: 'EASY',
    questionText: '', option1: '', option2: '', option3: '', option4: '',
    correctOption: 1, tutorialVideo: '', documentation: ''
  });
  const { user } = useAuthStore();

  useEffect(() => {
    if (activeTab === 'questions') fetchQuestions();
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'assessments') fetchAssessments();
  }, [activeTab]);

  const handleAssessmentFormChange = (e) => {
    setAssessmentForm({...assessmentForm, [e.target.name]: e.target.value});
  };

  const handleFetchAssessmentQuestions = async () => {
    try {
      const res = await axiosInstance.get(`/teacher/questions/filter?grade=${encodeURIComponent(assessmentForm.grade)}&topic=${encodeURIComponent(assessmentForm.topic)}&difficulty=${encodeURIComponent(assessmentForm.difficulty)}&limit=${assessmentForm.limit}`);
      setFetchedQuestions(res.data);
      setSelectedQuestionIds(res.data.map(q => q.id)); // Select all by default
      setAssessmentStep(3);
    } catch (err) {
      alert('Failed to fetch questions');
    }
  };

  const formatDateTime = (date, hour, minute, ampm) => {
    if (!date) return null;
    let h = parseInt(hour, 10);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const hh = h.toString().padStart(2, '0');
    return new Date(`${date}T${hh}:${minute}:00`).toISOString();
  };

  const openAssignStudentsStep = () => {
    setSelectedAssessmentStudentIds(students.map(s => s.student.id)); // Default all my students
    setAssessmentStep(4);
  };

  const handleCreateAssessment = async () => {
    try {
      const payload = {
        title: assessmentForm.title,
        description: assessmentForm.description,
        availableFrom: formatDateTime(assessmentForm.availableFromDate, assessmentForm.availableFromHour, assessmentForm.availableFromMinute, assessmentForm.availableFromAmPm),
        deadline: formatDateTime(assessmentForm.deadlineDate, assessmentForm.deadlineHour, assessmentForm.deadlineMinute, assessmentForm.deadlineAmPm),
        questionIds: selectedQuestionIds,
        studentIds: selectedAssessmentStudentIds
      };
      await axiosInstance.post('/teacher/assessments', payload);
      setIsCreateAssessmentOpen(false);
      fetchAssessments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create assessment');
    }
  };

  const openEditAssessmentSettings = (assessment) => {
    setEditAssessmentId(assessment.id);
    setEditAssessmentStudentIds(assessment.assessmentStudents.map(as => as.student.id));
    setIsEditAssessmentSettingsOpen(true);
  };

  const handleUpdateAssessmentSettings = async () => {
    try {
      await axiosInstance.put(`/teacher/assessments/${editAssessmentId}/students`, {
        studentIds: editAssessmentStudentIds
      });
      setIsEditAssessmentSettingsOpen(false);
      fetchAssessments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update assessment settings');
    }
  };

  const startCreateAssessment = () => {
    setAssessmentForm({
      title: '', description: '', 
      availableFromDate: '', availableFromHour: '12', availableFromMinute: '00', availableFromAmPm: 'AM', 
      deadlineDate: '', deadlineHour: '11', deadlineMinute: '59', deadlineAmPm: 'PM',
      grade: '1', 
      topic: '', difficulty: 'EASY', limit: 10
    });
    setAssessmentStep(1);
    setIsCreateAssessmentOpen(true);
  };

  const fetchQuestions = async () => {
    try {
      const res = await axiosInstance.get('/teacher/questions');
      setQuestions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAssessments = async () => {
    try {
      const res = await axiosInstance.get('/teacher/assessments');
      setAssessments(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get('/teacher/students');
      setStudents(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const res = await axiosInstance.get('/teacher/available-students');
      setAvailableStudents(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    try {
      await axiosInstance.post(`/teacher/students/${selectedStudentId}`);
      setIsAddStudentModalOpen(false);
      setSelectedStudentId('');
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add student');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if(window.confirm('Are you sure you want to remove this student?')) {
      try {
        await axiosInstance.delete(`/teacher/students/${studentId}`);
        fetchStudents();
      } catch (err) {
        alert('Failed to remove student');
      }
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axiosInstance.get('/teacher/analytics');
      setAnalytics(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axiosInstance.delete(`/teacher/questions/${id}`);
        fetchQuestions();
      } catch(e) {
        alert('Failed to delete');
      }
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/teacher/questions', newQuestion);
      setIsAddModalOpen(false);
      setNewQuestion({
        grade: '', topic: '', subTopic: '', difficulty: 'EASY',
        questionText: '', option1: '', option2: '', option3: '', option4: '',
        correctOption: 1, tutorialVideo: '', documentation: ''
      });
      fetchQuestions();
    } catch(err) {
      alert('Failed to add question');
    }
  };

  const handleEditQuestion = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/teacher/questions/${editingQuestion.id}`, editingQuestion);
      setIsEditModalOpen(false);
      setEditingQuestion(null);
      fetchQuestions();
    } catch(err) {
      alert('Failed to update question');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="glass-panel p-6 mb-4">
             <h2 className="text-xl font-bold text-white mb-1">Teacher Portal</h2>
             <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
          <nav className="flex flex-col space-y-2">
            <TabButton active={activeTab === 'questions'} onClick={() => setActiveTab('questions')} icon={<BookOpen />} label="Question Bank" />
            <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users />} label="My Students" />
            <TabButton active={activeTab === 'assessments'} onClick={() => setActiveTab('assessments')} icon={<FileText />} label="Assessments" />
            <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 />} label="Analytics" />
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel p-6 sm:p-8 min-h-[600px]">
          <AnimatePresence mode="wait">
            
            {activeTab === 'questions' && (
              <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-white">Question Bank</h2>
                   <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center space-x-2 py-2 px-4 text-sm">
                     <Plus className="w-4 h-4" />
                     <span>Add Question</span>
                   </button>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800 border-b border-slate-700">
                        <th className="p-4 text-slate-300 font-medium">Grade</th>
                        <th className="p-4 text-slate-300 font-medium">Topic</th>
                        <th className="p-4 text-slate-300 font-medium">Question</th>
                        <th className="p-4 text-slate-300 font-medium">Difficulty</th>
                        <th className="p-4 text-slate-300 font-medium">Status</th>
                        <th className="p-4 text-slate-300 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-400">No questions found. Add some!</td></tr>
                      ) : questions.map((q) => (
                        <tr key={q.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 text-white">{q.grade}</td>
                          <td className="p-4 text-slate-300">{q.topic}</td>
                          <td className="p-4 text-slate-300 max-w-xs truncate">{q.questionText}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${q.difficulty === 'EASY' ? 'bg-green-500/20 text-green-400' : q.difficulty === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                               {q.difficulty}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${q.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                               {q.status}
                            </span>
                          </td>
                          <td className="p-4 flex justify-end space-x-2">
                             <button onClick={() => { setEditingQuestion(q); setIsEditModalOpen(true); }} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors" title="Edit">
                               <Edit2 className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDelete(q.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Delete">
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'students' && (
              <motion.div key="students" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">My Students</h2>
                    <button onClick={() => { fetchAvailableStudents(); setIsAddStudentModalOpen(true); }} className="btn-primary flex items-center space-x-2 py-2 px-4 text-sm">
                      <Plus className="w-4 h-4" />
                      <span>Add Student</span>
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                   {students.length === 0 ? (
                     <div className="text-slate-400 text-center py-8">No students assigned yet.</div>
                   ) : students.map(st => (
                     <div key={st.student.id} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex justify-between items-center space-x-4 w-full">
                       <div className="flex items-center space-x-4">
                         <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center font-bold text-xl">
                            {st.student.email.charAt(0).toUpperCase()}
                         </div>
                         <div>
                           <h3 className="text-white font-bold">{st.student.email}</h3>
                           <p className="text-sm text-slate-400">Assigned recently</p>
                         </div>
                       </div>
                       <button onClick={() => handleRemoveStudent(st.student.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Remove Student">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'assessments' && (
              <motion.div key="assessments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Assessments</h2>
                    <button onClick={startCreateAssessment} className="btn-primary flex items-center space-x-2 py-2 px-4 text-sm">
                      <Plus className="w-4 h-4" />
                      <span>Create Assessment</span>
                    </button>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                   {assessments.length === 0 ? (
                     <div className="text-slate-400 text-center py-8">No assessments found.</div>
                   ) : assessments.map(a => (
                     <div key={a.id} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-start mb-4 border-b border-slate-700/50 pb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{a.title}</h3>
                            <p className="text-slate-400 text-sm mb-2">{a.description || 'No description provided'}</p>
                          </div>
                          <button 
                            onClick={() => openEditAssessmentSettings(a)}
                            className="btn-secondary py-1 px-3 text-sm flex items-center space-x-1"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Edit Settings</span>
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                          <div>Starts: {a.availableFrom ? new Date(a.availableFrom).toLocaleString() : 'Anytime'}</div>
                          <div>Due: {a.deadline ? new Date(a.deadline).toLocaleString() : 'No deadline'}</div>
                       </div>
                     </div>
                   ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-white">Class Analytics</h2>
                </div>
                
                {analytics ? (
                  <div className="space-y-6">
                     <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                           <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Total Students</div>
                           <div className="text-3xl font-bold text-primary-400">{analytics.totalStudents}</div>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                           <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Tests Taken</div>
                           <div className="text-3xl font-bold text-accent">{analytics.totalTestsTaken}</div>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                           <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Avg. Score</div>
                           <div className="text-3xl font-bold text-green-400">{analytics.averageClassScore.toFixed(1)}</div>
                        </div>
                     </div>

                     <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-white font-bold mb-6">Topic Performance (Accuracy %)</h3>
                        <div className="w-full h-80">
                           {analytics.topicPerformance && analytics.topicPerformance.length > 0 ? (
                             <ResponsiveContainer width="100%" height="100%">
                               <BarChart data={analytics.topicPerformance}>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                 <XAxis dataKey="topic" stroke="#94a3b8" />
                                 <YAxis stroke="#94a3b8" domain={[0, 100]} />
                                 <RechartsTooltip 
                                    cursor={{fill: '#1e293b'}}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                 />
                                 <Legend />
                                 <Bar dataKey="averageAccuracy" name="Accuracy %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                               </BarChart>
                             </ResponsiveContainer>
                           ) : (
                             <div className="h-full flex items-center justify-center text-slate-500">No topic performance data available.</div>
                           )}
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="text-slate-400 animate-pulse">Loading analytics...</div>
                )}
              </motion.div>
            )}

            {/* Placeholder for assessments */}
            {activeTab === 'assessments' && (
              <motion.div key="placeholder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
                 <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Settings className="w-8 h-8 opacity-50" />
                 </div>
                 <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
                 <p>This module is under construction.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl my-8">
            <h3 className="text-xl font-bold text-white mb-4">Add New Question</h3>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Grade</label>
                  <input type="text" required value={newQuestion.grade} onChange={e => setNewQuestion({...newQuestion, grade: e.target.value})} className="input-field mt-1" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Difficulty</label>
                  <select value={newQuestion.difficulty} onChange={e => setNewQuestion({...newQuestion, difficulty: e.target.value})} className="input-field mt-1">
                    <option value="EASY">EASY</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Topic</label>
                  <input type="text" required value={newQuestion.topic} onChange={e => setNewQuestion({...newQuestion, topic: e.target.value})} className="input-field mt-1" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Sub Topic</label>
                  <input type="text" required value={newQuestion.subTopic} onChange={e => setNewQuestion({...newQuestion, subTopic: e.target.value})} className="input-field mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Question Text</label>
                <textarea required value={newQuestion.questionText} onChange={e => setNewQuestion({...newQuestion, questionText: e.target.value})} className="input-field mt-1 h-24"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-400">Option 1</label><input type="text" required value={newQuestion.option1} onChange={e => setNewQuestion({...newQuestion, option1: e.target.value})} className="input-field mt-1" /></div>
                <div><label className="text-sm text-slate-400">Option 2</label><input type="text" required value={newQuestion.option2} onChange={e => setNewQuestion({...newQuestion, option2: e.target.value})} className="input-field mt-1" /></div>
                <div><label className="text-sm text-slate-400">Option 3</label><input type="text" required value={newQuestion.option3} onChange={e => setNewQuestion({...newQuestion, option3: e.target.value})} className="input-field mt-1" /></div>
                <div><label className="text-sm text-slate-400">Option 4</label><input type="text" required value={newQuestion.option4} onChange={e => setNewQuestion({...newQuestion, option4: e.target.value})} className="input-field mt-1" /></div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Correct Option (1-4)</label>
                <input type="number" min="1" max="4" required value={newQuestion.correctOption} onChange={e => setNewQuestion({...newQuestion, correctOption: parseInt(e.target.value)})} className="input-field mt-1" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Tutorial Video Link (Optional)</label>
                  <input type="url" value={newQuestion.tutorialVideo} onChange={e => setNewQuestion({...newQuestion, tutorialVideo: e.target.value})} className="input-field mt-1" placeholder="https://youtube.com/..." />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Documentation / Explanation (Optional)</label>
                  <textarea value={newQuestion.documentation} onChange={e => setNewQuestion({...newQuestion, documentation: e.target.value})} className="input-field mt-1 h-20" placeholder="Explain the concept..."></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingQuestion && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl my-8">
            <h3 className="text-xl font-bold text-white mb-4">Edit Question</h3>
            <form onSubmit={handleEditQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Grade</label>
                  <input type="text" required value={editingQuestion.grade} onChange={e => setEditingQuestion({...editingQuestion, grade: e.target.value})} className="input-field mt-1" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Difficulty</label>
                  <select value={editingQuestion.difficulty} onChange={e => setEditingQuestion({...editingQuestion, difficulty: e.target.value})} className="input-field mt-1">
                    <option value="EASY">EASY</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Topic</label>
                  <input type="text" required value={editingQuestion.topic} onChange={e => setEditingQuestion({...editingQuestion, topic: e.target.value})} className="input-field mt-1" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Sub Topic</label>
                  <input type="text" required value={editingQuestion.subTopic} onChange={e => setEditingQuestion({...editingQuestion, subTopic: e.target.value})} className="input-field mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Question Text</label>
                <textarea required value={editingQuestion.questionText} onChange={e => setEditingQuestion({...editingQuestion, questionText: e.target.value})} className="input-field mt-1 h-24"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-400">Option 1</label><input type="text" required value={editingQuestion.option1} onChange={e => setEditingQuestion({...editingQuestion, option1: e.target.value})} className="input-field mt-1" /></div>
                <div><label className="text-sm text-slate-400">Option 2</label><input type="text" required value={editingQuestion.option2} onChange={e => setEditingQuestion({...editingQuestion, option2: e.target.value})} className="input-field mt-1" /></div>
                <div><label className="text-sm text-slate-400">Option 3</label><input type="text" required value={editingQuestion.option3} onChange={e => setEditingQuestion({...editingQuestion, option3: e.target.value})} className="input-field mt-1" /></div>
                <div><label className="text-sm text-slate-400">Option 4</label><input type="text" required value={editingQuestion.option4} onChange={e => setEditingQuestion({...editingQuestion, option4: e.target.value})} className="input-field mt-1" /></div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Correct Option (1-4)</label>
                <input type="number" min="1" max="4" required value={editingQuestion.correctOption} onChange={e => setEditingQuestion({...editingQuestion, correctOption: parseInt(e.target.value)})} className="input-field mt-1" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Tutorial Video Link (Optional)</label>
                  <input type="url" value={editingQuestion.tutorialVideo || ''} onChange={e => setEditingQuestion({...editingQuestion, tutorialVideo: e.target.value})} className="input-field mt-1" placeholder="https://youtube.com/..." />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Documentation / Explanation (Optional)</label>
                  <textarea value={editingQuestion.documentation || ''} onChange={e => setEditingQuestion({...editingQuestion, documentation: e.target.value})} className="input-field mt-1 h-20" placeholder="Explain the concept..."></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingQuestion(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Update Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md my-8">
            <h3 className="text-xl font-bold text-white mb-4">Add Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Select an unassigned student</label>
                <select required value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="input-field mt-1">
                  <option value="" disabled>-- Select a student --</option>
                  {availableStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.email}</option>
                  ))}
                </select>
                {availableStudents.length === 0 && (
                  <p className="text-xs text-yellow-500 mt-2">No unassigned students available.</p>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={() => setIsAddStudentModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isCreateAssessmentOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Create Assessment - Step {assessmentStep} of 4</h3>
              <button onClick={() => setIsCreateAssessmentOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6"/></button>
            </div>

            {assessmentStep === 1 && (
              <div className="space-y-4">
                <h4 className="text-lg text-primary-400 font-semibold mb-2">Assessment Details</h4>
                <div>
                  <label className="text-sm text-slate-400">Title</label>
                  <input type="text" name="title" value={assessmentForm.title} onChange={handleAssessmentFormChange} className="input-field mt-1" required />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Description</label>
                  <textarea name="description" value={assessmentForm.description} onChange={handleAssessmentFormChange} className="input-field mt-1" rows="3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Start Date & Time (Optional)</label>
                    <div className="flex space-x-2 mt-1">
                      <input type="date" name="availableFromDate" value={assessmentForm.availableFromDate} onChange={handleAssessmentFormChange} className="input-field flex-1" />
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <select name="availableFromHour" value={assessmentForm.availableFromHour} onChange={handleAssessmentFormChange} className="input-field w-1/3">
                        {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                      </select>
                      <select name="availableFromMinute" value={assessmentForm.availableFromMinute} onChange={handleAssessmentFormChange} className="input-field w-1/3">
                        <option value="00">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option>
                      </select>
                      <select name="availableFromAmPm" value={assessmentForm.availableFromAmPm} onChange={handleAssessmentFormChange} className="input-field w-1/3">
                        <option value="AM">AM</option><option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">End Date & Time (Optional)</label>
                    <div className="flex space-x-2 mt-1">
                      <input type="date" name="deadlineDate" value={assessmentForm.deadlineDate} onChange={handleAssessmentFormChange} className="input-field flex-1" />
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <select name="deadlineHour" value={assessmentForm.deadlineHour} onChange={handleAssessmentFormChange} className="input-field w-1/3">
                        {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                      </select>
                      <select name="deadlineMinute" value={assessmentForm.deadlineMinute} onChange={handleAssessmentFormChange} className="input-field w-1/3">
                        <option value="00">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option>
                      </select>
                      <select name="deadlineAmPm" value={assessmentForm.deadlineAmPm} onChange={handleAssessmentFormChange} className="input-field w-1/3">
                        <option value="AM">AM</option><option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={() => setAssessmentStep(2)} className="btn-primary" disabled={!assessmentForm.title}>Next: Question Criteria</button>
                </div>
              </div>
            )}

            {assessmentStep === 2 && (
              <div className="space-y-4">
                <h4 className="text-lg text-primary-400 font-semibold mb-2">Question Criteria</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Grade</label>
                    <select name="grade" value={assessmentForm.grade} onChange={handleAssessmentFormChange} className="input-field mt-1">
                      {GRADES.map(g => (
                        <option key={g} value={g}>{g.includes('Engineering') ? g : `Grade ${g}`}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Difficulty</label>
                    <select name="difficulty" value={assessmentForm.difficulty} onChange={handleAssessmentFormChange} className="input-field mt-1">
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Topic</label>
                    <select name="topic" value={assessmentForm.topic} onChange={handleAssessmentFormChange} className="input-field mt-1">
                      {availableTopics.length === 0 ? (
                        <option value="" disabled>No topics found for this Grade & Difficulty</option>
                      ) : (
                        availableTopics.map(t => <option key={t} value={t}>{t}</option>)
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Number of Questions</label>
                    <input type="number" name="limit" value={assessmentForm.limit} onChange={handleAssessmentFormChange} className="input-field mt-1" min="1" max="50" />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setAssessmentStep(1)} className="btn-secondary">Back</button>
                  <button onClick={handleFetchAssessmentQuestions} className="btn-primary">Fetch Questions</button>
                </div>
              </div>
            )}

            {assessmentStep === 3 && (
              <div className="space-y-4">
                <h4 className="text-lg text-primary-400 font-semibold mb-2">Select Questions</h4>
                <p className="text-sm text-slate-400 mb-4">Found {fetchedQuestions.length} questions matching your criteria. Uncheck any you don't want to include.</p>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  {fetchedQuestions.length === 0 ? (
                    <div className="text-yellow-500">No questions found matching these criteria. Please go back and adjust.</div>
                  ) : fetchedQuestions.map(q => (
                    <label key={q.id} className="flex items-start space-x-3 bg-slate-800 p-3 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700/50">
                      <input 
                        type="checkbox" 
                        checked={selectedQuestionIds.includes(q.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedQuestionIds([...selectedQuestionIds, q.id]);
                          else setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== q.id));
                        }}
                        className="mt-1"
                      />
                      <div className="text-sm text-white">{q.questionText}</div>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setAssessmentStep(2)} className="btn-secondary">Back</button>
                  <button onClick={openAssignStudentsStep} className="btn-primary">Next: Assign Students</button>
                </div>
              </div>
            )}

            {assessmentStep === 4 && (
              <div className="space-y-4">
                <h4 className="text-lg text-primary-400 font-semibold mb-2">Assign to Students</h4>
                <p className="text-sm text-slate-400 mb-4">By default, all your students are included. Uncheck any student to exclude them.</p>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  {students.length === 0 ? (
                    <div className="text-yellow-500">You have no students assigned to you yet.</div>
                  ) : students.map(st => (
                    <label key={st.student.id} className="flex items-center space-x-3 bg-slate-800 p-3 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700/50">
                      <input 
                        type="checkbox" 
                        checked={selectedAssessmentStudentIds.includes(st.student.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedAssessmentStudentIds([...selectedAssessmentStudentIds, st.student.id]);
                          else setSelectedAssessmentStudentIds(selectedAssessmentStudentIds.filter(id => id !== st.student.id));
                        }}
                      />
                      <div className="text-sm text-white font-medium">{st.student.email}</div>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setAssessmentStep(3)} className="btn-secondary">Back</button>
                  <button onClick={handleCreateAssessment} className="btn-primary">Create Assessment</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Assessment Settings Modal */}
      {isEditAssessmentSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit Assessment Settings</h3>
              <button onClick={() => setIsEditAssessmentSettingsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white mb-2">Assign Students</h4>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 max-h-[400px] overflow-y-auto">
                  {students.length === 0 ? (
                    <div className="text-slate-400 text-center text-sm">You have no students assigned to you yet.</div>
                  ) : (
                    students.map(s => (
                      <div key={s.student.id} className="flex items-center justify-between p-3 border-b border-slate-700/50 last:border-0 hover:bg-slate-800 transition-colors rounded-lg">
                        <div className="flex items-center space-x-3">
                          <input 
                            type="checkbox" 
                            checked={editAssessmentStudentIds.includes(s.student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditAssessmentStudentIds([...editAssessmentStudentIds, s.student.id]);
                              } else {
                                setEditAssessmentStudentIds(editAssessmentStudentIds.filter(id => id !== s.student.id));
                              }
                            }}
                            className="w-5 h-5 rounded border-slate-600 text-primary-500 focus:ring-primary-500 bg-slate-700"
                          />
                          <div>
                            <div className="text-white font-medium">{s.student.firstName} {s.student.lastName}</div>
                            <div className="text-slate-400 text-sm">{s.student.email}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-700">
                <button onClick={() => setIsEditAssessmentSettingsOpen(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleUpdateAssessmentSettings} className="btn-primary">Save Changes</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
      active 
      ? 'bg-accent text-white shadow-lg shadow-accent/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className={`${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
    <span className="font-medium">{label}</span>
  </button>
);

export default TeacherDashboard;
