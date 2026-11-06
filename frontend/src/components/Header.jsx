import { Sparkles, Activity } from 'lucide-react';

export default function Header({ totalEvaluados }) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Smart ATS
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sistema Inteligente de Evaluación y Filtrado de Candidatos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>API:</span>
            <code className="text-emerald-400 font-mono">localhost:8000</code>
          </div>
          {totalEvaluados > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs font-medium text-indigo-300">
              {totalEvaluados} {totalEvaluados === 1 ? 'candidato evaluado' : 'candidatos evaluados'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

