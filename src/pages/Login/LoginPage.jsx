import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import {
  BookOpenIcon,
  ShieldIcon,
  GraduationCapIcon,
  SunIcon,
  MoonIcon,
  CheckCircleIcon,
} from '../../components/common/Icons';

export function LoginPage() {
  const { admins, students, login } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [selectedRole, setSelectedRole] = useState('student');

  const handleSelectUser = (user) => {
    login(user.id);
    showToast(`Signed in as ${user.name} (${user.role === 'admin' ? 'Faculty' : 'Student'})`, 'success');
  };

  const usersToList = selectedRole === 'admin' ? admins : students;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 transition-colors">
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <BookOpenIcon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">
              Joineazy
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Assignment & Review Dashboard
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <SunIcon className="w-4 h-4 text-amber-400" />
          ) : (
            <MoonIcon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </header>

      <main className="max-w-lg w-full mx-auto my-auto py-4 sm:py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-7 space-y-4 sm:space-y-5">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <span>Frontend Intern Assignment (Task 1)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Select Demo User Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Choose an identity below to test role permissions, assignment workflow, and two-step submission confirmation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                selectedRole === 'student'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <GraduationCapIcon className="w-4 h-4" />
              <span>Students (5 Seeded)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldIcon className="w-4 h-4" />
              <span>Admins / Professors (2 Seeded)</span>
            </button>
          </div>

          <div className="space-y-2">
            {usersToList.map((user) => {
              const isAdmin = user.role === 'admin';

              return (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${user.color} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}
                    >
                      {user.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {user.name}
                        </p>
                        <span
                          className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                            isAdmin
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                          }`}
                        >
                          {isAdmin ? 'FACULTY' : 'STUDENT'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      {user.title && (
                        <p className="text-[11px] text-slate-400 truncate">{user.title}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 pl-2">
                    <span>Sign In</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>No password required. Instant session switching enabled.</span>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 py-2">
        Joineazy Assignment & Review Dashboard • Production Frontend Architecture
      </footer>
    </div>
  );
}
