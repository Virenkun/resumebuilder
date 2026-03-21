import { useState } from "react";
import apiClient from "../../../services/apiClient";
import useResumeStore from "../../../store/resumeStore";
import { ViewSection } from "../ui/ViewSection";
import { PersonalInfoSection } from "../sections/PersonalInfoSection";
import { SummarySection } from "../sections/SummarySection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { EducationSection } from "../sections/EducationSection";
import { SkillsSection } from "../sections/SkillsSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { PersonalInfoModal } from "../modals/PersonalInfoModal";
import { SummaryModal } from "../modals/SummaryModal";
import { ExperienceModal } from "../modals/ExperienceModal";
import { EducationModal } from "../modals/EducationModal";
import { SkillsModal } from "../modals/SkillsModal";
import { ProjectModal } from "../modals/ProjectModal";

export function EditTab({
  resume,
  updateResume,
}: {
  resume: any;
  updateResume: (u: any) => void;
}) {
  type ModalType =
    | "personal"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingExpIdx, setEditingExpIdx] = useState<number | null>(null);
  const [editingEduIdx, setEditingEduIdx] = useState<number | null>(null);
  const [editingProjIdx, setEditingProjIdx] = useState<number | null>(null);

  // Draft state for modals
  const [draftPersonal, setDraftPersonal] = useState<any>(null);
  const [draftSummary, setDraftSummary] = useState("");
  const [draftExperience, setDraftExperience] = useState<any>(null);
  const [draftEducation, setDraftEducation] = useState<any>(null);
  const [draftSkills, setDraftSkills] = useState<any>(null);
  const [draftProject, setDraftProject] = useState<any>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [enhancingBulletIdx, setEnhancingBulletIdx] = useState<number | null>(null);
  const [enhancedBulletIdxs, setEnhancedBulletIdxs] = useState<Set<number>>(new Set());
  const [bulletInstructions, setBulletInstructions] = useState<Record<number, string>>({});
  const [pendingEnhancements, setPendingEnhancements] = useState<Record<string, { original: string; enhanced: string }>>({});
  const [enhancingViewBullet, setEnhancingViewBullet] = useState<string | null>(null);
  const [viewPromptOpen, setViewPromptOpen] = useState<string | null>(null);
  const [viewPromptText, setViewPromptText] = useState<Record<string, string>>({});
  const { setError } = useResumeStore();

  // Open modal helpers
  const openPersonal = () => {
    setDraftPersonal({ ...resume.personal });
    setActiveModal("personal");
  };
  const openSummary = () => {
    setDraftSummary(resume.summary || "");
    setActiveModal("summary");
  };
  const openExperience = (idx?: number) => {
    if (idx !== undefined) {
      setEditingExpIdx(idx);
      setDraftExperience({
        ...resume.experience[idx],
        bullets: [...resume.experience[idx].bullets],
      });
    } else {
      setEditingExpIdx(null);
      setDraftExperience({
        company: "",
        position: "",
        location: "",
        start_date: "",
        end_date: "",
        bullets: [""],
      });
    }
    setActiveModal("experience");
  };
  const openEducation = (idx?: number) => {
    if (idx !== undefined) {
      setEditingEduIdx(idx);
      setDraftEducation({ ...resume.education[idx] });
    } else {
      setEditingEduIdx(null);
      setDraftEducation({
        institution: "",
        degree: "",
        field: "",
        location: "",
        graduation_date: "",
        gpa: "",
      });
    }
    setActiveModal("education");
  };
  const openSkills = () => {
    setDraftSkills({
      technical: [...(resume.skills.technical || [])],
      languages: [...(resume.skills.languages || [])],
      frameworks: [...(resume.skills.frameworks || [])],
      tools: [...(resume.skills.tools || [])],
    });
    setActiveModal("skills");
  };
  const openProject = (idx?: number) => {
    if (idx !== undefined) {
      setEditingProjIdx(idx);
      setDraftProject({
        ...resume.projects[idx],
        technologies: [...(resume.projects[idx].technologies || [])],
      });
    } else {
      setEditingProjIdx(null);
      setDraftProject({
        name: "",
        description: "",
        technologies: [],
        link: "",
      });
    }
    setActiveModal("projects");
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingExpIdx(null);
    setEditingEduIdx(null);
    setEditingProjIdx(null);
    setEnhancedBulletIdxs(new Set());
    setBulletInstructions({});
  };

  const enhanceSingleBullet = async (bIdx: number, instruction?: string) => {
    const bullet = draftExperience?.bullets?.[bIdx];
    if (!bullet?.trim()) return;
    setEnhancingBulletIdx(bIdx);
    try {
      const res = await apiClient.post("/api/enhance", {
        bullets: [bullet],
        ...(instruction ? { instruction } : {}),
      });
      if (res.data.success && res.data.enhanced_bullets?.[0]) {
        const bullets = [...draftExperience.bullets];
        bullets[bIdx] = res.data.enhanced_bullets[0];
        setDraftExperience({ ...draftExperience, bullets });
        setEnhancedBulletIdxs((prev) => new Set([...prev, bIdx]));
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Enhancement failed");
    } finally {
      setEnhancingBulletIdx(null);
    }
  };

  // Save handlers
  const savePersonal = () => {
    updateResume({ personal: draftPersonal });
    closeModal();
  };
  const saveSummary = () => {
    updateResume({ summary: draftSummary });
    closeModal();
  };
  const saveExperience = () => {
    const updated = [...resume.experience];
    if (editingExpIdx !== null) {
      updated[editingExpIdx] = {
        ...updated[editingExpIdx],
        ...draftExperience,
      };
    } else {
      updated.push({ ...draftExperience, id: crypto.randomUUID() });
    }
    updateResume({ experience: updated });
    closeModal();
  };
  const saveEducation = () => {
    const updated = [...resume.education];
    if (editingEduIdx !== null) {
      updated[editingEduIdx] = { ...updated[editingEduIdx], ...draftEducation };
    } else {
      updated.push({ ...draftEducation, id: crypto.randomUUID() });
    }
    updateResume({ education: updated });
    closeModal();
  };
  const saveSkills = () => {
    updateResume({ skills: draftSkills });
    closeModal();
  };
  const saveProject = () => {
    const updated = [...resume.projects];
    if (editingProjIdx !== null) {
      updated[editingProjIdx] = { ...updated[editingProjIdx], ...draftProject };
    } else {
      updated.push({ ...draftProject, id: crypto.randomUUID() });
    }
    updateResume({ projects: updated });
    closeModal();
  };

  // AI Enhance for summary
  const enhanceSummary = async () => {
    setEnhancing(true);
    try {
      const res = await apiClient.post("/api/enhance", {
        bullets: [draftSummary],
      });
      if (res.data.success && res.data.enhanced_bullets?.[0]) {
        setDraftSummary(res.data.enhanced_bullets[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Enhancement failed");
    } finally {
      setEnhancing(false);
    }
  };

  // AI Enhance for experience bullets
  const enhanceExperience = async () => {
    if (!draftExperience?.bullets?.length) return;
    setEnhancing(true);
    try {
      const res = await apiClient.post("/api/enhance", {
        bullets: draftExperience.bullets.filter((b: string) => b.trim()),
      });
      if (res.data.success && res.data.enhanced_bullets) {
        setDraftExperience({
          ...draftExperience,
          bullets: res.data.enhanced_bullets,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Enhancement failed");
    } finally {
      setEnhancing(false);
    }
  };

  // AI Enhance for project description
  const enhanceProject = async () => {
    if (!draftProject?.description) return;
    setEnhancing(true);
    try {
      const res = await apiClient.post("/api/enhance", {
        bullets: [draftProject.description],
      });
      if (res.data.success && res.data.enhanced_bullets?.[0]) {
        setDraftProject({
          ...draftProject,
          description: res.data.enhanced_bullets[0],
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Enhancement failed");
    } finally {
      setEnhancing(false);
    }
  };

  // View-mode per-bullet AI enhance
  const enhanceViewBullet = async (expIdx: number, bIdx: number, instruction?: string) => {
    const key = `${expIdx}-${bIdx}`;
    const bullet = resume.experience[expIdx]?.bullets?.[bIdx];
    if (!bullet?.trim()) return;
    setEnhancingViewBullet(key);
    setViewPromptOpen(null);
    try {
      const res = await apiClient.post("/api/enhance", {
        bullets: [bullet],
        ...(instruction ? { instruction } : {}),
      });
      if (res.data.success && res.data.enhanced_bullets?.[0]) {
        setPendingEnhancements((prev) => ({
          ...prev,
          [key]: { original: bullet, enhanced: res.data.enhanced_bullets[0] },
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Enhancement failed");
    } finally {
      setEnhancingViewBullet(null);
    }
  };

  const enhanceSummaryView = async (instruction?: string) => {
    const key = "summary";
    const text = resume.summary;
    if (!text?.trim()) return;
    setEnhancingViewBullet(key);
    setViewPromptOpen(null);
    try {
      const res = await apiClient.post("/api/enhance", {
        bullets: [text],
        ...(instruction ? { instruction } : {}),
      });
      if (res.data.success && res.data.enhanced_bullets?.[0]) {
        setPendingEnhancements((prev) => ({
          ...prev,
          [key]: { original: text, enhanced: res.data.enhanced_bullets[0] },
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Enhancement failed");
    } finally {
      setEnhancingViewBullet(null);
    }
  };

  const acceptSummaryEnhancement = () => {
    const pending = pendingEnhancements["summary"];
    if (!pending) return;
    updateResume({ summary: pending.enhanced });
    setPendingEnhancements((prev) => { const n = { ...prev }; delete n["summary"]; return n; });
  };

  const rejectSummaryEnhancement = () => {
    setPendingEnhancements((prev) => { const n = { ...prev }; delete n["summary"]; return n; });
  };

  const enhanceProjView = async (projIdx: number, instruction?: string) => {
    const key = `proj-${projIdx}`;
    const text = resume.projects[projIdx]?.description;
    if (!text?.trim()) return;
    setEnhancingViewBullet(key);
    setViewPromptOpen(null);
    try {
      const res = await apiClient.post("/api/enhance", {
        bullets: [text],
        ...(instruction ? { instruction } : {}),
      });
      if (res.data.success && res.data.enhanced_bullets?.[0]) {
        setPendingEnhancements((prev) => ({
          ...prev,
          [key]: { original: text, enhanced: res.data.enhanced_bullets[0] },
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Enhancement failed");
    } finally {
      setEnhancingViewBullet(null);
    }
  };

  const acceptProjEnhancement = (projIdx: number) => {
    const key = `proj-${projIdx}`;
    const pending = pendingEnhancements[key];
    if (!pending) return;
    const updatedProjects = [...resume.projects];
    updatedProjects[projIdx] = { ...updatedProjects[projIdx], description: pending.enhanced };
    updateResume({ projects: updatedProjects });
    setPendingEnhancements((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const rejectProjEnhancement = (projIdx: number) => {
    const key = `proj-${projIdx}`;
    setPendingEnhancements((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const acceptEnhancement = (expIdx: number, bIdx: number) => {
    const key = `${expIdx}-${bIdx}`;
    const pending = pendingEnhancements[key];
    if (!pending) return;
    const updatedExperience = [...resume.experience];
    const bullets = [...updatedExperience[expIdx].bullets];
    bullets[bIdx] = pending.enhanced;
    updatedExperience[expIdx] = { ...updatedExperience[expIdx], bullets };
    updateResume({ experience: updatedExperience });
    setPendingEnhancements((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const rejectEnhancement = (expIdx: number, bIdx: number) => {
    const key = `${expIdx}-${bIdx}`;
    setPendingEnhancements((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Delete helpers
  const deleteExperience = (idx: number) => {
    const updated = resume.experience.filter((_: any, i: number) => i !== idx);
    updateResume({ experience: updated });
  };
  const deleteEducation = (idx: number) => {
    const updated = resume.education.filter((_: any, i: number) => i !== idx);
    updateResume({ education: updated });
  };
  const deleteProject = (idx: number) => {
    const updated = resume.projects.filter((_: any, i: number) => i !== idx);
    updateResume({ projects: updated });
  };

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <ViewSection title="Personal Info" onEdit={openPersonal}>
        <PersonalInfoSection personal={resume.personal} />
      </ViewSection>

      {/* Summary */}
      <ViewSection
        title="Professional Summary"
        onEdit={openSummary}
        isEmpty={!resume.summary}
      >
        <SummarySection
          summary={resume.summary}
          pendingEnhancement={pendingEnhancements["summary"] || null}
          isEnhancing={enhancingViewBullet === "summary"}
          promptOpen={viewPromptOpen === "summary"}
          promptText={viewPromptText["summary"] || ""}
          onEnhance={() => enhanceSummaryView()}
          onTogglePrompt={() =>
            setViewPromptOpen(viewPromptOpen === "summary" ? null : "summary")
          }
          onPromptChange={(v) =>
            setViewPromptText((prev) => ({ ...prev, summary: v }))
          }
          onPromptSubmit={() => enhanceSummaryView(viewPromptText["summary"])}
          onAccept={acceptSummaryEnhancement}
          onDiscard={rejectSummaryEnhancement}
        />
      </ViewSection>

      {/* Experience */}
      <ViewSection
        title="Experience"
        onEdit={() => openExperience()}
        isEmpty={resume.experience.length === 0}
      >
        <ExperienceSection
          experience={resume.experience}
          pendingEnhancements={pendingEnhancements}
          enhancingViewBullet={enhancingViewBullet}
          viewPromptOpen={viewPromptOpen}
          viewPromptText={viewPromptText}
          onEdit={(idx) => openExperience(idx)}
          onDelete={deleteExperience}
          onAdd={() => openExperience()}
          onEnhanceBullet={enhanceViewBullet}
          onAcceptBullet={acceptEnhancement}
          onRejectBullet={rejectEnhancement}
          onToggleBulletPrompt={(key) =>
            setViewPromptOpen(viewPromptOpen === key ? null : key)
          }
          onBulletPromptChange={(key, v) =>
            setViewPromptText((prev) => ({ ...prev, [key]: v }))
          }
        />
      </ViewSection>

      {/* Education */}
      <ViewSection
        title="Education"
        onEdit={() => openEducation()}
        isEmpty={resume.education.length === 0}
      >
        <EducationSection
          education={resume.education}
          onEdit={(idx) => openEducation(idx)}
          onDelete={deleteEducation}
          onAdd={() => openEducation()}
        />
      </ViewSection>

      {/* Skills */}
      <ViewSection
        title="Skills"
        onEdit={openSkills}
        isEmpty={Object.values(resume.skills).flat().length === 0}
      >
        <SkillsSection skills={resume.skills} />
      </ViewSection>

      {/* Projects */}
      <ViewSection
        title="Projects"
        onEdit={() => openProject()}
        isEmpty={resume.projects.length === 0}
      >
        <ProjectsSection
          projects={resume.projects}
          pendingEnhancements={pendingEnhancements}
          enhancingViewBullet={enhancingViewBullet}
          viewPromptOpen={viewPromptOpen}
          viewPromptText={viewPromptText}
          onEdit={(idx) => openProject(idx)}
          onDelete={deleteProject}
          onAdd={() => openProject()}
          onEnhanceProj={enhanceProjView}
          onAcceptProj={acceptProjEnhancement}
          onRejectProj={rejectProjEnhancement}
          onToggleProjPrompt={(key) =>
            setViewPromptOpen(viewPromptOpen === key ? null : key)
          }
          onProjPromptChange={(key, v) =>
            setViewPromptText((prev) => ({ ...prev, [key]: v }))
          }
        />
      </ViewSection>

      {/* ===== MODALS ===== */}

      {/* Personal Info Modal */}
      {activeModal === "personal" && draftPersonal && (
        <PersonalInfoModal
          draft={draftPersonal}
          onChange={setDraftPersonal}
          onClose={closeModal}
          onSave={savePersonal}
        />
      )}

      {/* Summary Modal */}
      {activeModal === "summary" && (
        <SummaryModal
          draft={draftSummary}
          onChange={setDraftSummary}
          onClose={closeModal}
          onSave={saveSummary}
          onEnhance={enhanceSummary}
          enhancing={enhancing}
        />
      )}

      {/* Experience Modal */}
      {activeModal === "experience" && draftExperience && (
        <ExperienceModal
          draft={draftExperience}
          onChange={(d) => {
            // Handle bullet removal side effects inline for index adjustments
            setDraftExperience(d);
          }}
          onClose={closeModal}
          onSave={saveExperience}
          onEnhanceAll={enhanceExperience}
          enhancing={enhancing}
          enhancingBulletIdx={enhancingBulletIdx}
          enhancedBulletIdxs={enhancedBulletIdxs}
          bulletInstructions={bulletInstructions}
          onBulletInstructionChange={(idx, v) =>
            setBulletInstructions((prev) => ({ ...prev, [idx]: v }))
          }
          onEnhanceBullet={enhanceSingleBullet}
          isEditing={editingExpIdx !== null}
        />
      )}

      {/* Education Modal */}
      {activeModal === "education" && draftEducation && (
        <EducationModal
          draft={draftEducation}
          onChange={setDraftEducation}
          onClose={closeModal}
          onSave={saveEducation}
          isEditing={editingEduIdx !== null}
        />
      )}

      {/* Skills Modal */}
      {activeModal === "skills" && draftSkills && (
        <SkillsModal
          draft={draftSkills}
          onChange={setDraftSkills}
          onClose={closeModal}
          onSave={saveSkills}
        />
      )}

      {/* Project Modal */}
      {activeModal === "projects" && draftProject && (
        <ProjectModal
          draft={draftProject}
          onChange={setDraftProject}
          onClose={closeModal}
          onSave={saveProject}
          onEnhance={enhanceProject}
          enhancing={enhancing}
          isEditing={editingProjIdx !== null}
        />
      )}
    </div>
  );
}
