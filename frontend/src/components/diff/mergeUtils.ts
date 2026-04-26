import type { Resume, Experience, Project } from "../../types/resume";
import type { Choice } from "./CompareCard";

export type SectionChoices = {
  summary: Choice;
  experience: Record<string, Choice>;
  education: Choice;
  skills: Choice;
  projects: Record<string, Choice>;
  certifications: Choice;
};

const stableStringify = (v: unknown): string => {
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  if (v && typeof v === "object") {
    const keys = Object.keys(v as object).sort();
    return `{${keys
      .map((k) => `${k}:${stableStringify((v as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(v ?? null);
};

export const isChanged = (a: unknown, b: unknown) =>
  stableStringify(a) !== stableStringify(b);

const indexById = <T extends { id: string }>(arr: T[]): Record<string, T> =>
  Object.fromEntries((arr || []).map((x) => [x.id, x]));

export function defaultChoices(
  original: Resume,
  tailored: Resume,
): SectionChoices {
  const expOrig = indexById(original.experience || []);
  const expTail = indexById(tailored.experience || []);
  const projOrig = indexById(original.projects || []);
  const projTail = indexById(tailored.projects || []);

  const experience: Record<string, Choice> = {};
  for (const id of new Set([
    ...Object.keys(expOrig),
    ...Object.keys(expTail),
  ])) {
    const o = expOrig[id];
    const t = expTail[id];
    experience[id] = isChanged(o, t) && t ? "tailored" : "original";
  }

  const projects: Record<string, Choice> = {};
  for (const id of new Set([
    ...Object.keys(projOrig),
    ...Object.keys(projTail),
  ])) {
    const o = projOrig[id];
    const t = projTail[id];
    projects[id] = isChanged(o, t) && t ? "tailored" : "original";
  }

  return {
    summary:
      isChanged(original.summary, tailored.summary) && tailored.summary
        ? "tailored"
        : "original",
    experience,
    education: isChanged(original.education, tailored.education)
      ? "tailored"
      : "original",
    skills: isChanged(original.skills, tailored.skills)
      ? "tailored"
      : "original",
    projects,
    certifications: isChanged(original.certifications, tailored.certifications)
      ? "tailored"
      : "original",
  };
}

const pickEntry = <T extends { id: string }>(
  id: string,
  origIdx: Record<string, T>,
  tailIdx: Record<string, T>,
  choice: Choice,
): T | undefined =>
  choice === "tailored" ? tailIdx[id] || origIdx[id] : origIdx[id] || tailIdx[id];

export function buildMergedResume(
  original: Resume,
  tailored: Resume,
  choices: SectionChoices,
): Resume {
  const expOrig = indexById(original.experience || []);
  const expTail = indexById(tailored.experience || []);
  const projOrig = indexById(original.projects || []);
  const projTail = indexById(tailored.projects || []);

  const experienceIds = (tailored.experience || []).map((e) => e.id);
  for (const id of Object.keys(expOrig))
    if (!experienceIds.includes(id)) experienceIds.push(id);

  const projectIds = (tailored.projects || []).map((p) => p.id);
  for (const id of Object.keys(projOrig))
    if (!projectIds.includes(id)) projectIds.push(id);

  const experience: Experience[] = experienceIds
    .map((id) =>
      pickEntry(id, expOrig, expTail, choices.experience[id] ?? "original"),
    )
    .filter((x): x is Experience => Boolean(x));

  const projects: Project[] = projectIds
    .map((id) =>
      pickEntry(id, projOrig, projTail, choices.projects[id] ?? "original"),
    )
    .filter((x): x is Project => Boolean(x));

  return {
    ...original,
    summary:
      choices.summary === "tailored" ? tailored.summary : original.summary,
    experience,
    education:
      choices.education === "tailored"
        ? tailored.education
        : original.education,
    skills: choices.skills === "tailored" ? tailored.skills : original.skills,
    projects,
    certifications:
      choices.certifications === "tailored"
        ? tailored.certifications
        : original.certifications,
    metadata: {
      ...original.metadata,
      ...tailored.metadata,
      lastModified: new Date().toISOString(),
    },
  };
}
