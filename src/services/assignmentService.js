import { isPastDue } from '../utils/dateUtils';
import { SEED_USERS } from '../data/seedData';

export function createAssignmentRecord(adminId, data) {
  const newId = `asg-${Date.now()}`;
  const assignedStudentIds = data.assignedStudentIds || [];

  const initialSubmissions = {};
  assignedStudentIds.forEach((studentId) => {
    initialSubmissions[studentId] = {
      status: 'PENDING',
      submittedAt: null,
    };
  });

  return {
    id: newId,
    title: data.title.trim(),
    description: data.description.trim(),
    dueDate: new Date(data.dueDate).toISOString(),
    submissionUrl: data.submissionUrl ? data.submissionUrl.trim() : '',
    createdBy: adminId,
    assignedStudentIds,
    createdAt: new Date().toISOString(),
    submissions: initialSubmissions,
  };
}

export function updateAssignmentRecord(assignment, adminId, updatedData) {
  if (assignment.createdBy !== adminId) {
    return assignment;
  }

  const newAssignedIds = updatedData.assignedStudentIds || [];
  const existingSubmissions = assignment.submissions || {};
  const updatedSubmissions = {};

  newAssignedIds.forEach((studentId) => {
    if (existingSubmissions[studentId]) {
      updatedSubmissions[studentId] = existingSubmissions[studentId];
    } else {
      updatedSubmissions[studentId] = {
        status: 'PENDING',
        submittedAt: null,
      };
    }
  });

  return {
    ...assignment,
    title: updatedData.title.trim(),
    description: updatedData.description.trim(),
    dueDate: new Date(updatedData.dueDate).toISOString(),
    submissionUrl: updatedData.submissionUrl ? updatedData.submissionUrl.trim() : '',
    assignedStudentIds: newAssignedIds,
    submissions: updatedSubmissions,
    updatedAt: new Date().toISOString(),
  };
}

export function submitAssignmentRecord(assignment, studentId) {
  if (!assignment.assignedStudentIds.includes(studentId)) {
    return {
      success: false,
      message: 'You are not assigned to this assignment.',
      assignment,
    };
  }

  const studentSub = assignment.submissions?.[studentId];
  if (studentSub && studentSub.status === 'SUBMITTED') {
    return {
      success: false,
      message: 'Assignment has already been submitted.',
      assignment,
    };
  }

  const updatedSubmissions = {
    ...(assignment.submissions || {}),
    [studentId]: {
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    },
  };

  return {
    success: true,
    message: 'Assignment successfully submitted!',
    assignment: {
      ...assignment,
      submissions: updatedSubmissions,
    },
  };
}

export function filterStudentAssignments(assignments, studentId) {
  if (!studentId) return [];

  return assignments
    .filter((assignment) => assignment.assignedStudentIds?.includes(studentId))
    .map((assignment) => {
      const studentSubmission = assignment.submissions?.[studentId] || {
        status: 'PENDING',
        submittedAt: null,
      };
      const status = studentSubmission.status;
      const overdue = status === 'PENDING' && isPastDue(assignment.dueDate);
      const creator = SEED_USERS.find((user) => user.id === assignment.createdBy);

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        submissionUrl: assignment.submissionUrl,
        createdBy: assignment.createdBy,
        creatorName: creator ? creator.name : 'Faculty Instructor',
        createdAt: assignment.createdAt,
        status,
        isOverdue: overdue,
        submittedAt: studentSubmission.submittedAt,
      };
    });
}

export function filterAdminAssignments(assignments, adminId) {
  if (!adminId) return [];

  return assignments
    .filter((assignment) => assignment.createdBy === adminId)
    .map((assignment) => {
      const assignedIds = assignment.assignedStudentIds || [];
      const submissions = assignment.submissions || {};

      let submittedCount = 0;
      let pendingCount = 0;
      let overdueCount = 0;

      const roster = assignedIds.map((studentId) => {
        const studentUser = SEED_USERS.find((user) => user.id === studentId);
        const submission = submissions[studentId] || { status: 'PENDING', submittedAt: null };
        const isStudentOverdue = submission.status === 'PENDING' && isPastDue(assignment.dueDate);

        if (submission.status === 'SUBMITTED') {
          submittedCount += 1;
        } else {
          pendingCount += 1;
          if (isStudentOverdue) overdueCount += 1;
        }

        return {
          id: studentId,
          name: studentUser ? studentUser.name : 'Unknown Student',
          email: studentUser ? studentUser.email : studentId,
          avatar: studentUser ? studentUser.avatar : 'ST',
          color: studentUser ? studentUser.color : 'from-slate-500 to-slate-600',
          status: submission.status,
          isOverdue: isStudentOverdue,
          submittedAt: submission.submittedAt,
        };
      });

      const totalAssigned = assignedIds.length;
      const completionPercentage =
        totalAssigned === 0 ? 0 : Math.round((submittedCount / totalAssigned) * 100);

      return {
        ...assignment,
        totalAssigned,
        submittedCount,
        pendingCount,
        overdueCount,
        completionPercentage,
        roster,
      };
    });
}

