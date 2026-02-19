'use client';

import { useState } from 'react';

export default function PrivacyNotice() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <div className="flex-1">
        <p className="text-sm text-green-800">
          <strong>Your data stays private.</strong> All information is processed locally in your browser. Nothing is sent to any server.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-green-600 hover:text-green-800 p-1"
        aria-label="Dismiss notice"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
