import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useResumeStore from "../../store/resumeStore";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectsStep";
import ReviewStep from "./steps/ReviewStep";

const STEPS = [
  { id: "personal", title: "Personal Info", component: PersonalInfoStep },
  { id: "experience", title: "Experience", component: ExperienceStep },
  { id: "education", title: "Education", component: EducationStep },
  { id: "skills", title: "Skills", component: SkillsStep },
  { id: "projects", title: "Projects", component: ProjectsStep },
  { id: "review", title: "Review", component: ReviewStep },
];

export default function ResumeForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { currentResume, initializeEmptyResume } = useResumeStore();

  if (!currentResume) {
    initializeEmptyResume();
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleComplete = () => navigate("/editor");

  const CurrentStepComponent = STEPS[currentStep].component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen py-10" style={{ background: "linear-gradient(135deg, #f8f5f0 0%, #e8f5e9 100%)" }}>
      <div className="max-w-4xl mx-auto px-4">

        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: "#2e7d32" }}>
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <h2 className="text-xl font-bold" style={{ color: "#1b5e20" }}>
                {STEPS[currentStep].title}
              </h2>
            </div>
            <span className="text-sm font-semibold" style={{ color: "#2e7d32" }}>
              {Math.round(progress)}% complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full" style={{ background: "#e0d6c9" }}>
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #2e7d32, #4caf50)" }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-between mt-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: index < currentStep ? "#2e7d32" : index === currentStep ? "#2e7d32" : "#e0d6c9",
                    color: index <= currentStep ? "#ffffff" : "#a1887f",
                    boxShadow: index === currentStep ? "0 0 0 3px rgba(46,125,50,0.20)" : "none",
                  }}
                >
                  {index < currentStep ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block" style={{ color: index <= currentStep ? "#2e7d32" : "#a1887f" }}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(153,246,228,0.40)",
            boxShadow: "0 4px 24px rgba(46,125,50,0.08), 0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <CurrentStepComponent onNext={handleNext} />

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center pt-6" style={{ borderTop: "1px solid #e0d6c9" }}>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: "rgba(46,125,50,0.08)", color: "#2e7d32", border: "1px solid rgba(46,125,50,0.20)" }}
            >
              ← Previous
            </button>

            {currentStep === STEPS.length - 1 ? (
              <button
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: "linear-gradient(135deg, #2e7d32, #388e3c)" }}
              >
                Complete & Continue →
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: "#2e7d32" }}
              >
                Next Step →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
