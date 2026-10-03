import React, { useState, useEffect } from 'react';
import { SystemUser, UserRole } from '../../types';
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Layers,
  X,
  UserPlus,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  Lock,
  Building,
  Mail,
  Award,
  Plus,
  Trash2,
  AlertCircle,
  Check,
} from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: SystemUser) => void;
  existingUsers: SystemUser[];
  initialRole?: UserRole;
  userToEdit?: SystemUser | null;
}

interface RolePreset {
  label: string;
  badge: string;
  icon: React.ReactNode;
  themeColor: string;
  badgeClass: string;
  cardBorder: string;
  ringColor: string;
  defaultTitle: string;
  defaultDept: string;
  description: string;
  allowedModules: string;
  defaultPermissions: string[];
}

const ROLE_PRESETS: Record<UserRole, RolePreset> = {
  faculty_author: {
    label: 'Faculty Author',
    badge: 'Faculty Author',
    icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
    themeColor: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    cardBorder: 'border-emerald-500 bg-emerald-50/40',
    ringColor: 'ring-emerald-500',
    defaultTitle: 'Assistant Professor & Course Lead',
    defaultDept: 'Computer Engineering Department',
    description: 'Authors exam items across 12 BSCpE question formats; links questions to syllabus CLOs and Bloom cognitive taxonomy.',
    allowedModules: 'Author Dashboard, Question Bank, Operations Manual',
    defaultPermissions: [
      'Create and author 12 BSCpE question types',
      'Submit questions for peer and committee review',
      'Manage personal question bank drafts',
      'Test code snippets and automated test case runners',
      'Tag Bloom Taxonomy cognitive levels and CLO rubrics',
    ],
  },
  reviewer: {
    label: 'Reviewer / Validator',
    badge: 'Reviewer / Validator',
    icon: <CheckCircle2 className="w-5 h-5 text-amber-600" />,
    themeColor: 'amber',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    cardBorder: 'border-amber-500 bg-amber-50/40',
    ringColor: 'ring-amber-500',
    defaultTitle: 'Associate Professor & Curriculum Reviewer',
    defaultDept: 'Academic Curriculum Committee',
    description: 'Validates submitted questions for syllabus alignment, Bloom taxonomy rigor, answer key accuracy, and rubric quality.',
    allowedModules: 'Validation Queue, Question Bank, Operations Manual',
    defaultPermissions: [
      'Evaluate questions in validation queue',
      'Approve, reject, or request revisions with rubrics',
      'Validate Bloom cognitive taxonomy & CLO mapping',
      'Audit test case coverage & answer keys',
      'Submit peer review recommendations and quality notes',
    ],
  },
  examiner: {
    label: 'Faculty Examiner',
    badge: 'Faculty Examiner',
    icon: <Layers className="w-5 h-5 text-indigo-600" />,
    themeColor: 'indigo',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    cardBorder: 'border-indigo-500 bg-indigo-50/40',
    ringColor: 'ring-indigo-500',
    defaultTitle: 'Senior Lecturer & Examination Officer',
    defaultDept: 'Examination & Assessment Unit',
    description: 'Generates multi-set scrambled examinations (Sets A-D), Table of Specifications (TOS), and official answer keys.',
    allowedModules: 'Exam Generator, Question Bank, Operations Manual',
    defaultPermissions: [
      'Generate multi-set exams with automated scrambling',
      'Generate Table of Specifications (TOS) matrix',
      'Custom print layout (separated exam + answer keys)',
      'Export high-definition PDF and OMR bubble sheets',
      'Configure assessment parameters and question weighting',
    ],
  },
  admin: {
    label: 'System Administrator',
    badge: 'System Administrator',
    icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
    themeColor: 'purple',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    cardBorder: 'border-purple-500 bg-purple-50/40',
    ringColor: 'ring-purple-500',
    defaultTitle: 'CpE Department Chairperson & Chief Admin',
    defaultDept: 'Computer Engineering Department',
    description: 'Full governance of the BSCpE curriculum catalog, institutional user roles, RBAC permissions, and security audit logs.',
    allowedModules: 'Admin Control Center, Curriculum, Users, Audit, Question Bank, Manual',
    defaultPermissions: [
      'Full administrative access across all modules',
      'Curriculum course catalog & syllabus management',
      'Security audit trail monitoring & user management',
      'Institutional accreditation & OBE compliance oversight',
      'Role-Based Access Control (RBAC) governance',
    ],
  },
};

