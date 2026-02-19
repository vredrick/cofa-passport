'use client';

import { useState } from 'react';

export default function PrivacyNotice() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-surface border-l-4 border-ocean rounded-r-lg p-4 flex items-start gap-3">
      <span className="material-symbols-outlined text-ocean text-[22px] flex-shrink-0 mt-0.5">
        shield_lock
      </span>
      <div className="flex-1">
        <p className="text-base text-ink">
          <strong>Your data stays private.</strong> All information is processed locally in your browser. Nothing is sent to any server.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted hover:text-ink p-1 transition-colors"
        aria-label="Dismiss notice"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  );
}
