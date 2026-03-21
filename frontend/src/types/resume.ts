export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string; // YYYY-MM format
  end_date: string; // YYYY-MM or "Present"
  bullets: string[];
  keywords?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  graduation_date: string;
  gpa?: string;
  relevant_coursework?: string[];
}

export interface Skills {
  technical: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeMetadata {
  template?: string;
  lastModified?: string;
  targetJD?: string;
  atsScore?: number;
}

export interface Resume {
  id: string;
  personal: PersonalInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  certifications: Certification[];
  metadata: ResumeMetadata;
}

export interface ParseResponse {
  resume: Resume;
}

export interface EnhanceRequest {
  bullets: string[];
}

export interface EnhanceResponse {
  enhanced_bullets: string[];
}

export interface CompileRequest {
  resume_id: string;
  template: string;
}

export interface ScoreResponse {
  score: number;
  keyword_match: number;
  issues: {
    critical: string[];
    recommended: string[];
    optional: string[];
  };
  suggestions: string[];
}
