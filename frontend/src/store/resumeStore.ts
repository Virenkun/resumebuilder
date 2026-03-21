import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  Resume,
  Experience,
  Education,
  Project,
  Certification,
} from "../types/resume";
import { v4 as uuidv4 } from "uuid";

interface ResumeState {
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setResume: (resume: Resume) => void;
  updateResume: (updates: Partial<Resume>) => void;
  addExperience: (experience: Omit<Experience, "id">) => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Omit<Education, "id">) => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: (certification: Certification) => void;
  removeCertification: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResume: () => void;
  initializeEmptyResume: () => void;
}

const useResumeStore = create<ResumeState>()(
  devtools(
    persist(
      (set) => ({
        currentResume: null,
        isLoading: false,
        error: null,

        setResume: (resume) => set({ currentResume: resume, error: null }),

        updateResume: (updates) =>
          set((state) => ({
            currentResume: state.currentResume
              ? { ...state.currentResume, ...updates }
              : null,
          })),

        addExperience: (experience) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  experience: [
                    ...state.currentResume.experience,
                    { ...experience, id: uuidv4() },
                  ],
                }
              : null,
          })),

        updateExperience: (id, updates) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  experience: state.currentResume.experience.map((exp) =>
                    exp.id === id ? { ...exp, ...updates } : exp,
                  ),
                }
              : null,
          })),

        removeExperience: (id) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  experience: state.currentResume.experience.filter(
                    (exp) => exp.id !== id,
                  ),
                }
              : null,
          })),

        addEducation: (education) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  education: [
                    ...state.currentResume.education,
                    { ...education, id: uuidv4() },
                  ],
                }
              : null,
          })),

        updateEducation: (id, updates) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  education: state.currentResume.education.map((edu) =>
                    edu.id === id ? { ...edu, ...updates } : edu,
                  ),
                }
              : null,
          })),

        removeEducation: (id) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  education: state.currentResume.education.filter(
                    (edu) => edu.id !== id,
                  ),
                }
              : null,
          })),

        addProject: (project) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  projects: [
                    ...state.currentResume.projects,
                    { ...project, id: uuidv4() },
                  ],
                }
              : null,
          })),

        updateProject: (id, updates) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  projects: state.currentResume.projects.map((proj) =>
                    proj.id === id ? { ...proj, ...updates } : proj,
                  ),
                }
              : null,
          })),

        removeProject: (id) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  projects: state.currentResume.projects.filter(
                    (proj) => proj.id !== id,
                  ),
                }
              : null,
          })),

        addCertification: (certification) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  certifications: [
                    ...state.currentResume.certifications,
                    certification,
                  ],
                }
              : null,
          })),

        removeCertification: (index) =>
          set((state) => ({
            currentResume: state.currentResume
              ? {
                  ...state.currentResume,
                  certifications: state.currentResume.certifications.filter(
                    (_, i) => i !== index,
                  ),
                }
              : null,
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        clearResume: () => set({ currentResume: null, error: null }),

        initializeEmptyResume: () =>
          set({
            currentResume: {
              id: uuidv4(),
              personal: {
                name: "",
                email: "",
                phone: "",
                location: "",
              },
              experience: [],
              education: [],
              skills: {
                technical: [],
                languages: [],
                frameworks: [],
                tools: [],
              },
              projects: [],
              certifications: [],
              metadata: {},
            },
            error: null,
          }),
      }),
      {
        name: "resume-storage",
        partialize: (state) => ({ currentResume: state.currentResume }),
      },
    ),
  ),
);

export default useResumeStore;
