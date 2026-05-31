'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link as LinkIcon, FileText, ChevronRight, Sparkles, Loader2, Play, Trash2 } from 'lucide-react';

interface Dataset {
  id: number;
  name: string;
  source_type: string;
  source_url?: string;
  created_at: string;
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'csv'>('url');
  const [datasetName, setDatasetName] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  // Ingestion loading states
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // History
  const [history, setHistory] = useState<Dataset[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    try {
      const saved = localStorage.getItem('reviewlens_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error("Could not load history from localStorage", e);
    }
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== 'url' && !datasetName.trim()) {
      setErrorMsg("Please specify a reference name for this dataset.");
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setStatusMessage("Connecting to analysis engine...");

    const formData = new FormData();
    if (activeTab !== 'url') {
      formData.append('name', datasetName);
    }

    let endpoint = '/api/ingest/text';

    if (activeTab === 'text') {
      if (!pastedText.trim()) {
        setErrorMsg("Please paste some reviews to analyze.");
        setIsLoading(false);
        return;
      }
      formData.append('text', pastedText);
      setStatusMessage("Uploading reviews, tokenizing text payloads...");
    } else if (activeTab === 'csv') {
      if (!csvFile) {
        setErrorMsg("Please select a CSV review file.");
        setIsLoading(false);
        return;
      }
      formData.append('file', csvFile);
      endpoint = '/api/ingest/csv';
      setStatusMessage("Parsing CSV column layout and stratifying review ratings...");
    } else {
      if (!productUrl.trim()) {
        setErrorMsg("Please enter a valid product URL.");
        setIsLoading(false);
        return;
      }
      endpoint = '/api/ingest/url';
    }

    try {
      let response;
      if (activeTab === 'url') {
        setStatusMessage("Crawling review sections and scraping feedback contents...");
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: productUrl }),
        });
      } else {
        response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.detail || "Analysis extraction failed.");
      }

      setStatusMessage("Running structured schema alignment...");
      const result = await response.json();
      
      // Create the new dataset history item
      const newDataset = {
        id: Date.now(), // Unique ID
        name: result.name,
        source_type: result.source_type,
        source_url: result.source_url,
        buyer_insights: result.buyer_insights,
        seller_insights: result.seller_insights,
        created_at: new Date().toISOString()
      };

      // Save to history in localStorage
      const savedHistory = JSON.parse(localStorage.getItem('reviewlens_history') || '[]');
      savedHistory.unshift(newDataset);
      localStorage.setItem('reviewlens_history', JSON.stringify(savedHistory));

      // Navigate to dashboard
      router.push(`/dashboard?id=${newDataset.id}&t=${Date.now()}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to contact analysis server.");
      setIsLoading(false);
    }
  };

  const deleteDataset = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this dataset and its AI insights?")) return;
    try {
      const savedHistory = JSON.parse(localStorage.getItem('reviewlens_history') || '[]');
      const filtered = savedHistory.filter((item: any) => item.id !== id);
      localStorage.setItem('reviewlens_history', JSON.stringify(filtered));
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllHistory = () => {
    if (!confirm("Are you sure you want to clear all analysis history? This will delete all saved product insights and cannot be undone.")) return;
    try {
      localStorage.removeItem('reviewlens_history');
      fetchHistory();
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'csv': return <Upload className="w-3.5 h-3.5 text-neutral-400" />;
      case 'url': return <LinkIcon className="w-3.5 h-3.5 text-neutral-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 flex flex-col justify-center">
      
      {/* Dynamic Header Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-color)] text-[10px] font-mono tracking-wider uppercase text-[var(--accent-muted)] mb-6"
        >
          <Sparkles className="w-3 h-3 text-[var(--accent-muted)]" />
          <span>Engine v1.011 // Core Intelligence</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)] mb-4 font-sans"
        >
          Insights from reviews. <br />
          <span className="text-[var(--accent-muted)] opacity-70">In seconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md mx-auto text-sm text-[var(--accent-muted)] font-sans leading-relaxed"
        >
          Submit a product URL, paste reviews, or upload a CSV file to extract structured consumer verdict and roadmap diagnostics.
        </motion.p>
      </div>

      {/* Main Centered Container */}
      <div className="max-w-xl mx-auto w-full space-y-12">
        
        {/* Ingestion Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-6 sm:p-8 rounded-2xl"
        >
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              [ 01 // Ingestion Pipeline ]
            </span>
          </div>

          {/* Source Toggles (Segmented Control style) */}
          <div className="relative flex p-1 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] mb-8">
            {/* Sliding background */}
            <div 
              className="absolute inset-y-1 transition-all duration-300 ease-out bg-[var(--background)] rounded-md border border-[var(--border-color)] shadow-[0_1px_3px_rgba(0,0,0,0.15)]" 
              style={{
                width: 'calc(33.333% - 6px)',
                left: activeTab === 'url' ? '4px' : activeTab === 'text' ? 'calc(33.333% + 2px)' : 'calc(66.666% + 0px)'
              }} 
            />
            
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`relative z-10 flex-1 py-2 text-[10px] font-mono tracking-wider uppercase transition-colors duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'url' ? 'text-[var(--foreground)] font-semibold' : 'text-[var(--accent-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>URL</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`relative z-10 flex-1 py-2 text-[10px] font-mono tracking-wider uppercase transition-colors duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'text' ? 'text-[var(--foreground)] font-semibold' : 'text-[var(--accent-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>TEXT</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('csv')}
              className={`relative z-10 flex-1 py-2 text-[10px] font-mono tracking-wider uppercase transition-colors duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'csv' ? 'text-[var(--foreground)] font-semibold' : 'text-[var(--accent-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          {/* Ingestion Form with animations */}
          <form onSubmit={handleIngest} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {activeTab !== 'url' && (
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                      Dataset Reference Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Smart Watch Series 8 Reviews"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                      className="w-full glass-input px-3.5 py-3 text-sm focus:border-white/[0.2] focus:shadow-[0_0_12px_rgba(255,255,255,0.02)]"
                      disabled={isLoading}
                    />
                  </div>
                )}

                {activeTab === 'text' && (
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                      Reviews Content (one review per line)
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Example:&#10;Excellent device, battery lasts days!&#10;The charger was missing and customer service was slow...&#10;Great build, very scratch-resistant."
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      className="w-full glass-input px-3.5 py-3 text-sm font-sans focus:border-white/[0.2]"
                      disabled={isLoading}
                    />
                  </div>
                )}

                {activeTab === 'csv' && (
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                      Choose CSV File
                    </label>
                    <div className="border border-dashed border-[var(--border-color)] rounded-xl p-8 flex flex-col items-center justify-center hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] transition-all duration-300 cursor-pointer bg-transparent">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="csv-file-picker"
                        disabled={isLoading}
                      />
                      <label htmlFor="csv-file-picker" className="cursor-pointer flex flex-col items-center w-full">
                        <Upload className="w-6 h-6 text-neutral-500 mb-3" />
                        <span className="text-xs text-[var(--foreground)] opacity-90 font-sans font-medium">
                          {csvFile ? csvFile.name : "Select CSV review sheet"}
                        </span>
                        <span className="text-[10px] text-neutral-500 mt-1.5 font-mono">
                          Supports standard UTF-8 reviews tables
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'url' && (
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                      Product URL to Crawl
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.amazon.com/dp/B0CX123456"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      className="w-full glass-input px-3.5 py-3 text-sm focus:border-white/[0.2]"
                      disabled={isLoading}
                    />
                    <p className="text-[9px] text-neutral-500 mt-2 font-mono">
                      Scrapes and aggregates feedback metrics dynamically.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {errorMsg && (
              <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded font-mono">
                {errorMsg}
              </div>
            )}

            {/* Submit Trigger */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] transition-all duration-200 font-semibold rounded-lg text-xs tracking-wider uppercase font-mono flex items-center justify-center space-x-2 disabled:opacity-30 cursor-pointer active:scale-[0.99] transform"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Analysis</span>
                </>
              )}
            </button>
          </form>

          {/* Analysis Loading Status Panel */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-[var(--border-color)] flex items-center space-x-3 text-xs font-mono text-neutral-500"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                <span className="animate-pulse">{statusMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Center/Underneath History Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              [ 02 // History ]
            </span>
            {history.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="text-[10px] font-mono text-neutral-500 hover:text-red-400 cursor-pointer transition-colors bg-transparent border-0 p-0 flex items-center space-x-1"
              >
                <span>Clear All</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 rounded-xl border border-[var(--border-color)] bg-white/[0.01] text-xs text-neutral-600 font-mono">
              No active records
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/dashboard?id=${item.id}&t=${Date.now()}`)}
                  className="group relative w-full p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] flex items-center justify-center">
                      {getSourceIcon(item.source_type)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-medium text-[var(--foreground)] opacity-85 group-hover:opacity-100 transition-all truncate">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-neutral-500 font-mono mt-0.5">
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={(e) => deleteDataset(item.id, e)}
                      className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400 text-neutral-500 transition-all rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[var(--foreground)] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
