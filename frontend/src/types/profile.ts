export type ExperienceLevel =
  | "student"
  | "entry"
  | "mid"
  | "senior"
  | "lead"
  | "executive";

export type PrimaryGoal =
  | "first_job"
  | "new_job"
  | "career_switch"
  | "promotion"
  | "freelance"
  | "exploring";

export interface UserProfile {
  user_id: string;
  full_name: string | null;
  target_role: string | null;
  experience_level: ExperienceLevel | null;
  years_experience: number | null;
  industry: string | null;
  primary_goal: PrimaryGoal | null;
  skills: string[];
  onboarding_resume_id: string | null;
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const PRIMARY_GOAL_OPTIONS: { value: PrimaryGoal; label: string; description: string }[] = [
  { value: "first_job", label: "Landing my first job", description: "Student or recent graduate" },
  { value: "new_job", label: "Finding a new role", description: "Actively looking for the next step" },
  { value: "career_switch", label: "Switching careers", description: "Moving into a different field" },
  { value: "promotion", label: "Going for a promotion", description: "Leveling up within my career path" },
  { value: "freelance", label: "Freelance or contract", description: "Project-based opportunities" },
  { value: "exploring", label: "Just exploring", description: "Keeping options open" },
];

export const EXPERIENCE_LEVEL_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

export const INDUSTRY_OPTIONS: string[] = [
  "Tech",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Consulting",
  "Media",
  "Government",
  "Other",
];
