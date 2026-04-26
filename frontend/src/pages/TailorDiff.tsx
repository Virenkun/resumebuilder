import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../services/apiClient";
import useResumeStore from "../store/resumeStore";
import type { Resume, Experience, Project } from "../types/resume";
import { CompareCard, type Choice } from "../components/diff/CompareCard";
import {
  SummaryView,
  ExperienceView,
  EducationView,
  SkillsView,
  ProjectView,
  CertificationsView,
} from "../components/diff/renderers";
import {
  buildMergedResume,
  defaultChoices,
  isChanged,
  type SectionChoices,
} from "../components/diff/mergeUtils";

type TailorRationale = {
  summary?: string;
  experience?: Record<string, string>;
  skills?: string;
  projects?: Record<string, string>;
  education?: string;
  certifications?: string;
};

const findById = <T extends { id: string }>(arr: T[], id: string) =>
  arr?.find((x) => x.id === id);

export default function TailorDiff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setResume = useResumeStore((s) => s.setResume);

  const [original, setOriginal] = useState<Resume | null>(null);
  const [tailored, setTailored] = useState<Resume | null>(null);
  const [rationale, setRationale] = useState<TailorRationale>({});
  const [choices, setChoices] = useState<SectionChoices | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient
      .get(`/api/tailor/${id}/diff`)
      .then((res) => {
        const o: Resume = res.data.original;
        const t: Resume = res.data.tailored;
        setOriginal(o);
        setTailored(t);
        setRationale((res.data.rationale as TailorRationale) ?? {});
        setChoices(defaultChoices(o, t));
      })
      .catch((err) =>
        setError(
          err.response?.data?.detail ||
            "Could not load tailored resume. Try tailoring again.",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const merged = useMemo(() => {
    if (!original || !tailored || !choices) return null;
    return buildMergedResume(original, tailored, choices);
  }, [original, tailored, choices]);

  const setSection = (key: keyof SectionChoices, value: Choice) =>
    setChoices((c) => (c ? { ...c, [key]: value } : c));

  const setExpChoice = (expId: string, value: Choice) =>
    setChoices((c) =>
      c ? { ...c, experience: { ...c.experience, [expId]: value } } : c,
    );

  const setProjChoice = (pId: string, value: Choice) =>
    setChoices((c) =>
      c ? { ...c, projects: { ...c.projects, [pId]: value } } : c,
    );

  const acceptAll = () => {
    if (!choices) return;
    setChoices({
      summary: "tailored",
      experience: Object.fromEntries(
        Object.keys(choices.experience).map((k) => [k, "tailored" as Choice]),
      ),
      education: "tailored",
      skills: "tailored",
      projects: Object.fromEntries(
        Object.keys(choices.projects).map((k) => [k, "tailored" as Choice]),
      ),
      certifications: "tailored",
    });
  };

  const rejectAll = () => {
    if (!choices) return;
    setChoices({
      summary: "original",
      experience: Object.fromEntries(
        Object.keys(choices.experience).map((k) => [k, "original" as Choice]),
      ),
      education: "original",
      skills: "original",
      projects: Object.fromEntries(
        Object.keys(choices.projects).map((k) => [k, "original" as Choice]),
      ),
      certifications: "original",
    });
  };

  const handleSave = async () => {
    if (!id || !merged) return;
    setSaving(true);
    setError(null);
    try {
      await apiClient.put(`/api/resume/${id}`, merged);
      setResume(merged);
      navigate(`/editor/${id}`);
    } catch (err) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail;
      setError(detail || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading diff…
      </div>
    );
  }

  if (error && !original) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={() => navigate(`/editor/${id}`)}
          className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-[#163300] transition-transform hover:scale-[1.05]"
        >
          Back to editor
        </button>
      </div>
    );
  }

  if (!original || !tailored || !choices || !merged) return null;

  const expIds = Array.from(
    new Set([
      ...(tailored.experience || []).map((e) => e.id),
      ...(original.experience || []).map((e) => e.id),
    ]),
  );
  const projIds = Array.from(
    new Set([
      ...(tailored.projects || []).map((p) => p.id),
      ...(original.projects || []).map((p) => p.id),
    ]),
  );

  const summaryChanged = isChanged(original.summary, tailored.summary);
  const eduChanged = isChanged(original.education, tailored.education);
  const skillsChanged = isChanged(original.skills, tailored.skills);
  const certsChanged = isChanged(original.certifications, tailored.certifications);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-foreground">
              Review tailored changes
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick the version you want for each section, then save.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={rejectAll}
              className="inline-flex items-center rounded-full border border-[rgba(14,15,12,0.12)] bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Keep all original
            </button>
            <button
              onClick={acceptAll}
              className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-bold text-[#054d28] transition-colors hover:bg-accent"
            >
              Accept all tailored
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-bold text-[#163300] transition-transform hover:scale-[1.05] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save & open editor"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <CompareCard
            title="Summary"
            changed={summaryChanged}
            choice={choices.summary}
            onChange={(c) => setSection("summary", c)}
            rationale={rationale.summary}
            original={<SummaryView text={original.summary} />}
            tailored={<SummaryView text={tailored.summary} />}
          />

          {expIds.length > 0 && (
            <div className="space-y-4">
              <h2 className="mt-6 font-display text-2xl text-foreground">
                Experience
              </h2>
              {expIds.map((expId) => {
                const o = findById<Experience>(original.experience, expId);
                const t = findById<Experience>(tailored.experience, expId);
                const changed = isChanged(o, t);
                const title =
                  t?.position ||
                  o?.position ||
                  t?.company ||
                  o?.company ||
                  "Experience";
                return (
                  <CompareCard
                    key={expId}
                    title={title}
                    changed={changed}
                    choice={choices.experience[expId] ?? "original"}
                    onChange={(c) => setExpChoice(expId, c)}
                    rationale={rationale.experience?.[expId]}
                    original={<ExperienceView exp={o} />}
                    tailored={<ExperienceView exp={t} />}
                  />
                );
              })}
            </div>
          )}

          <CompareCard
            title="Skills"
            changed={skillsChanged}
            choice={choices.skills}
            onChange={(c) => setSection("skills", c)}
            rationale={rationale.skills}
            original={<SkillsView skills={original.skills} />}
            tailored={<SkillsView skills={tailored.skills} />}
          />

          {projIds.length > 0 && (
            <div className="space-y-4">
              <h2 className="mt-6 font-display text-2xl text-foreground">
                Projects
              </h2>
              {projIds.map((pId) => {
                const o = findById<Project>(original.projects, pId);
                const t = findById<Project>(tailored.projects, pId);
                const changed = isChanged(o, t);
                const title = t?.name || o?.name || "Project";
                return (
                  <CompareCard
                    key={pId}
                    title={title}
                    changed={changed}
                    choice={choices.projects[pId] ?? "original"}
                    onChange={(c) => setProjChoice(pId, c)}
                    rationale={rationale.projects?.[pId]}
                    original={<ProjectView proj={o} />}
                    tailored={<ProjectView proj={t} />}
                  />
                );
              })}
            </div>
          )}

          <CompareCard
            title="Education"
            changed={eduChanged}
            choice={choices.education}
            onChange={(c) => setSection("education", c)}
            rationale={rationale.education}
            original={<EducationView items={original.education} />}
            tailored={<EducationView items={tailored.education} />}
          />

          <CompareCard
            title="Certifications"
            changed={certsChanged}
            choice={choices.certifications}
            onChange={(c) => setSection("certifications", c)}
            rationale={rationale.certifications}
            original={
              <CertificationsView items={original.certifications} />
            }
            tailored={
              <CertificationsView items={tailored.certifications} />
            }
          />
        </div>
      </div>
    </div>
  );
}
