import React, { useState } from 'react';
import { Course, CourseCategory, CourseTopic, UserRole } from '../../types';
import { Plus, Trash2, Edit3, BookOpen, Layers, Check, AlertCircle, X } from 'lucide-react';

interface CourseManagerProps {
  courses: Course[];
  currentRole: UserRole;
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (courseCode: string) => void;
}

export const CourseManager: React.FC<CourseManagerProps> = ({
  courses,
  currentRole,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'ALL'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // New course form state
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CourseCategory>('Programming');
  const [newDescription, setNewDescription] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newSubtopicsStr, setNewSubtopicsStr] = useState('');
  const [newTopicsList, setNewTopicsList] = useState<CourseTopic[]>([
    { id: 't1', name: 'Core Foundations', subtopics: ['Basic principles', 'System concepts'] }
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories: CourseCategory[] = [
    'Programming',
    'CE Fundamentals',
    'Computing Systems',
    'Advanced Specialized',
  ];

  const filteredCourses = courses.filter((c) =>
    selectedCategory === 'ALL' ? true : c.category === selectedCategory
  );

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    const subtopics = newSubtopicsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setNewTopicsList([
      ...newTopicsList,
      {
        id: `t${Date.now()}`,
        name: newTopicName.trim(),
        subtopics: subtopics.length > 0 ? subtopics : ['Standard Concepts'],
      },
    ]);
    setNewTopicName('');
    setNewSubtopicsStr('');
  };

  const handleSaveNewCourse = () => {
    if (!newCode.trim() || !newTitle.trim()) {
      setErrorMsg('Course Code and Course Title are required.');
      return;
    }

    if (courses.some((c) => c.code.toLowerCase() === newCode.trim().toLowerCase())) {
      setErrorMsg(`Course code '${newCode.trim()}' already exists in the catalog.`);
      return;
    }

    const courseObj: Course = {
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'BSCpE Curriculum Module.',
      topics: newTopicsList.length > 0 ? newTopicsList : [
        { id: 't1', name: 'General Topics', subtopics: ['Foundations'] }
      ],
    };

    onAddCourse(courseObj);
    setIsAddModalOpen(false);
    // Reset
    setNewCode('');
    setNewTitle('');
    setNewDescription('');
    setNewTopicsList([]);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            BSCpE Curriculum & Course Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage BSCpE degree courses, topics, subtopics, and disciplinary categories.
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            id="add-course-btn"
            name="addCourseBtn"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add BSCpE Course</span>
          </button>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs w-fit">
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Categories ({courses.length})
        </button>
        {categories.map((cat) => {
          const count = courses.filter((c) => c.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((c) => (
          <div
            key={c.code}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {c.code}
                </span>
                <span className="font-medium text-slate-600">{c.category}</span>
              </div>

              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {c.title}
              </h2>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {c.description}
              </p>

              {/* Topics list */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Course Modules & Topics ({c.topics.length})
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {c.topics.map((t) => (
                    <div key={t.id} className="text-xs text-slate-700 bg-slate-50 rounded p-1.5 border border-slate-100">
                      <div className="font-semibold text-slate-900">{t.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {t.subtopics.join(' · ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions for Admin */}
            {currentRole === 'admin' && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onDeleteCourse(c.code)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  title="Delete Course from catalog"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Add BSCpE Course to Curriculum
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Course Code
                  </label>
                  <input
                    id="course-code-input"
                    name="code"
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CPE 431"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Disciplinary Category
                  </label>
                  <select
                    id="course-category-select"
                    name="category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CourseCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Course Title
                </label>
                <input
                  id="course-title-input"
                  name="title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Robotics & Autonomous Systems"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Description / Syllabus Scope
                </label>
                <textarea
                  id="course-description-input"
                  name="description"
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Overview of course topics, prerequisites, and learning competencies..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              {/* Add Topic builder */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-700 block">Topics & Subtopics</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id="course-topic-name-input"
                    name="topicName"
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="Topic Name (e.g. Forward Kinematics)"
                    className="bg-white border border-slate-300 rounded p-1.5"
                  />
                  <input
                    id="course-subtopics-input"
                    name="subtopics"
                    type="text"
                    value={newSubtopicsStr}
                    onChange={(e) => setNewSubtopicsStr(e.target.value)}
                    placeholder="Subtopics (comma-sep)"
                    className="bg-white border border-slate-300 rounded p-1.5"
                  />
                </div>
                <button
                  id="add-topic-btn"
                  name="addTopicBtn"
                  type="button"
                  onClick={handleAddTopic}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold text-[11px]"
                >
                  + Add Topic to Course
                </button>

                {newTopicsList.length > 0 && (
                  <div className="space-y-1 pt-2">
                    {newTopicsList.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-1.5 rounded border border-slate-200 text-[11px]">
                        <span><strong>{t.name}</strong> ({t.subtopics.join(', ')})</span>
                        <button
                          type="button"
                          onClick={() => setNewTopicsList(newTopicsList.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              <button
                id="cancel-course-modal-btn"
                name="cancelCourseBtn"
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                id="save-course-modal-btn"
                name="saveCourseBtn"
                type="button"
                onClick={handleSaveNewCourse}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Save Course to Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
