import React from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { TrashIcon, AlertTriangleIcon } from "../common/Icons";

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  assignmentTitle,
  isLoading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Assignment"
      maxWidth="max-w-md"
    >
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200">
          <div className="p-1.5 rounded-md bg-rose-600 text-white shrink-0">
            <AlertTriangleIcon className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm">
            <p className="font-semibold text-rose-950 dark:text-rose-100">
              Are you sure you want to delete this assignment?
            </p>
            <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
              "{assignmentTitle}" and all associated student submission records
              will be permanently removed.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          This action cannot be undone. Assigned students will no longer see
          this assignment on their dashboards.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto justify-center"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            icon={TrashIcon}
            className="w-full sm:w-auto justify-center"
          >
            Delete Assignment
          </Button>
        </div>
      </div>
    </Modal>
  );
}
