import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ConfirmResetDialog } from '../dialogs/ConfirmResetDialog';
import { useAssignments } from '../../context/AssignmentContext';
import { useToast } from '../../context/ToastContext';

export function Layout({
  children,
  activeTab = 'assignments',
  onSelectTab,
  onCreateAssignment,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { resetDemoData } = useAssignments();
  const { showToast } = useToast();

  const handleConfirmReset = () => {
    resetDemoData();
    setIsResetModalOpen(false);
    showToast('Demo state and assignments restored to initial defaults', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 flex flex-col font-sans transition-colors">
      <Header
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onOpenResetModal={() => setIsResetModalOpen(true)}
          onCreateAssignment={onCreateAssignment}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-7">
          {children}
        </main>
      </div>

      <ConfirmResetDialog
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
