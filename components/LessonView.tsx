import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Terminal, Loader2, Play } from 'lucide-react';
import { Topic, ChatMessage } from '../types';
import { generateLessonContent } from '../services/geminiService';

interface LessonViewProps {
  topic: Topic;
  onBack: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ topic, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Initial lesson generation
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const startLesson = async () => {
      setIsLoading(true);
      try {
        const introPrompt = `Initialize the training module for: ${topic.title}. 
        Level: ${topic.difficulty}.
        
        1. Give a brief, high-level technical brief of the vulnerability.
        2. Set up a realistic scenario (e.g., "Target is a microservice architecture on AWS...").
        3. Present the first challenge or command for the user to try.
        `;
        
        // Pass empty history for the first message
        const response = await generateLessonContent(introPrompt, []);
        setMessages([{ role: 'model', text: response }]);
      } catch (error) {
        setMessages([{ role: 'model', text: 'Connection to training environment failed. Please check credentials.', isError: true }]);
      } finally {
        setIsLoading(false);
      }
    };

    startLesson();
  }, [topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Pass the current history (excluding the message we just added optimistically to UI to avoid duplication if we structured it differently, 
      // but here we need to pass the history *before* the new message, and let the service add the new one, 
      // OR pass the updated history. The service expects (msg, history).
      // Let's pass the *current* state of messages as history.
      const response = await generateLessonContent(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error executing command.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Basic formatter to handle code blocks in the absence of a heavy markdown library
  const renderMessageText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const content = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
        return (
          <div key={index} className="my-3 bg-black/80 border border-slate-700 rounded-md overflow-hidden font-mono text-sm">
            <div className="flex items-center px-3 py-1 bg-slate-800/50 border-b border-slate-700">
               <Terminal className="w-3 h-3 mr-2 text-slate-500" />
               <span className="text-xs text-slate-400">Terminal Output / Code</span>
            </div>
            <pre className="p-3 overflow-x-auto text-green-400">
              {content}
            </pre>
          </div>
        );
      }
      // Simple inline code and bold formatting
      return (
        <span key={index} className="whitespace-pre-wrap leading-relaxed">
          {part.split(/(`.*?`|\*\*.*?\*\*)/g).map((subPart, i) => {
            if (subPart.startsWith('`') && subPart.endsWith('`')) {
              return <code key={i} className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300 font-mono text-sm border border-slate-700">{subPart.slice(1, -1)}</code>;
            }
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
              return <strong key={i} className="text-white font-bold">{subPart.slice(2, -2)}</strong>;
            }
            return subPart;
          })}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {topic.title}
            </h2>
            <p className="text-xs text-slate-400">Interactive Lab Session</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs text-indigo-400 font-mono">
             ENV: {topic.difficulty.toUpperCase()}
           </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.length === 0 && isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-mono animate-pulse">Initializing container...</p>
            </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-lg p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : msg.isError 
                    ? 'bg-red-500/10 border border-red-500/50 text-red-200'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 shadow-xl'
              }`}
            >
              {msg.role === 'model' && !msg.isError ? (
                <div className="text-sm">
                  {renderMessageText(msg.text)}
                </div>
              ) : (
                <div className="whitespace-pre-wrap font-mono text-sm">{msg.text}</div>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-xs text-slate-400 font-mono">Processing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-800 p-4 border-t border-slate-700 shrink-0">
        <div className="relative max-w-4xl mx-auto flex items-center gap-2">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-indigo-400 font-mono font-bold">{'>'}</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command or answer..."
              className="block w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-mono text-sm shadow-inner transition-all"
              autoFocus
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-2">
             <span className="text-[10px] text-slate-500 font-mono">Use standard *nix commands (curl, wget, whois) to interact with the lab.</span>
        </div>
      </div>
    </div>
  );
};