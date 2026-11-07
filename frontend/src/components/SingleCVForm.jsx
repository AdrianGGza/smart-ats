import { useState, useRef } from 'react';
import { analizarPDF } from '../services/atsApi';
import ErrorAlert from './ErrorAlert';

export default function SingleCVForm({ onCandidateAnalyzed }) {
  const [criterios_vacante, setCriteriosVacante] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setError('Por favor selecciona un archivo PDF válido (.pdf).');
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
    }
  };

  const handleLoadSamplePDF = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch('/cv_harvard_ejemplo.pdf');
      if (!resp.ok) {
        throw new Error('No se pudo cargar el PDF de ejemplo.');
      }
      const blob = await resp.blob();
      const file = new File([blob], 'cv_harvard_ejemplo.pdf', { type: 'application/pdf' });
      setSelectedFile(file);
      setCriteriosVacante('Busco un desarrollador con experiencia sólida en Python, FastAPI, React y bases de datos.');
    } catch (err) {
      setError(err.message || 'Error al cargar el archivo PDF de prueba.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Por favor selecciona un archivo PDF antes de iniciar el análisis.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultado = await analizarPDF(selectedFile, criterios_vacante);
      onCandidateAnalyzed(resultado);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo conectar con https://smart-ats-0c5l.onrender.com/analizar-pdf. Verifica que el backend esté activo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setSelectedFile(null);
    setCriteriosVacante('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#111111]/10 pb-4">
        <div>
          <h3 className="text-[20px] font-medium text-[#111111] tracking-[-0.02em]">
            Evaluación individual de CV en formato PDF
          </h3>
          <p className="text-[16px] text-[#6b6b6b] mt-1">
            Envía el documento al endpoint <code className="font-mono text-[14px] text-[#111111]">POST /analizar-pdf</code> con <code className="font-mono text-[14px] text-[#111111]">multipart/form-data</code> y almacena el resultado en Supabase.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSamplePDF}
          disabled={isLoading}
          className="taste-btn-secondary h-[38px] px-4 text-[14px]"
        >
          Cargar PDF de ejemplo (Harvard)
        </button>
      </div>

      {/* 1. Textarea opcional para los criterios de la vacante */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="criterios-vacante-textarea"
            className="text-[13px] font-medium text-[#111111]"
          >
            Criterios de la vacante <span className="text-[#6b6b6b] font-normal">(Opcional)</span>
          </label>
        </div>

        <textarea
          id="criterios-vacante-textarea"
          rows={3}
          value={criterios_vacante}
          onChange={(e) => setCriteriosVacante(e.target.value)}
          disabled={isLoading}
          placeholder="Ej. Busco un desarrollador especializado en React... (Opcional)"
          className="w-full rounded-[12px] bg-[#f4f4f4] border border-[#111111]/15 focus:bg-[#ffffff] focus:border-[#1a4be0] focus:ring-2 focus:ring-[#1a4be0]/15 p-4 text-[16px] leading-[1.5] text-[#111111] placeholder-[#6b6b6b] outline-none transition-all resize-y disabled:opacity-60"
        />
      </div>

      {/* 2. Input de tipo file para subir el PDF */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="pdf-file-input"
            className="text-[13px] font-medium text-[#111111]"
          >
            Currículum Vitae en formato PDF
          </label>
          {selectedFile && (
            <span className="font-mono text-[13px] text-[#6b6b6b]">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </span>
          )}
        </div>

        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`rounded-[12px] border p-6 transition-colors cursor-pointer ${
            selectedFile
              ? 'border-[#111111] bg-[#f4f4f4]'
              : 'border-dashed border-[#111111]/25 bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] hover:border-[#111111]/45'
          } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <input
            id="pdf-file-input"
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[16px] font-medium text-[#111111]">
                  Haz clic para seleccionar o arrastra un archivo <span className="font-mono font-semibold">.pdf</span> aquí
                </p>
                <p className="text-[14px] text-[#6b6b6b]">
                  Acepta PDFs de candidatos con texto legible (Harvard, ATS clásico, etc.)
                </p>
              </div>
              <span className="taste-btn-secondary text-[14px] h-[38px] px-4 shrink-0 pointer-events-none">
                Seleccionar PDF
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-0.5">
                <span className="text-[12px] font-medium text-[#1a4be0] block">
                  Documento PDF listo para procesar
                </span>
                <p className="text-[16px] font-medium text-[#111111] font-mono">
                  {selectedFile.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={isLoading}
                className="taste-btn-secondary text-[13px] h-[34px] px-3 shrink-0"
              >
                Cambiar archivo
              </button>
            </div>
          )}
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError(null)} />

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-[14px] text-[#6b6b6b]">
          Extracción y evaluación con PyPDF2 y Gemini hacia Supabase.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {(selectedFile || criterios_vacante) && (
            <button
              type="button"
              onClick={clearForm}
              disabled={isLoading}
              className="taste-btn-secondary flex-1 sm:flex-initial"
            >
              Limpiar
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !selectedFile}
            className="taste-btn-primary flex-1 sm:flex-initial"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Extrayendo y evaluando PDF...</span>
              </>
            ) : (
              <>
                <span>Evaluar PDF</span>
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
      </div>
    </form>
  );
}
