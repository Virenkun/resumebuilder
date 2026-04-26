import { useState } from 'react';
import useResumeStore from '../../../store/resumeStore';
import { validateProject } from '../../../utils/validation';
import type { Project } from '../../../types/resume';

interface ProjectsStepProps {
  onNext: () => void;
}

export default function ProjectsStep({ onNext }: ProjectsStepProps) {
  const { currentResume, addProject, updateProject, removeProject } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    technologies: [],
    link: '',
  });
  const [newTech, setNewTech] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const projects = currentResume?.projects || [];

  const handleChange = (field: keyof Project, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const addTechnology = () => {
    const value = newTech.trim();
    if (value && !formData.technologies?.includes(value)) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), value],
      });
      setNewTech('');
      if (errors.technologies) {
        setErrors({ ...errors, technologies: '' });
      }
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((_, i) => i !== index) || [],
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  const handleSave = () => {
    const validation = validateProject(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editingId) {
      updateProject(editingId, formData as Project);
      setEditingId(null);
    } else {
      addProject(formData as Omit<Project, 'id'>);
    }

    setFormData({ name: '', description: '', technologies: [], link: '' });
    setNewTech('');
    setErrors({});
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', technologies: [], link: '' });
    setNewTech('');
    setErrors({});
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/40 bg-secondary/40 p-4">
        <p className="text-sm text-[#054d28]">
          <strong className="font-bold">Tip:</strong> Projects are optional but highly recommended for students and early-career professionals. Include personal projects, open-source contributions, or academic projects.
        </p>
      </div>

      {/* Existing Projects */}
      {projects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Your Projects</h3>
          {projects.map((project) => (
            <div
              key={project.id}
              className="shadow-ring rounded-2xl bg-card p-4 transition-colors hover:shadow-ring-green"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-[#054d28]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <p className="mt-1 text-sm text-[#054d28]">{project.link}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="text-sm font-semibold text-[#054d28] hover:text-[#163300]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProject(project.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingId ? 'Edit Project' : 'Add Project'}
        </h3>

        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="E-commerce Platform"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Built a full-stack e-commerce platform with user authentication, product catalog, and payment processing..."
              rows={3}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies Used <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="e.g., React, Node.js, PostgreSQL..."
              />
              <button
                type="button"
                onClick={addTechnology}
                className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-[#163300] transition-transform hover:scale-[1.05] active:scale-[0.95]"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies?.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-[#054d28]"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="hover:text-[#163300]"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            {errors.technologies && <p className="mt-1 text-sm text-red-600">{errors.technologies}</p>}
          </div>

          {/* Project Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Link <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => handleChange('link', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                errors.link ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://github.com/username/project"
            />
            {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-[#163300] transition-transform hover:scale-[1.05] active:scale-[0.95]"
            >
              {editingId ? 'Update' : 'Add'} Project
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <button onClick={handleContinue} className="hidden">Continue</button>
    </div>
  );
}
