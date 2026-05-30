'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Sparkles, Upload, FileText, BarChart3, HelpCircle as HelpIcon } from 'lucide-react';

export default function Header() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neutral-400 via-neutral-100 to-white flex items-center justify-center shadow-md">
              <span className="text-black font-extrabold text-sm font-mono">RL</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-white font-sans">
              Review<span className="text-neutral-400">Lens</span>
            </span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="py-2 px-3.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14] text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center space-x-2 focus:outline-none"
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
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg glass-panel bg-black/95 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[90vh] shadow-2xl border border-white/[0.08] z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-neutral-300" />
                  <h3 className="text-lg font-bold text-white tracking-tight">ReviewLens User Guide</h3>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-1 text-neutral-500 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Instructions steps */}
              <div className="space-y-5 text-sm leading-relaxed">
                
                {/* Step 1 */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-neutral-200 text-xs font-mono flex items-center justify-center">1</span>
                    <span>Ingesting Review Data</span>
                  </h4>
                  <p className="text-xs text-neutral-400 pl-7">
                    Submit reviews using three methods: paste raw reviews (one per line), drag-and-drop a multi-megabyte CSV spreadsheet (we auto-detect review text columns), or provide a product URL to simulate a live crawl.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-neutral-200 text-xs font-mono flex items-center justify-center">2</span>
                    <span>Buyer Mode Insights</span>
                  </h4>
                  <p className="text-xs text-neutral-400 pl-7">
                    Designed for B2C consumers. View the definitive buying verdict badge (e.g. <strong>Strong Buy</strong> or <strong>Avoid</strong>), read AI summaries, audit sentiment distributions, check dimension rankings, and extract core highlights.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-neutral-200 text-xs font-mono flex items-center justify-center">3</span>
                    <span>Seller Mode Analytics</span>
                  </h4>
                  <p className="text-xs text-neutral-400 pl-7">
                    For product teams. Track ranked customer complaint scores (impact vs. volume), review journey timelines (e.g. day 1 setup errors), check product categories clustering, and follow strategic fixes or gaps recommendations.
                  </p>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-full py-2.5 px-4 bg-white text-black font-semibold hover:bg-neutral-200 transition-colors text-xs rounded-lg cursor-pointer"
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
