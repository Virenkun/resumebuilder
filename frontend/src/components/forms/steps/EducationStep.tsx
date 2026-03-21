import { useState } from 'react';
import useResumeStore from '../../../store/resumeStore';
import { validateEducation } from '../../../utils/validation';
import type { Education } from '../../../types/resume';

interface EducationStepProps {
  onNext: () => void;
}

export default function EducationStep({ onNext }: EducationStepProps) {
  const { currentResume, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    field: '',
    location: '',
    graduation_date: '',
    gpa: '',
    relevant_coursework: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const educationList = currentResume?.education || [];

  const handleChange = (field: keyof Education, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSave = () => {
    const validation = validateEducation(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editingId) {
      updateEducation(editingId, formData as Education);
      setEditingId(null);
    } else {
      addEducation(formData as Omit<Education, 'id'>);
    }

    setFormData({
      institution: '',
      degree: '',
      field: '',
      location: '',
      graduation_date: '',
      gpa: '',
      relevant_coursework: [],
    });
    setErrors({});
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData(edu);
  };

  const handleContinue = () => {
    if (educationList.length === 0) {
      setErrors({ general: 'Please add at least one education entry' });
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Existing Education */}
      {educationList.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Your Education</h3>
          {educationList.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">
                    {edu.graduation_date} • {edu.location}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(edu)}
                    className="text-green-700 hover:text-green-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
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
      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingId ? 'Edit Education' : 'Add Education'}
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.institution ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Stanford University"
          />
          {errors.institution && <p className="mt-1 text-sm text-red-600">{errors.institution}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Degree <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.degree ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Bachelor of Science"
            />
            {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field of Study <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.field}
              onChange={(e) => handleChange('field', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.field ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Computer Science"
            />
            {errors.field && <p className="mt-1 text-sm text-red-600">{errors.field}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Palo Alto, CA"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.graduation_date}
              onChange={(e) => handleChange('graduation_date', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.graduation_date ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="2024-05"
            />
            <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM</p>
            {errors.graduation_date && <p className="mt-1 text-sm text-red-600">{errors.graduation_date}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GPA (Optional)
          </label>
          <input
            type="text"
            value={formData.gpa || ''}
            onChange={(e) => handleChange('gpa', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="3.8/4.0"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800"
        >
          {editingId ? 'Update' : 'Add'} Education
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({
                institution: '',
                degree: '',
                field: '',
                location: '',
                graduation_date: '',
                gpa: '',
                relevant_coursework: [],
              });
            }}
            className="ml-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <button onClick={handleContinue} className="hidden">Continue</button>
    </div>
  );
}
