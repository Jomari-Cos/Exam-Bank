import React, { useState } from 'react';
import { AuditLog, Question, Course } from '../../types';
import { Shield, Clock, Search, Filter, Database, CheckCircle, FileText, BookOpen, Printer } from 'lucide-react';
import { printElementById } from '../../utils/printUtils';

interface AuditLogViewProps {
  logs: AuditLog[];
  questions: Question[];
  courses: Course[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  logs,
  questions,
  courses,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'ALL' && log.entityType !== filterType) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        log.user.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term) ||
        log.entityId.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const approvedCount = questions.filter((q) => q.status === 'Approved' || q.status === 'Published').length;
  const pendingCount = questions.filter((q) => q.status === 'Submitted' || q.status === 'For Review').length;
  const draftCount = questions.filter((q) => q.status === 'Draft').length;

  return (
    <div className="space-y-6">
      {/* Title & Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Administration & Activity Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable event log tracking examination creation, validation decisions, curriculum revisions, and user access.
          </p>
        </div>

        <button
          id="print-audit-report-btn"
          name="printAuditReportBtn"
          type="button"
          onClick={() => {
            printElementById('printable-audit-report', {
              documentTitle: `BSCpE_Security_Audit_Report_${new Date().toISOString().slice(0, 10)}`,
            });
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Print Audit Report</span>
        </button>
      </div>

      {/* Quick Summary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-slate-400 text-xs block mb-1">Total Question Bank</span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {questions.length}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Across 12 question formats
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-slate-400 text-xs block mb-1">Validated & Approved</span>
          <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {approvedCount}
          </span>
          <span className="text-[11px] text-emerald-600 block mt-1">
            Eligible for exam sets
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-slate-400 text-xs block mb-1">Pending Validation</span>
          <span className="text-2xl font-bold font-mono text-amber-700 tabular-nums">
            {pendingCount}
          </span>
          <span className="text-[11px] text-amber-600 block mt-1">
            In review queue
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-slate-400 text-xs block mb-1">BSCpE Courses</span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {courses.length}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Configured in catalog
          </span>
        </div>
      </div>

      {/* Logs Table Card */}
      <div id="printable-audit-report" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        {/* Print-only institution header */}
        <div className="print-only pb-4 border-b-2 border-slate-900 text-center space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            BS Computer Engineering Examination Data Bank · Information Security Office
          </div>
          <div className="text-base font-extrabold text-slate-900">
            Official System Activity & Compliance Audit Report
          </div>
          <div className="text-xs text-slate-700">
            Generated on: <strong>{new Date().toLocaleString()}</strong> · Total Records: <strong>{filteredLogs.length}</strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search audit trail by user, action, or question ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Entity:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Entities</option>
              <option value="Question">Question Operations</option>
              <option value="Exam">Examination Generations</option>
              <option value="Course">Course Catalog</option>
              <option value="Setting">System Settings</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3 w-40">Timestamp</th>
                <th className="py-2.5 px-3 w-48">Actor & Role</th>
                <th className="py-2.5 px-3 w-36">Action</th>
                <th className="py-2.5 px-3 w-44">Target Entity</th>
                <th className="py-2.5 px-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">{log.user}</div>
                    <div className="text-[11px] text-slate-500 capitalize">{log.role.replace('_', ' ')}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-slate-800">{log.action}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">
                    <span className="text-slate-400 font-sans text-[11px] mr-1">{log.entityType}:</span>
                    {log.entityId}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
