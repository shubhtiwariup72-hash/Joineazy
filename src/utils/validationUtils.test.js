import { isValidUrl, validateAssignmentForm } from './validationUtils';

describe('validationUtils', () => {
  describe('isValidUrl', () => {
    test('accepts valid HTTP and HTTPS URLs', () => {
      expect(isValidUrl('https://drive.google.com/drive/folders/123')).toBe(true);
      expect(isValidUrl('http://example.com/assignment')).toBe(true);
      expect(isValidUrl('https://dropbox.com/s/xyz')).toBe(true);
    });

    test('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://invalid-protocol.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
    });
  });

  describe('validateAssignmentForm', () => {
    const validData = {
      title: 'Cloud Architecture Research',
      description: 'Comprehensive analysis of fault-tolerant systems in AWS and GCP.',
      dueDate: '2026-11-20T23:59',
      submissionUrl: 'https://drive.google.com/drive/u/0/my-drive',
      assignedStudentIds: ['student1', 'student2'],
    };

    test('validates correct assignment form without errors', () => {
      const result = validateAssignmentForm(validData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    test('flags missing required title, description, dueDate and students', () => {
      const result = validateAssignmentForm({
        title: '',
        description: '',
        dueDate: '',
        submissionUrl: '',
        assignedStudentIds: [],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.description).toBeDefined();
      expect(result.errors.dueDate).toBeDefined();
      expect(result.errors.assignedStudentIds).toBeDefined();
    });

    test('flags invalid submission URL if provided', () => {
      const result = validateAssignmentForm({
        ...validData,
        submissionUrl: 'invalid-url-string',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.submissionUrl).toBeDefined();
    });
  });
});
