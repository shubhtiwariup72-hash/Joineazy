import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserSwitcher } from './UserSwitcher';
import {
  SunIcon,
  MoonIcon,
  MenuIcon,
  BookOpenIcon,
  GraduationCapIcon,
  ShieldIcon,
  RefreshCwIcon,
} from '../common/Icons';

export function Header({ onToggleMobileMenu, onOpenResetModal }) {
  const { currentUser, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpenIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                  Joineazy
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Dashboard
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {currentUser && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              {isAdmin ? (
                <>
                  <ShieldIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-700 dark:text-slate-300">Faculty Mode</span>
                </>
              ) : (
                <>
                  <GraduationCapIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-slate-700 dark:text-slate-300">Student Portal</span>
                </>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onOpenResetModal}
            className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Demo Data"
            aria-label="Reset Demo Data"
          >
            <RefreshCwIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <SunIcon className="w-4 h-4 text-amber-400" />
            ) : (
              <MoonIcon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <UserSwitcher onOpenResetModal={onOpenResetModal} />
        </div>
      </div>
    </header>
  );
}
