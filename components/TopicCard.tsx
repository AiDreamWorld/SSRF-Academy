import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-blue-400 bg-blue-400/10';
      case 'Hard': return 'text-orange-400 bg-orange-400/10';
      case 'Expert': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-6 cursor-pointer transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-500/10 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        {topic.icon}
      </div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 group-hover:border-indigo-500/30 transition-colors">
          {topic.icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
          {topic.difficulty}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
        {topic.title}
      </h3>
      <p className="text-slate-400 text-sm mb-6 line-clamp-2">
        {topic.description}
      </p>

      <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
        Start Module <ArrowRight className="w-4 h-4 ml-2" />
      </div>
    </div>
  );
};