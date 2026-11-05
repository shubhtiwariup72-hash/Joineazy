export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

export function validateAssignmentForm({ title, description, dueDate, submissionUrl, assignedStudentIds }) {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Assignment title is required';
  } else if (title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!description || !description.trim()) {
    errors.description = 'Description is required';
  } else if (description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  if (!dueDate) {
    errors.dueDate = 'Due date and time is required';
  } else {
    const dateObj = new Date(dueDate);
    if (isNaN(dateObj.getTime())) {
      errors.dueDate = 'Please provide a valid date and time';
    }
  }

  if (submissionUrl && submissionUrl.trim()) {
    if (!isValidUrl(submissionUrl)) {
      errors.submissionUrl = 'Please enter a valid URL (e.g. https://drive.google.com/...)';
    }
  }

  if (!assignedStudentIds || assignedStudentIds.length === 0) {
    errors.assignedStudentIds = 'Please assign at least one student';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
