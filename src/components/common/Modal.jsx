import React, { useEffect, useRef } from "react";
import { XIcon } from "./Icons";

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-xl",
  showClose = true,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className={`relative w-full ${maxWidth} max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all z-10 my-auto`}
      >
        <div className="flex items-start justify-between p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="pr-4 min-w-0">
            <h3
              id="modal-title"
              className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate"
            >
              {title}
            </h3>
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
