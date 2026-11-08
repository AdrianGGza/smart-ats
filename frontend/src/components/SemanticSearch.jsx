import { useState } from 'react';
import ErrorAlert from './ErrorAlert';

const LIT_PANELS = ['taste-panel-sky', 'taste-panel-sand', 'taste-panel-sage'];

export default function SemanticSearch() {
  const [consulta, setConsulta] = useState('');
  const [resultados, setResultados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const queryTrimmed = consulta.trim();
    if (!queryTrimmed) {
      setError('Por favor ingresa una descripción o habilidades para buscar candidatos.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch('http://localhost:8000/buscar-candidatos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consulta: queryTrimmed,
          limite_resultados: 5,
          umbral_similitud: 0.2,
        }),
      });

      if (!response.ok) {
        let errorDetail = `Error HTTP ${response.status} (${response.statusText})`;
        try {
          const errorData = await response.json();
          if (errorData?.detail) {
            errorDetail =
              typeof errorData.detail === 'string'
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          }
        } catch {
          // Mantiene el mensaje de estado HTTP si no hay JSON
        }
        throw new Error(errorDetail);
      }

      const data = await response.json();
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.resultados)
        ? data.resultados
        : [];

      setResultados(lista);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo conectar con el motor de búsqueda semántica en http://localhost:8000/buscar-candidatos.'
      );
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setConsulta('');
    setResultados([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <section
      id="busqueda-semantica"
      className="py-16 sm:py-20 bg-[#ffffff] border-t border-[#111111]/10"
    >
      <div className="taste-wrap space-y-10">
        <div className="max-w-[68ch] space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f4f4] border border-[#111111]/12 text-[13px] font-medium text-[#1a4be0]">
            Búsqueda Semántica con IA
          </span>
          <h2 className="taste-h2">
            Encuentra al candidato ideal por contexto y habilidades.
          </h2>
          <p className="text-[16px] text-[#6b6b6b]">
            Describe con lenguaje natural el perfil que necesitas y compara la afinidad semántica entre tu consulta y los currículums registrados.
          </p>
        </div>

        {/* Barra de búsqueda amplia estilo Google */}
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 rounded-[16px] sm:rounded-full bg-[#f4f4f4] border border-[#111111]/15 focus-within:bg-[#ffffff] focus-within:border-[#1a4be0] focus-within:ring-4 focus-within:ring-[#1a4be0]/10 transition-all shadow-sm">
            <div className="flex items-center flex-1 pl-4 pr-2 py-2 sm:py-0 gap-3">
              <svg
                className="w-5 h-5 text-[#6b6b6b] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <input
                type="text"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                disabled={isLoading}
                placeholder="Ej. Desarrollador con experiencia en Python, FastAPI, bases vectoriales o React..."
                aria-label="Consulta de búsqueda semántica"
                className="w-full bg-transparent text-[16px] text-[#111111] placeholder-[#6b6b6b] outline-none disabled:opacity-60"
              />

              {consulta && !isLoading && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Limpiar búsqueda"
                  className="p-1.5 rounded-full text-[#6b6b6b] hover:text-[#111111] hover:bg-[#111111]/5 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !consulta.trim()}
              className="taste-btn-primary sm:rounded-full px-7 h-[46px] shrink-0"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <span>Buscar</span>
                  <svg
                    className="m-arrow w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <ErrorAlert message={error} onClose={() => setError(null)} />

        {/* Estado de carga o resultados */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="taste-card bg-[#f4f4f4]/60 animate-pulse h-[240px] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-6 w-2/3 bg-[#111111]/10 rounded-[6px]" />
                  <div className="h-4 w-1/3 bg-[#111111]/10 rounded-[6px]" />
                </div>
                <div className="h-24 w-full bg-[#111111]/10 rounded-[12px]" />
              </div>
            ))}
          </div>
        ) : resultados.length > 0 ? (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between border-b border-[#111111]/10 pb-3">
              <p className="text-[14px] font-medium text-[#6b6b6b]">
                Mostrando <span className="text-[#111111] font-mono">{resultados.length}</span>{' '}
                {resultados.length === 1 ? 'candidato compatible' : 'candidatos compatibles'}
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="text-[13px] font-medium text-[#6b6b6b] hover:text-[#111111] transition-colors"
              >
                Limpiar resultados
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultados.map((candidato, idx) => {
                const nombre = candidato.nombre || candidato.name || 'Candidato sin nombre';
                const matchScore = Number(candidato.match_score ?? 0);
                const similitudFloat = Number(candidato.similitud ?? 0);
                const afinidadPorcentaje = (similitudFloat * 100).toFixed(1);
                const panelClass = LIT_PANELS[idx % LIT_PANELS.length];

                return (
                  <article
                    key={candidato.id ?? `${nombre}-${idx}`}
                    className="taste-card taste-card--interactive flex flex-col justify-between bg-[#ffffff]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[20px] leading-[28px] font-medium text-[#111111] truncate">
                          {nombre}
                        </h3>
                        <span className="px-2.5 py-1 rounded-[6px] bg-[#1a4be0] text-[#ffffff] font-mono text-[13px] font-medium shrink-0">
                          {afinidadPorcentaje}% de afinidad
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[14px] text-[#6b6b6b]">
                        <span>Match Score original:</span>
                        <span className="font-mono font-medium text-[#111111] bg-[#f4f4f4] px-2 py-0.5 rounded-[6px] border border-[#111111]/10">
                          {matchScore.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div
                      className={`mt-6 rounded-[12px] p-5 ${panelClass} flex flex-col justify-between`}
                    >
                      <div className="rounded-[10px] bg-[#ffffff] border border-[#111111]/12 p-4 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[13px] font-medium text-[#6b6b6b]">
                            Similitud semántica
                          </span>
                          <span className="font-mono text-[28px] leading-none font-medium tracking-[-0.03em] text-[#111111]">
                            {afinidadPorcentaje}%
                          </span>
                        </div>

                        <div className="h-2 w-full rounded-full bg-[#f4f4f4] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#1a4be0] transition-all duration-500"
                            style={{
                              width: `${Math.min(Math.max(similitudFloat * 100, 0), 100)}%`,
                            }}
                          />
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[12px] text-[#6b6b6b] font-mono">
                          <span>Score base: {matchScore.toFixed(1)} pts</span>
                          {candidato.id !== undefined && (
                            <span>ID #{candidato.id}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          hasSearched &&
          !error && (
            <div className="taste-card bg-[#f4f4f4]/60 max-w-2xl">
              <h3 className="text-[18px] font-medium text-[#111111]">
                No se encontraron candidatos con esa afinidad
              </h3>
              <p className="text-[15px] text-[#6b6b6b] mt-1">
                Intenta describir otras tecnologías, cargos o habilidades técnicas en tu búsqueda.
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
