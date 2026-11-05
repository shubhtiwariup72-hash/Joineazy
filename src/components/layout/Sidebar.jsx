import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  GraduationCapIcon,
  UsersIcon,
  RefreshCwIcon,
  LogOutIcon,
  XIcon,
} from '../common/Icons';

export function Sidebar({
  isOpen,
  onClose,
  activeTab = 'assignments',
  onSelectTab,
  onOpenResetModal,
  onCreateAssignment,
}) {
  const { currentUser, isAdmin, logout } = useAuth();

  if (!currentUser) return null;

  const adminNavItems = [
    { id: 'assignments', label: 'All Assignments', icon: BookOpenIcon },
    { id: 'students', label: 'Class Students', icon: UsersIcon },
  ];

  const studentNavItems = [
    { id: 'assignments', label: 'My Assignments', icon: BookOpenIcon },
    { id: 'pending', label: 'Pending / Due', icon: ClockIcon },
    { id: 'submitted', label: 'Submitted Work', icon: CheckCircleIcon },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${currentUser.color} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}
          >
            {currentUser.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  <ShieldIcon className="w-3 h-3" />
                  Faculty
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <GraduationCapIcon className="w-3 h-3" />
                  Student
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close navigation"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {isAdmin && onCreateAssignment && (
          <div className="mt-3.5">
            <button
              type="button"
              onClick={() => {
                onCreateAssignment();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>+ Create Assignment</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        <p className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
        <button
          type="button"
          onClick={() => {
            onOpenResetModal();
            if (onClose) onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
        >
          <RefreshCwIcon className="w-3.5 h-3.5 text-amber-500" />
          <span>Reset Demo Data</span>
        </button>

        <button
          type="button"
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOutIcon className="w-3.5 h-3.5 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-60 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="relative w-64 max-w-[80vw] h-full shadow-xl z-10 animate-in slide-in-from-left duration-150">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
