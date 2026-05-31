'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, HelpCircle, AlertOctagon, 
  TrendingUp, TrendingDown, Clock, ShieldAlert, Zap, FileText, BarChart3, 
  Activity, Sparkles, ChevronRight, MessageSquare 
} from 'lucide-react';

// Domain model typings from schema
interface Sentiment {
  positive_percentage: number;
  neutral_percentage: number;
  negative_percentage: number;
}

interface FrequencyItem {
  term: string;
  count: number;
  percentage: number;
}

interface ThematicScore {
  category: string;
  score: number;
}

interface ReviewHighlight {
  category: string;
  quote: string;
  sentiment: string;
}

interface BuyerInsights {
  verdict: string;
  verdict_explanation: string;
  ai_summary: string;
  sentiment_overview: Sentiment;
  top_pros: FrequencyItem[];
  top_cons: FrequencyItem[];
  thematic_scores: ThematicScore[];
  comparison_insights: string;
  categorized_highlights: ReviewHighlight[];
}

interface ComplaintItem {
  issue: string;
  impact_score: number;
  volume: number;
  severity: string;
  root_cause: string;
}

interface TimelineEvent {
  stage_or_time: string;
  issue: string;
  diagnostic: string;
}

interface FeatureRequest {
  feature: string;
  count: number;
  sample_quote: string;
}

interface ClusterItem {
  category: string;
  issue: string;
  frequency: number;
}

interface SellerInsights {
  ranked_complaints: ComplaintItem[];
  root_cause_timeline: TimelineEvent[];
  extracted_feature_requests: FeatureRequest[];
  clustered_feedback: ClusterItem[];
  immediate_fixes: string[];
  short_term_improvements: string[];
  long_term_roadmap: string[];
  competitor_gaps: string[];
}

interface AnalysisData {
  id?: number;
  dataset_id?: number;
  name: string;
  source_type: string;
  source_url?: string;
  buyer_insights: BuyerInsights;
  seller_insights: SellerInsights;
  created_at: string;
}

