import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { formatDateTime, formatDate } from '../../utils/dateUtils';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, ExternalLinkIcon } from '../common/Icons';

export function StudentRosterModal({ isOpen, onClose, assignment }) {
  if (!assignment) return null;

  const roster = assignment.roster || [];
  const submittedCount = assignment.submittedCount || 0;
  const totalAssigned = assignment.totalAssigned || 0;
  const overdueCount = assignment.overdueCount || 0;
  const pendingCount = assignment.pendingCount || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Submission Roster"
      subtitle={`Tracking submissions for "${assignment.title}"`}
      maxWidth="max-w-2xl"
    >
      <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5">
        <div className="p-3 sm:p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Assignment Due Date</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                {formatDate(assignment.dueDate)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {submittedCount} Submitted
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {pendingCount - overdueCount} Pending
              </span>
              {overdueCount > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {overdueCount} Overdue
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              <span>Submission Rate</span>
              <span>{assignment.completionPercentage}% ({submittedCount}/{totalAssigned})</span>
            </div>
            <ProgressBar value={assignment.completionPercentage} size="sm" />
          </div>

          {assignment.submissionUrl && (
            <div className="pt-0.5">
              <a
                href={assignment.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                <ExternalLinkIcon className="w-3.5 h-3.5" />
                <span>Open Google Drive Submission Folder</span>
              </a>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Assigned Students ({roster.length})
          </h4>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {roster.map((student) => {
              const isSubmitted = student.status === 'SUBMITTED';

              return (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 gap-2.5 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-md bg-gradient-to-tr ${student.color} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}
                    >
                      {student.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:text-right">
                    <StatusBadge status={student.status} isOverdue={student.isOverdue} />
                    <div className="text-xs text-slate-500 dark:text-slate-400 min-w-[120px]">
                      {isSubmitted ? (
                        <div className="flex items-center gap-1 sm:justify-end text-emerald-600 dark:text-emerald-400">
                          <CheckCircleIcon className="w-3 h-3" />
                          <span>{formatDateTime(student.submittedAt)}</span>
                        </div>
                      ) : student.isOverdue ? (
                        <div className="flex items-center gap-1 sm:justify-end text-rose-600 dark:text-rose-400">
                          <AlertCircleIcon className="w-3 h-3" />
                          <span>Past Due</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 sm:justify-end text-amber-600 dark:text-amber-400">
                          <ClockIcon className="w-3 h-3" />
                          <span>Awaiting</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
