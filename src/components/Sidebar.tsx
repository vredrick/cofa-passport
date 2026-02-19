'use client';

interface SidebarProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onBackToLanding?: () => void;
}

const SIDEBAR_STEPS = [
  { label: 'Passport Type', icon: 'badge', steps: [0] },
  { label: 'Your Details', icon: 'person', steps: [1] },
  { label: 'Parental Info', icon: 'family_restroom', steps: [2, 3] },
  { label: 'Review & Print', icon: 'description', steps: [4] },
];

export default function Sidebar({
  currentStep,
  completedSteps,
  onStepClick,
  mobileOpen,
  onMobileClose,
  onBackToLanding,
}: SidebarProps) {
  const isActive = (steps: number[]) => steps.includes(currentStep);
  const isCompleted = (steps: number[]) => steps.every((s) => completedSteps.has(s));
  const isClickable = (steps: number[]) =>
    isCompleted(steps) || steps.some((s) => s <= currentStep);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Branding */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0">
            <circle cx="20" cy="20" r="19" fill="none" stroke="#1B4F72" strokeWidth="1.5" />
            {[
              [20, 8],
              [20, 32],
              [8, 20],
              [32, 20],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="2.5" fill="#1B4F72" />
            ))}
          </svg>
          <div>
            <h1 className="text-lg font-bold text-ink leading-tight">FSM Passport</h1>
            <p className="text-xs text-muted">Form 500B</p>
          </div>
        </div>
        {onBackToLanding && (
          <button
            type="button"
            onClick={() => {
              onBackToLanding();
              onMobileClose();
            }}
            className="flex items-center gap-1 mt-3 text-sm font-semibold text-ocean hover:text-ocean-light transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Home
          </button>
        )}
      </div>

      {/* Step Navigation */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {SIDEBAR_STEPS.map((item) => {
            const active = isActive(item.steps);
            const completed = isCompleted(item.steps);
            const clickable = isClickable(item.steps);
            const targetStep = item.steps[0];

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (clickable) {
                      onStepClick(targetStep);
                      onMobileClose();
                    }
                  }}
                  disabled={!clickable}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    active
                      ? 'bg-ocean text-white'
                      : completed
                      ? 'text-ocean hover:bg-ocean/5 cursor-pointer'
                      : clickable
                      ? 'text-ink hover:bg-surface cursor-pointer'
                      : 'text-gray-400 cursor-default'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {completed && !active ? 'check_circle' : item.icon}
                  </span>
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="material-symbols-outlined text-[16px]">shield_lock</span>
          <span>All data stays in your browser</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-200 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          <aside className="relative w-80 max-w-[85vw] bg-white h-full shadow-xl animate-slide-in">
            <button
              type="button"
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-1 text-muted hover:text-ink"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
