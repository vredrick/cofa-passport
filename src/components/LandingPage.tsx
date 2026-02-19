'use client';

import { useState } from 'react';
import { NATIONS, type NationInfo } from '@/data/nations';
import DetailsModal from '@/components/DetailsModal';

interface LandingPageProps {
  onStartApplication: () => void;
}

function NationCard({
  nation,
  onStartApplication,
  onShowDetails,
}: {
  nation: NationInfo;
  onStartApplication: () => void;
  onShowDetails: () => void;
}) {
  const isAvailable = nation.status === 'available';

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all ${
        isAvailable
          ? 'border-[3px] border-ocean shadow-hard bg-white'
          : 'border-[3px] border-ocean/15 bg-white'
      }`}
    >
      {/* Coming Soon badge */}
      {!isAvailable && (
        <div className="absolute top-4 right-4 z-10 bg-ocean/80 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm">
          Coming Soon
        </div>
      )}

      {/* Passport cover image */}
      <div className={`relative bg-ocean/5 ${isAvailable ? '' : 'opacity-40 grayscale-[30%]'}`}>
        <div className="flex items-center justify-center px-8 pt-8 pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${nation.passportImage}`}
            alt={`${nation.fullName} passport`}
            className={`w-full max-w-[200px] h-auto rounded-md transition-transform duration-300 ${
              isAvailable ? 'drop-shadow-[0_8px_24px_rgba(27,79,114,0.3)] group-hover:scale-[1.03]' : 'drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
            }`}
          />
        </div>
      </div>

      {/* Gold divider */}
      <div className={`h-1 ${isAvailable ? 'bg-gold' : 'bg-ocean/10'}`} />

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className={`font-bold text-xl mb-1 ${isAvailable ? 'text-ink' : 'text-ink/40'}`}>
          {nation.name}
        </h3>
        <p className={`text-sm mb-4 ${isAvailable ? 'text-muted' : 'text-muted/40'}`}>
          {nation.fullName}
        </p>

        {isAvailable ? (
          <div className="mt-auto space-y-2.5">
            <button type="button" onClick={onStartApplication} className="btn-primary">
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px]">edit_document</span>
                Passport Renewal
              </span>
            </button>
            <button
              type="button"
              disabled
              className="btn-secondary opacity-40 cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                Replacement
                <span className="text-xs font-normal">(Soon)</span>
              </span>
            </button>
            <button
              type="button"
              onClick={onShowDetails}
              className="w-full text-center text-sm font-semibold text-ocean hover:text-ocean-light transition-colors py-1.5"
            >
              <span className="flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[18px]">info</span>
                Requirements & Fees
              </span>
            </button>
          </div>
        ) : (
          <div className="mt-auto pt-2">
            <p className="text-sm text-muted/50 text-center">
              We&apos;re working on adding {nation.name} passport services.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LandingPage({ onStartApplication }: LandingPageProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Hero */}
      <div className="bg-ocean text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="text-center">
            {/* COFA 4-star emblem */}
            <svg width="56" height="56" viewBox="0 0 56 56" className="text-white mx-auto mb-5">
              <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {[
                [28, 11],
                [28, 45],
                [11, 28],
                [45, 28],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" />
              ))}
            </svg>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
              COFA Passport Services
            </h1>
            <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto mb-5">
              Fill out your passport application online, generate a pre-filled PDF, and print it for submission.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full border border-white/10">
              <span className="material-symbols-outlined text-[16px]">shield_lock</span>
              100% private — your data never leaves this device
            </div>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 w-full">
        <p className="text-sm font-bold text-ocean uppercase tracking-widest mt-8 mb-4">
          Select your nation
        </p>
      </div>

      {/* Nation cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-16 w-full flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NATIONS.map((nation) => (
            <NationCard
              key={nation.id}
              nation={nation}
              onStartApplication={onStartApplication}
              onShowDetails={() => setDetailsOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-ocean/10 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <span className="material-symbols-outlined text-[16px]">shield_lock</span>
            Your data never leaves your device. No accounts, no servers.
          </div>
          <p className="text-xs text-muted/60">
            This is not an official government website. This tool helps you fill out application
            forms that must be printed and submitted to the appropriate passport office.
          </p>
        </div>
      </footer>

      <DetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onStartApplication={() => {
          setDetailsOpen(false);
          onStartApplication();
        }}
      />
    </div>
  );
}
