import { useState } from 'react';

const LIT_PANELS = ['taste-panel-sky', 'taste-panel-sand', 'taste-panel-sage'];

function getScoreMeta(score) {
  const num = Number(score) || 0;
  if (num >= 80) {
    return {
      label: 'Compatibilidad alta',
      pill: 'bg-[#111111] text-[#ffffff]',
      barColor: '#1a4be0',
    };
  }
  if (num >= 60) {
    return {
      label: 'Compatibilidad media',
      pill: 'bg-[#f4f4f4] text-[#111111] border border-[#111111]/20',
      barColor: '#111111',
    };
  }
  return {
    label: 'Compatibilidad baja',
    pill: 'bg-[#f4f4f4] text-[#6b6b6b] border border-[#111111]/15',
    barColor: '#6b6b6b',
  };
}

export default function CandidateResults({ candidates, onClear }) {
  const [viewMode, setViewMode] = useState('cards');

  const hasCandidates = Array.isArray(candidates) && candidates.length > 0;

  return (
    <section
      id="resultados"
      className="py-24 bg-[#f4f4f4] border-t border-[#111111]/10"
    >
      <div className="taste-wrap space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-[62ch]">
            <h2 className="taste-h2">
              Candidatos evaluados y puntaje de compatibilidad.{' '}
              <span className="text-[#6b6b6b]">
                Ordenados por ingreso desde la API en la nube.
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasCandidates && (
              <>
                <div
                  role="tablist"
                  aria-label="Modo de visualización"
                  className="inline-flex rounded-[8px] bg-[#ffffff] p-1 border border-[#111111]/12"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'cards'}
                    onClick={() => setViewMode('cards')}
                    className={`px-3.5 py-1.5 rounded-[6px] text-[14px] font-medium transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-[#111111] text-[#ffffff]'
                        : 'text-[#6b6b6b] hover:text-[#111111]'
                    }`}
                  >
                    Tarjetas
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'table'}
                    onClick={() => setViewMode('table')}
                    className={`px-3.5 py-1.5 rounded-[6px] text-[14px] font-medium transition-colors ${
                      viewMode === 'table'
                        ? 'bg-[#111111] text-[#ffffff]'
                        : 'text-[#6b6b6b] hover:text-[#111111]'
                    }`}
                  >
                    Tabla estructurada
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClear}
                  className="taste-btn-secondary h-[40px] px-4 text-[14px] bg-[#ffffff]"
                >
                  Limpiar lista
                </button>
              </>
            )}
          </div>
        </div>

        {!hasCandidates ? (
          <div className="taste-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-[58ch]">
              <p className="text-[13px] font-medium text-[#6b6b6b]">
                Bandeja de evaluación vacía
              </p>
              <h3 className="text-[20px] font-medium text-[#111111]">
                Aún no se han procesado currículums en esta sesión
              </h3>
              <p className="text-[16px] text-[#6b6b6b]">
                Utiliza el formulario superior para enviar documentos PDF al endpoint{' '}
                <code className="font-mono text-[14px] text-[#111111]">/analizar-pdf</code> o sube un archivo CSV a{' '}
                <code className="font-mono text-[14px] text-[#111111]">/procesar-batch</code>.
              </p>
            </div>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((cand, idx) => {
              const score = Number(cand.match_score ?? 0);
              const meta = getScoreMeta(score);
              const skills = Array.isArray(cand.habilidades_tecnicas)
                ? cand.habilidades_tecnicas
                : [];
              const panelClass = LIT_PANELS[idx % LIT_PANELS.length];

              return (
                <article
                  key={`${cand.name}-${idx}`}
                  className="taste-card taste-card--interactive flex flex-col justify-between bg-[#ffffff]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[20px] leading-[28px] font-medium text-[#111111] truncate">
                        {cand.name || 'Candidato sin nombre'}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-[6px] text-[13px] font-medium shrink-0 ${meta.pill}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <p className="text-[16px] leading-[24px] text-[#111111]/85 mt-2">
                      {cand.experiencia_years ?? 0}{' '}
                      {cand.experiencia_years === 1
                        ? 'año de experiencia comprobada'
                        : 'años de experiencia comprobada'}{' '}
                      · {skills.length} habilidades técnicas registradas.
                    </p>
                  </div>

                  <div
                    className={`mt-8 rounded-[12px] p-5 ${panelClass} flex flex-col justify-between min-h-[210px]`}
                  >
                    <div className="rounded-[10px] bg-[#ffffff] border border-[#111111]/12 p-4 space-y-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[13px] font-medium text-[#6b6b6b]">
                          Match score
                        </span>
                        <span className="font-mono text-[32px] leading-none font-medium tracking-[-0.03em] text-[#111111]">
                          {score.toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-[#f4f4f4] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(Math.max(score, 0), 100)}%`,
                            backgroundColor: meta.barColor,
                          }}
                        />
                      </div>

                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {skills.length > 0 ? (
                          skills.map((skill, sIdx) => (
                            <span
                              key={`${skill}-${sIdx}`}
                              className="px-2.5 py-1 rounded-[6px] bg-[#f4f4f4] text-[#111111] font-mono text-[12px] font-normal"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-[13px] text-[#6b6b6b]">
                            Sin habilidades listadas
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
          <div className="taste-card bg-[#ffffff] p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#111111]/12 bg-[#f4f4f4]/60 text-[13px] font-medium text-[#6b6b6b]">
                    <th className="py-4 px-6 font-medium">Candidato</th>
                    <th className="py-4 px-6 font-medium">Experiencia</th>
                    <th className="py-4 px-6 font-medium">Habilidades técnicas</th>
                    <th className="py-4 px-6 font-medium text-right">Match score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10 text-[16px]">
                  {candidates.map((cand, idx) => {
                    const score = Number(cand.match_score ?? 0);
                    const skills = Array.isArray(cand.habilidades_tecnicas)
                      ? cand.habilidades_tecnicas
                      : [];

                    return (
                      <tr
                        key={`${cand.name}-${idx}`}
                        className="hover:bg-[#f4f4f4]/50 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-[#111111] whitespace-nowrap">
                          {cand.name || 'Sin nombre'}
                        </td>
                        <td className="py-4 px-6 text-[#111111] whitespace-nowrap font-mono text-[14px]">
                          {cand.experiencia_years ?? 0}{' '}
                          {cand.experiencia_years === 1 ? 'año' : 'años'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill, sIdx) => (
                              <span
                                key={`${skill}-${sIdx}`}
                                className="px-2.5 py-0.5 rounded-[6px] bg-[#f4f4f4] text-[#111111] font-mono text-[13px] border border-[#111111]/10"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-[8px] font-mono text-[15px] font-medium bg-[#111111] text-[#ffffff]">
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
      </div>
    </section>
  );
}
