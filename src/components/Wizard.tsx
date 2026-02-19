'use client';

import { useState, useCallback, useEffect } from 'react';
import { FormData, INITIAL_FORM_DATA, PassportType, ApplicantInfo, ParentInfo } from '@/types/form';
import ProgressBar from './ProgressBar';
import PassportTypeStep from './steps/PassportTypeStep';
import ApplicantInfoStep from './steps/ApplicantInfoStep';
import ParentInfoStep from './steps/ParentInfoStep';
import ReviewStep from './steps/ReviewStep';

export default function Wizard() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

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

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const updatePassportType = useCallback((type: PassportType) => {
    setFormData((prev) => ({ ...prev, passportType: type }));
  }, []);

  const updateApplicant = useCallback((applicant: ApplicantInfo) => {
    setFormData((prev) => ({ ...prev, applicant }));
  }, []);

  const updateFather = useCallback((father: ParentInfo) => {
    setFormData((prev) => ({ ...prev, father }));
  }, []);

  const updateMother = useCallback((mother: ParentInfo) => {
    setFormData((prev) => ({ ...prev, mother }));
  }, []);

  return (
    <div>
      <ProgressBar currentStep={currentStep} completedSteps={completedSteps} onStepClick={goToStep} />

      <div className="mt-4">
        {currentStep === 0 && (
          <PassportTypeStep
            value={formData.passportType}
            onChange={updatePassportType}
            onNext={() => markCompleteAndAdvance(0)}
          />
        )}
        {currentStep === 1 && (
          <ApplicantInfoStep
            data={formData.applicant}
            onChange={updateApplicant}
            onNext={() => markCompleteAndAdvance(1)}
            onBack={() => goToStep(0)}
          />
        )}
        {currentStep === 2 && (
          <ParentInfoStep
            parentLabel="Father"
            data={formData.father}
            onChange={updateFather}
            onNext={() => markCompleteAndAdvance(2)}
            onBack={() => goToStep(1)}
          />
        )}
        {currentStep === 3 && (
          <ParentInfoStep
            parentLabel="Mother"
            data={formData.mother}
            onChange={updateMother}
            onNext={() => markCompleteAndAdvance(3)}
            onBack={() => goToStep(2)}
          />
        )}
        {currentStep === 4 && (
          <ReviewStep
            data={formData}
            onEdit={goToStep}
            onBack={() => goToStep(3)}
          />
        )}
      </div>
    </div>
  );
}
