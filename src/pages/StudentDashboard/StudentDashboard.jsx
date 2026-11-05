import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentContext';
import { useToast } from '../../context/ToastContext';
import { StudentAssignmentCard } from '../../components/assignments/StudentAssignmentCard';
import { ConfirmSubmissionDialog } from '../../components/dialogs/ConfirmSubmissionDialog';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  SearchIcon,
  ArrowUpDownIcon,
} from '../../components/common/Icons';

export function StudentDashboard({ activeTab = 'assignments' }) {
  const { currentUser } = useAuth();
  const { getStudentAssignments, getStudentStats, submitAssignment } = useAssignments();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('due-asc');

  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveFilter =
    activeTab === 'submitted'
      ? 'SUBMITTED'
      : activeTab === 'pending'
      ? 'PENDING'
      : statusFilter;

  const studentAssignments = useMemo(
    () => getStudentAssignments(currentUser?.id),
    [getStudentAssignments, currentUser?.id]
  );

  const stats = useMemo(
    () => getStudentStats(currentUser?.id),
    [getStudentStats, currentUser?.id]
  );

  const filteredAssignments = useMemo(() => {
    return studentAssignments
      .filter((asg) => {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = asg.title.toLowerCase().includes(query);
          const matchDesc = asg.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }

        if (effectiveFilter === 'SUBMITTED') {
          return asg.status === 'SUBMITTED';
        }
        if (effectiveFilter === 'OVERDUE') {
          return asg.isOverdue;
        }
        if (effectiveFilter === 'PENDING') {
          return asg.status === 'PENDING' && !asg.isOverdue;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due-asc') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'due-desc') {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [studentAssignments, searchQuery, effectiveFilter, sortBy]);

  const handleConfirmSubmission = () => {
    if (!selectedAssignmentForSubmit) return;

    setIsSubmitting(true);
    const result = submitAssignment(selectedAssignmentForSubmit.id, currentUser.id);
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Submission recorded for "${selectedAssignmentForSubmit.title}"!`, 'success');
      setSelectedAssignmentForSubmit(null);
    } else {
      showToast(result.message || 'Failed to submit assignment', 'error');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span>Student Portal</span>
            {currentUser?.studentIdNum && (
              <span>• {currentUser.studentIdNum}</span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {currentUser?.name}!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            Track coursework, submit external project links, and review submission deadlines.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 w-full sm:w-auto shrink-0 min-w-[200px]">
          <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            <span>Overall Progress</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {stats.submitted} of {stats.total} Submitted
            </span>
          </div>
          <ProgressBar
            value={stats.progressPercentage}
            color="green"
            size="sm"
            className="my-1"
          />
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{stats.progressPercentage}% completed</span>
            <span>{stats.remaining} remaining</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BookOpenIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Assigned</p>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{stats.total}</h4>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircleIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Submitted</p>
            <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {stats.submitted}
            </h4>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ClockIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending</p>
            <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {stats.pending}
            </h4>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircleIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Overdue</p>
            <h4 className="text-lg font-bold text-rose-600 dark:text-rose-400">
              {stats.overdue}
            </h4>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <SearchIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search assignments by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                effectiveFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                effectiveFilter === 'PENDING'
                  ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('SUBMITTED')}
              className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                effectiveFilter === 'SUBMITTED'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Submitted ({stats.submitted})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('OVERDUE')}
              className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                effectiveFilter === 'OVERDUE'
                  ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Overdue ({stats.overdue})
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
              <option value="title">Title (A-Z)</option>
            </select>
            <ArrowUpDownIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAssignments.map((assignment) => (
            <StudentAssignmentCard
              key={assignment.id}
              assignment={assignment}
              onOpenSubmitDialog={(asg) => setSelectedAssignmentForSubmit(asg)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            searchQuery
              ? 'No matching assignments found'
              : stats.total === 0
              ? 'No assignments assigned yet'
              : `No ${effectiveFilter.toLowerCase()} assignments`
          }
          description={
            searchQuery
              ? `No assignments matched "${searchQuery}". Try a different keyword.`
              : stats.total === 0
              ? 'You currently do not have any assignments assigned by your professors.'
              : `You have zero assignments in the "${effectiveFilter.toLowerCase()}" category.`
          }
          actionLabel={searchQuery || effectiveFilter !== 'ALL' ? 'Clear Filters' : null}
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('ALL');
          }}
        />
      )}

      <ConfirmSubmissionDialog
        isOpen={Boolean(selectedAssignmentForSubmit)}
        onClose={() => setSelectedAssignmentForSubmit(null)}
        onConfirm={handleConfirmSubmission}
        assignment={selectedAssignmentForSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
