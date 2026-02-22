import { describe, it, expect } from 'vitest';
import { NATIONS, FSM_PASSPORT_INFO } from './nations';

describe('NATIONS', () => {
  it('contains exactly 3 nations', () => {
    expect(NATIONS).toHaveLength(3);
  });

  it('has FSM as available', () => {
    const fsm = NATIONS.find((n) => n.id === 'fsm');
    expect(fsm).toBeDefined();
    expect(fsm!.status).toBe('available');
    expect(fsm!.name).toBe('FSM');
  });

  it('has RMI and Palau as coming-soon', () => {
    const rmi = NATIONS.find((n) => n.id === 'rmi');
    const palau = NATIONS.find((n) => n.id === 'palau');
    expect(rmi!.status).toBe('coming-soon');
    expect(palau!.status).toBe('coming-soon');
  });

  it('each nation has required fields', () => {
    for (const nation of NATIONS) {
      expect(nation.id).toBeTruthy();
      expect(nation.name).toBeTruthy();
      expect(nation.fullName).toBeTruthy();
      expect(nation.passportImage).toBeTruthy();
      expect(['available', 'coming-soon']).toContain(nation.status);
    }
  });

  it('each nation has unique id', () => {
    const ids = NATIONS.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('FSM_PASSPORT_INFO', () => {
  it('has requirements list', () => {
    expect(FSM_PASSPORT_INFO.requirements.length).toBeGreaterThan(0);
  });

  it('has fees with label and amount', () => {
    expect(FSM_PASSPORT_INFO.fees.length).toBeGreaterThan(0);
    for (const fee of FSM_PASSPORT_INFO.fees) {
      expect(fee.label).toBeTruthy();
      expect(fee.amount).toMatch(/^\$/);
    }
  });

  it('has processing time entries', () => {
    expect(FSM_PASSPORT_INFO.processingTime.length).toBeGreaterThan(0);
    for (const pt of FSM_PASSPORT_INFO.processingTime) {
      expect(pt.label).toBeTruthy();
      expect(pt.duration).toBeTruthy();
    }
  });

  it('has at least one office', () => {
    expect(FSM_PASSPORT_INFO.offices.length).toBeGreaterThan(0);
    for (const office of FSM_PASSPORT_INFO.offices) {
      expect(office.name).toBeTruthy();
      expect(office.address).toBeTruthy();
    }
  });
});
