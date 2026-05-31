'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link as LinkIcon, FileText, ChevronRight, Sparkles, Loader2, Play, Trash2 } from 'lucide-react';

interface Dataset {
  id: number;
  name: string;
  source_type: string;
  created_at: string;
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'text' | 'csv' | 'url'>('text');
  const [datasetName, setDatasetName] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  // Ingestion loading states
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // OAuth Simulated Session
  const [user, setUser] = useState<any>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  // History
  const [history, setHistory] = useState<Dataset[]>([]);

  useEffect(() => {
    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem('reviewlens_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/datasets', {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Could not load history from backend. Make sure FastAPI server is running.", e);
    }
  };

  const handleMockLogin = (provider: 'google' | 'github') => {
    setIsLoggingIn(provider);
    setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/auth/mock-login/${provider}?email=partner-${provider}@reviewlens.io`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('reviewlens_user', JSON.stringify(data.user));
        }
      } catch (err) {
        // Local fallback if backend is down
        const mockUser = {
          name: `Premium User (${provider.charAt(0).toUpperCase() + provider.slice(1)})`,
          email: `partner-${provider}@reviewlens.io`,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=partner-${provider}`,
          tier: "Premium Partner",
          provider
        };
        setUser(mockUser);
        localStorage.setItem('reviewlens_user', JSON.stringify(mockUser));
      } finally {
        setIsLoggingIn(null);
      }
    }, 1200);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('reviewlens_user');
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetName.trim()) {
      setErrorMsg("Please specify a friendly name for this dataset.");
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setStatusMessage("Connecting to analysis engine...");

    const formData = new FormData();
    formData.append('name', datasetName);

    let endpoint = 'http://localhost:8000/api/ingest/text';

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
      endpoint = 'http://localhost:8000/api/ingest/csv';
      setStatusMessage("Parsing CSV column layout and stratifying review ratings...");
    } else {
      if (!productUrl.trim()) {
        setErrorMsg("Please enter a valid product URL.");
        setIsLoading(false);
        return;
      }
      // URL ingest accepts JSON
      endpoint = 'http://localhost:8000/api/ingest/url';
    }

    try {
      let response;
      if (activeTab === 'url') {
        setStatusMessage("Crawling review sections and scraping feedback contents...");
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: datasetName, url: productUrl }),
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

      setStatusMessage("Running structured schema alignment via OpenAI structured outputs...");
      const result = await response.json();
      
      // Navigate to dashboard
      router.push(`/dashboard?id=${result.dataset_id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to contact analysis server. Ensure python backend is running.");
      setIsLoading(false);
    }
  };

  const deleteDataset = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this dataset and its AI insights?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/datasets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'csv': return <Upload className="w-4 h-4 text-emerald-400" />;
      case 'url': return <LinkIcon className="w-4 h-4 text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col justify-center">
      
      {/* Dynamic Header Section */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-300 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-neutral-400 animate-pulse" />
          <span>Smarter Review Analytics Engine</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4"
        >
          Turn thousands of reviews into <br />
          <span className="text-gradient-silver">insights in seconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto text-sm sm:text-base text-[var(--accent-muted)] font-sans"
        >
          Understand the verdict before buying, or discover product complaints and immediate roadmap improvements if you are a seller.
        </motion.p>
      </div>

      {/* Main Grid: Upload Panel & OAuth / History Sidepanel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto w-full">
        
        {/* Left/Middle Column: Ingestion Card */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 flex flex-col justify-between h-full min-h-[480px]">
          <div>
            <h2 className="text-lg font-semibold mb-6 flex items-center space-x-2 text-slate-900 dark:text-white">
              <Sparkles className="w-5 h-5 text-[var(--accent-muted)]" />
              <span>Ingestion Pipeline</span>
            </h2>

            {/* Source Toggles */}
            <div className="flex border-b border-[var(--border-color)] mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'text'
                    ? 'border-[var(--accent)] text-[var(--foreground)]'
                    : 'border-transparent text-[var(--accent-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Raw Text Paste</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('csv')}
                className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'csv'
                    ? 'border-[var(--accent)] text-[var(--foreground)]'
                    : 'border-transparent text-[var(--accent-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'url'
                    ? 'border-[var(--accent)] text-[var(--foreground)]'
                    : 'border-transparent text-[var(--accent-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Product URL</span>
              </button>
            </div>

            {/* Ingestion Forms */}
            <form onSubmit={handleIngest} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                  Dataset Reference Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smart Watch Series 8 Reviews"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 text-sm"
                  disabled={isLoading}
                />
              </div>

              {activeTab === 'text' && (
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                    Reviews Content (one review per line)
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Example:&#10;Excellent device, battery lasts days!&#10;The charger was missing and customer service was slow...&#10;Great build, very scratch-resistant."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 text-sm font-sans"
                    disabled={isLoading}
                  />
                </div>
              )}

              {activeTab === 'csv' && (
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                    Choose CSV File
                  </label>
                  <div className="border border-dashed border-white/[0.08] rounded-lg p-8 flex flex-col items-center justify-center hover:border-white/[0.2] transition-colors cursor-pointer bg-white/[0.01]">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="csv-file-picker"
                      disabled={isLoading}
                    />
                    <label htmlFor="csv-file-picker" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-neutral-500 mb-2" />
                      <span className="text-xs text-neutral-300">
                        {csvFile ? csvFile.name : "Click to select or drop CSV review sheet"}
                      </span>
                      <span className="text-[10px] text-neutral-500 mt-1">
                        Supports multi-megabyte datasets (CSV, Excel exported formats)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'url' && (
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                    Product URL to Crawl
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.amazon.com/dp/B0CX123456"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 text-sm"
                    disabled={isLoading}
                  />
                  <p className="text-[10px] text-neutral-500 mt-1.5 font-mono">
                    Scrapes and aggregates feedback metrics dynamically.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded font-mono">
                  {errorMsg}
                </div>
              )}

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-white text-black hover:bg-neutral-200 transition-colors duration-200 font-semibold rounded-lg text-sm flex items-center justify-center space-x-2 disabled:opacity-40"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing reviews...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Analysis & Extract Insights</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Analysis Loading Status Panel */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/[0.06] flex items-center space-x-3 text-xs font-mono text-neutral-400"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-300" />
                <span className="animate-pulse">{statusMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Premium Auth Panel & Ingestion History */}
        <div className="space-y-6">
          
          {/* Simulated Premium Auth */}
          <div className="glass-panel p-6">
            <h3 className="text-xs font-mono text-[var(--accent-muted)] uppercase tracking-widest mb-4">
              Premium Portal
            </h3>

            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-[var(--surface)] border border-[var(--border-color)] p-3 rounded-lg">
                  <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-[var(--border-color)]" />
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">{user.name}</h4>
                    <p className="text-xs text-[var(--accent-muted)]">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--accent-muted)] border border-[var(--border-color)]">
                    {user.tier}
                  </span>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-400 cursor-pointer">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[var(--accent-muted)] font-sans leading-relaxed mb-1">
                  Access enterprise dashboard caching and large multi-megabyte CSV processing by linking your account.
                </p>
                <button
                  onClick={() => handleMockLogin('google')}
                  disabled={isLoggingIn !== null}
                  className="w-full py-2.5 px-3 rounded bg-[var(--surface)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] text-xs font-medium text-[var(--foreground)] flex items-center justify-center space-x-2 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isLoggingIn === 'google' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                  )}
                  <span>Sign in with Google OAuth</span>
                </button>
                <button
                  onClick={() => handleMockLogin('github')}
                  disabled={isLoggingIn !== null}
                  className="w-full py-2.5 px-3 rounded bg-[var(--surface)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] text-xs font-medium text-[var(--foreground)] flex items-center justify-center space-x-2 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isLoggingIn === 'github' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  )}
                  <span>Sign in with GitHub OAuth</span>
                </button>
              </div>
            )}
          </div>

          {/* History / Previously Parsed Datasets */}
          <div className="glass-panel p-6">
            <h3 className="text-xs font-mono text-[var(--accent-muted)] uppercase tracking-widest mb-4">
              Analysis History
            </h3>
            
            {history.length === 0 ? (
              <div className="text-center py-6 text-xs text-[var(--accent-muted)] font-mono">
                No analyzed datasets found.
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/dashboard?id=${item.id}`)}
                    className="group w-full p-3 text-left rounded-lg bg-[var(--surface)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center">
                        {getSourceIcon(item.source_type)}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[var(--accent-muted)] font-mono mt-0.5">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => deleteDataset(item.id, e)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-400 text-[var(--accent-muted)] transition-all rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-[var(--accent-muted)] group-hover:text-[var(--foreground)] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
