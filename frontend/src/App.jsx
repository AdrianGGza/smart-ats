import { useState } from 'react';
import Header from './components/Header';
import SingleCVForm from './components/SingleCVForm';
import BatchUploadDropzone from './components/BatchUploadDropzone';
import CandidateResults from './components/CandidateResults';

export default function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [candidates, setCandidates] = useState([]);

  const handleSingleCandidate = (nuevoCandidato) => {
    if (Array.isArray(nuevoCandidato)) {
      setCandidates((prev) => [...nuevoCandidato, ...prev]);
    } else if (nuevoCandidato) {
      setCandidates((prev) => [nuevoCandidato, ...prev]);
    }
    setTimeout(() => {
      document.getElementById('resultados')?.scrollIntoView({ behavior: 'auto' });
    }, 80);
  };

  const handleBatchCandidates = (listaCandidatos) => {
    if (Array.isArray(listaCandidatos)) {
      setCandidates((prev) => [...listaCandidatos, ...prev]);
      setTimeout(() => {
        document.getElementById('resultados')?.scrollIntoView({ behavior: 'auto' });
      }, 80);
    }
  };

  const handleClearResults = () => {
    setCandidates([]);
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#ffffff] text-[#111111]">
      <Header
        totalEvaluados={candidates.length}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <main className="flex-1 pt-[56px] sm:pt-[72px]">
        <section className="py-12 sm:py-20 bg-[#ffffff]">
          <div className="taste-wrap space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-[14px] font-medium text-[#6b6b6b]">
                  Motor FastAPI en Render · Filtrado Polars (&ge; 2 años de experiencia) · Persistencia Supabase
                </p>
                <h1 className="taste-h1">
                  Evaluación de currículums para equipos de talento.
                </h1>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <p className="text-[18px] leading-[1.55] text-[#111111]">
                  Extrae habilidades técnicas y calcula el <code className="font-mono text-[15px]">match_score</code> de 0 a 100 desde documentos PDF o lotes CSV en un solo paso.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('single')}
                    className={
                      activeTab === 'single' ? 'taste-btn-primary' : 'taste-btn-secondary'
                    }
                  >
                    <span>Evaluar CV en PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('batch')}
                    className={
                      activeTab === 'batch' ? 'taste-btn-primary' : 'taste-btn-secondary'
                    }
                  >
                    <span>Subir lote CSV</span>
                  </button>
                </div>
              </div>
            </div>

            <div
              id="workspace"
              className="rounded-[20px] p-3 sm:p-5 taste-panel-sky border border-[#111111]/12"
            >
              <div className="rounded-[14px] bg-[#ffffff] border border-[#111111]/12 overflow-hidden">
                <div className="px-5 py-3.5 bg-[#f4f4f4] border-b border-[#111111]/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[13px] font-medium text-[#111111]">
                      Consola de ingesta ATS
                    </span>
                    <span className="text-[#6b6b6b]">·</span>
                    <span className="font-mono text-[12px] text-[#6b6b6b]">
                      {activeTab === 'single'
                        ? 'POST https://smart-ats-0c5l.onrender.com/analizar-pdf'
                        : 'POST https://smart-ats-0c5l.onrender.com/procesar-batch'}
                    </span>
                  </div>

                  <div
                    role="tablist"
                    aria-label="Seleccionar endpoint de entrada"
                    className="inline-flex rounded-[8px] bg-[#ffffff] p-1 border border-[#111111]/12"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'single'}
                      onClick={() => setActiveTab('single')}
                      className={`px-3.5 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${
                        activeTab === 'single'
                          ? 'bg-[#111111] text-[#ffffff]'
                          : 'text-[#6b6b6b] hover:text-[#111111]'
                      }`}
                    >
                      1. Documento PDF (/analizar-pdf)
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'batch'}
                      onClick={() => setActiveTab('batch')}
                      className={`px-3.5 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${
                        activeTab === 'batch'
                          ? 'bg-[#111111] text-[#ffffff]'
                          : 'text-[#6b6b6b] hover:text-[#111111]'
                      }`}
                    >
                      2. Archivo CSV (/procesar-batch)
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {activeTab === 'single' ? (
                    <SingleCVForm onCandidateAnalyzed={handleSingleCandidate} />
                  ) : (
                    <BatchUploadDropzone onBatchProcessed={handleBatchCandidates} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <CandidateResults
          candidates={candidates}
          onClear={handleClearResults}
        />

        <section id="arquitectura" className="py-24 bg-[#ffffff] border-t border-[#111111]/10">
          <div className="taste-wrap grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="taste-h2">
                Flujo de validación en memoria.{' '}
                <span className="text-[#6b6b6b]">
                  De la petición HTTP a Supabase.
                </span>
              </h2>
              <p className="text-[16px] leading-[1.6] text-[#111111]/85">
                Cada petición valida estrictamente el esquema con Pydantic antes de registrar al candidato en PostgreSQL, garantizando tipos exactos para el puntaje y los años de experiencia.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="taste-card taste-panel-sand p-6 sm:p-8">
                <div className="rounded-[12px] bg-[#ffffff] border border-[#111111]/12 p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-[#111111]/10 pb-4">
                    <span className="text-[13px] font-medium text-[#111111]">
                      Arquitectura de ejecución en la nube
                    </span>
                    <span className="font-mono text-[12px] text-[#1a4be0]">
                      Pydantic · AnalisisCVCandidato
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-[10px] bg-[#f4f4f4] p-4 space-y-1.5 border border-[#111111]/8">
                      <span className="font-mono text-[12px] text-[#6b6b6b]">01 · Entrada</span>
                      <p className="text-[16px] font-medium text-[#111111]">
                        PDF o CSV
                      </p>
                      <p className="text-[14px] text-[#6b6b6b]">
                        Lectura directa en RAM mediante <code className="font-mono text-[12px]">io.BytesIO</code> y filtro Polars.
                      </p>
                    </div>

                    <div className="rounded-[10px] bg-[#f4f4f4] p-4 space-y-1.5 border border-[#111111]/8">
                      <span className="font-mono text-[12px] text-[#1a4be0]">02 · Inferencia</span>
                      <p className="text-[16px] font-medium text-[#111111]">
                        Google Gemini
                      </p>
                      <p className="text-[14px] text-[#6b6b6b]">
                        Extracción estructurada con <code className="font-mono text-[12px]">model_json_schema()</code>.
                      </p>
                    </div>

                    <div className="rounded-[10px] bg-[#f4f4f4] p-4 space-y-1.5 border border-[#111111]/8">
                      <span className="font-mono text-[12px] text-[#6b6b6b]">03 · Registro</span>
                      <p className="text-[16px] font-medium text-[#111111]">
                        Supabase DB
                      </p>
                      <p className="text-[14px] text-[#6b6b6b]">
                        Inserción inmediata en la tabla <code className="font-mono text-[12px]">candidatos</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#111111] text-[#ffffff] py-16">
        <div className="taste-wrap space-y-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-12 border-b border-white/15">
            <div className="space-y-2">
              <h2 className="text-[28px] sm:text-[36px] font-medium tracking-[-0.03em] text-[#ffffff]">
                Evalúa tu próximo lote de candidatos hoy.
              </h2>
              <p className="text-[16px] text-[#9a9a9a]">
                Conectado al servidor de producción en Render (smart-ats-0c5l.onrender.com).
              </p>
            </div>

            <a
              href="#workspace"
              onClick={() => setActiveTab('single')}
              className="taste-btn-primary bg-[#ffffff] text-[#111111] hover:bg-[#f4f4f4] no-underline shrink-0"
            >
              <span>Evaluar candidato</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px] text-[#9a9a9a]">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-[5px] bg-[#ffffff] text-[#111111] inline-flex items-center justify-center font-mono text-[12px] font-medium">
                S
              </span>
              <span className="text-[#ffffff] font-medium">Smart ATS</span>
              <span>·</span>
              <span>© {new Date().getFullYear()}</span>
            </div>

            <div className="flex flex-wrap gap-6">
              <a href="#workspace" className="text-[#9a9a9a] hover:text-[#ffffff] no-underline">
                Ingesta PDF
              </a>
              <a
                href="#workspace"
                onClick={() => setActiveTab('batch')}
                className="text-[#9a9a9a] hover:text-[#ffffff] no-underline"
              >
                Procesamiento CSV
              </a>
              <a href="#resultados" className="text-[#9a9a9a] hover:text-[#ffffff] no-underline">
                Resultados
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
