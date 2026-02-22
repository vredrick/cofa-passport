'use client';

import { FSM_PASSPORT_INFO } from '@/data/nations';

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  onStartApplication: () => void;
}

export default function DetailsModal({ open, onClose, onStartApplication }: DetailsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-t-2xl sm:rounded-2xl border border-ocean/20 shadow-smooth overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-ocean-deep text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold">FSM Passport Info</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Requirements */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-ocean text-[22px]">checklist</span>
              <h3 className="font-bold text-ink text-lg font-mono">Requirements</h3>
            </div>
            <ul className="space-y-2">
              {FSM_PASSPORT_INFO.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-muted">
                  <span className="material-symbols-outlined text-gold text-[16px] mt-0.5 flex-shrink-0">
                    arrow_right
                  </span>
                  {req}
                </li>
              ))}
            </ul>
          </section>

          {/* Fees */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-ocean text-[22px]">payments</span>
              <h3 className="font-bold text-ink text-lg font-mono">Fees</h3>
            </div>
            <div className="space-y-2">
              {FSM_PASSPORT_INFO.fees.map((fee) => (
                <div key={fee.label} className="flex justify-between text-sm">
                  <span className="text-muted">{fee.label}</span>
                  <span className="font-bold text-ink">{fee.amount}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Processing Time */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-ocean text-[22px]">schedule</span>
              <h3 className="font-bold text-ink text-lg font-mono">Processing Time</h3>
            </div>
            <div className="space-y-2">
              {FSM_PASSPORT_INFO.processingTime.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-bold text-ink">{item.duration}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Offices */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-ocean text-[22px]">location_on</span>
              <h3 className="font-bold text-ink text-lg font-mono">Passport Offices</h3>
            </div>
            <div className="space-y-3">
              {FSM_PASSPORT_INFO.offices.map((office) => (
                <div key={office.name} className="text-sm">
                  <p className="font-semibold text-ink">{office.name}</p>
                  <p className="text-muted">{office.address}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <p className="text-xs text-muted/70 italic">
            Fees and processing times are estimates and may vary. Contact the nearest passport office for current information.
          </p>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white border-t border-ocean/10 p-4 flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Close
          </button>
          <button type="button" onClick={onStartApplication} className="btn-primary flex-1">
            Start Application
          </button>
        </div>
      </div>
    </div>
  );
}
