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
              <div className="lg:col-span-7">
                <h1 className="taste-h1">
                  Evaluación de currículums para equipos de talento.
                </h1>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <p className="text-[18px] leading-[1.55] text-[#111111]">
                  Identifica habilidades clave, experiencia comprobada y nivel de compatibilidad con tus vacantes en segundos.
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
                  <span className="text-[14px] font-medium text-[#111111]">
                    Panel de evaluación de candidatos
                  </span>

                  <div
                    role="tablist"
                    aria-label="Seleccionar modo de carga"
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
                      Documentos PDF
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
                      Lote CSV
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
      </main>

      <footer className="bg-[#111111] text-[#ffffff] py-12">
        <div className="taste-wrap flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px] text-[#9a9a9a]">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-[5px] bg-[#ffffff] text-[#111111] inline-flex items-center justify-center font-mono text-[12px] font-medium">
              S
            </span>
            <span className="text-[#ffffff] font-medium">Smart ATS</span>
            <span>·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap gap-6">
            <a
              href="#workspace"
              onClick={() => setActiveTab('single')}
              className="text-[#9a9a9a] hover:text-[#ffffff] no-underline"
            >
              Evaluación PDF
            </a>
            <a
              href="#workspace"
              onClick={() => setActiveTab('batch')}
              className="text-[#9a9a9a] hover:text-[#ffffff] no-underline"
            >
              Carga masiva CSV
            </a>
            <a href="#resultados" className="text-[#9a9a9a] hover:text-[#ffffff] no-underline">
              Candidatos
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
