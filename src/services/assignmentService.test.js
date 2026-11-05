import {
  createAssignmentRecord,
  updateAssignmentRecord,
  submitAssignmentRecord,
  filterStudentAssignments,
  filterAdminAssignments,
} from './assignmentService';

describe('assignmentService', () => {
  test('createAssignmentRecord initializes all assigned students to PENDING status', () => {
    const data = {
      title: 'Neural Networks Lab',
      description: 'Train a CNN on CIFAR-10 and plot loss curves.',
      dueDate: '2026-11-30T23:59:00',
      submissionUrl: 'https://drive.google.com/test',
      assignedStudentIds: ['student1', 'student2'],
    };

    const record = createAssignmentRecord('admin1', data);
    expect(record.createdBy).toBe('admin1');
    expect(record.assignedStudentIds).toEqual(['student1', 'student2']);
    expect(record.submissions.student1.status).toBe('PENDING');
    expect(record.submissions.student2.status).toBe('PENDING');
    expect(record.submissions.student1.submittedAt).toBeNull();
  });

  test('updateAssignmentRecord preserves existing submission records and initializes new ones', () => {
    const original = {
      id: 'asg-test',
      createdBy: 'admin1',
      title: 'Original Title',
      description: 'Original Description',
      dueDate: '2026-11-20T23:59:00',
      submissionUrl: '',
      assignedStudentIds: ['student1'],
      submissions: {
        student1: {
          status: 'SUBMITTED',
          submittedAt: '2026-11-04T12:00:00Z',
        },
      },
    };

    const updateData = {
      title: 'Updated Title',
      description: 'Updated Description',
      dueDate: '2026-11-25T23:59:00',
      submissionUrl: 'https://drive.google.com/updated',
      assignedStudentIds: ['student1', 'student2'],
    };

    const updated = updateAssignmentRecord(original, 'admin1', updateData);
    expect(updated.submissions.student1.status).toBe('SUBMITTED');
    expect(updated.submissions.student1.submittedAt).toBe('2026-11-04T12:00:00Z');
    expect(updated.submissions.student2.status).toBe('PENDING');
    expect(updated.submissions.student2.submittedAt).toBeNull();
  });

  test('submitAssignmentRecord marks as submitted and records timestamp', () => {
    const asg = {
      id: 'asg-sub',
      assignedStudentIds: ['student1'],
      submissions: {
        student1: { status: 'PENDING', submittedAt: null },
      },
    };

    const result = submitAssignmentRecord(asg, 'student1');
    expect(result.success).toBe(true);
    expect(result.assignment.submissions.student1.status).toBe('SUBMITTED');
    expect(result.assignment.submissions.student1.submittedAt).toBeDefined();

    const duplicate = submitAssignmentRecord(result.assignment, 'student1');
    expect(duplicate.success).toBe(false);
    expect(duplicate.message).toMatch(/already been submitted/i);
  });

  test('filterStudentAssignments strips out other students private submissions', () => {
    const assignments = [
      {
        id: 'asg-1',
        title: 'Task 1',
        description: 'Desc 1',
        dueDate: '2026-11-20T23:59:00',
        submissionUrl: '',
        createdBy: 'admin1',
        assignedStudentIds: ['student1', 'student2'],
        submissions: {
          student1: { status: 'PENDING', submittedAt: null },
          student2: { status: 'SUBMITTED', submittedAt: '2026-11-03T10:00:00Z' },
        },
      },
      {
        id: 'asg-2',
        title: 'Task 2',
        description: 'Desc 2',
        dueDate: '2026-11-20T23:59:00',
        submissionUrl: '',
        createdBy: 'admin1',
        assignedStudentIds: ['student2'],
        submissions: {
          student2: { status: 'PENDING', submittedAt: null },
        },
      },
    ];

    const student1View = filterStudentAssignments(assignments, 'student1');
    expect(student1View.length).toBe(1);
    expect(student1View[0].id).toBe('asg-1');
    expect(student1View[0].status).toBe('PENDING');
    expect(student1View[0].submissions).toBeUndefined();
  });

  test('filterAdminAssignments isolates only assignments created by that admin', () => {
    const assignments = [
      { id: 'asg-1', createdBy: 'admin1', assignedStudentIds: ['student1'] },
      { id: 'asg-2', createdBy: 'admin2', assignedStudentIds: ['student2'] },
    ];

    const admin1Assignments = filterAdminAssignments(assignments, 'admin1');
    expect(admin1Assignments.length).toBe(1);
    expect(admin1Assignments[0].id).toBe('asg-1');

    const admin2Assignments = filterAdminAssignments(assignments, 'admin2');
    expect(admin2Assignments.length).toBe(1);
    expect(admin2Assignments[0].id).toBe('asg-2');
  });
});

