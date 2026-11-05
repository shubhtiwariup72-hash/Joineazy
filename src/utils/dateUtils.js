export function formatDateTime(isoString) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return 'Invalid date';
  }
}

export function formatDate(isoString) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    return 'Invalid date';
  }
}

export function isPastDue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate).getTime() < Date.now();
}

export function getRelativeDueDateInfo(dueDate) {
  if (!dueDate) return { label: 'No due date', isOverdue: false, days: 0 };
  const target = new Date(dueDate).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    const overdueHours = Math.abs(diffHours);
    if (overdueDays >= 1) {
      return {
        label: `Overdue by ${overdueDays} ${overdueDays === 1 ? 'day' : 'days'}`,
        isOverdue: true,
        days: overdueDays,
      };
    }
    return {
      label: `Overdue by ${Math.max(1, overdueHours)} hrs`,
      isOverdue: true,
      days: 0,
    };
  }

  if (diffDays === 0) {
    if (diffHours <= 1) {
      return { label: 'Due in less than an hour', isOverdue: false, days: 0 };
    }
    return { label: `Due today (${diffHours} hrs left)`, isOverdue: false, days: 0 };
  }

  if (diffDays === 1) {
    return { label: 'Due tomorrow', isOverdue: false, days: 1 };
  }

  return { label: `Due in ${diffDays} days`, isOverdue: false, days: diffDays };
}

export function getDateOffset(daysOffset, hours = 23, minutes = 59) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}
