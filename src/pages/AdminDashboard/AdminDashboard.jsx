import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAssignments } from "../../context/AssignmentContext";
import { useToast } from "../../context/ToastContext";
import { AdminAssignmentCard } from "../../components/assignments/AdminAssignmentCard";
import { AdminAssignmentTable } from "../../components/assignments/AdminAssignmentTable";
import { StudentRosterModal } from "../../components/assignments/StudentRosterModal";
import { AssignmentFormModal } from "../../components/forms/AssignmentFormModal";
import { ConfirmDeleteDialog } from "../../components/dialogs/ConfirmDeleteDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";
import { ProgressBar } from "../../components/common/ProgressBar";
import {
  BookOpenIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  SearchIcon,
  ArrowUpDownIcon,
  LayoutGridIcon,
  TableIcon,
} from "../../components/common/Icons";

export function AdminDashboard({
  activeTab = "assignments",
  isCreateModalOpen = false,
  setIsCreateModalOpen,
}) {
  const { currentUser, students } = useAuth();
  const {
    getAdminAssignments,
    getAdminStats,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAssignments();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("due-asc");

  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deletingAssignment, setDeletingAssignment] = useState(null);
  const [rosterAssignment, setRosterAssignment] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const adminAssignments = useMemo(
    () => getAdminAssignments(currentUser?.id),
    [getAdminAssignments, currentUser?.id],
  );

  const stats = useMemo(
    () => getAdminStats(currentUser?.id),
    [getAdminStats, currentUser?.id],
  );

  const filteredAssignments = useMemo(() => {
    return adminAssignments
      .filter((asg) => {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = asg.title.toLowerCase().includes(query);
          const matchDesc = asg.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }

        if (statusFilter === "COMPLETED") {
          return (
            asg.totalAssigned > 0 && asg.submittedCount === asg.totalAssigned
          );
        }
        if (statusFilter === "IN_PROGRESS") {
          return (
            asg.totalAssigned > 0 && asg.submittedCount < asg.totalAssigned
          );
        }
        if (statusFilter === "OVERDUE") {
          return asg.overdueCount > 0;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "due-asc") {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === "due-desc") {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (sortBy === "completion") {
          return b.completionPercentage - a.completionPercentage;
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [adminAssignments, searchQuery, statusFilter, sortBy]);

  const studentPerformanceDirectory = useMemo(() => {
    return students.map((student) => {
      let assignedCount = 0;
      let submittedCount = 0;
      let overdueCount = 0;

      adminAssignments.forEach((asg) => {
        if (asg.assignedStudentIds?.includes(student.id)) {
          assignedCount += 1;
          const sub = asg.submissions?.[student.id];
          if (sub?.status === "SUBMITTED") {
            submittedCount += 1;
          } else if (asg.isOverdue) {
            overdueCount += 1;
          }
        }
      });

      const rate =
        assignedCount === 0
          ? 0
          : Math.round((submittedCount / assignedCount) * 100);

      return {
        ...student,
        assignedCount,
        submittedCount,
        overdueCount,
        rate,
      };
    });
  }, [students, adminAssignments]);

  const handleCreateAssignment = (formData) => {
    setIsSubmittingForm(true);
    try {
      const created = createAssignment(currentUser.id, formData);
      setIsSubmittingForm(false);
      setIsCreateModalOpen(false);
      showToast(
        `Assignment "${created.title}" created for ${formData.assignedStudentIds.length} students.`,
        "success",
      );
    } catch (err) {
      setIsSubmittingForm(false);
      showToast("Error creating assignment", "error");
    }
  };

  const handleUpdateAssignment = (formData) => {
    if (!editingAssignment) return;

    setIsSubmittingForm(true);
    try {
      const updated = updateAssignment(
        editingAssignment.id,
        currentUser.id,
        formData,
      );
      setIsSubmittingForm(false);
      setEditingAssignment(null);
      showToast(`Assignment "${updated.title}" updated.`, "success");
    } catch (err) {
      setIsSubmittingForm(false);
      showToast("Error updating assignment", "error");
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingAssignment) return;

    const title = deletingAssignment.title;
    const ok = deleteAssignment(deletingAssignment.id, currentUser.id);
    setDeletingAssignment(null);

    if (ok) {
      showToast(
        `Assignment "${title}" and associated submission records removed.`,
        "info",
      );
    } else {
      showToast("Failed to delete assignment", "error");
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span>Faculty Management Portal</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome, {currentUser?.name}!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            {currentUser?.department} • {currentUser?.title}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            icon={PlusIcon}
            className="w-full sm:w-auto justify-center"
          >
            Create Assignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BookOpenIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Created Assignments
            </p>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.totalAssignments}
            </h4>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <UsersIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Student Slots
            </p>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.totalStudentSlots}
            </h4>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircleIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Submissions In
            </p>
            <div className="flex items-baseline gap-1.5">
              <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {stats.totalSubmitted}
              </h4>
              <span className="text-[11px] text-slate-400">
                ({stats.overallCompletionRate}%)
              </span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ClockIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Pending
            </p>
            <div className="flex items-baseline gap-1.5">
              <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {stats.totalPending}
              </h4>
              {stats.totalOverdue > 0 && (
                <span className="text-[11px] text-rose-500 font-semibold">
                  ({stats.totalOverdue} overdue)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeTab === "students" ? (
        <div className="space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Class Student Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Overview of enrolled students and their submission progress in
                your courses
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 w-fit">
              {students.length} Enrolled Students
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {studentPerformanceDirectory.map((student) => (
              <div
                key={student.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${student.color} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}
                  >
                    {student.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {student.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {student.email}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {student.studentIdNum}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Submitted
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.submittedCount} of {student.assignedCount} (
                      {student.rate}%)
                    </span>
                  </div>
                  <ProgressBar value={student.rate} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="relative flex-1">
              <SearchIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search created assignments by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between md:justify-end">
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    statusFilter === "ALL"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  All ({stats.totalAssignments})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("IN_PROGRESS")}
                  className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    statusFilter === "IN_PROGRESS"
                      ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("COMPLETED")}
                  className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    statusFilter === "COMPLETED"
                      ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Completed
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("OVERDUE")}
                  className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    statusFilter === "OVERDUE"
                      ? "bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Overdue
                </button>
              </div>

              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-7 pr-6 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                >
                  <option value="due-asc">Due Date (Soonest)</option>
                  <option value="due-desc">Due Date (Latest)</option>
                  <option value="completion">Completion %</option>
                  <option value="title">Title (A-Z)</option>
                </select>
                <ArrowUpDownIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
              </div>

              <div className="hidden sm:flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "cards"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                  aria-label="Cards view"
                  title="Cards view"
                >
                  <LayoutGridIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "table"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                  aria-label="Table view"
                  title="Table view"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {filteredAssignments.length > 0 ? (
            viewMode === "table" ? (
              <AdminAssignmentTable
                assignments={filteredAssignments}
                onViewRoster={(asg) => setRosterAssignment(asg)}
                onEdit={(asg) => setEditingAssignment(asg)}
                onDelete={(asg) => setDeletingAssignment(asg)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredAssignments.map((assignment) => (
                  <AdminAssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onViewRoster={(asg) => setRosterAssignment(asg)}
                    onEdit={(asg) => setEditingAssignment(asg)}
                    onDelete={(asg) => setDeletingAssignment(asg)}
                  />
                ))}
              </div>
            )
          ) : (
            <EmptyState
              title={
                searchQuery
                  ? "No matching assignments found"
                  : stats.totalAssignments === 0
                    ? "No assignments created yet"
                    : `No ${statusFilter.toLowerCase().replace("_", " ")} assignments`
              }
              description={
                searchQuery
                  ? `No assignments matching "${searchQuery}" were found.`
                  : stats.totalAssignments === 0
                    ? 'You have not created any assignments yet. Click "+ Create Assignment" to draft your first assignment.'
                    : `You have zero assignments in the "${statusFilter.toLowerCase().replace("_", " ")}" view.`
              }
              actionLabel={
                searchQuery || statusFilter !== "ALL"
                  ? "Clear Filters"
                  : "+ Create Assignment"
              }
              onAction={() => {
                if (searchQuery || statusFilter !== "ALL") {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
            />
          )}
        </>
      )}

      <AssignmentFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAssignment}
        isLoading={isSubmittingForm}
      />

      <AssignmentFormModal
        isOpen={Boolean(editingAssignment)}
        onClose={() => setEditingAssignment(null)}
        initialData={editingAssignment}
        onSubmit={handleUpdateAssignment}
        isLoading={isSubmittingForm}
      />

      <StudentRosterModal
        isOpen={Boolean(rosterAssignment)}
        onClose={() => setRosterAssignment(null)}
        assignment={rosterAssignment}
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(deletingAssignment)}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={handleConfirmDelete}
        assignmentTitle={deletingAssignment?.title}
      />
    </div>
  );
}
