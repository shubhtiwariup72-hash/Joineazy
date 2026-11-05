import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssignmentProvider } from './context/AssignmentContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Login/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';

function AppContent() {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('assignments');
  const [isAdminCreateOpen, setIsAdminCreateOpen] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <Layout
      activeTab={activeTab}
      onSelectTab={(tab) => setActiveTab(tab)}
      onCreateAssignment={isAdmin ? () => setIsAdminCreateOpen(true) : undefined}
    >
      {isAdmin ? (
        <AdminDashboard
          activeTab={activeTab}
          isCreateModalOpen={isAdminCreateOpen}
          setIsCreateModalOpen={setIsAdminCreateOpen}
        />
      ) : (
        <StudentDashboard activeTab={activeTab} />
      )}
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AssignmentProvider>
            <AppContent />
          </AssignmentProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
