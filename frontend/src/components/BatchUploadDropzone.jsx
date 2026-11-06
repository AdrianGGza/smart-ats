import { useState, useRef } from 'react';
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
      setError('Selecciona un archivo con extensión .csv válido.');
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
      setError('Adjunta un archivo CSV antes de procesar el lote.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultados = await procesarBatchCSV(selectedFile);
      onBatchProcessed(resultados);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo procesar el archivo CSV en https://smart-ats-0c5l.onrender.com/procesar-batch.'
      );
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

  const handleDownloadSampleCSV = (e) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = '/candidatos_prueba_masiva.csv';
    a.download = 'candidatos_prueba_masiva.csv';
    a.click();
  };

  return (
    <form onSubmit={handleUpload} className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#111111]/10 pb-4">
        <div>
          <h3 className="text-[20px] font-medium text-[#111111] tracking-[-0.02em]">
            Filtra y evalúa lotes CSV en memoria con Polars
          </h3>
          <p className="text-[16px] text-[#6b6b6b] mt-1">
            Envía el archivo mediante <code className="font-mono text-[14px] text-[#111111]">FormData</code> a <code className="font-mono text-[14px] text-[#111111]">POST /procesar-batch</code>. Descarta perfiles con menos de 2 años.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadSampleCSV}
          className="taste-btn-secondary h-[38px] px-4 text-[14px]"
        >
          Descargar CSV de prueba
        </button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`rounded-[16px] border p-8 transition-colors cursor-pointer ${
          isDragging
            ? 'border-[#1a4be0] bg-[#1a4be0]/[0.04]'
            : selectedFile
            ? 'border-[#111111] bg-[#f4f4f4]'
            : 'border-dashed border-[#111111]/25 bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] hover:border-[#111111]/45'
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[16px] font-medium text-[#111111]">
                Arrastra tu archivo <span className="font-mono">.csv</span> aquí o haz clic para seleccionarlo
              </p>
              <p className="text-[14px] text-[#6b6b6b]">
                Columnas requeridas: <code className="font-mono text-[13px] text-[#111111]">nombre, experiencia_years, texto_cv</code>
              </p>
            </div>
            <span className="taste-btn-secondary pointer-events-none shrink-0">
              Seleccionar archivo CSV
            </span>
          </div>
        ) : (
          <div
            className="flex flex-wrap items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-0.5">
              <p className="text-[13px] font-medium text-[#1a4be0]">
                Archivo listo para enviar en FormData
              </p>
              <p className="text-[18px] font-medium text-[#111111] font-mono">
                {selectedFile.name}
              </p>
              <p className="text-[14px] text-[#6b6b6b]">
                {(selectedFile.size / 1024).toFixed(2)} KB • Filtro Polars activo: experiencia_years &gt;= 2
              </p>
            </div>

            <button
              type="button"
              onClick={clearFile}
              disabled={isLoading}
              className="taste-btn-secondary h-[38px] px-4 text-[14px]"
            >
              Cambiar archivo
            </button>
          </div>
        )}
      </div>

      <ErrorAlert message={error} onClose={() => setError(null)} />

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-[14px] text-[#6b6b6b]">
          Lectura en RAM con <code className="font-mono text-[13px] text-[#111111]">io.BytesIO</code> y persistencia por cada finalista.
        </p>

        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className="taste-btn-primary w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Procesando lote CSV...</span>
            </>
          ) : (
            <>
              <span>Procesar lote CSV</span>
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
  );
}