const SUGGESTED_TITLES = [
  'Instructor I',
  'Instructor II',
  'Instructor III',
  'Assistant Professor',
  'Assistant Professor & Course Lead',
  'Associate Professor',
  'Associate Professor & Curriculum Reviewer',
  'Professor',
  'Senior Lecturer & Examination Officer',
  'CpE Department Chairperson & Chief Admin',
  'College Dean / Program Director',
];

const SUGGESTED_DEPARTMENTS = [
  'Computer Engineering Department',
  'Academic Curriculum Committee',
  'Examination & Assessment Unit',
  'College of Engineering & Technology',
  'Software Systems & Networks Lab',
  'Embedded Systems & Robotics Research Group',
  'Quality Assurance & Accreditation Office',
];

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingUsers,
  initialRole = 'faculty_author',
  userToEdit = null,
}) => {
  const isEditing = !!userToEdit;

  const [role, setRole] = useState<UserRole>(userToEdit?.role || initialRole);
  const [name, setName] = useState(userToEdit?.name || '');
  const [email, setEmail] = useState(userToEdit?.email || '');
  const [password, setPassword] = useState(userToEdit?.password || 'password123');
  const [showPassword, setShowPassword] = useState(false);
  const [title, setTitle] = useState(
    userToEdit?.title || ROLE_PRESETS[initialRole].defaultTitle
  );
  const [department, setDepartment] = useState(
    userToEdit?.department || ROLE_PRESETS[initialRole].defaultDept
  );
  const [avatar, setAvatar] = useState(userToEdit?.avatar || '');
  const [permissions, setPermissions] = useState<string[]>(
    userToEdit?.permissions || ROLE_PRESETS[initialRole].defaultPermissions
  );
  const [newCustomPermission, setNewCustomPermission] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or initialize state when modal opens or initialRole/userToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setRole(userToEdit.role);
        setName(userToEdit.name);
        setEmail(userToEdit.email);
        setPassword(userToEdit.password || 'password123');
        setTitle(userToEdit.title || ROLE_PRESETS[userToEdit.role].defaultTitle);
        setDepartment(userToEdit.department || ROLE_PRESETS[userToEdit.role].defaultDept);
        setAvatar(userToEdit.avatar || '');
        setPermissions(
          userToEdit.permissions && userToEdit.permissions.length > 0
            ? userToEdit.permissions
            : ROLE_PRESETS[userToEdit.role].defaultPermissions
        );
      } else {
        const targetRole = initialRole || 'faculty_author';
        setRole(targetRole);
        setName('');
        setEmail('');
        setPassword('password123');
        setTitle(ROLE_PRESETS[targetRole].defaultTitle);
        setDepartment(ROLE_PRESETS[targetRole].defaultDept);
        setAvatar('');
        setPermissions([...ROLE_PRESETS[targetRole].defaultPermissions]);
      }
      setErrors({});
      setNewCustomPermission('');
    }
  }, [isOpen, initialRole, userToEdit]);

  // When changing role in "Add" mode, optionally update defaults if untouched
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (!isEditing) {
      const preset = ROLE_PRESETS[newRole];
      setTitle(preset.defaultTitle);
      setDepartment(preset.defaultDept);
      setPermissions([...preset.defaultPermissions]);
    }
  };

  // Derive initials from name if avatar is not manually set
  const computeInitials = (fullName: string) => {
    const parts = fullName
      .replace(/^(Engr\.|Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return 'US';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setShowPassword(true);
  };

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleAddCustomPermission = () => {
    const trimmed = newCustomPermission.trim();
    if (!trimmed) return;
    if (!permissions.includes(trimmed)) {
      setPermissions([...permissions, trimmed]);
    }
    setNewCustomPermission('');
  };

  const handleRemovePermission = (perm: string) => {
    setPermissions(permissions.filter((p) => p !== perm));
  };

  const handleResetToRoleDefaults = () => {
    setPermissions([...ROLE_PRESETS[role].defaultPermissions]);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Institutional email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. user@univ.edu.ph).';
    } else {
      // Check duplicate email
      const normalized = email.trim().toLowerCase();
      const duplicate = existingUsers.find(
        (u) => u.email.toLowerCase() === normalized && u.id !== userToEdit?.id
      );
      if (duplicate) {
        newErrors.email = `Email is already in use by ${duplicate.name} (${duplicate.role}).`;
      }
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!department.trim()) {
      newErrors.department = 'Department is required.';
    }

    if (permissions.length === 0) {
      newErrors.permissions = 'User must have at least one assigned RBAC permission.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const initials = avatar.trim() || computeInitials(name);
    const userId =
      userToEdit?.id ||
      `user-${role.replace('_', '-')}-${Date.now().toString().slice(-5)}`;

    const savedUser: SystemUser = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role,
      title: title.trim() || ROLE_PRESETS[role].defaultTitle,
      designation: ROLE_PRESETS[role].label,
      department: department.trim() || ROLE_PRESETS[role].defaultDept,
      avatar: initials,
      permissions: permissions.length > 0 ? permissions : ROLE_PRESETS[role].defaultPermissions,
    };

    onSave(savedUser);
    onClose();
  };

  if (!isOpen) return null;

  const currentPreset = ROLE_PRESETS[role];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                {isEditing ? 'Edit Institutional User & Role' : 'Add Institutional User by Role'}
              </h2>
              <p className="text-xs text-slate-300">
                Configure account identity, institutional role segregation, and RBAC permissions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="add-user-form" name="addUserForm" onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-xs">
          {/* STEP 1: ROLE SELECTION (KEY REQUIREMENT: ADD USERS BASE ON ROLE) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>1. Select Institutional Role & Boundary</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Assigns access sandbox & capability scope
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {(['faculty_author', 'reviewer', 'examiner', 'admin'] as const).map((r) => {
                const preset = ROLE_PRESETS[r];
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    id={`role-select-${r}`}
                    name="roleOption"
                    data-role={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? `${preset.cardBorder} ring-2 ${preset.ringColor} shadow-xs`
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="p-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                          {preset.icon}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-slate-900 text-xs mb-1">
                        {preset.label}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${preset.badgeClass}`}>
                        {preset.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Role Context & Boundary Banner */}
            <div id="role-context-banner" className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-600">
              <span className="shrink-0 mt-0.5">{currentPreset.icon}</span>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800">
                  {currentPreset.label} Domain Scope:
                </span>{' '}
                <span>{currentPreset.description}</span>
                <div className="text-[10px] text-indigo-700 font-medium pt-0.5">
                  Permitted Modules: <strong>{currentPreset.allowedModules}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: USER PROFILE & CREDENTIALS */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Identity & Institutional Profile</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="user-name-input" className="block text-slate-700 font-semibold mb-1">
                  Full Name & Academic Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="user-name-input"
                  name="name"
                  type="text"
                  placeholder="e.g., Engr. Alex Rivera, MEng CpE"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.name && (
                  <p id="error-user-name" className="text-rose-600 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Institutional Email */}
              <div>
                <label htmlFor="user-email-input" className="block text-slate-700 font-semibold mb-1">
                  Institutional Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="user-email-input"
                    name="email"
                    type="email"
                    placeholder="e.g., alex.rivera@univ.edu.ph"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                      errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p id="error-user-email" className="text-rose-600 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Title / Academic Rank */}
              <div>
                <label htmlFor="user-title-input" className="block text-slate-700 font-semibold mb-1">
                  Academic Rank / Faculty Position
                </label>
                <div className="space-y-1.5">
                  <input
                    id="user-title-input"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Assistant Professor & Course Lead"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_TITLES.slice(0, 4).map((sugg, idx) => (
                      <button
                        key={sugg}
                        id={`sugg-title-btn-${idx}`}
                        type="button"
                        onClick={() => setTitle(sugg)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px]"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department */}
              <div>
                <label htmlFor="user-department-input" className="block text-slate-700 font-semibold mb-1">
                  Department / Institutional Unit <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-1.5">
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="user-department-input"
                      name="department"
                      type="text"
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        if (errors.department) setErrors({ ...errors, department: '' });
                      }}
                      placeholder="e.g., Computer Engineering Department"
                      className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                        errors.department ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_DEPARTMENTS.slice(0, 3).map((dept, idx) => (
                      <button
                        key={dept}
                        id={`sugg-dept-btn-${idx}`}
                        type="button"
                        onClick={() => setDepartment(dept)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px]"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.department && (
                  <p id="error-user-department" className="text-rose-600 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.department}</span>
                  </p>
                )}
              </div>

              {/* Password & Credential */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="user-password-input" className="text-slate-700 font-semibold">
                    Account Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    id="generate-password-btn"
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="user-password-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Enter account password"
                    className={`w-full pl-3 pr-9 py-2 bg-slate-50 border rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                      errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  <button
                    id="toggle-password-visibility-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Default institutional password is <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">password123</code>.
                </p>
                {errors.password && (
                  <p id="error-user-password" className="text-rose-600 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Avatar Initials */}
              <div>
                <label htmlFor="user-avatar-input" className="block text-slate-700 font-semibold mb-1">
                  Avatar Monogram Initials
                </label>
                <div className="flex items-center gap-2">
                  <div id="avatar-preview-box" className="w-9 h-9 rounded-lg bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {avatar.trim() || (name.trim() ? computeInitials(name) : 'US')}
                  </div>
                  <input
                    id="user-avatar-input"
                    name="avatar"
                    type="text"
                    maxLength={3}
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value.toUpperCase())}
                    placeholder={name.trim() ? computeInitials(name) : 'e.g. AR'}
                    className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs uppercase focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">
                    Auto-generated from user name
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: ROLE-BASED ACCESS CONTROL (RBAC) CAPABILITIES */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>3. Role-Based Permissions & Capabilities</span>
                <span className="text-rose-500">*</span>
              </label>
              <button
                id="reset-permissions-btn"
                type="button"
                onClick={handleResetToRoleDefaults}
                className="text-[10px] text-slate-500 hover:text-indigo-600 font-medium"
              >
                Reset to {currentPreset.label} Defaults
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Check all authorized capabilities granted to this user under institutional compliance policies.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentPreset.defaultPermissions.map((perm, idx) => {
                  const isChecked = permissions.includes(perm);
                  return (
                    <label
                      key={perm}
                      htmlFor={`permission-checkbox-${idx}`}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer border text-[11px] transition-colors ${
                        isChecked
                          ? 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                          : 'bg-transparent border-transparent text-slate-500 hover:bg-white/60'
                      }`}
                    >
                      <input
                        id={`permission-checkbox-${idx}`}
                        name="permissions"
                        type="checkbox"
                        value={perm}
                        checked={isChecked}
                        onChange={() => togglePermission(perm)}
                        className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="leading-snug">{perm}</span>
                    </label>
                  );
                })}
              </div>

              {/* Any additional custom permissions */}
              {permissions.filter((p) => !currentPreset.defaultPermissions.includes(p)).length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Custom Granted Privileges:
                  </div>
                  <div className="space-y-1">
                    {permissions
                      .filter((p) => !currentPreset.defaultPermissions.includes(p))
                      .map((customP, idx) => (
                        <div
                          key={customP}
                          id={`custom-perm-row-${idx}`}
                          className="flex items-center justify-between px-2.5 py-1.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-900 text-[11px]"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span>{customP}</span>
                          </span>
                          <button
                            id={`remove-custom-perm-btn-${idx}`}
                            type="button"
                            onClick={() => handleRemovePermission(customP)}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                            title="Remove permission"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Add Custom Permission Input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="custom-permission-input"
                  name="customPermission"
                  type="text"
                  placeholder="Add custom departmental authorization..."
                  value={newCustomPermission}
                  onChange={(e) => setNewCustomPermission(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomPermission();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  id="add-custom-permission-btn"
                  type="button"
                  onClick={handleAddCustomPermission}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {errors.permissions && (
              <p id="error-permissions" className="text-rose-600 text-[10px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.permissions}</span>
              </p>
            )}
          </div>

          {/* STEP 4: PREVIEW CARD */}
          <div id="credential-preview-card" className="bg-slate-900 text-white p-4 rounded-xl space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-400">
                Institutional Credential Preview
              </span>
              <span>Role: <strong className="text-white">{currentPreset.label}</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-sm shrink-0">
                {avatar.trim() || (name.trim() ? computeInitials(name) : 'US')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm truncate">
                  {name.trim() || 'New User Account'}
                </div>
                <div className="text-[11px] text-slate-300 truncate">
                  {email.trim() || 'user@univ.edu.ph'} • {title || currentPreset.defaultTitle}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {department || currentPreset.defaultDept}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${currentPreset.badgeClass}`}>
                  {currentPreset.badge}
                </span>
                <div className="text-[10px] text-emerald-400 mt-1">
                  {permissions.length} Privileges Active
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <button
            id="cancel-user-modal-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            id="submit-user-btn"
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isEditing ? 'Save Account Changes' : `Add ${currentPreset.label}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
