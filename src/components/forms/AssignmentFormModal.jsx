import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { validateAssignmentForm } from "../../utils/validationUtils";
import { SEED_USERS } from "../../data/seedData";
import { CheckIcon, GoogleDriveIcon, UsersIcon } from "../common/Icons";

const ALL_STUDENTS = SEED_USERS.filter((user) => user.role === "student");

export function AssignmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const isEditMode = Boolean(initialData);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [distributionMode, setDistributionMode] = useState("all");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");

      if (initialData.dueDate) {
        try {
          const date = new Date(initialData.dueDate);
          if (!isNaN(date.getTime())) {
            const pad = (num) => String(num).padStart(2, "0");
            const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
              date.getHours(),
            )}:${pad(date.getMinutes())}`;
            setDueDate(formatted);
          } else {
            setDueDate("");
          }
        } catch {
          setDueDate("");
        }
      } else {
        setDueDate("");
      }

      setSubmissionUrl(initialData.submissionUrl || "");

      const assigned = initialData.assignedStudentIds || [];
      setSelectedStudentIds(assigned);

      if (assigned.length === ALL_STUDENTS.length) {
        setDistributionMode("all");
      } else {
        setDistributionMode("custom");
      }
    } else {
      setTitle("");
      setDescription("");

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      futureDate.setHours(23, 59, 0, 0);
      const pad = (num) => String(num).padStart(2, "0");
      const defaultDue = `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-${pad(
        futureDate.getDate(),
      )}T${pad(futureDate.getHours())}:${pad(futureDate.getMinutes())}`;
      setDueDate(defaultDue);

      setSubmissionUrl(
        "https://drive.google.com/drive/folders/joineazy-assignment",
      );
      setDistributionMode("all");
      setSelectedStudentIds(ALL_STUDENTS.map((student) => student.id));
    }
    setErrors({});
    setTouched({});
  }, [isOpen, initialData]);

  const handleDistributionModeChange = (mode) => {
    setDistributionMode(mode);
    if (mode === "all") {
      setSelectedStudentIds(ALL_STUDENTS.map((student) => student.id));
      if (errors.assignedStudentIds) {
        setErrors((prev) => ({ ...prev, assignedStudentIds: undefined }));
      }
    }
  };

  const handleToggleStudent = (studentId) => {
    setSelectedStudentIds((prev) => {
      const next = prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId];
      if (next.length === ALL_STUDENTS.length) {
        setDistributionMode("all");
      } else {
        setDistributionMode("custom");
      }
      return next;
    });
    if (errors.assignedStudentIds) {
      setErrors((prev) => ({ ...prev, assignedStudentIds: undefined }));
    }
  };

  const handleSelectAllStudents = () => {
    setDistributionMode("all");
    setSelectedStudentIds(ALL_STUDENTS.map((student) => student.id));
    if (errors.assignedStudentIds) {
      setErrors((prev) => ({ ...prev, assignedStudentIds: undefined }));
    }
  };

  const handleDeselectAllStudents = () => {
    setDistributionMode("custom");
    setSelectedStudentIds([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      title,
      description,
      dueDate,
      submissionUrl,
      assignedStudentIds: selectedStudentIds,
    };

    const validation = validateAssignmentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({
        title: true,
        description: true,
        dueDate: true,
        submissionUrl: true,
        assignedStudentIds: true,
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Assignment" : "Create Assignment"}
      subtitle={
        isEditMode
          ? "Update assignment details, timeline, and distribution"
          : "Define assignment instructions, submission link, and assigned students"
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Assignment Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Distributed Database Sharding Analysis"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            onBlur={() => setTouched((p) => ({ ...p, title: true }))}
            className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
              touched.title && errors.title
                ? "border-rose-300 dark:border-rose-700 bg-rose-50/20"
                : "border-slate-300 dark:border-slate-700"
            }`}
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Description & Instructions <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Specify assignment requirements, rubrics, deliverables, and expectations..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: undefined }));
              }
            }}
            onBlur={() => setTouched((p) => ({ ...p, description: true }))}
            className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
              touched.description && errors.description
                ? "border-rose-300 dark:border-rose-700 bg-rose-50/20"
                : "border-slate-300 dark:border-slate-700"
            }`}
          />
          {touched.description && errors.description && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Due Date & Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) {
                  setErrors((prev) => ({ ...prev, dueDate: undefined }));
                }
              }}
              onBlur={() => setTouched((p) => ({ ...p, dueDate: true }))}
              className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                touched.dueDate && errors.dueDate
                  ? "border-rose-300 dark:border-rose-700 bg-rose-50/20"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            {touched.dueDate && errors.dueDate && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.dueDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Google Drive / External URL
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={submissionUrl}
                onChange={(e) => {
                  setSubmissionUrl(e.target.value);
                  if (errors.submissionUrl) {
                    setErrors((prev) => ({ ...prev, submissionUrl: undefined }));
                  }
                }}
                onBlur={() =>
                  setTouched((p) => ({ ...p, submissionUrl: true }))
                }
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                  touched.submissionUrl && errors.submissionUrl
                    ? "border-rose-300 dark:border-rose-700 bg-rose-50/20"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              />
              <div className="absolute left-3 top-2.5 text-slate-400">
                <GoogleDriveIcon className="w-4 h-4" />
              </div>
            </div>
            {touched.submissionUrl && errors.submissionUrl && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.submissionUrl}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Distribution & Assignment <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {selectedStudentIds.length} of {ALL_STUDENTS.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDistributionModeChange("all")}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                distributionMode === "all"
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                  distributionMode === "all"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-400"
                }`}
              >
                {distributionMode === "all" && (
                  <div className="w-1 h-1 rounded-full bg-white" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">All Students</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Assign to entire class
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDistributionModeChange("custom")}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                distributionMode === "custom"
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                  distributionMode === "custom"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-400"
                }`}
              >
                {distributionMode === "custom" && (
                  <div className="w-1 h-1 rounded-full bg-white" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">
                  Selected Students
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Custom selection
                </p>
              </div>
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700/80 divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
            <div className="flex items-center justify-between p-2 bg-slate-100/70 dark:bg-slate-800/60 px-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Class Roster</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                >
                  Select All
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleDeselectAllStudents}
                  className="text-slate-500 dark:text-slate-400 hover:underline text-xs"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="max-h-44 overflow-y-auto p-1 space-y-1">
              {ALL_STUDENTS.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);

                return (
                  <div
                    key={student.id}
                    onClick={() => handleToggleStudent(student.id)}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 border border-blue-200 dark:border-blue-900/60"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-md bg-gradient-to-tr ${student.color} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}
                      >
                        {student.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">
                          {student.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      {isSelected && <CheckIcon className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {touched.assignedStudentIds && errors.assignedStudentIds && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.assignedStudentIds}
            </p>
          )}

          {isEditMode && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Note: Existing submission statuses for retained students will be
              preserved.
            </p>
          )}
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
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            icon={isEditMode ? null : UsersIcon}
            className="w-full sm:w-auto justify-center"
          >
            {isEditMode ? "Save Changes" : "Create Assignment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
