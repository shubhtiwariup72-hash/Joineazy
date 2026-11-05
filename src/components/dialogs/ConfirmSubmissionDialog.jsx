import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CheckCircleIcon, ExternalLinkIcon, AlertTriangleIcon } from '../common/Icons';
import { formatDate } from '../../utils/dateUtils';

export function ConfirmSubmissionDialog({
  isOpen,
  onClose,
  onConfirm,
  assignment,
  isLoading = false,
}) {
  if (!assignment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Submission"
      subtitle="Verify your deliverables before recording your final submission"
      maxWidth="max-w-md"
    >
      <div className="p-4 sm:p-5 space-y-4">
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {assignment.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Due date: {formatDate(assignment.dueDate)}
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            Submission checklist:
          </p>
          <ul className="space-y-1.5 pl-1">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1 shrink-0"></span>
              <span>All deliverables have been uploaded to the designated submission folder.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1 shrink-0"></span>
              <span>File view and review permissions are granted to your instructor.</span>
            </li>
          </ul>

          {assignment.submissionUrl && (
            <div className="pt-1.5">
              <a
                href={assignment.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                <ExternalLinkIcon className="w-3.5 h-3.5" />
                <span>Review Google Drive submission folder</span>
              </a>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-xs">
          <AlertTriangleIcon className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>
            Once confirmed, your submission timestamp will be logged and your status will be set to Submitted.
          </span>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto justify-center">
            Cancel
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            icon={CheckCircleIcon}
            className="w-full sm:w-auto justify-center"
          >
            Confirm Submission
          </Button>
        </div>
      </div>
    </Modal>
  );
}
