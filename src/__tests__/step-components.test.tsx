import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PassportTypeStep from '@/components/steps/PassportTypeStep';
import ParentInfoStep from '@/components/steps/ParentInfoStep';
import { INITIAL_PARENT } from '@/types/form';
import type { ParentInfo } from '@/types/form';

// ============================================================
// PassportTypeStep
// ============================================================
describe('PassportTypeStep', () => {
  it('renders all three passport type options', () => {
    render(<PassportTypeStep value="" onChange={() => {}} onNext={() => {}} />);
    expect(screen.getByText('Ordinary Passport')).toBeInTheDocument();
    expect(screen.getByText('Official Passport')).toBeInTheDocument();
    expect(screen.getByText('Diplomatic Passport')).toBeInTheDocument();
  });

  it('renders heading and description', () => {
    render(<PassportTypeStep value="" onChange={() => {}} onNext={() => {}} />);
    expect(screen.getByText('Passport Type')).toBeInTheDocument();
    expect(screen.getByText('Select the type of passport you are applying for.')).toBeInTheDocument();
  });

  it('shows validation error when Continue clicked without selection', async () => {
    const user = userEvent.setup();
    render(<PassportTypeStep value="" onChange={() => {}} onNext={() => {}} />);
    await user.click(screen.getByText('Continue'));
    expect(screen.getByRole('alert')).toHaveTextContent('Please select a passport type');
  });

  it('does not call onNext when Continue clicked without selection', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(<PassportTypeStep value="" onChange={() => {}} onNext={onNext} />);
    await user.click(screen.getByText('Continue'));
    expect(onNext).not.toHaveBeenCalled();
  });

  it('calls onNext when Continue clicked with valid selection', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(<PassportTypeStep value="ordinary" onChange={() => {}} onNext={onNext} />);
    await user.click(screen.getByText('Continue'));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('calls onChange when a passport type is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PassportTypeStep value="" onChange={onChange} onNext={() => {}} />);
    await user.click(screen.getByText('Ordinary Passport'));
    expect(onChange).toHaveBeenCalledWith('ordinary');
  });

  it('clears error when a passport type is selected after error', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <PassportTypeStep value="" onChange={onChange} onNext={() => {}} />
    );

    // Trigger error
    await user.click(screen.getByText('Continue'));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Click an option - error should clear
    await user.click(screen.getByText('Official Passport'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ============================================================
// ParentInfoStep
// ============================================================
describe('ParentInfoStep', () => {
  const defaultProps = {
    data: { ...INITIAL_PARENT },
    onChange: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders with Father label', () => {
    render(<ParentInfoStep parentLabel="Father" {...defaultProps} />);
    expect(screen.getByText("Father's Information")).toBeInTheDocument();
  });

  it('renders with Mother label', () => {
    render(<ParentInfoStep parentLabel="Mother" {...defaultProps} />);
    expect(screen.getByText("Mother's Information")).toBeInTheDocument();
  });

  it('shows validation errors on Continue with empty required fields', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(
      <ParentInfoStep
        parentLabel="Father"
        data={{ ...INITIAL_PARENT }}
        onChange={() => {}}
        onNext={onNext}
        onBack={() => {}}
      />
    );
    await user.click(screen.getByText('Continue'));
    expect(onNext).not.toHaveBeenCalled();
    // Should show errors for first name and last name at minimum
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onNext when form is valid', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const validData: ParentInfo = {
      lastName: 'ROBERT',
      firstName: 'JOHN',
      middleName: '',
      birthDate: '',
      birthPlace: '',
      fsmCitizen: 'yes',
      nationality: '',
    };
    render(
      <ParentInfoStep
        parentLabel="Father"
        data={validData}
        onChange={() => {}}
        onNext={onNext}
        onBack={() => {}}
      />
    );
    await user.click(screen.getByText('Continue'));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('calls onBack when Back is clicked', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(
      <ParentInfoStep
        parentLabel="Father"
        data={{ ...INITIAL_PARENT }}
        onChange={() => {}}
        onNext={() => {}}
        onBack={onBack}
      />
    );
    await user.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('shows nationality field when No is clicked for FSM citizen', async () => {
    const user = userEvent.setup();
    function Wrapper() {
      const [data, setData] = useState<ParentInfo>({ ...INITIAL_PARENT });
      return (
        <ParentInfoStep
          parentLabel="Father"
          data={data}
          onChange={setData}
          onNext={() => {}}
          onBack={() => {}}
        />
      );
    }
    render(<Wrapper />);
    // Nationality should not be visible initially
    expect(screen.queryByRole('textbox', { name: /nationality/i })).not.toBeInTheDocument();
    // Click "No" for FSM citizen
    await user.click(screen.getByText('No'));
    // Nationality field should now appear
    expect(screen.getByRole('textbox', { name: /nationality/i })).toBeInTheDocument();
  });

  it('hides nationality field when fsmCitizen is "yes"', () => {
    const data: ParentInfo = { ...INITIAL_PARENT, fsmCitizen: 'yes' };
    render(
      <ParentInfoStep
        parentLabel="Father"
        data={data}
        onChange={() => {}}
        onNext={() => {}}
        onBack={() => {}}
      />
    );
    expect(screen.queryByRole('textbox', { name: /nationality/i })).not.toBeInTheDocument();
  });

  it('hides nationality field when fsmCitizen is not selected', () => {
    const data: ParentInfo = { ...INITIAL_PARENT, fsmCitizen: '' };
    render(
      <ParentInfoStep
        parentLabel="Father"
        data={data}
        onChange={() => {}}
        onNext={() => {}}
        onBack={() => {}}
      />
    );
    expect(screen.queryByRole('textbox', { name: /nationality/i })).not.toBeInTheDocument();
  });

  it('calls onChange when a field is updated', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ParentInfoStep
        parentLabel="Father"
        data={{ ...INITIAL_PARENT }}
        onChange={onChange}
        onNext={() => {}}
        onBack={() => {}}
      />
    );
    const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
    await user.type(firstNameInput, 'J');
    expect(onChange).toHaveBeenCalled();
  });
});
