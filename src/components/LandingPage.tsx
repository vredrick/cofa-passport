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
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 ${isAvailable
        ? 'border border-ocean/15 bg-white shadow-premium hover:shadow-premium-hover hover:-translate-y-1 z-10 hover:z-20'
        : 'border border-ocean/10 bg-white shadow-sm opacity-90'
        }`}
    >
      {/* Coming Soon badge */}
      {!isAvailable && (
        <div className="absolute top-4 right-4 z-10 bg-ocean/80 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm">
          Coming Soon
        </div>
      )}

      {/* Passport cover image */}
      <div className={`relative bg-gradient-to-b from-ocean/5 to-transparent overflow-hidden ${isAvailable ? '' : 'opacity-50 grayscale-[40%]'}`}>

        {/* Backdrop glow for available passports */}
        {isAvailable && (
          <div className="absolute inset-0 bg-ocean-light/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl scale-125 rounded-full" />
        )}

        <div className="relative flex items-center justify-center px-8 pt-8 pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${nation.passportImage}`}
            alt={`${nation.fullName} passport`}
            className={`w-full max-w-[200px] h-auto rounded-md transition-all duration-500 ease-out ${isAvailable ? 'drop-shadow-[0_12px_24px_rgba(27,79,114,0.25)] group-hover:drop-shadow-[0_20px_32px_rgba(27,79,114,0.35)] group-hover:scale-[1.04] group-hover:-translate-y-1' : 'drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
              }`}
          />
        </div>
      </div>

      {/* Gold divider */}
      <div className={`h-1.5 transition-colors duration-500 ${isAvailable ? 'bg-gradient-to-r from-gold to-gold-light group-hover:from-gold-light group-hover:to-gold' : 'bg-ocean/10'}`} />

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
      <div className="relative overflow-hidden bg-gradient-to-br from-ocean-deep via-ocean to-ocean-light text-white">
        {/* Micronesian seashell background pattern */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url(/images/micronesian-pattern.png)', backgroundSize: '300px' }} />

        {/* Glowing orbs */}
        <div className="absolute -top-20 -left-20 w-[40rem] h-[40rem] bg-ocean-light/30 rounded-full mix-blend-screen filter blur-[100px] animate-glow pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[50rem] h-[50rem] bg-[#0E2C48]/50 rounded-full mix-blend-screen filter blur-[120px] animate-glow delay-1000 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
          <div className="text-center">
            {/* COFA 4-star emblem */}
            <svg width="56" height="56" viewBox="0 0 56 56" className="text-white mx-auto mb-6 animate-float drop-shadow-md">
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 animate-fade-in-up opacity-0">
              COFA Passport Services
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-6 animate-fade-in-up opacity-0 delay-100">
              Fill out your passport application online, generate a pre-filled PDF, and print it for submission.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full border border-white/20 backdrop-blur-md animate-fade-in-up opacity-0 delay-200 shadow-lg">
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
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:pb-0">
          {NATIONS.map((nation) => (
            <div key={nation.id} className="min-w-[280px] max-w-[300px] flex-shrink-0 snap-center sm:min-w-0 sm:max-w-none sm:flex-shrink">
              <NationCard
                nation={nation}
                onStartApplication={onStartApplication}
                onShowDetails={() => setDetailsOpen(true)}
              />
            </div>
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
