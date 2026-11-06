import { useState } from 'react';
import { FileText, Send, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { analizarCV } from '../services/atsApi';
import ErrorAlert from './ErrorAlert';

const EJEMPLO_CV = `María Fernanda Gómez
Ingeniera de Software Full Stack con 5 años de experiencia diseñando arquitecturas escalables y microservicios.
Experiencia trabajando con Python, FastAPI, React, TypeScript, PostgreSQL, Docker y AWS.
Lideró la migración de monolito a servicios distribuidos reduciendo tiempos de respuesta en un 40%.`;

export default function SingleCVForm({ onCandidateAnalyzed }) {
  const [textoCv, setTextoCv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = textoCv.trim();
    if (!trimmed) {
      setError('Por favor ingresa o pega el texto del CV antes de analizar.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultado = await analizarCV(trimmed);
      onCandidateAnalyzed(resultado);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor backend en http://localhost:8000');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setTextoCv(EJEMPLO_CV);
    setError(null);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Análisis Individual de CV
            </h2>
            <p className="text-xs text-slate-400">
              Endpoint <code className="text-indigo-300 font-mono">POST /analizar-cv</code> (JSON)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          disabled={isLoading}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Cargar CV de prueba
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="cv-textarea"
            className="block text-xs font-medium text-slate-300 mb-2"
          >
            Texto completo del Currículum Vitae
          </label>
          <textarea
            id="cv-textarea"
            rows={7}
            value={textoCv}
            onChange={(e) => setTextoCv(e.target.value)}
            disabled={isLoading}
            placeholder="Pega aquí el contenido del CV del candidato (experiencia, educación, habilidades técnicas...)"
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-100 placeholder-slate-500 p-3.5 transition-all outline-none resize-y disabled:opacity-60"
          />
          <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500">
            <span>Se extraerá: nombre, años de experiencia, skills y match score.</span>
            <span>{textoCv.length} caracteres</span>
          </div>
        </div>

        <ErrorAlert message={error} onClose={() => setError(null)} />

        <div className="flex items-center justify-end gap-2.5 pt-1">
          {textoCv && (
            <button
              type="button"
              onClick={() => {
                setTextoCv('');
                setError(null);
              }}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !textoCv.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando con IA...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Analizar Candidato
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

