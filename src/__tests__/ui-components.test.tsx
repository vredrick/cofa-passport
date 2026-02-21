import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from '@/components/ui/TextInput';
import DateInput from '@/components/ui/DateInput';
import RadioGroup from '@/components/ui/RadioGroup';
import YesNoToggle from '@/components/ui/YesNoToggle';

// ============================================================
// TextInput
// ============================================================
describe('TextInput', () => {
  it('renders label and input', () => {
    render(<TextInput label="First Name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
  });

  it('auto-uppercases input by default', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextInput label="Name" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Name');
    await user.type(input, 'a');
    expect(onChange).toHaveBeenCalledWith('A');
  });

  it('does not uppercase when uppercase={false}', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextInput label="Email" value="" onChange={onChange} uppercase={false} />);
    const input = screen.getByLabelText('Email');
    await user.type(input, 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('shows error message when error prop is provided', () => {
    render(<TextInput label="Name" value="" onChange={() => {}} error="Name is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required');
  });

  it('sets aria-invalid when error is present', () => {
    render(<TextInput label="Name" value="" onChange={() => {}} error="Required" />);
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid to false when no error', () => {
    render(<TextInput label="Name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'false');
  });

  it('sets aria-describedby when error is present', () => {
    render(<TextInput label="Name" value="" onChange={() => {}} error="Required" />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('aria-describedby', 'name-error');
  });

  it('does not set aria-describedby when no error', () => {
    render(<TextInput label="Name" value="" onChange={() => {}} />);
    const input = screen.getByLabelText('Name');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('shows required asterisk when required', () => {
    render(<TextInput label="Name" value="" onChange={() => {}} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required asterisk when not required', () => {
    render(<TextInput label="Name" value="" onChange={() => {}} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });
});

// ============================================================
// DateInput
// ============================================================
describe('DateInput', () => {
  it('renders label and input', () => {
    render(<DateInput label="Date of Birth" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
  });

  it('has MM/DD/YYYY placeholder', () => {
    render(<DateInput label="Date of Birth" value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('MM/DD/YYYY')).toBeInTheDocument();
  });

  it('formats input through formatDateInput', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateInput label="Date" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Date');
    await user.type(input, '1');
    // formatDateInput('1') returns '1'
    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('shows error message when error prop is provided', () => {
    render(<DateInput label="Date" value="" onChange={() => {}} error="Invalid date" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid date');
  });

  it('sets aria-invalid when error is present', () => {
    render(<DateInput label="Date" value="" onChange={() => {}} error="Required" />);
    expect(screen.getByLabelText('Date')).toHaveAttribute('aria-invalid', 'true');
  });
});

// ============================================================
// RadioGroup
// ============================================================
describe('RadioGroup', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ];

  it('renders all options', () => {
    render(<RadioGroup label="Pick one" options={options} value="" onChange={() => {}} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<RadioGroup label="Pick one" options={options} value="" onChange={() => {}} />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('calls onChange with clicked option value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioGroup label="Pick one" options={options} value="" onChange={onChange} />);
    await user.click(screen.getByText('Option B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('shows error message', () => {
    render(
      <RadioGroup label="Pick one" options={options} value="" onChange={() => {}} error="Required" />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('renders inline variant', () => {
    render(
      <RadioGroup
        label="Pick one"
        options={options}
        value=""
        onChange={() => {}}
        variant="inline"
      />
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('calls onChange in inline variant', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup
        label="Pick one"
        options={options}
        value=""
        onChange={onChange}
        variant="inline"
      />
    );
    await user.click(screen.getByText('Option C'));
    expect(onChange).toHaveBeenCalledWith('c');
  });
});

// ============================================================
// YesNoToggle
// ============================================================
describe('YesNoToggle', () => {
  it('renders label', () => {
    render(<YesNoToggle label="Convicted?" value="" onChange={() => {}} />);
    expect(screen.getByText('Convicted?')).toBeInTheDocument();
  });

  it('renders Yes and No buttons', () => {
    render(<YesNoToggle label="Q" value="" onChange={() => {}} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('calls onChange with "yes" when Yes clicked and not already "yes"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<YesNoToggle label="Q" value="" onChange={onChange} />);
    await user.click(screen.getByText('Yes'));
    expect(onChange).toHaveBeenCalledWith('yes');
  });

  it('calls onChange with "" when Yes clicked and already "yes" (toggle off)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<YesNoToggle label="Q" value="yes" onChange={onChange} />);
    await user.click(screen.getByText('Yes'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('calls onChange with "no" when No clicked and not already "no"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<YesNoToggle label="Q" value="" onChange={onChange} />);
    await user.click(screen.getByText('No'));
    expect(onChange).toHaveBeenCalledWith('no');
  });

  it('calls onChange with "" when No clicked and already "no" (toggle off)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<YesNoToggle label="Q" value="no" onChange={onChange} />);
    await user.click(screen.getByText('No'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('shows error message', () => {
    render(<YesNoToggle label="Q" value="" onChange={() => {}} error="Please select" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Please select');
  });
});
