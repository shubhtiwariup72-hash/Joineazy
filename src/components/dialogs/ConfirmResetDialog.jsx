import React from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { RefreshCwIcon, AlertTriangleIcon } from "../common/Icons";

export function ConfirmResetDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Demo Data"
      maxWidth="max-w-md"
    >
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200">
          <div className="p-1.5 rounded-md bg-amber-600 text-white shrink-0">
            <AlertTriangleIcon className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm">
            <p className="font-semibold text-amber-950 dark:text-amber-100">
              Restore initial demo assignments?
            </p>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              This will reset all assignments, submissions, and demo user states
              back to their default seed values.
            </p>
          </div>
        </div>

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
            variant="primary"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            icon={RefreshCwIcon}
            className="w-full sm:w-auto justify-center"
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </Modal>
  );
}
