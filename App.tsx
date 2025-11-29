import React, { useState } from 'react';
import { Shield, Terminal, BookOpen, Server, Cloud, Globe, AlertTriangle } from 'lucide-react';
import { LessonView } from './components/LessonView';
import { TopicCard } from './components/TopicCard';
import { Topic, TopicId } from './types';

const TOPICS: Topic[] = [
  {
    id: TopicId.BLIND_SSRF,
    title: 'Blind SSRF',
    description: 'Exploiting vulnerabilities where the backend response is not returned.',
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    difficulty: 'Hard'
  },
  {
    id: TopicId.CLOUD_METADATA,
    title: 'Cloud Metadata',
    description: 'Accessing instance metadata services (IMDSv1/v2) on AWS, GCP, and Azure.',
    icon: <Cloud className="w-6 h-6 text-blue-400" />,
    difficulty: 'Medium'
  },
  {
    id: TopicId.FILTER_BYPASS,
    title: 'Filter Bypasses',
    description: 'Evading IP blocklists using octal, hex, and alternative encoding.',
    icon: <Server className="w-6 h-6 text-purple-400" />,
    difficulty: 'Expert'
  },
  {
    id: TopicId.DNS_REBINDING,
    title: 'DNS Rebinding',
    description: 'Bypassing same-origin policy using dynamic DNS resolution.',
    icon: <Globe className="w-6 h-6 text-orange-400" />,
    difficulty: 'Expert'
  }
];

export default function App() {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTopic(null)}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              SSRF Academy
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Educational Purposes Only
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {!activeTopic ? (
          <div className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-4xl font-extrabold mb-4">Advanced SSRF Exploitation & Defense</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Master the nuances of Server-Side Request Forgery through interactive AI-driven lessons.
                Select a module below to begin your deep dive.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TOPICS.map((topic) => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  onClick={() => setActiveTopic(topic)} 
                />
              ))}
            </div>
          </div>
        ) : (
          <LessonView 
            topic={activeTopic} 
            onBack={() => setActiveTopic(null)} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-auto bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SSRF Academy. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}