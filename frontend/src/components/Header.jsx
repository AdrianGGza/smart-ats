export default function Header({ totalEvaluados, activeTab, onSelectTab }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'auto' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] sm:h-[72px] bg-[#ffffff] border-b border-[#111111]/12 z-20">
      <div className="taste-wrap h-full flex items-center justify-between">
        {/* Brand mark (stack geometry) + Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-3 text-[#111111] no-underline group"
        >
          <span
            aria-hidden="true"
            className="w-7 h-7 rounded-[6px] bg-[#111111] text-[#ffffff] flex items-center justify-center font-mono text-[13px] font-medium tracking-tight"
          >
            S
          </span>
          <span className="text-[20px] font-medium tracking-[-0.03em] text-[#111111]">
            Smart ATS
          </span>
        </a>

        {/* Plain one-word nouns navigation (system.md rule) */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-8">
          <button
            type="button"
            onClick={() => {
              onSelectTab('single');
              scrollToSection('workspace');
            }}
            aria-current={activeTab === 'single' ? 'page' : undefined}
            className="taste-nav-link bg-transparent border-0 cursor-pointer"
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('batch');
              scrollToSection('workspace');
            }}
            aria-current={activeTab === 'batch' ? 'page' : undefined}
            className="taste-nav-link bg-transparent border-0 cursor-pointer"
          >
            Lotes
          </button>
          <a href="#resultados" className="taste-nav-link no-underline">
            Candidatos
            {totalEvaluados > 0 && (
              <span className="ml-1.5 font-mono text-[13px] text-[#1a4be0]">
                ({totalEvaluados})
              </span>
            )}
          </a>
          <a href="#arquitectura" className="taste-nav-link no-underline">
            Flujo
          </a>
        </nav>

        {/* Single main action button ending on the right edge */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline-flex items-center gap-2 font-mono text-[13px] text-[#6b6b6b]">
            <span className="w-2 h-2 rounded-full bg-[#111111]" />
            localhost:8000
          </span>
          <a
            href="#workspace"
            onClick={() => onSelectTab('single')}
            className="taste-btn-primary no-underline"
          >
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
          </a>
        </div>
      </div>
    </header>
  );
}
