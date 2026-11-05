import {
  calculateStudentMetrics,
  calculateAdminMetrics,
  calculateAssignmentProgress,
} from './progressUtils';

describe('progressUtils', () => {
  test('calculateStudentMetrics correctly calculates submitted, pending, and overdue counts', () => {
    const mockAssignments = [
      { status: 'SUBMITTED', dueDate: '2026-11-20T23:59:00', isOverdue: false },
      { status: 'PENDING', dueDate: '2026-11-25T23:59:00', isOverdue: false },
      { status: 'PENDING', dueDate: '2026-11-01T23:59:00', isOverdue: true },
    ];

    const metrics = calculateStudentMetrics(mockAssignments);
    expect(metrics.total).toBe(3);
    expect(metrics.submitted).toBe(1);
    expect(metrics.pending).toBe(1);
    expect(metrics.overdue).toBe(1);
    expect(metrics.remaining).toBe(2);
    expect(metrics.progressPercentage).toBe(33);
  });

  test('calculateAdminMetrics aggregates student slots, submitted, and pending counts', () => {
    const mockAdminAssignments = [
      { totalAssigned: 5, submittedCount: 3, pendingCount: 2, overdueCount: 1 },
      { totalAssigned: 3, submittedCount: 1, pendingCount: 2, overdueCount: 0 },
    ];

    const metrics = calculateAdminMetrics(mockAdminAssignments);
    expect(metrics.totalAssignments).toBe(2);
    expect(metrics.totalStudentSlots).toBe(8);
    expect(metrics.totalSubmitted).toBe(4);
    expect(metrics.totalPending).toBe(4);
    expect(metrics.totalOverdue).toBe(1);
    expect(metrics.overallCompletionRate).toBe(50);
  });

  test('calculateAssignmentProgress handles edge cases', () => {
    expect(calculateAssignmentProgress(0, 0)).toBe(0);
    expect(calculateAssignmentProgress(5, 5)).toBe(100);
    expect(calculateAssignmentProgress(4, 2)).toBe(50);
  });
});

