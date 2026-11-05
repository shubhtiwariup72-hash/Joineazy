import React from 'react';
import { ProgressBar } from '../common/ProgressBar';
import {
  CalendarIcon,
  ExternalLinkIcon,
  UsersIcon,
  EditIcon,
  TrashIcon,
} from '../common/Icons';
import { formatDate, getRelativeDueDateInfo } from '../../utils/dateUtils';

export function AdminAssignmentTable({
  assignments,
  onViewRoster,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <table className="w-full text-left border-collapse min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-3 px-4">Assignment</th>
            <th className="py-3 px-4">Due Date</th>
            <th className="py-3 px-4">Distribution</th>
            <th className="py-3 px-4 min-w-[180px]">Submission Progress</th>
            <th className="py-3 px-4">Resource</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {assignments.map((asg) => {
            const relativeDate = getRelativeDueDateInfo(asg.dueDate);
            const isCompleted =
              asg.totalAssigned > 0 && asg.submittedCount === asg.totalAssigned;

            return (
              <tr
                key={asg.id}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-semibold text-slate-900 dark:text-white line-clamp-1 text-xs sm:text-sm">
                    {asg.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {asg.description}
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(asg.dueDate)}</span>
                  </div>
                  <div className="text-[11px] mt-0.5">
                    <span
                      className={`font-medium ${
                        relativeDate.isOverdue
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {relativeDate.label}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onViewRoster(asg)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <UsersIcon className="w-3.5 h-3.5" />
                    <span>{asg.totalAssigned} Students</span>
                  </button>
                  <div className="flex -space-x-1 mt-1">
                    {asg.roster?.slice(0, 5).map((student) => (
                      <div
                        key={student.id}
                        title={`${student.name}: ${student.status === 'SUBMITTED' ? 'Submitted' : 'Pending'}`}
                        className={`relative w-6 h-6 rounded-full bg-gradient-to-tr ${student.color} text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white dark:ring-slate-900 cursor-pointer`}
                        onClick={() => onViewRoster(asg)}
                      >
                        {student.avatar}
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
                            student.status === 'SUBMITTED' ? 'bg-emerald-500' : 'bg-amber-400'
                          }`}
                        />
                      </div>
                    ))}
                    {asg.roster?.length > 5 && (
                      <div
                        onClick={() => onViewRoster(asg)}
                        title="View all assigned students"
                        className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[9px] font-bold ring-2 ring-white dark:ring-slate-900 cursor-pointer"
                      >
                        +{asg.roster.length - 5}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {asg.completionPercentage}%
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {asg.submittedCount}/{asg.totalAssigned} submitted
                      </span>
                    </div>
                    <ProgressBar
                      value={asg.completionPercentage}
                      size="sm"
                      color={isCompleted ? 'green' : 'blue'}
                    />
                    {asg.overdueCount > 0 && (
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                        {asg.overdueCount} overdue
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {asg.submissionUrl ? (
                    <a
                      href={asg.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ExternalLinkIcon className="w-3.5 h-3.5" />
                      <span>Drive Link</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">None</span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewRoster(asg)}
                      className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                      Roster
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(asg)}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                      title="Edit"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(asg)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
