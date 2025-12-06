import React, { useState, useCallback } from 'react';
import { Upload, Camera, FileText } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      alert("Please upload an image file (JPG, PNG).");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
      {/* Brand Hero Section */}
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center justify-center p-4 bg-teal-50 rounded-full mb-4 ring-1 ring-teal-100 shadow-sm">
          <FileText className="w-8 h-8 text-[#00796B]" />
        </div>
        <h2 className="text-3xl font-bold text-[#333333] tracking-tight">Upload Medical Report</h2>
        <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
          Take a clear photo of your lab report or prescription for an instant AI summary.
        </p>
      </div>

      <div 
        className={`
          w-full max-w-sm transition-all duration-300
          ${isDragging ? 'scale-105' : 'scale-100'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col gap-4">
          {/* Primary Action - Native Camera */}
          <label className="group relative w-full flex items-center justify-center gap-3 bg-[#00796B] hover:bg-[#00695C] text-white rounded-full py-5 px-8 shadow-lg shadow-teal-900/10 transition-all cursor-pointer active:scale-95">
            <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold tracking-wide">Take Photo</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileInput} 
            />
          </label>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Or</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {/* Secondary Action - Upload File */}
          <label className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-[#00796B] text-slate-600 hover:text-[#00796B] rounded-full py-3.5 px-6 shadow-sm transition-all cursor-pointer active:scale-95">
            <Upload className="w-5 h-5" />
            <span className="font-semibold text-sm">Upload from Gallery</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileInput} 
            />
          </label>
        </div>
      </div>
    </div>
  );
};