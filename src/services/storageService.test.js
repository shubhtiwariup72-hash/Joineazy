import {
  safeGetItem,
  safeSetItem,
  loadAssignments,
  loadCurrentUser,
  resetStorageToDefaults,
  STORAGE_KEYS,
} from './storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('safeGetItem returns defaultValue on empty or invalid JSON', () => {
    expect(safeGetItem('non_existent_key', 'fallback')).toBe('fallback');

    localStorage.setItem('corrupted_key', '{invalid_json');
    expect(safeGetItem('corrupted_key', 'fallback')).toBe('fallback');
  });

  test('safeSetItem stores and safeGetItem retrieves data successfully', () => {
    const payload = { test: 'value', number: 42 };
    safeSetItem('test_key', payload);
    expect(safeGetItem('test_key', null)).toEqual(payload);
  });

  test('loadAssignments initializes seed data if empty', () => {
    const assignments = loadAssignments();
    expect(Array.isArray(assignments)).toBe(true);
    expect(assignments.length).toBeGreaterThanOrEqual(4);
  });

  test('loadCurrentUser returns null when not set', () => {
    expect(loadCurrentUser()).toBeNull();
  });

  test('resetStorageToDefaults resets data to original seed assignments', () => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify([{ id: 'dummy' }]));
    const { assignments } = resetStorageToDefaults();
    expect(assignments.length).toBeGreaterThanOrEqual(4);
    expect(assignments.some((asg) => asg.id === 'asg-101')).toBe(true);
  });
});
