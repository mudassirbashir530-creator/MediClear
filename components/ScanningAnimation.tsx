import React, { useEffect, useState } from 'react';

interface ScanningAnimationProps {
  file: File;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ file }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="w-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-white p-10 flex flex-col items-center animate-fade-in-up">
      <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-inner mb-8">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Scanning" 
            className="w-full h-full object-cover opacity-90 blur-[2px]"
          />
        )}
        
        {/* Scanning Laser Line */}
        <div className="absolute left-0 right-0 h-1.5 bg-[#00796B] shadow-[0_0_20px_rgba(0,121,107,0.8)] z-10 scan-line" />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00796B]/20 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col items-center">
        <div className="w-12 h-12 mb-4 border-4 border-[#00796B] border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-2xl font-bold text-[#333333] mb-2">
          Analyzing Report...
        </h3>
        <p className="text-slate-500 text-center max-w-xs font-medium">
          Our AI is reading the medical terms and translating them for you.
        </p>
      </div>
    </div>
  );
};