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
          className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => addSkill(category)}
          className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-[#163300] transition-transform hover:scale-[1.05] active:scale-[0.95]"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills[category].map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-[#054d28]"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(category, index)}
              className="hover:text-[#163300]"
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
      <div className="rounded-2xl border border-primary/40 bg-secondary/40 p-4">
        <p className="text-sm text-[#054d28]">
          <strong className="font-bold">Tip:</strong> Add skills relevant to
          your target roles. You can organize them by category for better
          readability.
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
