import { useState } from 'react';
import { analizarCV } from '../services/atsApi';
import ErrorAlert from './ErrorAlert';

const EJEMPLO_CV = `María Fernanda Gómez
Ingeniera de Software Senior con 6 años de experiencia en desarrollo backend y sistemas de datos.
Especialista en Python, FastAPI, Polars, PostgreSQL, Docker, Kubernetes y despliegues en AWS.
Redujo la latencia de procesamiento de lotes en un 45% migrando pipelines hacia Polars en memoria.`;

export default function SingleCVForm({ onCandidateAnalyzed }) {
  const [textoCv, setTextoCv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = textoCv.trim();
    if (!trimmed) {
      setError('Escribe o pega el texto del currículum antes de enviarlo.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultado = await analizarCV(trimmed);
      onCandidateAnalyzed(resultado);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo conectar con http://localhost:8000/analizar-cv. Verifica que el backend FastAPI esté activo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#111111]/10 pb-4">
        <div>
          <h3 className="text-[20px] font-medium text-[#111111] tracking-[-0.02em]">
            Extrae habilidades y compatibilidad desde texto plano
          </h3>
          <p className="text-[16px] text-[#6b6b6b] mt-1">
            Envía el perfil al endpoint <code className="font-mono text-[14px] text-[#111111]">POST /analizar-cv</code> y almacena el resultado en Supabase.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTextoCv(EJEMPLO_CV);
            setError(null);
          }}
          disabled={isLoading}
          className="taste-btn-secondary h-[38px] px-4 text-[14px]"
        >
          Cargar perfil de ejemplo
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="cv-plain-textarea"
            className="text-[13px] font-medium text-[#111111]"
          >
            Texto del currículum (experiencia, tecnologías y logros)
          </label>
          <span className="font-mono text-[13px] text-[#6b6b6b]">
            {textoCv.length} caracteres
          </span>
        </div>

        <textarea
          id="cv-plain-textarea"
          rows={6}
          value={textoCv}
          onChange={(e) => setTextoCv(e.target.value)}
          disabled={isLoading}
          placeholder="Pega aquí el contenido completo del CV en texto plano..."
          className="w-full rounded-[12px] bg-[#f4f4f4] border border-[#111111]/15 focus:bg-[#ffffff] focus:border-[#1a4be0] focus:ring-2 focus:ring-[#1a4be0]/15 p-4 text-[16px] leading-[1.5] text-[#111111] placeholder-[#6b6b6b] outline-none transition-all resize-y disabled:opacity-60"
        />
      </div>

      <ErrorAlert message={error} onClose={() => setError(null)} />

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-[14px] text-[#6b6b6b]">
          Esquema validado: <span className="font-mono text-[13px] text-[#111111]">name, experiencia_years, habilidades_tecnicas, match_score</span>
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {textoCv && (
            <button
              type="button"
              onClick={() => {
                setTextoCv('');
                setError(null);
              }}
              disabled={isLoading}
              className="taste-btn-secondary flex-1 sm:flex-initial"
            >
              Limpiar texto
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !textoCv.trim()}
            className="taste-btn-primary flex-1 sm:flex-initial"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analizando currículum...</span>
              </>
            ) : (
              <>
                <span>Evaluar candidato</span>
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
