import React, { useEffect, useState } from 'react';
import { HistoryItem } from '../types';
import { getHistory, clearHistory } from '../services/historyService';
import { Calendar, ChevronRight, Trash2, FileText, Clock } from 'lucide-react';

interface HistoryListProps {
  onSelect: (item: HistoryItem) => void;
  onEmpty: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ onSelect, onEmpty }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to delete all history?")) {
      clearHistory();
      setItems([]);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 border border-white">
        <div className="w-20 h-20 bg-[#F4F7F6] rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-2xl font-bold text-[#333333] mb-3">No History Yet</h3>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">Upload a report to see your past analysis summaries here.</p>
        <button 
          onClick={onEmpty}
          className="px-8 py-3 bg-[#00796B] text-white rounded-full hover:bg-[#00695C] transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          Scan New Report
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl animate-fade-in-up">
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <h2 className="text-3xl font-bold text-[#333333]">Past Reports</h2>
          <p className="text-slate-500 mt-1">Your previously analyzed medical documents</p>
        </div>
        <button 
          onClick={handleClear}
          className="text-red-500 hover:text-red-700 text-sm flex items-center gap-2 px-4 py-2 rounded-full hover:bg-red-50 transition-colors font-medium"
        >
          <Trash2 className="w-4 h-4" /> Clear History
        </button>
      </div>

      <div className="grid gap-5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="group w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#00796B]/30 transition-all duration-300 text-left flex items-start justify-between gap-5 transform hover:-translate-y-1"
          >
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-[#E0F2F1] rounded-xl flex items-center justify-center text-[#00796B] group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <h3 className="text-[#333333] font-bold text-lg mb-2 group-hover:text-[#00796B] transition-colors line-clamp-1">
                  Analysis Report
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
                  {item.detailedSummary || item.summary}
                </p>
              </div>
            </div>
            <div className="mt-3 text-slate-300 group-hover:text-[#00796B] transition-colors bg-slate-50 p-2 rounded-full group-hover:bg-[#E0F2F1]">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};