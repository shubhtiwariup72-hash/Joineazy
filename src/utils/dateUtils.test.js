import { isPastDue, formatDate, formatDateTime, getRelativeDueDateInfo } from './dateUtils';

describe('dateUtils', () => {
  test('isPastDue returns true for past dates and false for future dates', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    expect(isPastDue(yesterday)).toBe(true);
    expect(isPastDue(tomorrow)).toBe(false);
  });

  test('formatDate formats valid ISO string', () => {
    const iso = '2026-11-15T12:00:00.000Z';
    const formatted = formatDate(iso);
    expect(formatted).toContain('2026');
  });

  test('formatDateTime formats valid ISO string', () => {
    const iso = '2026-11-15T12:00:00.000Z';
    const formatted = formatDateTime(iso);
    expect(formatted).toContain('2026');
  });

  test('getRelativeDueDateInfo returns overdue label for past dates', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const info = getRelativeDueDateInfo(threeDaysAgo);
    expect(info.isOverdue).toBe(true);
    expect(info.label).toMatch(/overdue/i);
  });

  test('getRelativeDueDateInfo returns due soon for upcoming dates', () => {
    const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const info = getRelativeDueDateInfo(inThreeDays);
    expect(info.isOverdue).toBe(false);
    expect(info.label).toMatch(/due in/i);
  });
});
