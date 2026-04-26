import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import useResumeStore from "../../store/resumeStore";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectsStep";
import ReviewStep from "./steps/ReviewStep";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-[#054d28]">
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <h2 className="font-display text-2xl text-foreground">
                {STEPS[currentStep].title}
              </h2>
            </div>
            <span className="text-sm font-semibold text-[#054d28]">
              {Math.round(progress)}% complete
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            {STEPS.map((step, index) => {
              const done = index < currentStep;
              const active = index === currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-xs font-bold",
                      done && "bg-primary text-[#163300]",
                      active && "bg-primary text-[#163300] ring-2 ring-primary/40 ring-offset-2 ring-offset-background",
                      !done && !active && "bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      "hidden text-xs font-semibold sm:block",
                      (done || active) ? "text-[#054d28]" : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="shadow-ring rounded-3xl bg-card p-8">
          <CurrentStepComponent onNext={handleNext} />

          <div className="mt-8 flex items-center justify-between border-t border-[rgba(14,15,12,0.08)] pt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="size-4" />
              Previous
            </Button>

            {currentStep === STEPS.length - 1 ? (
              <Button size="sm" onClick={handleComplete}>
                Complete & continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext}>
                Next step
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
