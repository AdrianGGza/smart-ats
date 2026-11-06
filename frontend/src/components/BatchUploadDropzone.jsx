import { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Loader2, X, CheckCircle2 } from 'lucide-react';
import { procesarBatchCSV } from '../services/atsApi';
import ErrorAlert from './ErrorAlert';

export default function BatchUploadDropzone({ onBatchProcessed }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setError('Formato no válido. Por favor selecciona un archivo con extensión .csv');
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isLoading) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Selecciona un archivo CSV antes de iniciar el procesamiento por lotes.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultados = await procesarBatchCSV(selectedFile);
      onBatchProcessed(resultados);
    } catch (err) {
      setError(err.message || 'Error al procesar el archivo CSV en el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Procesamiento Masivo por Lotes (CSV)
            </h2>
            <p className="text-xs text-slate-400">
              Endpoint <code className="text-violet-300 font-mono">POST /procesar-batch</code> (FormData • Filtra experiencia ≥ 2 años)
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-violet-400 bg-violet-500/10'
              : selectedFile
              ? 'border-emerald-500/40 bg-emerald-950/20'
              : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/50 hover:bg-slate-950/80'
          } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-violet-400">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Arrastra y suelta tu archivo <span className="text-violet-400 font-semibold">.csv</span> aquí
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  o haz clic para explorar en tu equipo
                </p>
              </div>
              <div className="pt-1">
                <span className="inline-block text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                  Columnas esperadas: nombre, experiencia_years, texto_cv
                </span>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-between bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3.5 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(selectedFile.size / 1024).toFixed(2)} KB • Listo para procesar
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFile}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Quitar archivo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <ErrorAlert message={error} onClose={() => setError(null)} />

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading || !selectedFile}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Filtrando con Polars y evaluando en IA...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                Procesar Lote CSV
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

