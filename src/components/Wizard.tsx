'use client';

import { useState, useCallback } from 'react';
import { FormData, INITIAL_FORM_DATA, PassportType, ApplicantInfo, ParentInfo } from '@/types/form';
import PassportTypeStep from './steps/PassportTypeStep';
import ApplicantInfoStep from './steps/ApplicantInfoStep';
import ParentInfoStep from './steps/ParentInfoStep';
import ReviewStep from './steps/ReviewStep';

interface WizardProps {
  currentStep: number;
  goToStep: (step: number) => void;
  markCompleteAndAdvance: (step: number) => void;
}

export default function Wizard({ currentStep, goToStep, markCompleteAndAdvance }: WizardProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

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
    <div key={currentStep} className="step-animate-in">
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
  );
}
