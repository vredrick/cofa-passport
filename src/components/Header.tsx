'use client';

export default function Header() {
  return (
    <header className="bg-ocean text-white py-4 px-4">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        {/* FSM Four-Star Motif */}
        <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0">
          <circle cx="20" cy="20" r="19" fill="none" stroke="white" strokeWidth="1.5" />
          {/* Four stars in diamond pattern */}
          <polygon points="20,6 21.5,10 20,9 18.5,10" fill="white" />
          <polygon points="20,30 21.5,34 20,33 18.5,34" fill="white" />
          <polygon points="8,18 8,22 6,20" fill="white" />
          <polygon points="32,18 32,22 34,20" fill="white" />
          {/* Star shapes */}
          {[
            [20, 8],
            [20, 32],
            [8, 20],
            [32, 20],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2" fill="white" />
          ))}
        </svg>
        <div>
          <h1 className="text-lg font-bold leading-tight">FSM Passport Application</h1>
          <p className="text-xs text-white/80">Form 500B — Digital Assistant</p>
        </div>
      </div>
    </header>
  );
}
