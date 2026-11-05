import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { StatusBadge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  CalendarIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
} from '../common/Icons';
import { formatDate, formatDateTime, getRelativeDueDateInfo } from '../../utils/dateUtils';

export function StudentAssignmentCard({ assignment, onOpenSubmitDialog }) {
  const isSubmitted = assignment.status === 'SUBMITTED';
  const isOverdue = assignment.isOverdue;
  const relativeDate = getRelativeDueDateInfo(assignment.dueDate);

  return (
    <Card
      hover
      className={`flex flex-col justify-between transition-all border ${
        isSubmitted
          ? 'border-emerald-200/80 dark:border-emerald-900/40'
          : isOverdue
          ? 'border-rose-200/80 dark:border-rose-900/50'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div>
        <CardHeader className="flex items-start justify-between gap-3 pb-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={assignment.status} isOverdue={isOverdue} />
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  isOverdue
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : isSubmitted
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {relativeDate.label}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">
              {assignment.title}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-3.5 pt-1">
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {assignment.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Due: <strong className="text-slate-700 dark:text-slate-200 font-medium">{formatDate(assignment.dueDate)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Instructor: <strong className="text-slate-700 dark:text-slate-200 font-medium">{assignment.creatorName}</strong></span>
            </div>
          </div>

          {assignment.submissionUrl ? (
            <div className="pt-0.5">
              <a
                href={assignment.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium hover:underline bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 w-full truncate"
              >
                <ExternalLinkIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Open Google Drive Submission Folder</span>
              </a>
            </div>
          ) : (
            <div className="pt-0.5 text-[11px] text-slate-400 italic">
              No external drive link provided
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="pt-2.5 pb-2.5 sm:pt-3 sm:pb-3">
        {isSubmitted ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <CheckCircleIcon className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Submitted on {formatDateTime(assignment.submittedAt)}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <ClockIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{isOverdue ? 'Action needed' : 'Pending'}</span>
            </div>
            <Button
              variant={isOverdue ? 'danger' : 'primary'}
              size="sm"
              onClick={() => onOpenSubmitDialog(assignment)}
              icon={CheckCircleIcon}
              className="w-full sm:w-auto justify-center"
            >
              Yes, I have submitted
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
