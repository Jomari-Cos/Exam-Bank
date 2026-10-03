import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { UserRole } from '../../types';

interface AccessDeniedViewProps {
  currentRole: UserRole;
  attemptedFeature: string;
  onReturnToHome: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentRole,
  attemptedFeature,
  onReturnToHome,
}) => {
  const roleLabels: Record<UserRole, string> = {
    admin: 'System Administrator',
    faculty_author: 'Faculty Author',
    reviewer: 'Reviewer / Validator',
    examiner: 'Faculty Examiner',
  };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white border border-rose-200 rounded-2xl p-8 shadow-sm text-center">
      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 mb-3">
        <Lock className="w-3.5 h-3.5" />
        <span>403 — Unauthorized Role Access</span>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Access Restricted to Assigned Role
      </h2>

      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
        You are currently signed in as{' '}
        <strong className="text-slate-900 font-semibold">{roleLabels[currentRole]}</strong>.
        The requested module (<code className="px-1.5 py-0.5 bg-slate-100 rounded text-rose-700 font-mono text-xs">{attemptedFeature}</code>) is restricted to prevent cross-role conflicts and maintain security integrity.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left mb-6 text-slate-600 space-y-1.5">
        <div className="font-semibold text-slate-800">Assigned Responsibilities:</div>
        {currentRole === 'faculty_author' && (
          <ul className="list-disc pl-5 space-y-1">
            <li>Authoring questions across 12 BSCpE formats</li>
            <li>Aligning questions to syllabus ILOs and Bloom's cognitive taxonomy</li>
            <li>Revising draft submissions based on reviewer feedback</li>
          </ul>
        )}
        {currentRole === 'reviewer' && (
          <ul className="list-disc pl-5 space-y-1">
            <li>Reviewing questions in the validation queue</li>
            <li>Verifying answer keys, cognitive levels, and rubrics</li>
            <li>Approving or returning questions with actionable feedback</li>
          </ul>
        )}
        {currentRole === 'examiner' && (
          <ul className="list-disc pl-5 space-y-1">
            <li>Generating official Prelim, Midterm, and Final examination papers</li>
            <li>Constructing Table of Specifications (TOS) matrices</li>
            <li>Exporting scrambled test sets and answer keys</li>
          </ul>
        )}
        {currentRole === 'admin' && (
          <ul className="list-disc pl-5 space-y-1">
            <li>BSCpE curriculum course catalog and syllabus administration</li>
            <li>Institutional user account & role permissions management</li>
            <li>Security audit trail and compliance verification</li>
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onReturnToHome}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to My Dedicated Portal</span>
      </button>
    </div>
  );
};
