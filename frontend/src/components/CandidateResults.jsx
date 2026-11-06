import { useState } from 'react';
import {
  Award,
  Briefcase,
  Code2,
  LayoutGrid,
  Table as TableIcon,
  Trash2,
  UserCheck,
} from 'lucide-react';

/**
 * Devuelve clases de color dinámicas según el match_score (0 - 100)
 */
function getScoreBadgeStyle(score) {
  const num = Number(score) || 0;
  if (num >= 80) {
    return {
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 ring-emerald-500/20',
      bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      label: 'Alto Match',
    };
  }
  if (num >= 60) {
    return {
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40 ring-amber-500/20',
      bar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      label: 'Match Medio',
    };
  }
  return {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/40 ring-rose-500/20',
    bar: 'bg-gradient-to-r from-rose-500 to-orange-500',
    label: 'Match Bajo',
  };
}

export default function CandidateResults({ candidates, onClear }) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  if (!candidates || candidates.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <UserCheck className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300">
          Sin candidatos evaluados aún
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Envía un CV en texto plano o sube un archivo CSV por lotes para visualizar las tarjetas de compatibilidad y el <code className="text-slate-400">match_score</code> calculado por Gemini.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Barra de controles de resultados */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 px-5 py-3.5 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">
            Resultados de Evaluación
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            {candidates.length} {candidates.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Tarjetas
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Tabla
            </button>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors"
            title="Limpiar resultados de la vista"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vista en Tarjetas (Cards) */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((cand, idx) => {
            const score = Number(cand.match_score ?? 0);
            const styles = getScoreBadgeStyle(score);
            const skills = Array.isArray(cand.habilidades_tecnicas)
              ? cand.habilidades_tecnicas
              : [];

            return (
              <article
                key={`${cand.name}-${idx}`}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all"
              >
                <div>
                  {/* Cabecera con Nombre y Match Score destacado */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Candidato
                      </span>
                      <h3 className="text-base font-bold text-white truncate">
                        {cand.name || 'Sin nombre'}
                      </h3>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-xl border ring-2 text-right shrink-0 ${styles.badge}`}
                    >
                      <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                        Match Score
                      </div>
                      <div className="text-lg font-extrabold leading-tight">
                        {score.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Barra visual de Match Score */}
                  <div className="mb-4">
                    <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                        style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                      <span>{styles.label}</span>
                      <span>Guardado en Supabase</span>
                    </div>
                  </div>

                  {/* Años de experiencia */}
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800/80 mb-3">
                    <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Experiencia profesional:</span>
                    <strong className="text-white ml-auto">
                      {cand.experiencia_years ?? 0}{' '}
                      {cand.experiencia_years === 1 ? 'año' : 'años'}
                    </strong>
                  </div>

                  {/* Habilidades técnicas */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2">
                      <Code2 className="w-3.5 h-3.5 text-violet-400" />
                      <span>Habilidades Técnicas ({skills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.length > 0 ? (
                        skills.map((skill, sIdx) => (
                          <span
                            key={`${skill}-${sIdx}`}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/70"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          Sin habilidades especificadas
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Vista en Tabla Estructurada */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Candidato</th>
                  <th className="py-3.5 px-4">Experiencia</th>
                  <th className="py-3.5 px-4">Habilidades Técnicas</th>
                  <th className="py-3.5 px-4 text-right">Match Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-sm">
                {candidates.map((cand, idx) => {
                  const score = Number(cand.match_score ?? 0);
                  const styles = getScoreBadgeStyle(score);
                  const skills = Array.isArray(cand.habilidades_tecnicas)
                    ? cand.habilidades_tecnicas
                    : [];

                  return (
                    <tr
                      key={`${cand.name}-${idx}`}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                        {cand.name || 'Sin nombre'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {cand.experiencia_years ?? 0}{' '}
                        {cand.experiencia_years === 1 ? 'año' : 'años'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((skill, sIdx) => (
                            <span
                              key={`${skill}-${sIdx}`}
                              className="px-2 py-0.5 rounded-md text-xs bg-slate-800 text-slate-200 border border-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border ${styles.badge}`}
                        >
                          {score.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

