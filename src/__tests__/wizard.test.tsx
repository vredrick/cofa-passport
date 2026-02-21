import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Wizard from '@/components/Wizard';

describe('Wizard', () => {
  const defaultProps = {
    currentStep: 0,
    goToStep: vi.fn(),
    markCompleteAndAdvance: vi.fn(),
  };

  it('renders PassportTypeStep at step 0', () => {
    render(<Wizard {...defaultProps} currentStep={0} />);
    expect(screen.getByText('Passport Type')).toBeInTheDocument();
    expect(screen.getByText('Ordinary Passport')).toBeInTheDocument();
  });

  it('renders ApplicantInfoStep at step 1', () => {
    render(<Wizard {...defaultProps} currentStep={1} />);
    expect(screen.getByText('Applicant Information')).toBeInTheDocument();
  });

  it('renders ParentInfoStep for Father at step 2', () => {
    render(<Wizard {...defaultProps} currentStep={2} />);
    expect(screen.getByText("Father's Information")).toBeInTheDocument();
  });

  it('renders ParentInfoStep for Mother at step 3', () => {
    render(<Wizard {...defaultProps} currentStep={3} />);
    expect(screen.getByText("Mother's Information")).toBeInTheDocument();
  });

  it('renders ReviewStep at step 4', () => {
    render(<Wizard {...defaultProps} currentStep={4} />);
    expect(screen.getByText('Review Your Application')).toBeInTheDocument();
  });

  it('does not render other steps when on step 0', () => {
    render(<Wizard {...defaultProps} currentStep={0} />);
    expect(screen.queryByText('Applicant Information')).not.toBeInTheDocument();
    expect(screen.queryByText("Father's Information")).not.toBeInTheDocument();
  });

  it('calls markCompleteAndAdvance when completing step 0', async () => {
    const user = userEvent.setup();
    const markCompleteAndAdvance = vi.fn();
    render(
      <Wizard currentStep={0} goToStep={vi.fn()} markCompleteAndAdvance={markCompleteAndAdvance} />
    );

    // Select a passport type first
    await user.click(screen.getByText('Ordinary Passport'));
    await user.click(screen.getByText('Continue'));
    expect(markCompleteAndAdvance).toHaveBeenCalledWith(0);
  });
});
