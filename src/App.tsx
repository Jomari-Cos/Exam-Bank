/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Question,
  Course,
  UserRole,
  AuditLog,
  SystemUser,
} from './types';
import {
  INITIAL_COURSES,
  INITIAL_QUESTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS,
} from './data/initialData';
import { Navbar, ActiveTab } from './components/Navbar';
import { LoginPage } from './components/Auth/LoginPage';
import { AuthorDashboardView } from './components/Author/AuthorDashboardView';
import { AdminOverviewView } from './components/Admin/AdminOverviewView';
import { UserAccountsView } from './components/Admin/UserAccountsView';
import { AccessDeniedView } from './components/Common/AccessDeniedView';
import { QuestionBankList } from './components/QuestionBank/QuestionBankList';
import { QuestionDetailModal } from './components/QuestionBank/QuestionDetailModal';
import { QuestionEditorModal } from './components/QuestionBank/QuestionEditorModal';
import { BulkImportModal } from './components/QuestionBank/BulkImportModal';
import { ReviewQueueView } from './components/ReviewQueue/ReviewQueueView';
import { ExamGeneratorView } from './components/ExamGenerator/ExamGeneratorView';
import { CourseManager } from './components/Curriculum/CourseManager';
import { AuditLogView } from './components/AuditLogs/AuditLogView';
import { SystemManualView } from './components/Manual/SystemManualView';

// Dedicated permitted pages per institutional role
const ROLE_ALLOWED_TABS: Record<UserRole, ActiveTab[]> = {
  faculty_author: ['author_dashboard', 'questions', 'manual'],
  reviewer: ['review', 'questions', 'manual'],
  examiner: ['exams', 'questions', 'manual'],
  admin: ['admin_overview', 'curriculum', 'questions', 'users', 'audit', 'manual'],
};

