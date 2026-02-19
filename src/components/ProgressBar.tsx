'use client';

import { STEP_LABELS } from '@/types/form';

interface ProgressBarProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

export default function ProgressBar({ currentStep, completedSteps, onStepClick }: ProgressBarProps) {
  const progress = ((currentStep) / (STEP_LABELS.length - 1)) * 100;

  return (
    <div className="py-4">
      {/* Progress fill bar */}
      <div className="relative h-1.5 bg-gray-200 rounded-full mb-4">
        <div
          className="absolute h-full bg-ocean rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {STEP_LABELS.map((label, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStep;
          const isClickable = isCompleted || index < currentStep;

          return (
            <button
              key={label}
              type="button"
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className="flex flex-col items-center gap-1 group"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-ocean text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-ocean text-ocean ring-2 ring-ocean/20'
                    : 'bg-gray-200 text-gray-500'
                } ${isClickable ? 'cursor-pointer group-hover:scale-110' : 'cursor-default'}`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isCurrent ? 'text-ocean' : isCompleted ? 'text-ocean' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
