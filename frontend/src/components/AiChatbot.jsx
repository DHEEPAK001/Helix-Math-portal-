import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import useAuthStore from '../store/authStore';

const AiChatbot = () => {
  const { user, isGuest } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! I'm your AI Math Tutor. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!user && !isGuest) return null; // Don't show if not logged in

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsTyping(true);

    if (isGuest) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: "Please create a full account to unlock unlimited AI doubt clearing!" }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const res = await axiosInstance.post('/ai/chat', {
        message: userMessage,
        context: 'General Math'
      });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, my neural pathways are a bit congested. Try again later!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6" />
                <span className="font-bold">AI Math Tutor</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center ${msg.sender === 'user' ? 'bg-primary-600' : 'bg-accent/20 text-accent'}`}>
                      {msg.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                 <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-800 rounded-tl-none border border-slate-700 flex space-x-1">
                       <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                       <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex items-center space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a math question..."
                className="flex-1 bg-slate-900 border border-slate-600 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="w-12 h-12 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-accent hover:bg-accent/90 text-white rounded-full flex items-center justify-center shadow-2xl shadow-accent/40 hover:scale-105 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default AiChatbot;
