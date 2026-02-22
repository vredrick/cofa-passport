'use client';

const STEP_NAMES = ['Type', 'Applicant', 'Father', 'Mother', 'Review'];

interface MobileHeaderProps {
  currentStep: number;
  onToggleSidebar: () => void;
  onBackToLanding?: () => void;
}

export default function MobileHeader({ currentStep, onToggleSidebar, onBackToLanding }: MobileHeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-40 text-white" style={{ background: 'rgba(27, 79, 114, 0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="p-1 -ml-1 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-focus"
              aria-label="Back to home"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}
          <span className="font-bold text-base">FSM Passport</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
            {STEP_NAMES[currentStep]} ({currentStep + 1}/5)
          </span>
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-focus"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
