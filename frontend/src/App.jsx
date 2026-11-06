import { useState } from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import Header from './components/Header';
import SingleCVForm from './components/SingleCVForm';
import BatchUploadDropzone from './components/BatchUploadDropzone';
import CandidateResults from './components/CandidateResults';

export default function App() {
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'batch'
  const [candidates, setCandidates] = useState([]);

  const handleSingleCandidate = (nuevoCandidato) => {
    setCandidates((prev) => [nuevoCandidato, ...prev]);
  };

  const handleBatchCandidates = (listaCandidatos) => {
    if (Array.isArray(listaCandidatos)) {
      setCandidates((prev) => [...listaCandidatos, ...prev]);
    }
  };

  const handleClearResults = () => {
    setCandidates([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header totalEvaluados={candidates.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Selector de modo de operación */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              Panel de Recepción de Currículums
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Analiza un candidato individual en texto plano o procesa un lote CSV filtrado automáticamente.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-900 p-1.5 border border-slate-800 self-start">
            <button
              type="button"
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'single'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              CV Individual (JSON)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('batch')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'batch'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Lote CSV (Batch)
            </button>
          </div>
        </div>

        {/* Formulario Activo */}
        <section>
          {activeTab === 'single' ? (
            <SingleCVForm onCandidateAnalyzed={handleSingleCandidate} />
          ) : (
            <BatchUploadDropzone onBatchProcessed={handleBatchCandidates} />
          )}
        </section>

        {/* Resultados Renderizados (Cards / Tabla con Match Score destacado) */}
        <CandidateResults
          candidates={candidates}
          onClear={handleClearResults}
        />
      </main>
    </div>
  );
}

