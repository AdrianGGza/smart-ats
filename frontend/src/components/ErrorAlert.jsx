import { AlertTriangle, X } from 'lucide-react';

export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-xl bg-rose-950/50 border border-rose-500/40 p-4 text-rose-200 shadow-lg shadow-rose-950/20 flex items-start gap-3 animate-fadeIn"
    >
      <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-rose-300">
          Error al procesar la solicitud
        </h3>
        <p className="text-xs text-rose-200/90 mt-1 break-words font-mono bg-rose-950/60 p-2 rounded border border-rose-800/50">
          {message}
        </p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-rose-400 hover:text-rose-200 p-1 rounded-lg hover:bg-rose-500/20 transition-colors"
          aria-label="Cerrar alerta de error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

