import { useState, useRef } from 'react';
import { analizarPDF } from '../services/atsApi';
import ErrorAlert from './ErrorAlert';

export default function SingleCVForm({ onCandidateAnalyzed }) {
  const [criterios_vacante, setCriteriosVacante] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );
      if (validFiles.length === 0) {
        setError('Por favor selecciona archivos PDF válidos (.pdf).');
        setSelectedFiles([]);
        return;
      }
      setError(null);
      setSelectedFiles(validFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Por favor selecciona uno o varios archivos PDF antes de iniciar el análisis.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultado = await analizarPDF(selectedFiles, criterios_vacante);
      onCandidateAnalyzed(resultado);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo completar el análisis en este momento. Por favor intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setSelectedFiles([]);
    setCriteriosVacante('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-[#111111]/10 pb-4">
        <h3 className="text-[20px] font-medium text-[#111111] tracking-[-0.02em]">
          Evaluación de CVs en formato PDF
        </h3>
      </div>

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

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="pdf-file-input"
            className="text-[13px] font-medium text-[#111111]"
          >
            Currículum Vitae en formato PDF
          </label>
          {selectedFiles.length > 0 && (
            <span className="font-mono text-[13px] text-[#6b6b6b]">
              {selectedFiles.length} {selectedFiles.length === 1 ? 'archivo' : 'archivos'} · {(selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)} KB total
            </span>
          )}
        </div>

        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`rounded-[12px] border p-6 transition-colors cursor-pointer ${
            selectedFiles.length > 0
              ? 'border-[#111111] bg-[#f4f4f4]'
              : 'border-dashed border-[#111111]/25 bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] hover:border-[#111111]/45'
          } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <input
            id="pdf-file-input"
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />

          {selectedFiles.length === 0 ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[16px] font-medium text-[#111111]">
                  Haz clic para seleccionar uno o varios archivos <span className="font-mono font-semibold">.pdf</span>
                </p>
                <p className="text-[14px] text-[#6b6b6b]">
                  Soporta carga individual o múltiple de currículums en PDF
                </p>
              </div>
              <span className="taste-btn-secondary text-[14px] h-[38px] px-4 shrink-0 pointer-events-none">
                Seleccionar PDFs
              </span>
            </div>
          ) : (
            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between gap-3 border-b border-[#111111]/10 pb-2">
                <span className="text-[13px] font-medium text-[#1a4be0]">
                  {selectedFiles.length} {selectedFiles.length === 1 ? 'documento PDF seleccionado' : 'documentos PDF seleccionados'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFiles([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  disabled={isLoading}
                  className="taste-btn-secondary text-[13px] h-[32px] px-3 shrink-0"
                >
                  Cambiar archivos
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pt-1">
                {selectedFiles.map((f, i) => (
                  <span
                    key={`${f.name}-${i}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#ffffff] border border-[#111111]/15 text-[12px] font-mono text-[#111111]"
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError(null)} />

      <div className="flex items-center justify-end gap-3 pt-2">
        {(selectedFiles.length > 0 || criterios_vacante) && (
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
          disabled={isLoading || selectedFiles.length === 0}
          className="taste-btn-primary flex-1 sm:flex-initial"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluando...</span>
            </>
          ) : (
            <>
              <span>Evaluar {selectedFiles.length > 1 ? `${selectedFiles.length} PDFs` : 'PDF'}</span>
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
