'use client';

const STEP_NAMES = ['Type', 'Applicant', 'Father', 'Mother', 'Review'];

interface MobileHeaderProps {
  currentStep: number;
  onToggleSidebar: () => void;
  onBackToLanding?: () => void;
}

export default function MobileHeader({ currentStep, onToggleSidebar, onBackToLanding }: MobileHeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-ocean text-white">
      <div className="flex items-center justify-between px-4 h-14">
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
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
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
