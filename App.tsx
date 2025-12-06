import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { UploadZone } from './components/UploadZone';
import { ScanningAnimation } from './components/ScanningAnimation';
import { ResultCard } from './components/ResultCard';
import { HistoryList } from './components/HistoryList';
import { analyzeMedicalReport } from './services/geminiService';
import { addToHistory } from './services/historyService';
import { AnalysisResult } from './types';
import { AlertCircle } from 'lucide-react';

type AppMode = 'upload' | 'scanning' | 'result' | 'history';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>('upload');

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setMode('scanning');

    try {
      // Simulate a minimum "scanning" time for better UX
      const minScanTime = new Promise(resolve => setTimeout(resolve, 3000));
      
      const analysisPromise = analyzeMedicalReport(selectedFile);
      
      const [analysisData] = await Promise.all([analysisPromise, minScanTime]);
      
      setResult(analysisData);
      addToHistory(analysisData);
      setMode('result');
    } catch (err) {
      console.error(err);
      setError("We couldn't analyze this image. Please ensure it is a clear picture of a medical report and try again.");
      setFile(null);
      setMode('upload');
    }
  }, []);

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setMode('upload');
  };

  const handleNavigate = (view: 'home' | 'history') => {
    setError(null);
    if (view === 'history') {
      setMode('history');
    } else {
      // If navigating home and we have a result, show the result, otherwise upload
      if (result && mode === 'result') {
        setMode('result');
      } else {
        handleReset();
      }
    }
  };

  const handleHistorySelect = (item: AnalysisResult) => {
    setResult(item);
    // We don't have the original file image for history items, but that's okay for the ResultCard
    setMode('result');
  };

  return (
    <Layout 
      onNavigate={handleNavigate} 
      currentView={mode === 'history' ? 'history' : 'home'}
    >
      <div className="max-w-3xl mx-auto w-full">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* State Management Views */}
        {mode === 'upload' && (
          <UploadZone onFileSelect={handleFileSelect} />
        )}

        {mode === 'scanning' && file && (
          <ScanningAnimation file={file} />
        )}

        {mode === 'result' && result && (
          <ResultCard result={result} onReset={handleReset} />
        )}

        {mode === 'history' && (
          <HistoryList 
            onSelect={handleHistorySelect} 
            onEmpty={() => handleNavigate('home')} 
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
