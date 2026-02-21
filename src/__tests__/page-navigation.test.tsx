import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';

// Mock child components to keep tests focused on navigation state
vi.mock('@/components/LandingPage', () => ({
  default: ({ onStartApplication }: { onStartApplication: () => void }) => (
    <div data-testid="landing-page">
      <button onClick={onStartApplication}>Start Application</button>
    </div>
  ),
}));

vi.mock('@/components/PrivacyNotice', () => ({
  default: () => <div data-testid="privacy-notice" />,
}));

vi.mock('@/components/Sidebar', () => ({
  default: ({
    currentStep,
    onBackToLanding,
  }: {
    currentStep: number;
    completedSteps: Set<number>;
    onStepClick: (step: number) => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
    onBackToLanding: () => void;
  }) => (
    <div data-testid="sidebar">
      <span data-testid="current-step">{currentStep}</span>
      <button onClick={onBackToLanding}>Back to Landing</button>
    </div>
  ),
}));

vi.mock('@/components/MobileHeader', () => ({
  default: () => <div data-testid="mobile-header" />,
}));

vi.mock('@/components/Wizard', () => ({
  default: ({
    currentStep,
    goToStep,
    markCompleteAndAdvance,
  }: {
    currentStep: number;
    goToStep: (step: number) => void;
    markCompleteAndAdvance: (step: number) => void;
  }) => (
    <div data-testid="wizard">
      <span data-testid="wizard-step">{currentStep}</span>
      <button onClick={() => markCompleteAndAdvance(currentStep)}>Next</button>
      <button onClick={() => goToStep(currentStep - 1)}>Prev</button>
    </div>
  ),
}));

// Mock window.scrollTo
beforeEach(() => {
  vi.stubGlobal('scrollTo', vi.fn());
});

describe('Home page navigation', () => {
  it('starts in landing view', () => {
    render(<Home />);
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    expect(screen.queryByTestId('wizard')).not.toBeInTheDocument();
  });

  it('switches to wizard view when Start Application is clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText('Start Application'));
    expect(screen.queryByTestId('landing-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('wizard')).toBeInTheDocument();
  });

  it('starts wizard at step 0', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText('Start Application'));
    expect(screen.getByTestId('wizard-step')).toHaveTextContent('0');
  });

  it('advances step when Next is clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText('Start Application'));
    expect(screen.getByTestId('wizard-step')).toHaveTextContent('0');
    await user.click(screen.getByText('Next'));
    expect(screen.getByTestId('wizard-step')).toHaveTextContent('1');
  });

  it('goes back a step when Prev is clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText('Start Application'));
    // Advance to step 1
    await user.click(screen.getByText('Next'));
    expect(screen.getByTestId('wizard-step')).toHaveTextContent('1');
    // Go back to step 0
    await user.click(screen.getByText('Prev'));
    expect(screen.getByTestId('wizard-step')).toHaveTextContent('0');
  });

  it('returns to landing view when Back to Landing is clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText('Start Application'));
    expect(screen.getByTestId('wizard')).toBeInTheDocument();
    await user.click(screen.getByText('Back to Landing'));
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('scrolls to top on view change', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText('Start Application'));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
