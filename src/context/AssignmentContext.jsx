import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadAssignments, saveAssignments, resetStorageToDefaults } from '../services/storageService';
import {
  createAssignmentRecord,
  updateAssignmentRecord,
  submitAssignmentRecord,
  filterStudentAssignments,
  filterAdminAssignments,
} from '../services/assignmentService';
import { calculateStudentMetrics, calculateAdminMetrics } from '../utils/progressUtils';

const AssignmentContext = createContext(null);

export function AssignmentProvider({ children }) {
  const [assignments, setAssignments] = useState(() => loadAssignments());

  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

  const createAssignment = useCallback((adminId, data) => {
    const newAssignment = createAssignmentRecord(adminId, data);
    setAssignments((prev) => [newAssignment, ...prev]);
    return newAssignment;
  }, []);

  const updateAssignment = useCallback((assignmentId, adminId, updatedData) => {
    let updatedItem = null;
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id !== assignmentId) return asg;
        updatedItem = updateAssignmentRecord(asg, adminId, updatedData);
        return updatedItem;
      })
    );
    return updatedItem;
  }, []);

  const deleteAssignment = useCallback((assignmentId, adminId) => {
    let deleted = false;
    setAssignments((prev) => {
      const target = prev.find((asg) => asg.id === assignmentId);
      if (!target || target.createdBy !== adminId) {
        return prev;
      }
      deleted = true;
      return prev.filter((asg) => asg.id !== assignmentId);
    });
    return deleted;
  }, []);

  const submitAssignment = useCallback((assignmentId, studentId) => {
    let result = { success: false, message: 'Assignment not found.' };

    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id !== assignmentId) return asg;
        result = submitAssignmentRecord(asg, studentId);
        return result.assignment;
      })
    );

    return result;
  }, []);

  const resetDemoData = useCallback(() => {
    const { assignments: freshAssignments } = resetStorageToDefaults();
    setAssignments(freshAssignments);
  }, []);

  const getStudentAssignments = useCallback(
    (studentId) => filterStudentAssignments(assignments, studentId),
    [assignments]
  );

  const getAdminAssignments = useCallback(
    (adminId) => filterAdminAssignments(assignments, adminId),
    [assignments]
  );

  const getStudentStats = useCallback(
    (studentId) => {
      const studentAsgs = filterStudentAssignments(assignments, studentId);
      return calculateStudentMetrics(studentAsgs);
    },
    [assignments]
  );

  const getAdminStats = useCallback(
    (adminId) => {
      const adminAsgs = filterAdminAssignments(assignments, adminId);
      return calculateAdminMetrics(adminAsgs);
    },
    [assignments]
  );

  const value = {
    assignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    resetDemoData,
    getStudentAssignments,
    getAdminAssignments,
    getStudentStats,
    getAdminStats,
  };

  return <AssignmentContext.Provider value={value}>{children}</AssignmentContext.Provider>;
}

export function useAssignments() {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
}
