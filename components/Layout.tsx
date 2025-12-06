import React, { ReactNode } from 'react';
import { Activity, History, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  onNavigate: (view: 'home' | 'history') => void;
  currentView: 'home' | 'history';
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F6] text-[#333333] font-sans selection:bg-[#00796B] selection:text-white">
      {/* Premium Medical Header */}
      <header className="bg-[#00796B] text-white shadow-lg sticky top-0 z-50">
        <div className="container max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight leading-tight">MediClear</h1>
                <span className="text-[10px] text-teal-100 uppercase tracking-widest opacity-80 font-medium">Medical AI</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center bg-[#00695C] p-1 rounded-full">
              <button
                onClick={() => onNavigate('home')}
                className={`
                  flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300
                  ${currentView === 'home' 
                    ? 'bg-white text-[#00796B] shadow-sm' 
                    : 'text-teal-100 hover:text-white'
                  }
                `}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Scan</span>
              </button>
              <button
                onClick={() => onNavigate('history')}
                className={`
                  flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300
                  ${currentView === 'history' 
                    ? 'bg-white text-[#00796B] shadow-sm' 
                    : 'text-teal-100 hover:text-white'
                  }
                `}
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container max-w-3xl mx-auto px-4 py-6 md:py-10 flex flex-col">
        {children}
      </main>

      {/* Professional Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-[#333333] text-sm font-semibold opacity-60">
            Developed by Mudassir Bashir
          </p>
        </div>
      </footer>
    </div>
  );
};