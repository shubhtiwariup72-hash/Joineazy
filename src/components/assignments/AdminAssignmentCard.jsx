import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import {
  CalendarIcon,
  ExternalLinkIcon,
  UsersIcon,
  EditIcon,
  TrashIcon,
} from '../common/Icons';
import { formatDate, getRelativeDueDateInfo } from '../../utils/dateUtils';

export function AdminAssignmentCard({
  assignment,
  onViewRoster,
  onEdit,
  onDelete,
}) {
  const relativeDate = getRelativeDueDateInfo(assignment.dueDate);
  const isAllSubmitted =
    assignment.totalAssigned > 0 &&
    assignment.submittedCount === assignment.totalAssigned;

  return (
    <Card
      hover
      className={`flex flex-col justify-between transition-all border ${
        isAllSubmitted
          ? 'border-emerald-200/80 dark:border-emerald-900/50'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div>
        <CardHeader className="flex items-start justify-between gap-3 pb-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  relativeDate.isOverdue
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                }`}
              >
                {relativeDate.label}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Created: {formatDate(assignment.createdAt)}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">
              {assignment.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(assignment)}
              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit assignment"
              aria-label="Edit assignment"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(assignment)}
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Delete assignment"
              aria-label="Delete assignment"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3.5 pt-1">
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {assignment.description}
          </p>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Class Submissions
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {assignment.completionPercentage}% ({assignment.submittedCount}/
                {assignment.totalAssigned})
              </span>
            </div>
            <ProgressBar value={assignment.completionPercentage} size="sm" />
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span>{assignment.submittedCount} submitted</span>
              <span>{assignment.pendingCount} pending</span>
              {assignment.overdueCount > 0 && (
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                  {assignment.overdueCount} overdue
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  Due: <strong className="text-slate-700 dark:text-slate-200 font-medium">{formatDate(assignment.dueDate)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  <strong className="text-slate-700 dark:text-slate-200 font-medium">{assignment.totalAssigned}</strong> students
                </span>
              </div>
            </div>

            {assignment.submissionUrl && (
              <a
                href={assignment.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium hover:underline truncate w-full"
              >
                <ExternalLinkIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">View Google Drive Folder</span>
              </a>
            )}

            {assignment.roster && assignment.roster.length > 0 && (
              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Student Submission Status:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {assignment.roster.map((student) => {
                    const isSub = student.status === 'SUBMITTED';
                    return (
                      <span
                        key={student.id}
                        title={`${student.name}: ${isSub ? 'Submitted' : student.isOverdue ? 'Overdue' : 'Pending'}`}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                          isSub
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : student.isOverdue
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSub
                              ? 'bg-emerald-500'
                              : student.isOverdue
                              ? 'bg-rose-500'
                              : 'bg-amber-400'
                          }`}
                        />
                        <span className="truncate max-w-[85px]">{student.name}</span>
                        <span className="opacity-75">
                          {isSub ? '✓' : 'Pending'}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-3 pb-3">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => onViewRoster(assignment)}
          icon={UsersIcon}
        >
          View Student Roster ({assignment.totalAssigned})
        </Button>
      </CardFooter>
    </Card>
  );
}
