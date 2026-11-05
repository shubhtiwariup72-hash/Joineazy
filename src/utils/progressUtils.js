import { isPastDue } from './dateUtils';

export function calculateStudentMetrics(studentAssignments) {
  const total = studentAssignments.length;
  let submitted = 0;
  let overdue = 0;
  let pending = 0;

  studentAssignments.forEach((assignment) => {
    if (assignment.status === 'SUBMITTED') {
      submitted += 1;
    } else if (assignment.isOverdue || (isPastDue(assignment.dueDate) && assignment.status === 'PENDING')) {
      overdue += 1;
    } else {
      pending += 1;
    }
  });

  const progressPercentage = total === 0 ? 0 : Math.round((submitted / total) * 100);

  return {
    total,
    submitted,
    pending,
    overdue,
    remaining: pending + overdue,
    progressPercentage,
  };
}

export function calculateAdminMetrics(adminAssignments) {
  const totalAssignments = adminAssignments.length;
  let totalStudentSlots = 0;
  let totalSubmitted = 0;
  let totalPending = 0;
  let totalOverdue = 0;

  adminAssignments.forEach((assignment) => {
    totalStudentSlots += assignment.totalAssigned || assignment.assignedStudentIds?.length || 0;
    totalSubmitted += assignment.submittedCount || 0;
    totalPending += assignment.pendingCount || 0;
    totalOverdue += assignment.overdueCount || 0;
  });

  const overallCompletionRate =
    totalStudentSlots === 0 ? 0 : Math.round((totalSubmitted / totalStudentSlots) * 100);

  return {
    totalAssignments,
    totalStudentSlots,
    totalSubmitted,
    totalPending,
    totalOverdue,
    overallCompletionRate,
  };
}

export function calculateAssignmentProgress(assignedCount, submittedCount) {
  if (!assignedCount || assignedCount === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((submittedCount / assignedCount) * 100)));
}

