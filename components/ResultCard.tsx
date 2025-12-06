import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, ChatMessage } from '../types';
import { askReportQuestion } from '../services/geminiService';
import { Check, RotateCcw, ShieldAlert, FileText, Share2, Send, MessageCircle, Info } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const [showDetailed, setShowDetailed] = useState(false);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleWhatsAppShare = () => {
    const text = `MediClear Analysis:\n\nSummary: ${result.summary}\n\nUrdu: ${result.urduTranslation}\n\n- Sent via MediClear App`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userQuestion = chatInput;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuestion,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const answer = await askReportQuestion(result.detailedSummary || result.summary, userQuestion);
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: answer,
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up pb-8">
      
      {/* Success Banner */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#00796B] p-2 rounded-full text-white">
            <Check className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#333333]">Analysis Complete</span>
        </div>
      </div>

      {/* Card 1: Simple Summary (Primary) */}
      <section className="bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-[#F4F7F6] px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h3 className="text-[#00796B] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4" /> Simple Summary
          </h3>
          <button 
            onClick={() => setShowDetailed(!showDetailed)}
            className="text-xs text-slate-500 underline decoration-slate-300 hover:text-[#00796B] transition-colors"
          >
            {showDetailed ? 'Hide Details' : 'View Details'}
          </button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-[#333333] text-lg leading-relaxed font-medium">
            {showDetailed 
              ? (result.detailedSummary || result.summary) 
              : result.summary
            }
          </p>
        </div>
      </section>

      {/* Card 2: Urdu Translation (Secondary) */}
      <section className="bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-[#F4F7F6] px-6 py-4 border-b border-slate-100 flex justify-end">
          <h3 className="text-[#00796B] font-bold text-sm uppercase tracking-wider">
            Urdu Translation
          </h3>
        </div>
        <div className="p-6 md:p-8 bg-[#FAFAFA]">
          <p className="text-slate-800 text-xl leading-loose font-serif text-right" dir="rtl">
            {result.urduTranslation}
          </p>
        </div>
      </section>

      {/* Primary Action: Share on WhatsApp */}
      <button
        onClick={handleWhatsAppShare}
        className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full py-4 px-6 shadow-md hover:shadow-lg transform active:scale-95 transition-all font-bold text-lg"
      >
        <Share2 className="w-5 h-5" />
        Share Report on WhatsApp
      </button>

      {/* Additional Features: Q&A */}
      <div className="border-t border-slate-200 pt-6 mt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Questions & Help</h4>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-3 bg-[#00796B] text-white text-xs font-bold flex items-center gap-2">
             <MessageCircle className="w-4 h-4" /> Chat Assistant
          </div>
          <div className="bg-[#EFEAE2] p-4 h-48 overflow-y-auto space-y-3">
             {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                  <Info className="w-6 h-6 mb-1 opacity-50" />
                  <p>Ask: "Is this report normal?"</p>
                </div>
             )}
             {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
             ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-3 py-2 rounded-lg rounded-tl-none shadow-sm flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}
             <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-2 bg-white flex gap-2">
             <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 text-sm bg-slate-50 border-none rounded-full px-4 focus:ring-1 focus:ring-[#00796B]"
             />
             <button type="submit" disabled={!chatInput.trim()} className="p-2 bg-[#00796B] text-white rounded-full disabled:opacity-50">
               <Send className="w-4 h-4" />
             </button>
          </form>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-600 rounded-full py-3 px-6 hover:bg-slate-50 transition-colors font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Analyze New Report
        </button>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-100 text-slate-500 text-xs leading-tight">
        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>AI generated. Not medical advice. Consult a doctor.</p>
      </div>
    </div>
  );
};