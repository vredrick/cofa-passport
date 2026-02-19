'use client';

import { useState, useCallback, useEffect } from 'react';
import PrivacyNotice from '@/components/PrivacyNotice';
import Wizard from '@/components/Wizard';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';
import LandingPage from '@/components/LandingPage';

type View = 'landing' | 'wizard';

export default function Home() {
  const [view, setView] = useState<View>('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const markCompleteAndAdvance = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(Array.from(prev));
      next.add(step);
      return next;
    });
    setCurrentStep(step + 1);
  }, []);

  const handleStartApplication = useCallback(() => {
    setView('wizard');
    setCurrentStep(0);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setView('landing');
  }, []);

  // Scroll to top on step change or view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, view]);

  if (view === 'landing') {
    return <LandingPage onStartApplication={handleStartApplication} />;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      <Sidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onBackToLanding={handleBackToLanding}
      />
      <MobileHeader
        currentStep={currentStep}
        onToggleSidebar={() => setMobileOpen((o) => !o)}
        onBackToLanding={handleBackToLanding}
      />
      <main className="flex-1">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8 py-8 space-y-6">
          <PrivacyNotice />
          <Wizard
            currentStep={currentStep}
            goToStep={goToStep}
            markCompleteAndAdvance={markCompleteAndAdvance}
          />
        </div>
      </main>
    </div>
  );
}