// Suspense Boundary Wrapper for Next.js Search Params
export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--background)] min-h-[500px]">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--foreground)]" />
        <span className="mt-4 text-xs font-mono text-[var(--accent-muted)]">Loading analysis portal...</span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const datasetId = searchParams.get('id');
  const t = searchParams.get('t');

  const [mode, setMode] = useState<'buyer' | 'seller'>('buyer');
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Recharts hydration fix
  const [mounted, setMounted] = useState(false);
  // Seller cluster filter category state
  const [selectedClusterTab, setSelectedClusterTab] = useState<string>('All');

  useEffect(() => {
    setMounted(true);
    if (datasetId) {
      fetchAnalysis(datasetId);
    } else {
      router.push('/');
    }
  }, [datasetId, t]);

  const fetchAnalysis = (id: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const savedHistory = JSON.parse(localStorage.getItem('reviewlens_history') || '[]');
      const result = savedHistory.find((item: any) => item.id.toString() === id);
      if (!result) {
        throw new Error("Could not find analysis results for this dataset in local history.");
      }
      setData(result);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch dataset analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--background)]">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent-muted)]" />
        <span className="mt-4 text-xs font-mono text-[var(--accent-muted)]">Extracting NLP intelligence layer...</span>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 glass-panel text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2">Analysis Unreachable</h3>
        <p className="text-sm text-[var(--accent-muted)] font-mono mb-6">{errorMsg || "Dataset records are invalid."}</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded text-xs hover:bg-[var(--accent)] transition-colors cursor-pointer"
        >
          Return to Ingestion
        </button>
      </div>
    );
  }

  // Sentiment Pie Chart data formulation
  const sentiment = data.buyer_insights.sentiment_overview;
  const pieData = [
    { name: 'Positive', value: sentiment.positive_percentage, color: '#10B981' },
    { name: 'Neutral', value: sentiment.neutral_percentage, color: '#6B7280' },
    { name: 'Negative', value: sentiment.negative_percentage, color: '#EF4444' }
  ];

  // Verdict style mapper
  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case 'Strong Buy':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
          colorClass: 'text-emerald-800 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 glow-strong-buy',
          bgBadge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
        };
      case 'Buy with Caution':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-yellow-400" />,
          colorClass: 'text-amber-800 dark:text-yellow-400 bg-amber-500/10 dark:bg-yellow-950/20 border border-amber-200 dark:border-yellow-900/40 glow-buy-caution',
          bgBadge: 'bg-yellow-500/10 text-amber-600 dark:text-yellow-400 border border-yellow-500/20'
        };
      case 'Only Buy on Discount':
        return {
          icon: <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
          colorClass: 'text-blue-800 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 glow-discount',
          bgBadge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
        };
      default: // Avoid
        return {
          icon: <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />,
          colorClass: 'text-red-800 dark:text-red-400 bg-red-500/10 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 glow-avoid',
          bgBadge: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
        };
    }
  };

  const verdictStyle = getVerdictStyles(data.buyer_insights.verdict);

  // Group clusters
  const clusterCategories = ['All', 'Product Quality', 'Packaging', 'Customer Service', 'Delivery', 'Pricing', 'User Experience'];
  const filteredClusters = selectedClusterTab === 'All' 
    ? data.seller_insights.clustered_feedback 
    : data.seller_insights.clustered_feedback.filter(c => c.category === selectedClusterTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[var(--border-color)] pb-6 mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-neutral-300" />
          </button>
          <div>
            {data.source_type === 'url' && (
              <div className="text-[10px] font-mono text-slate-500 dark:text-neutral-500 mb-0.5">
                <span className="uppercase tracking-wider">Source: </span>
                <a href={data.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-800 dark:hover:text-slate-200 transition-colors break-all normal-case font-normal">{data.source_url || "URL"}</a>
              </div>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{data.name}</h1>
          </div>
        </div>

        {/* Dynamic sliding mode selector */}
        <div className="relative flex p-1 bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-xl self-stretch sm:self-auto">
          <button
            onClick={() => setMode('buyer')}
            className={`relative z-10 px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
              mode === 'buyer' ? 'text-black font-semibold' : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Buyer View</span>
          </button>
          <button
            onClick={() => setMode('seller')}
            className={`relative z-10 px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
              mode === 'seller' ? 'text-black font-semibold' : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Seller Analytics</span>
          </button>
          
          {/* Animated sliding slider pill */}
          <motion.div
            layoutId="activeTabPill"
            className="absolute top-1 bottom-1 bg-white shadow-sm rounded-lg"
            animate={{
              left: mode === 'buyer' ? '4px' : 'calc(50% + 2px)',
              right: mode === 'buyer' ? 'calc(50% + 2px)' : '4px',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        </div>
      </div>

      {/* Main Stateful Views */}
      <AnimatePresence mode="wait">
        {mode === 'buyer' ? (
          <motion.div
            key="buyer-mode"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            
            {/* Top row: Verdict and Sentiment Donut */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Verdict Card */}
              <div className={`md:col-span-2 glass-panel p-6 sm:p-8 flex flex-col justify-between ${verdictStyle.colorClass}`}>
                <div>
                  <div className="flex items-center space-x-2.5 mb-4">
                    {verdictStyle.icon}
                    <span className="text-xs font-mono tracking-widest uppercase font-semibold">Buying Verdict</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                    {data.buyer_insights.verdict}
                  </h2>
                  <p className="text-sm font-sans text-slate-700 dark:text-white/80 max-w-xl leading-relaxed">
                    {data.buyer_insights.verdict_explanation}
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-slate-500 dark:text-white/50 font-mono">
                  <span>Recommendation Tier</span>
                  <span className="font-semibold uppercase tracking-wider">ReviewLens AI Audited</span>
                </div>
              </div>

              {/* Sentiment Overview Chart */}
              <div className="glass-panel p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-4">Sentiment Overview</h3>
                  <div className="h-[160px] relative">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                            labelClassName="text-[var(--foreground)] font-mono text-xs"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{sentiment.positive_percentage}%</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-500 uppercase">Positive</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono border-t border-[var(--border-color)] pt-4 mt-2">
                  <div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-1" />
                    <span className="text-slate-600 dark:text-neutral-400">Pos {sentiment.positive_percentage}%</span>
                  </div>
                  <div>
                    <div className="w-2 h-2 rounded-full bg-neutral-500 mx-auto mb-1" />
                    <span className="text-slate-600 dark:text-neutral-400">Neu {sentiment.neutral_percentage}%</span>
                  </div>
                  <div>
                    <div className="w-2 h-2 rounded-full bg-red-500 mx-auto mb-1" />
                    <span className="text-slate-600 dark:text-neutral-400">Neg {sentiment.negative_percentage}%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Middle Row: AI Summary & Thematic dimension scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* AI Summary */}
              <div className="md:col-span-2 glass-panel p-6 sm:p-8">
                <h3 className="text-xs font-mono text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-4 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-slate-700 dark:text-neutral-300" />
                  <span>AI Executive Summary</span>
                </h3>
                <p className="text-sm font-sans text-slate-800 dark:text-neutral-200 leading-relaxed">
                  {data.buyer_insights.ai_summary}
                </p>
                <div className="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-white/[0.01] border border-[var(--border-color)]">
                  <span className="block text-[10px] font-mono text-slate-500 dark:text-neutral-500 uppercase tracking-wider mb-2">Market Comparison Insights</span>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-sans">{data.buyer_insights.comparison_insights}</p>
                </div>
              </div>

              {/* Thematic scores */}
              <div className="glass-panel p-6">
                <h3 className="text-xs font-mono text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-6">Thematic Dimension Ratings</h3>
                <div className="space-y-4">
                  {data.buyer_insights.thematic_scores.map((theme, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-neutral-200">{theme.category}</span>
                        <span className="font-mono text-slate-900 dark:text-white">{theme.score.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden border border-[var(--border-color)]">
                        <div 
                          className="h-full bg-gradient-to-r from-neutral-500 to-white rounded-full"
                          style={{ width: `${(theme.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Pros and Cons side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pros */}
              <div className="glass-panel p-6 border-l-2 border-l-emerald-500/40">
                <h3 className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-6 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Top Positive Mentions (Pros)</span>
                </h3>
                <div className="space-y-4">
                  {data.buyer_insights.top_pros.map((pro, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-800 dark:text-neutral-200 font-medium">{pro.term}</span>
                        <span className="text-slate-600 dark:text-neutral-400 font-mono">
                          {pro.count} mentions ({pro.percentage}%)
                        </span>
                      </div>
                      <div className="h-1 bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pro.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div className="glass-panel p-6 border-l-2 border-l-red-500/40">
                <h3 className="text-xs font-mono text-red-600 dark:text-red-400 uppercase tracking-widest mb-6 flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4" />
                  <span>Top Negative Mentions (Cons)</span>
                </h3>
                <div className="space-y-4">
                  {data.buyer_insights.top_cons.map((con, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-800 dark:text-neutral-200 font-medium">{con.term}</span>
                        <span className="text-slate-600 dark:text-neutral-400 font-mono">
                          {con.count} mentions ({con.percentage}%)
                        </span>
                      </div>
                      <div className="h-1 bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${con.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Categorized review highlights / quotes */}
            <div className="glass-panel p-6 sm:p-8">
              <h3 className="text-xs font-mono text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-6 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
                <span>Extracted Review Highlights</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.buyer_insights.categorized_highlights.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] flex flex-col justify-between">
                    <p className="text-xs italic text-slate-700 dark:text-neutral-300 font-sans leading-relaxed mb-4">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono border-t border-[var(--border-color)] pt-2">
                      <span className="text-slate-500 dark:text-neutral-500 uppercase">{item.category}</span>
                      <span className={item.sentiment === 'Positive' ? 'text-emerald-600 dark:text-emerald-400' : item.sentiment === 'Negative' ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-neutral-400'}>
                        {item.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="seller-mode"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            
            {/* Top row: strategic action boxes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Immediate Fixes */}
              <div className="glass-panel p-5 border-t-2 border-t-red-500/50">
                <span className="text-[10px] font-mono text-red-500 dark:text-red-400 uppercase tracking-widest font-semibold flex items-center space-x-1 mb-3">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Immediate Fixes</span>
                </span>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-neutral-300">
                  {data.seller_insights.immediate_fixes.map((fix, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-red-500 dark:text-red-400 select-none">•</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Short-term improvements */}
              <div className="glass-panel p-5 border-t-2 border-t-yellow-500/50">
                <span className="text-[10px] font-mono text-amber-600 dark:text-yellow-400 uppercase tracking-widest font-semibold flex items-center space-x-1 mb-3">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Short-term Iteration</span>
                </span>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-neutral-300">
                  {data.seller_insights.short_term_improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-500 dark:text-yellow-400 select-none">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Long term roadmap */}
              <div className="glass-panel p-5 border-t-2 border-t-blue-500/50">
                <span className="text-[10px] font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest font-semibold flex items-center space-x-1 mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Long-term Roadmap</span>
                </span>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-neutral-300">
                  {data.seller_insights.long_term_roadmap.map((road, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-blue-500 dark:text-blue-400 select-none">•</span>
                      <span>{road}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competitor Gaps */}
              <div className="glass-panel p-5 border-t-2 border-t-neutral-400/50">
                <span className="text-[10px] font-mono text-slate-600 dark:text-neutral-300 uppercase tracking-widest font-semibold flex items-center space-x-1 mb-3">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Competitor Gaps</span>
                </span>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-neutral-300">
                  {data.seller_insights.competitor_gaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-slate-600 dark:text-neutral-300 select-none">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Ranked complaints matrix */}
            <div className="glass-panel p-6 sm:p-8">
              <h3 className="text-xs font-mono text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-6">Ranked Complaint Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-slate-500 dark:text-neutral-400 font-mono uppercase tracking-wider pb-3">
                      <th className="pb-3 font-semibold">Issue</th>
                      <th className="pb-3 font-semibold text-center">Impact Score (1-10)</th>
                      <th className="pb-3 font-semibold text-center">Volume</th>
                      <th className="pb-3 font-semibold">Severity</th>
                      <th className="pb-3 font-semibold">Inferred Root Cause</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.seller_insights.ranked_complaints.map((comp, idx) => (
                      <tr key={idx} className="border-b border-[var(--border-color)] hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 font-semibold text-slate-900 dark:text-white pr-4">{comp.issue}</td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                            comp.impact_score >= 8 
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30' 
                              : comp.impact_score >= 5 
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30' 
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30'
                          }`}>
                            {comp.impact_score}/10
                          </span>
                        </td>
                        <td className="py-4 text-center font-mono text-slate-700 dark:text-neutral-300">{comp.volume}</td>
                        <td className="py-4">
                          <span className={`text-[10px] font-mono uppercase font-semibold ${
                            comp.severity === 'High' ? 'text-red-600 dark:text-red-400' : comp.severity === 'Medium' ? 'text-amber-500 dark:text-yellow-400' : 'text-slate-500 dark:text-neutral-400'
                          }`}>
                            {comp.severity}
                          </span>
                        </td>
                        <td className="py-4 text-slate-600 dark:text-neutral-400 font-sans leading-relaxed pl-2">{comp.root_cause}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clustering & Feature Requests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Clustering Grid */}
              <div className="md:col-span-2 glass-panel p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                    <h3 className="text-xs font-mono text-slate-500 dark:text-neutral-400 uppercase tracking-widest">
                      Clustered Customer Feedback
                    </h3>
                    
                    {/* Cluster Category Selector */}
                    <select
                      value={selectedClusterTab}
                      onChange={(e) => setSelectedClusterTab(e.target.value)}
                      className="bg-[var(--background)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--foreground)] rounded px-2.5 py-1.5 focus:outline-none focus:border-[var(--accent)]"
                    >
                      {clusterCategories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    {filteredClusters.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 dark:text-neutral-500 font-mono text-xs">
                        No feedback items in this cluster.
                      </div>
                    ) : (
                      filteredClusters.map((cluster, i) => (
                        <div key={i} className="p-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-500 dark:text-neutral-500 uppercase tracking-wider">
                              {cluster.category}
                            </span>
                            <p className="text-xs text-slate-800 dark:text-neutral-200 font-sans">{cluster.issue}</p>
                          </div>
                          <span className="text-xs font-mono text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded">
                            {cluster.frequency}x
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Feature requests */}
              <div className="glass-panel p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-6">
                    Extracted Feature Requests
                  </h3>
                  
                  <div className="space-y-4">
                    {data.seller_insights.extracted_feature_requests.map((req, i) => (
                      <div key={i} className="space-y-2 border-b border-[var(--border-color)] pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-900 dark:text-white">{req.feature}</span>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-500">{req.count} requests</span>
                        </div>
                        <p className="text-[11px] italic text-slate-600 dark:text-neutral-400 font-sans leading-relaxed">
                          &ldquo;{req.sample_quote}&ldquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Root cause timeline diagnostics */}
            <div className="glass-panel p-6 sm:p-8">
              <h3 className="text-xs font-mono text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-8">
                Root Cause Customer Journey Timeline
              </h3>
              
              <div className="relative border-l border-[var(--border-color)] ml-4 space-y-8 pb-4">
                {data.seller_insights.root_cause_timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-6">
                    {/* Timeline dot */}
                    <div className="absolute -left-[5.5px] top-1.5 w-[10px] h-[10px] rounded-full bg-slate-200 dark:bg-neutral-800 border-2 border-[var(--accent)]" />
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-500 uppercase tracking-widest font-semibold block">
                        {event.stage_or_time}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans">{event.issue}</h4>
                      <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-sans max-w-2xl">{event.diagnostic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
