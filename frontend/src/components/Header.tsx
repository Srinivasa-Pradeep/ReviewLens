'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Sparkles } from 'lucide-react';

export default function Header() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('reviewlens_theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      setTheme(systemTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('reviewlens_theme', nextTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(nextTheme);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--background)]/60 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neutral-400 via-neutral-100 to-white flex items-center justify-center shadow-md">
              <span className="text-black font-extrabold text-sm font-mono">RL</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-[var(--foreground)] font-sans transition-colors">
              Review<span className="text-[var(--accent-muted)]">Lens</span>
            </span>
          </div>
          
          <nav className="flex items-center space-x-3">
            {/* Animated Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] text-[var(--accent-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer flex items-center justify-center focus:outline-none overflow-hidden h-9 w-9"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -45, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 45, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-200"
                    >
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 45, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -45, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setIsHelpOpen(true)}
              className="py-2 px-3.5 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] text-xs font-semibold text-[var(--accent-muted)] hover:text-[var(--foreground)] transition-all cursor-pointer flex items-center space-x-2 focus:outline-none"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to Use</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Guide/Instructions Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg glass-panel bg-[var(--background)]/95 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[90vh] shadow-2xl border border-[var(--border-color)] z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[var(--foreground)]" />
                  <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">ReviewLens User Guide</h3>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-1 text-[var(--accent-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Instructions steps */}
              <div className="space-y-5 text-sm leading-relaxed">
                
                {/* Step 1 */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-[var(--foreground)] flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs font-mono flex items-center justify-center">1</span>
                    <span>Ingesting Review Data</span>
                  </h4>
                  <p className="text-xs text-[var(--accent-muted)] pl-7">
                    Submit reviews using three methods: paste raw reviews (one per line), drag-and-drop a CSV spreadsheet (we auto-detect review text columns), or provide a product URL to simulate a live crawl.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-[var(--foreground)] flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs font-mono flex items-center justify-center">2</span>
                    <span>Buyer Mode Insights</span>
                  </h4>
                  <p className="text-xs text-[var(--accent-muted)] pl-7">
                    Designed for B2C consumers. View the definitive buying verdict badge (e.g. <strong>Strong Buy</strong> or <strong>Avoid</strong>), read AI summaries, audit sentiment distributions, check dimension rankings, and extract core highlights.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-[var(--foreground)] flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs font-mono flex items-center justify-center">3</span>
                    <span>Seller Mode Analytics</span>
                  </h4>
                  <p className="text-xs text-[var(--accent-muted)] pl-7">
                    For product teams. Track ranked customer complaint scores (impact vs. volume), review journey timelines (e.g. day 1 setup errors), check product categories clustering, and follow strategic fixes or gaps recommendations.
                  </p>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-full py-2.5 px-4 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] transition-all font-semibold text-xs rounded-lg cursor-pointer"
              >
                Got it, let's explore!
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
