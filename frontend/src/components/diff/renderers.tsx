import type {
  Experience,
  Education,
  Project,
  Skills,
  Certification,
} from "../../types/resume";

const Empty = () => <span className="italic text-gray-400">— empty —</span>;

export function SummaryView({ text }: { text?: string }) {
  if (!text) return <Empty />;
  return <p className="whitespace-pre-wrap text-gray-800">{text}</p>;
}

export function ExperienceView({ exp }: { exp?: Experience }) {
  if (!exp) return <Empty />;
  return (
    <div>
      <div className="font-medium text-gray-900">{exp.position}</div>
      <div className="text-gray-600">
        {exp.company}
        {exp.location ? ` · ${exp.location}` : ""}
      </div>
      <div className="text-xs text-gray-400 mb-2">
        {exp.start_date} – {exp.end_date}
      </div>
      {exp.bullets?.length ? (
        <ul className="list-disc pl-5 space-y-1 text-gray-800">
          {exp.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : (
        <Empty />
      )}
    </div>
  );
}

export function EducationView({ items }: { items: Education[] }) {
  if (!items?.length) return <Empty />;
  return (
    <ul className="space-y-3">
      {items.map((e) => (
        <li key={e.id}>
          <div className="font-medium text-gray-900">{e.institution}</div>
          <div className="text-gray-700">
            {e.degree}
            {e.field ? ` in ${e.field}` : ""}
          </div>
          <div className="text-xs text-gray-400">{e.graduation_date}</div>
        </li>
      ))}
    </ul>
  );
}

export function SkillsView({ skills }: { skills: Skills }) {
  const buckets: Array<[string, string[]]> = [
    ["Technical", skills.technical || []],
    ["Frameworks", skills.frameworks || []],
    ["Tools", skills.tools || []],
    ["Languages", skills.languages || []],
  ];
  const hasAny = buckets.some(([, v]) => v.length);
  if (!hasAny) return <Empty />;
  return (
    <div className="space-y-2">
      {buckets.map(([label, items]) =>
        items.length ? (
          <div key={label}>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              {label}
            </div>
            <div className="flex flex-wrap gap-1">
              {items.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}

export function ProjectView({ proj }: { proj?: Project }) {
  if (!proj) return <Empty />;
  return (
    <div>
      <div className="font-medium text-gray-900">{proj.name}</div>
      <p className="text-gray-800 mb-1">{proj.description}</p>
      {proj.technologies?.length ? (
        <div className="flex flex-wrap gap-1">
          {proj.technologies.map((t, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CertificationsView({ items }: { items: Certification[] }) {
  if (!items?.length) return <Empty />;
  return (
    <ul className="space-y-2">
      {items.map((c, i) => (
        <li key={i}>
          <div className="font-medium text-gray-900">{c.name}</div>
          <div className="text-xs text-gray-500">
            {c.issuer}
            {c.date ? ` · ${c.date}` : ""}
          </div>
        </li>
      ))}
    </ul>
  );
}
