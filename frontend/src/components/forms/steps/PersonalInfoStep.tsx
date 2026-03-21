import { useState } from "react";
import useResumeStore from "../../../store/resumeStore";
import { validatePersonalInfo } from "../../../utils/validation";

interface PersonalInfoStepProps {
  onNext: () => void;
}

export default function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const { currentResume, updateResume } = useResumeStore();
  const [formData, setFormData] = useState(
    currentResume?.personal || {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePersonalInfo(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Save to store
    updateResume({ personal: formData });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email & Phone - Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="(123) 456-7890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.location ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="San Francisco, CA"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Optional Links
        </h3>

        {/* LinkedIn */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.linkedin ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://linkedin.com/in/johndoe"
          />
          {errors.linkedin && (
            <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
          )}
        </div>

        {/* GitHub */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Profile
          </label>
          <input
            type="url"
            value={formData.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.github ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://github.com/johndoe"
          />
          {errors.github && (
            <p className="mt-1 text-sm text-red-600">{errors.github}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personal Website
          </label>
          <input
            type="url"
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.website ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://johndoe.com"
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-600">{errors.website}</p>
          )}
        </div>
      </div>

      <button type="submit" className="hidden">
        Submit
      </button>
    </form>
  );
}
