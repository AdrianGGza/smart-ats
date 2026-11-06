export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-[12px] bg-[#fff5f5] border border-[#b91c1c]/25 p-4 text-[#111111] flex items-start justify-between gap-4"
    >
      <div className="space-y-1 min-w-0">
        <p className="text-[13px] font-medium text-[#b91c1c]">
          Respuesta del servidor (Error de solicitud)
        </p>
        <p className="font-mono text-[13px] text-[#111111] break-words">
          {message}
        </p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[13px] font-medium text-[#6b6b6b] hover:text-[#111111] px-2 py-1 rounded-[6px] border border-transparent hover:border-[#111111]/15 transition-colors shrink-0"
        >
          Cerrar
        </button>
      )}
    </div>
  );
}
