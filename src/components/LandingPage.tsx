'use client';

import { useState } from 'react';
import DetailsModal from '@/components/DetailsModal';

interface LandingPageProps {
  onStartApplication: () => void;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function LandingPage({ onStartApplication }: LandingPageProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* ─── Section 1: Floating Pill Navbar ─── */}
      <nav className="nav-pill">
        <div className="flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/cofa-supports-logo.svg`}
            alt="COFA Supports logo"
            width={22}
            height={22}
          />
          <span className="hidden sm:inline font-bold text-ink text-sm tracking-tight">COFA Supports</span>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 ml-auto md:ml-4">
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.15em] text-muted hover:text-ocean px-2 sm:px-3 py-1.5 rounded-full hover:bg-ocean/5 transition-colors"
          >
            Info
          </button>
          <a
            href="#security"
            className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.15em] text-muted hover:text-ocean px-2 sm:px-3 py-1.5 rounded-full hover:bg-ocean/5 transition-colors"
          >
            Security
          </a>
        </div>

        <button
          type="button"
          onClick={onStartApplication}
          className="ml-2 md:ml-4 px-4 sm:px-5 py-2 bg-ocean text-white text-xs sm:text-sm font-bold rounded-full hover:bg-ocean-light transition-colors whitespace-nowrap shrink-0"
        >
          Start Now
        </button>
      </nav>

      {/* ─── Section 2: Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center bg-surface overflow-hidden">
        <div className="absolute inset-0 grid-bg" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ocean" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              FSM Form 500B — Available Now
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-6">
            <span className="block text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-ink">
              Passport Renewal
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-7xl font-serif italic text-gold mt-1">
              Shouldn&apos;t Be This Hard.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted max-w-lg mx-auto mb-10 leading-relaxed">
            Fill out your FSM form online &mdash; correctly, the first time.<br className="hidden sm:block" />
            Print it ready to sign, notarize, and submit.
          </p>

          {/* CTA */}
          <button
            type="button"
            onClick={onStartApplication}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-ocean text-white font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-glow-ocean"
          >
            <span className="absolute inset-0 bg-ocean-light translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">edit_document</span>
              Fill Out Your Passport Form
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </span>
          </button>

          {/* Privacy badge */}
          <div className="mt-8 inline-flex items-center gap-2 text-muted/70 text-sm">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="font-mono text-xs tracking-wide">100% Client-Side Processing</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/40">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="material-symbols-outlined text-[20px] animate-float">expand_more</span>
        </div>
      </section>

      {/* ─── Section 3: Nation Feature Cards ─── */}
      <section className="relative py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="mb-12">
            <span className="mono-label">Supported Nations</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3 tracking-tight">
              Choose your <span className="font-serif italic text-ocean">passport.</span>
            </h2>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:snap-none md:pb-0 md:mx-0 md:px-0 items-center">
            {/* FSM first in DOM (shows first on mobile scroll) — centered on desktop via order-2 */}
            <div className="feature-card bg-ocean-deep min-w-[80vw] snap-center md:min-w-0 md:h-[500px] flex flex-col border border-ocean/30 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 shrink-0 md:order-2">
              <div className="flex-1 flex items-center justify-center p-8 pb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/passport-fsm.webp`}
                  alt="FSM passport"
                  className="passport-hover w-full max-w-[200px] h-auto rounded-md drop-shadow-[0_16px_32px_rgba(0,0,0,0.4)] hover:scale-105 hover:-translate-y-1"
                />
              </div>

              <div className="p-6 pt-2 space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-white">FSM</h3>
                  <p className="font-mono text-xs text-white/50 mt-0.5">Federated States of Micronesia</p>
                </div>

                <button
                  type="button"
                  onClick={onStartApplication}
                  className="w-full py-3 bg-gold text-white font-bold rounded-xl hover:bg-gold-light transition-colors"
                >
                  Start Application
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="w-full text-center font-mono text-xs text-white/60 hover:text-white transition-colors py-1"
                >
                  Requirements &amp; Fees
                </button>
              </div>
            </div>

            {/* RMI — second in DOM (swipe right on mobile), first column on desktop via order-1 */}
            <div className="feature-card bg-surface border border-ocean/10 min-w-[75vw] snap-center md:min-w-0 min-h-[360px] md:h-[440px] flex flex-col shrink-0 md:order-1">
              <div className="flex-1 flex items-center justify-center p-8 pb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/passport-rmi.png`}
                  alt="RMI passport"
                  className="w-full max-w-[160px] h-auto rounded-md opacity-25 grayscale"
                />
              </div>

              <div className="p-6 pt-2 space-y-3">
                <div>
                  <h3 className="font-bold text-xl text-ink/40">RMI</h3>
                  <p className="font-mono text-xs text-muted/40 mt-0.5">Republic of the Marshall Islands</p>
                </div>

                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                  Coming Soon
                </div>
              </div>
            </div>

            {/* Palau — third in DOM and on desktop via order-3 */}
            <div className="feature-card bg-surface border border-ocean/10 min-w-[75vw] snap-center md:min-w-0 min-h-[360px] md:h-[440px] flex flex-col shrink-0 md:order-3">
              <div className="flex-1 flex items-center justify-center p-8 pb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/passport-palau.png`}
                  alt="Palau passport"
                  className="w-full max-w-[160px] h-auto rounded-md opacity-25 grayscale"
                />
              </div>

              <div className="p-6 pt-2 space-y-3">
                <div>
                  <h3 className="font-bold text-xl text-ink/40">Palau</h3>
                  <p className="font-mono text-xs text-muted/40 mt-0.5">Republic of Palau</p>
                </div>

                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: The Old Way vs A Better Way ─── */}
      <section id="security" className="py-20 sm:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: The Old Way */}
            <div className="text-ink/20 space-y-4">
              <span className="mono-label !text-ink/15">The Old Way</span>
              <p className="text-2xl sm:text-3xl font-bold leading-snug">
                Download the form. Print it out. Fill it in by hand. Make a mistake.
                Cross it out. Start over with a fresh copy. Hope it&apos;s neat enough.
                Drive to get it notarized. Find out you missed a field...
              </p>
            </div>

            {/* Right: A Better Way */}
            <div className="space-y-5">
              <span className="mono-label text-gold">A Better Way</span>
              <p className="text-3xl sm:text-4xl font-serif italic text-ink leading-tight">
                Fill it out right<br />
                <span className="text-gold">the first time.</span>
              </p>
              <p className="text-base text-muted leading-relaxed max-w-md">
                This app walks you through the FSM passport application step by step.
                When you&apos;re done, print your completed form &mdash; ready to sign and notarize.
                No more handwriting mistakes. No more starting over.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted/70 pt-1">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Your information stays on your device. We don&apos;t collect or store anything.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Process Steps ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="mb-12">
            <span className="mono-label">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3 tracking-tight">
              Three steps. <span className="font-serif italic text-ocean">That&apos;s it.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 01 */}
            <div className="step-card group">
              <span className="font-mono text-7xl font-bold text-ocean/10 group-hover:text-gold/20 transition-colors duration-500 leading-none">
                01
              </span>
              <div className="relative mt-4 mb-3">
                <span className="material-symbols-outlined text-[32px] text-ocean group-hover:text-gold transition-colors duration-500">
                  public
                </span>
                {/* Spinning dashed circle on hover */}
                <div className="absolute -inset-2 border border-dashed border-ocean/0 group-hover:border-gold/30 rounded-full group-hover:animate-spin-slow transition-colors duration-500" />
              </div>
              <h3 className="font-bold text-lg text-ink">Select Nation</h3>
              <p className="font-mono text-xs text-muted mt-2 leading-relaxed">
                Choose your COFA nation and passport type to get started.
              </p>
            </div>

            {/* Step 02 */}
            <div className="step-card group">
              <span className="font-mono text-7xl font-bold text-ocean/10 group-hover:text-gold/20 transition-colors duration-500 leading-none">
                02
              </span>
              <div className="relative mt-4 mb-3">
                <span className="material-symbols-outlined text-[32px] text-ocean group-hover:text-gold transition-colors duration-500">
                  edit_note
                </span>
                <div className="absolute -inset-2 border border-dashed border-ocean/0 group-hover:border-gold/30 rounded-full group-hover:animate-spin-slow transition-colors duration-500" />
              </div>
              <h3 className="font-bold text-lg text-ink">Fill Details</h3>
              <p className="font-mono text-xs text-muted mt-2 leading-relaxed">
                Enter your personal information through our guided form wizard.
              </p>
            </div>

            {/* Step 03 */}
            <div className="step-card group">
              <span className="font-mono text-7xl font-bold text-ocean/10 group-hover:text-gold/20 transition-colors duration-500 leading-none">
                03
              </span>
              <div className="relative mt-4 mb-3">
                <span className="material-symbols-outlined text-[32px] text-ocean group-hover:text-gold transition-colors duration-500">
                  print
                </span>
                <div className="absolute -inset-2 border border-dashed border-ocean/0 group-hover:border-gold/30 rounded-full group-hover:animate-spin-slow transition-colors duration-500" />
              </div>
              <h3 className="font-bold text-lg text-ink">Print PDF</h3>
              <p className="font-mono text-xs text-muted mt-2 leading-relaxed">
                Generate your pre-filled application and print it for submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 6: Footer ─── */}
      <footer className="bg-ocean-deep text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {/* Logo + brand text */}
          <div className="flex items-center gap-6 mb-10">
            <img
              src={`${basePath}/cofa-supports-logo.svg`}
              alt="COFA Supports logo"
              className="h-20 sm:h-28 lg:h-32 w-auto invert opacity-80"
            />
            <h2
              className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(36,113,163,0.4) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              COFA<br />SUPPORTS
            </h2>
          </div>

          {/* Status line */}
          <div className="flex items-center gap-2.5 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              System Status: Operational
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 mb-10">
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="font-mono text-xs uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors"
            >
              Requirements
            </button>
            <a
              href="https://github.com/AikenOZ/cofa-passport"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors"
            >
              GitHub Repo
            </a>
          </div>

          {/* Disclaimer + copyright */}
          <div className="border-t border-white/10 pt-6 space-y-3">
            <p className="text-xs text-white/30 max-w-2xl leading-relaxed">
              This is not an official government website. This tool helps you fill out passport
              application forms that must be printed and submitted to the appropriate passport office.
            </p>
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.15em]">
              &copy; {new Date().getFullYear()} COFA Supports
            </p>
          </div>
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
