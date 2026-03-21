import { useState } from "react";
import useResumeStore from "../../../store/resumeStore";

interface SkillsStepProps {
  onNext: () => void;
}

export default function SkillsStep({ onNext }: SkillsStepProps) {
  const { currentResume, updateResume } = useResumeStore();
  const [skills, setSkills] = useState(
    currentResume?.skills || {
      technical: [],
      languages: [],
      frameworks: [],
      tools: [],
    },
  );

  const [newSkill, setNewSkill] = useState({
    technical: "",
    languages: "",
    frameworks: "",
    tools: "",
  });

  const addSkill = (category: keyof typeof skills) => {
    const value = newSkill[category].trim();
    if (value && !skills[category].includes(value)) {
      setSkills({
        ...skills,
        [category]: [...skills[category], value],
      });
      setNewSkill({ ...newSkill, [category]: "" });
    }
  };

  const removeSkill = (category: keyof typeof skills, index: number) => {
    setSkills({
      ...skills,
      [category]: skills[category].filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    category: keyof typeof skills,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(category);
    }
  };

  const handleContinue = () => {
    updateResume({ skills });
    onNext();
  };

  const SkillInput = ({
    category,
    title,
    placeholder,
  }: {
    category: keyof typeof skills;
    title: string;
    placeholder: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title}
      </label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newSkill[category]}
          onChange={(e) =>
            setNewSkill({ ...newSkill, [category]: e.target.value })
          }
          onKeyPress={(e) => handleKeyPress(e, category)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => addSkill(category)}
          className="px-4 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills[category].map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(category, index)}
              className="hover:text-green-900"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Add skills relevant to your target roles. You
          can organize them by category for better readability.
        </p>
      </div>

      <SkillInput
        category="technical"
        title="Technical Skills"
        placeholder="e.g., Python, Java, Machine Learning..."
      />

      <SkillInput
        category="frameworks"
        title="Frameworks & Libraries"
        placeholder="e.g., React, Django, TensorFlow..."
      />

      <SkillInput
        category="tools"
        title="Tools & Platforms"
        placeholder="e.g., Git, Docker, AWS, Figma..."
      />

      <SkillInput
        category="languages"
        title="Languages"
        placeholder="e.g., English (Native), Spanish (Fluent)..."
      />

      <button onClick={handleContinue} className="hidden">
        Continue
      </button>
    </div>
  );
}
