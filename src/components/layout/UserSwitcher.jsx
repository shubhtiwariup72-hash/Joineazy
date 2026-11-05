import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  ChevronDownIcon,
  CheckIcon,
  GraduationCapIcon,
  ShieldIcon,
  LogOutIcon,
  RefreshCwIcon,
} from "../common/Icons";

export function UserSwitcher({ onOpenResetModal }) {
  const { currentUser, switchUser, logout, admins, students } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (userId) => {
    switchUser(userId);
    setIsOpen(false);
    const target = [...admins, ...students].find((user) => user.id === userId);
    showToast(
      `Switched to ${target?.name} (${target?.role === "admin" ? "Faculty" : "Student"})`,
      "info",
    );
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    showToast("Signed out of session", "info");
  };

  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left shadow-xs"
        aria-label="Switch User Account"
        aria-expanded={isOpen}
      >
        <div
          className={`w-7 h-7 rounded-md bg-gradient-to-tr ${currentUser.color} text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs`}
        >
          {currentUser.avatar}
        </div>

        <div className="hidden sm:block text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {currentUser.name}
            </span>
            <span
              className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                isAdmin
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
              }`}
            >
              {isAdmin ? "FACULTY" : "STUDENT"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
            {currentUser.email}
          </p>
        </div>

        <ChevronDownIcon
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Switch Account
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Select any role to test strict data isolation
            </p>
          </div>

          <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            <div className="p-1.5 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <ShieldIcon className="w-3 h-3" />
                <span>Professors (Faculty)</span>
              </div>
              {admins.map((admin) => {
                const isSelected = currentUser.id === admin.id;
                return (
                  <button
                    key={admin.id}
                    type="button"
                    onClick={() => handleSelectUser(admin.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-medium"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-md bg-gradient-to-tr ${admin.color} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}
                      >
                        {admin.avatar}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold leading-tight truncate">
                          {admin.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-1.5 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <GraduationCapIcon className="w-3 h-3" />
                <span>Students</span>
              </div>
              {students.map((student) => {
                const isSelected = currentUser.id === student.id;
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => handleSelectUser(student.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-md bg-gradient-to-tr ${student.color} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}
                      >
                        {student.avatar}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold leading-tight truncate">
                          {student.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
            {onOpenResetModal && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenResetModal();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-md transition-colors"
              >
                <RefreshCwIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>Reset Demo State</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
            >
              <LogOutIcon className="w-3.5 h-3.5 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