export default function App() {
  // Persistence state
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('bscpe_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('bscpe_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('bscpe_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('bscpe_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current session & active role - starts on Login Page
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(() => {
    const saved = localStorage.getItem('bscpe_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (currentUser) return currentUser.role;
    return 'faculty_author';
  });

  const getDefaultTabForRole = (role: UserRole): ActiveTab => {
    switch (role) {
      case 'faculty_author':
        return 'author_dashboard';
      case 'reviewer':
        return 'review';
      case 'examiner':
        return 'exams';
      case 'admin':
        return 'admin_overview';
    }
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (currentUser) return getDefaultTabForRole(currentUser.role);
    return 'author_dashboard';
  });

  const [showLoggedOutManual, setShowLoggedOutManual] = useState(false);

  // Modals state
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('bscpe_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('bscpe_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('bscpe_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('bscpe_users', JSON.stringify(users));
  }, [users]);

  // Current active user name based on role or active user
  const getCurrentUserName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Engr. Carlos Mendoza, PECE, MEng';
      case 'faculty_author':
        return 'Engr. Maria Santos, MSc CPE';
      case 'reviewer':
        return 'Dr. Roberto Cruz, PhD CpE';
      case 'examiner':
        return 'Engr. Juvy Reyes, MEng CpE';
    }
  };

  const currentUserName = currentUser?.name || getCurrentUserName(currentRole);

  // Record an audit entry
  const recordAudit = (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: currentUserName,
      role: currentRole,
      action,
      entityType,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Login handler
  const handleLogin = (user: SystemUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    localStorage.setItem('bscpe_current_user', JSON.stringify(user));
    setShowLoggedOutManual(false);

    // Dedicated default landing view for the authenticated role
    const targetTab = getDefaultTabForRole(user.role);
    setActiveTab(targetTab);

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: user.name,
      role: user.role,
      action: 'User Sign In',
      entityType: 'User',
      entityId: user.id,
      details: `User ${user.name} logged into [${user.role}] portal (${user.department}).`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Logout / Switch Account handler
  const handleLogout = () => {
    if (currentUser) {
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: currentUser.name,
        role: currentUser.role,
        action: 'User Sign Out',
        entityType: 'User',
        entityId: currentUser.id,
        details: `User ${currentUser.name} signed out.`,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
    setCurrentUser(null);
    localStorage.removeItem('bscpe_current_user');
    setShowLoggedOutManual(false);
  };

  // Pending review count for badge
  const pendingReviewCount = questions.filter(
    (q) => q.status === 'Submitted' || q.status === 'For Review'
  ).length;

  // Handlers for Question actions
  const handleSaveQuestion = (newQuestion: Question, submitForReview: boolean) => {
    const existingIndex = questions.findIndex((q) => q.id === newQuestion.id);
    if (existingIndex >= 0) {
      // Update
      const updated = [...questions];
      updated[existingIndex] = newQuestion;
      setQuestions(updated);
      recordAudit(
        submitForReview ? 'Question Submitted for Review' : 'Question Updated',
        'Question',
        newQuestion.id,
        `Updated question: "${newQuestion.questionText.slice(0, 80)}..." Status: ${newQuestion.status}`
      );
    } else {
      // Create new
      setQuestions([newQuestion, ...questions]);
      recordAudit(
        submitForReview ? 'Question Created & Submitted' : 'Question Created Draft',
        'Question',
        newQuestion.id,
        `Created ${newQuestion.questionType.replace('_', ' ')} question for ${newQuestion.courseCode}.`
      );
    }

    setIsCreateModalOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm(`Are you sure you want to delete question ${questionId}?`)) {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      if (selectedQuestion?.id === questionId) setSelectedQuestion(null);
      recordAudit('Question Deleted', 'Question', questionId, 'Permanently removed from question bank.');
    }
  };

  const handleDuplicateQuestion = (question: Question) => {
    const duplicated: Question = {
      ...question,
      id: `BSCPE-${question.courseCode.replace(/\s+/g, '')}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Draft',
      version: 1,
      dateCreated: new Date().toISOString().slice(0, 10),
      dateModified: new Date().toISOString().slice(0, 10),
      author: currentUserName,
      reviewer: undefined,
      reviewFeedback: undefined,
    };
    setQuestions([duplicated, ...questions]);
    recordAudit('Question Duplicated', 'Question', duplicated.id, `Cloned from ${question.id}`);
  };

  // Review Queue actions (Reviewer only)
  const handleApproveQuestion = (questionId: string, comments: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: 'Approved',
              reviewer: currentUserName,
              dateModified: new Date().toISOString().slice(0, 10),
              reviewFeedback: comments,
            }
          : q
      )
    );
    recordAudit(
      'Question Approved',
      'Question',
      questionId,
      `Validated and approved by ${currentUserName}. Feedback: "${comments}"`
    );
  };

  const handleReturnForRevision = (questionId: string, comments: string, recommendations: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: 'Draft',
              reviewer: currentUserName,
              reviewFeedback: comments,
              reviewRecommendations: recommendations,
              dateModified: new Date().toISOString().slice(0, 10),
            }
          : q
      )
    );
    recordAudit(
      'Question Returned for Revision',
      'Question',
      questionId,
      `Returned to author with notes: "${comments}"`
    );
  };

  const handleRejectQuestion = (questionId: string, comments: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: 'Archived',
              reviewer: currentUserName,
              reviewFeedback: comments,
              dateModified: new Date().toISOString().slice(0, 10),
            }
          : q
      )
    );
    recordAudit(
      'Question Rejected',
      'Question',
      questionId,
      `Rejected and archived by validator. Rationale: "${comments}"`
    );
  };

  // Bulk actions
  const handleBulkImport = (imported: Question[]) => {
    setQuestions((prev) => [...imported, ...prev]);
    recordAudit(
      'Bulk Questions Ingested',
      'Question',
      `BATCH-${Date.now()}`,
      `Imported ${imported.length} examination questions from file/JSON array.`
    );
  };

  const handleBulkApprove = (questionIds: string[]) => {
    setQuestions((prev) =>
      prev.map((q) =>
        questionIds.includes(q.id)
          ? {
              ...q,
              status: 'Approved',
              reviewer: currentUserName,
              dateModified: new Date().toISOString().slice(0, 10),
            }
          : q
      )
    );
    recordAudit(
      'Bulk Questions Approved',
      'Question',
      `BATCH-${questionIds.length}`,
      `Batch approved ${questionIds.length} questions.`
    );
  };

  const handleBulkDelete = (questionIds: string[]) => {
    if (window.confirm(`Delete ${questionIds.length} selected questions?`)) {
      setQuestions((prev) => prev.filter((q) => !questionIds.includes(q.id)));
      recordAudit(
        'Bulk Questions Deleted',
        'Question',
        `BATCH-${questionIds.length}`,
        `Deleted ${questionIds.length} questions.`
      );
    }
  };

  // Curriculum actions (Admin only)
  const handleAddCourse = (newCourse: Course) => {
    setCourses([...courses, newCourse]);
    recordAudit('Course Added', 'Course', newCourse.code, `Added ${newCourse.code}: ${newCourse.title} to curriculum.`);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(courses.map((c) => (c.code === updatedCourse.code ? updatedCourse : c)));
    recordAudit('Course Updated', 'Course', updatedCourse.code, `Updated curriculum modules for ${updatedCourse.code}.`);
  };

  const handleDeleteCourse = (code: string) => {
    if (window.confirm(`Remove course ${code} from the curriculum catalog?`)) {
      setCourses(courses.filter((c) => c.code !== code));
      recordAudit('Course Removed', 'Course', code, `Removed ${code} from system course catalog.`);
    }
  };

  // User Management actions (Admin only)
  const handleAddUser = (newUser: SystemUser) => {
    setUsers((prev) => [...prev, newUser]);
    recordAudit(
      'User Account Created',
      'User',
      newUser.id,
      `Admin created ${newUser.role} account for ${newUser.name} (${newUser.email}) in ${newUser.department}.`
    );
  };

  const handleUpdateUser = (updatedUser: SystemUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      setCurrentRole(updatedUser.role);
    }
    recordAudit(
      'User Account Updated',
      'User',
      updatedUser.id,
      `Updated user profile and role settings for ${updatedUser.name} [${updatedUser.role}].`
    );
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    if (currentUser?.id === userId) {
      alert('Security Protection: You cannot delete your own active administrator account.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently remove user account "${target.name}" (${target.email})?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      recordAudit(
        'User Account Removed',
        'User',
        userId,
        `Removed user account for ${target.name} [${target.role}].`
      );
    }
  };

  // If not authenticated, render Login Page (or System Manual if requested from login)
  if (!currentUser) {
    if (showLoggedOutManual) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SystemManualView
              currentRole={currentRole}
              onNavigateTab={(tab) => {
                setShowLoggedOutManual(false);
                setActiveTab(tab);
              }}
              onOpenNewQuestion={() => {}}
              onReturnToLogin={() => setShowLoggedOutManual(false)}
            />
          </main>
        </div>
      );
    }

    return (
      <LoginPage
        users={users}
        onLogin={handleLogin}
        onOpenManual={() => setShowLoggedOutManual(true)}
      />
    );
  }

  // Check if active tab is permitted for current user's role
  const isTabAllowed = ROLE_ALLOWED_TABS[currentUser.role]?.includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Role-Dedicated Header Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          // Prevent navigating to tabs not allowed for this role
          if (ROLE_ALLOWED_TABS[currentUser.role]?.includes(tab)) {
            setActiveTab(tab);
          } else {
            setActiveTab(tab); // Handled by AccessDeniedView route guard below
          }
        }}
        currentRole={currentUser.role}
        currentUser={currentUser}
        onLogout={handleLogout}
        pendingReviewCount={pendingReviewCount}
        onOpenNewQuestion={() => {
          if (currentUser.role === 'faculty_author' || currentUser.role === 'admin') {
            setEditingQuestion(null);
            setIsCreateModalOpen(true);
          }
        }}
      />

      {/* Main Workspace Viewport with Role Access Control Enforcement */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!isTabAllowed ? (
          <AccessDeniedView
            currentRole={currentUser.role}
            attemptedFeature={activeTab.replace('_', ' ')}
            onReturnToHome={() => setActiveTab(getDefaultTabForRole(currentUser.role))}
          />
        ) : (
          <>
            {/* 1. FACULTY AUTHOR DEDICATED DASHBOARD */}
            {activeTab === 'author_dashboard' && currentUser.role === 'faculty_author' && (
              <AuthorDashboardView
                currentUser={currentUser}
                questions={questions}
                courses={courses}
                onOpenNewQuestion={() => {
                  setEditingQuestion(null);
                  setIsCreateModalOpen(true);
                }}
                onOpenBulkImport={() => setIsBulkImportOpen(true)}
                onNavigateToQuestionBank={() => setActiveTab('questions')}
                onNavigateToGuide={() => setActiveTab('manual')}
                onSelectQuestion={(q) => setSelectedQuestion(q)}
                onEditQuestion={(q) => {
                  setEditingQuestion(q);
                  setIsCreateModalOpen(true);
                }}
              />
            )}

            {/* 2. ADMINISTRATOR DEDICATED OVERVIEW */}
            {activeTab === 'admin_overview' && currentUser.role === 'admin' && (
              <AdminOverviewView
                currentUser={currentUser}
                questions={questions}
                courses={courses}
                users={users}
                auditLogs={auditLogs}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {/* 3. QUESTION BANK (Tailored by Role) */}
            {activeTab === 'questions' && (
              <QuestionBankList
                questions={questions}
                courses={courses}
                currentRole={currentUser.role}
                onSelectQuestion={(q) => setSelectedQuestion(q)}
                onEditQuestion={(q) => {
                  if (currentUser.role === 'faculty_author' || currentUser.role === 'admin') {
                    setEditingQuestion(q);
                    setIsCreateModalOpen(true);
                  }
                }}
                onDeleteQuestion={(id) => {
                  if (currentUser.role === 'faculty_author' || currentUser.role === 'admin') {
                    handleDeleteQuestion(id);
                  }
                }}
                onDuplicateQuestion={handleDuplicateQuestion}
                onBulkApprove={currentUser.role === 'admin' ? handleBulkApprove : undefined}
                onBulkDelete={currentUser.role === 'admin' ? handleBulkDelete : undefined}
                onOpenNewModal={() => {
                  if (currentUser.role === 'faculty_author' || currentUser.role === 'admin') {
                    setEditingQuestion(null);
                    setIsCreateModalOpen(true);
                  }
                }}
                onOpenBulkImport={() => {
                  if (currentUser.role === 'faculty_author' || currentUser.role === 'admin') {
                    setIsBulkImportOpen(true);
                  }
                }}
              />
            )}

            {/* 4. REVIEWER VALIDATION QUEUE */}
            {activeTab === 'review' && currentUser.role === 'reviewer' && (
              <ReviewQueueView
                questions={questions}
                currentRole={currentUser.role}
                reviewerName={currentUserName}
                onApprove={handleApproveQuestion}
                onReturnForRevision={handleReturnForRevision}
                onReject={handleRejectQuestion}
              />
            )}

            {/* 5. FACULTY EXAMINER GENERATOR & TOS */}
            {activeTab === 'exams' && currentUser.role === 'examiner' && (
              <ExamGeneratorView
                questions={questions}
                courses={courses}
                currentRole={currentUser.role}
                examinerName={currentUserName}
              />
            )}

            {/* 6. ADMINISTRATOR CURRICULUM MANAGER */}
            {activeTab === 'curriculum' && currentUser.role === 'admin' && (
              <CourseManager
                courses={courses}
                currentRole={currentUser.role}
                onAddCourse={handleAddCourse}
                onUpdateCourse={handleUpdateCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            )}

            {/* 7. ADMINISTRATOR USER ACCOUNTS & RBAC */}
            {activeTab === 'users' && currentUser.role === 'admin' && (
              <UserAccountsView
                users={users}
                currentUserId={currentUser.id}
                onAddUser={handleAddUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onSwitchUser={handleLogin}
              />
            )}

            {/* 8. ADMINISTRATOR AUDIT LOGS */}
            {activeTab === 'audit' && currentUser.role === 'admin' && (
              <AuditLogView
                logs={auditLogs}
                questions={questions}
                courses={courses}
              />
            )}

            {/* 9. SYSTEM OPERATIONS MANUAL & OBE GUIDELINES */}
            {activeTab === 'manual' && (
              <SystemManualView
                currentRole={currentUser.role}
                onNavigateTab={(tab) => {
                  if (ROLE_ALLOWED_TABS[currentUser.role]?.includes(tab)) {
                    setActiveTab(tab);
                  }
                }}
                onOpenNewQuestion={() => {
                  if (currentUser.role === 'faculty_author' || currentUser.role === 'admin') {
                    setEditingQuestion(null);
                    setIsCreateModalOpen(true);
                  }
                }}
                onReturnToLogin={handleLogout}
              />
            )}
          </>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 text-center no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BS Computer Engineering (BSCpE) Examination Question Data Bank System</span>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700 capitalize">
              Role: {currentUser.role.replace('_', ' ')}
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <span>Operations Guide</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-slate-400">
              OBE Standards · Bloom's Taxonomy Alignment
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          currentRole={currentUser.role}
          onClose={() => setSelectedQuestion(null)}
          onEdit={(q) => {
            if (currentUser.role === 'faculty_author' || currentUser.role === 'admin') {
              setSelectedQuestion(null);
              setEditingQuestion(q);
              setIsCreateModalOpen(true);
            }
          }}
          onSubmitForReview={(q) => {
            if (currentUser.role === 'faculty_author' || currentUser.role === 'admin') {
              handleSaveQuestion({ ...q, status: 'Submitted' }, true);
              setSelectedQuestion(null);
            }
          }}
          onApprove={(q) => {
            if (currentUser.role === 'reviewer' || currentUser.role === 'admin') {
              handleApproveQuestion(q.id, 'Approved via inspection dialog.');
              setSelectedQuestion(null);
            }
          }}
        />
      )}

      {isCreateModalOpen && (currentUser.role === 'faculty_author' || currentUser.role === 'admin') && (
        <QuestionEditorModal
          initialQuestion={editingQuestion}
          courses={courses}
          authorName={currentUserName}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingQuestion(null);
          }}
          onSave={handleSaveQuestion}
        />
      )}

      {isBulkImportOpen && (currentUser.role === 'faculty_author' || currentUser.role === 'admin') && (
        <BulkImportModal
          courses={courses}
          authorName={currentUserName}
          onClose={() => setIsBulkImportOpen(false)}
          onImport={handleBulkImport}
        />
      )}
    </div>
  );
}
