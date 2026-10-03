import React, { useState } from 'react';
import { SystemUser, UserRole } from '../../types';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Layers,
  Search,
  Check,
  Lock,
  Mail,
  Building,
  UserPlus,
  Pencil,
  Trash2,
  KeyRound,
  LogIn,
  Sparkles,
  Info,
  CheckCheck,
} from 'lucide-react';
import { AddUserModal } from './AddUserModal';

interface UserAccountsViewProps {
  users: SystemUser[];
  currentUserId?: string;
  onAddUser: (newUser: SystemUser) => void;
  onUpdateUser?: (updatedUser: SystemUser) => void;
  onDeleteUser?: (userId: string) => void;
  onSwitchUser?: (user: SystemUser) => void;
}

export const UserAccountsView: React.FC<UserAccountsViewProps> = ({
  users,
  currentUserId,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onSwitchUser,
}) => {
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialRole, setModalInitialRole] = useState<UserRole>('faculty_author');
  const [userToEdit, setUserToEdit] = useState<SystemUser | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const handleOpenAddModal = (targetRole: UserRole = 'faculty_author') => {
    setUserToEdit(null);
    setModalInitialRole(targetRole);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: SystemUser) => {
    setUserToEdit(user);
    setModalInitialRole(user.role);
    setIsModalOpen(true);
  };

  const handleSaveUser = (user: SystemUser) => {
    if (userToEdit) {
      if (onUpdateUser) {
        onUpdateUser(user);
        showToast(`User account "${user.name}" updated successfully.`);
      }
    } else {
      onAddUser(user);
      showToast(`Added new ${roleMeta[user.role].label}: "${user.name}" (${user.email}).`);
    }
  };

  const handleDelete = (user: SystemUser) => {
    if (user.id === currentUserId) {
      alert('Security Protection: You cannot delete your own active administrator account.');
      return;
    }
    if (onDeleteUser) {
      onDeleteUser(user.id);
      showToast(`User account "${user.name}" removed from system.`, 'info');
    }
  };

  const roleMeta: Record<
    UserRole,
    { label: string; badgeClass: string; icon: React.ReactNode; desc: string; addLabel: string }
  > = {
    faculty_author: {
      label: 'Faculty Author',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <BookOpen className="w-4 h-4 text-emerald-700" />,
      desc: 'Authors questions across 12 BSCpE formats; specifies syllabus ILOs and Bloom cognitive taxonomy.',
      addLabel: '+ Add Author',
    },
    reviewer: {
      label: 'Reviewer / Validator',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: <CheckCircle2 className="w-4 h-4 text-amber-700" />,
      desc: 'Validates submissions in review queue; enforces rubric standards; approves or returns for revision.',
      addLabel: '+ Add Reviewer',
    },
    examiner: {
      label: 'Faculty Examiner',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: <Layers className="w-4 h-4 text-indigo-700" />,
      desc: 'Generates multi-set exam papers, Table of Specifications (TOS), and official answer keys.',
      addLabel: '+ Add Examiner',
    },
    admin: {
      label: 'System Administrator',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: <ShieldCheck className="w-4 h-4 text-purple-700" />,
      desc: 'Manages BSCpE curriculum course catalog, user roles, RBAC permissions, and security audit logs.',
      addLabel: '+ Add Admin',
    },
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        (u.title && u.title.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 bg-emerald-900 text-white rounded-xl shadow-lg flex items-center justify-between text-xs animate-in fade-in duration-200 border border-emerald-700">
          <div className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-emerald-300 hover:text-white text-xs px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Title Header with Add User Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-900 text-white rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Institutional User Accounts & Role Permissions
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Role-Based Access Control (RBAC) directory ensuring strict feature separation and security isolation across institutional roles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="add-user-by-role-btn"
            name="addUserByRole"
            type="button"
            onClick={() => handleOpenAddModal('faculty_author')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User by Role</span>
          </button>
        </div>
      </div>

      {/* Role Segregation Architecture Cards with Quick "+ Add [Role]" action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {(['faculty_author', 'reviewer', 'examiner', 'admin'] as const).map((r) => {
          const meta = roleMeta[r];
          const count = users.filter((u) => u.role === r).length;
          return (
            <div
              key={r}
              id={`role-stat-card-${r}`}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold border text-[11px] ${meta.badgeClass}`}
                  >
                    {meta.icon}
                    <span>{meta.label}</span>
                  </span>
                  <span id={`role-count-${r}`} className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {count} {count === 1 ? 'User' : 'Users'}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {meta.desc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  id={`filter-shortcut-${r}`}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  View ({count})
                </button>
                <button
                  id={`quick-add-${r}-btn`}
                  name={`quickAdd${r}`}
                  type="button"
                  onClick={() => handleOpenAddModal(r)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-semibold rounded-lg text-[11px] transition-colors"
                  title={`Add a new ${meta.label}`}
                >
                  <UserPlus className="w-3 h-3" />
                  <span>{meta.addLabel}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-users-input"
            name="searchUsers"
            type="text"
            placeholder="Search users by name, email, department, rank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Filter Role:</span>
          {(['ALL', 'faculty_author', 'reviewer', 'examiner', 'admin'] as const).map((r) => {
            const count = r === 'ALL' ? users.length : users.filter((u) => u.role === r).length;
            return (
              <button
                key={r}
                id={`filter-role-tab-${r}`}
                name="filterRoleTab"
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  roleFilter === r
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{r === 'ALL' ? 'All Roles' : roleMeta[r].label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    roleFilter === r ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table id="user-accounts-table" className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">User & Academic Profile</th>
                <th className="py-3 px-4">Role & Domain Scope</th>
                <th className="py-3 px-4">Department & Identifier</th>
                <th className="py-3 px-4">RBAC Permissions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    <p className="font-semibold text-slate-700 mb-1">No user accounts found.</p>
                    <p className="text-xs text-slate-400 mb-3">Try clearing search filters or add a new institutional user.</p>
                    <button
                      id="empty-add-user-btn"
                      type="button"
                      onClick={() => handleOpenAddModal(roleFilter === 'ALL' ? 'faculty_author' : roleFilter)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add New User</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const meta = roleMeta[user.role];
                  const isCurrent = user.id === currentUserId;
                  const permsCount = user.permissions?.length || 0;

                  return (
                    <tr key={user.id} id={`user-row-${user.id}`} data-testid={`user-row-${user.id}`} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div id={`user-avatar-${user.id}`} className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            {user.avatar || user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span id={`user-name-${user.id}`}>{user.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 border border-indigo-200 rounded text-[9px] font-bold">
                                  You (Active Admin)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span id={`user-email-${user.id}`}>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          id={`user-role-badge-${user.id}`}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold border text-[11px] ${meta.badgeClass}`}
                        >
                          {meta.icon}
                          <span>{meta.label}</span>
                        </span>
                        <div id={`user-title-${user.id}`} className="text-[11px] text-slate-600 mt-1 font-medium">
                          {user.title || user.designation}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div id={`user-dept-${user.id}`} className="text-slate-800 font-medium">{user.department}</div>
                        <div id={`user-id-badge-${user.id}`} className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {user.id}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span id={`user-perms-count-${user.id}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{permsCount} Capabilities</span>
                          </span>
                        </div>
                        <button
                          id={`inspect-rbac-btn-${user.id}`}
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 hover:underline mt-1 block"
                        >
                          Inspect RBAC Scope
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onSwitchUser && (
                            <button
                              id={`test-persona-btn-${user.id}`}
                              name="testPersona"
                              type="button"
                              onClick={() => onSwitchUser(user)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title={`Log in / test persona as ${user.name}`}
                            >
                              <LogIn className="w-3 h-3 text-slate-500" />
                              <span className="hidden xl:inline">Test Persona</span>
                            </button>
                          )}

                          <button
                            id={`edit-user-btn-${user.id}`}
                            name="editUser"
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                            title="Edit user details and role"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {onDeleteUser && (
                            <button
                              id={`delete-user-btn-${user.id}`}
                              name="deleteUser"
                              type="button"
                              onClick={() => handleDelete(user)}
                              disabled={isCurrent}
                              className={`p-1.5 rounded-lg transition-colors border border-transparent ${
                                isCurrent
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100'
                              }`}
                              title={isCurrent ? 'Cannot delete active administrator' : 'Delete user account'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Inspector Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Role & Permission Scope</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-slate-900 text-sm">{selectedUser.name}</div>
              <div className="text-slate-500">{selectedUser.email} • {selectedUser.department}</div>
              <div className="text-indigo-700 font-medium">
                Assigned Institutional Role: <strong className="font-bold">{roleMeta[selectedUser.role].label}</strong>
              </div>
              {selectedUser.password && (
                <div className="text-slate-400 font-mono text-[10px] pt-1">
                  Default Login Password: <span className="text-slate-700 font-semibold">{selectedUser.password}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Authorized Operations & Capabilities:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {(selectedUser.permissions && selectedUser.permissions.length > 0
                  ? selectedUser.permissions
                  : [
                      'Access dedicated role dashboard and assigned modules only',
                      'Perform verified tasks under institutional code of practice',
                      'Participate in Outcome-Based Education (OBE) examination processes',
                    ]
                ).map((perm, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = selectedUser;
                  setSelectedUser(null);
                  handleOpenEditModal(target);
                }}
                className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit User & Role</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        existingUsers={users}
        initialRole={modalInitialRole}
        userToEdit={userToEdit}
      />
    </div>
  );
};
