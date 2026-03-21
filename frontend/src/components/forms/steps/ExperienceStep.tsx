import { useState } from "react";
import useResumeStore from "../../../store/resumeStore";
import { validateExperience } from "../../../utils/validation";
import type { Experience } from "../../../types/resume";

interface ExperienceStepProps {
  onNext: () => void;
}

export default function ExperienceStep({ onNext }: ExperienceStepProps) {
  const { currentResume, addExperience, updateExperience, removeExperience } =
    useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    bullets: [""],
    keywords: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const experiences = currentResume?.experience || [];

  const handleChange = (field: keyof Experience, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...(formData.bullets || [""])];
    newBullets[index] = value;
    setFormData({ ...formData, bullets: newBullets });
  };

  const addBullet = () => {
    setFormData({ ...formData, bullets: [...(formData.bullets || [""]), ""] });
  };

  const removeBullet = (index: number) => {
    const newBullets = formData.bullets?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      bullets: newBullets.length > 0 ? newBullets : [""],
    });
  };

  const handleSave = () => {
    // Filter out empty bullets
    const cleanedData = {
      ...formData,
      bullets: formData.bullets?.filter((b) => b.trim()) || [],
    };

    const validation = validateExperience(cleanedData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editingId) {
      updateExperience(editingId, cleanedData as Experience);
      setEditingId(null);
    } else {
      addExperience(cleanedData as Omit<Experience, "id">);
    }

    // Reset form
    setFormData({
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      bullets: [""],
      keywords: [],
    });
    setErrors({});
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData(exp);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      bullets: [""],
      keywords: [],
    });
    setErrors({});
  };

  const handleContinue = () => {
    if (experiences.length === 0) {
      setErrors({ general: "Please add at least one work experience" });
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Existing Experiences */}
      {experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Your Experience</h3>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {exp.position}
                  </h4>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {exp.start_date} - {exp.end_date} • {exp.location}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.slice(0, 2).map((bullet, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        • {bullet}
                      </li>
                    ))}
                    {exp.bullets.length > 2 && (
                      <li className="text-sm text-gray-500 italic">
                        +{exp.bullets.length - 2} more bullets
                      </li>
                    )}
                  </ul>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(exp)}
                    className="text-green-700 hover:text-green-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
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
          {editingId ? "Edit Experience" : "Add Experience"}
        </h3>

        <div className="space-y-4">
          {/* Company & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.company ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Acme Corp"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.position ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Software Engineer"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="San Francisco, CA"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.start_date ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="2022-01"
              />
              <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM</p>
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.end_date ? "border-red-500" : "border-gray-300"
                }`}
                placeholder='2024-01 or "Present"'
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: YYYY-MM or "Present"
              </p>
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Bullets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Achievements & Responsibilities{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {formData.bullets?.map((bullet, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Led development of feature X, resulting in Y% improvement..."
                    rows={2}
                  />
                  {formData.bullets && formData.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBullet(index)}
                      className="text-red-600 hover:text-red-700 px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addBullet}
              className="mt-2 text-green-700 hover:text-green-800 text-sm font-medium"
            >
              + Add Another Bullet
            </button>
            {errors.bullets && (
              <p className="mt-1 text-sm text-red-600">{errors.bullets}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800"
            >
              {editingId ? "Update" : "Add"} Experience
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

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <button onClick={handleContinue} className="hidden">
        Continue
      </button>
    </div>
  );
}
