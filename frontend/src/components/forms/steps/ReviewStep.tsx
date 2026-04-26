import useResumeStore from '../../../store/resumeStore';

interface ReviewStepProps {
  onNext: () => void;
}

export default function ReviewStep({ onNext }: ReviewStepProps) {
  const { currentResume } = useResumeStore();

  if (!currentResume) {
    return <p className="text-gray-500">No resume data to review.</p>;
  }

  const { personal, experience, education, skills, projects } = currentResume;

  const Section = ({ title, children, isEmpty }: { title: string; children: React.ReactNode; isEmpty?: boolean }) => (
    <div className="border border-gray-200 rounded-lg p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      {isEmpty ? (
        <p className="text-sm text-gray-400 italic">No entries added</p>
      ) : (
        children
      )}
    </div>
  );

  const hasSkills = Object.values(skills).some(arr => arr.length > 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/40 bg-secondary/40 p-4">
        <p className="text-sm text-[#054d28]">
          <strong className="font-bold">Review your resume</strong> before continuing. You can go back to any step to make changes.
        </p>
      </div>

      {/* Personal Info */}
      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Name:</span>{' '}
            <span className="font-medium text-gray-900">{personal.name || '---'}</span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>{' '}
            <span className="font-medium text-gray-900">{personal.email || '---'}</span>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>{' '}
            <span className="font-medium text-gray-900">{personal.phone || '---'}</span>
          </div>
          <div>
            <span className="text-gray-500">Location:</span>{' '}
            <span className="font-medium text-gray-900">{personal.location || '---'}</span>
          </div>
          {personal.linkedin && (
            <div>
              <span className="text-gray-500">LinkedIn:</span>{' '}
              <span className="font-medium text-gray-900">{personal.linkedin}</span>
            </div>
          )}
          {personal.github && (
            <div>
              <span className="text-gray-500">GitHub:</span>{' '}
              <span className="font-medium text-gray-900">{personal.github}</span>
            </div>
          )}
          {personal.website && (
            <div className="md:col-span-2">
              <span className="text-gray-500">Website:</span>{' '}
              <span className="font-medium text-gray-900">{personal.website}</span>
            </div>
          )}
        </div>
      </Section>

      {/* Experience */}
      <Section title="Experience" isEmpty={experience.length === 0}>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="border-l-2 border-primary pl-4">
              <h4 className="font-semibold text-gray-900">{exp.position}</h4>
              <p className="text-sm text-gray-600">
                {exp.company} &bull; {exp.location}
              </p>
              <p className="text-xs text-gray-500">
                {exp.start_date} - {exp.end_date}
              </p>
              <ul className="mt-2 space-y-1">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="text-sm text-gray-700">&bull; {bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section title="Education" isEmpty={education.length === 0}>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="border-l-2 border-primary pl-4">
              <h4 className="font-semibold text-gray-900">
                {edu.degree} in {edu.field}
              </h4>
              <p className="text-sm text-gray-600">
                {edu.institution} &bull; {edu.location}
              </p>
              <p className="text-xs text-gray-500">Graduated: {edu.graduation_date}</p>
              {edu.gpa && (
                <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills" isEmpty={!hasSkills}>
        <div className="space-y-3">
          {skills.technical.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Technical: </span>
              <span className="text-sm text-gray-600">{skills.technical.join(', ')}</span>
            </div>
          )}
          {skills.frameworks.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Frameworks: </span>
              <span className="text-sm text-gray-600">{skills.frameworks.join(', ')}</span>
            </div>
          )}
          {skills.tools.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Tools: </span>
              <span className="text-sm text-gray-600">{skills.tools.join(', ')}</span>
            </div>
          )}
          {skills.languages.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Languages: </span>
              <span className="text-sm text-gray-600">{skills.languages.join(', ')}</span>
            </div>
          )}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects" isEmpty={projects.length === 0}>
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="border-l-2 border-primary pl-4">
              <h4 className="font-semibold text-gray-900">{project.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-[#054d28]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {project.link && (
                <p className="text-xs text-[#054d28] mt-1">{project.link}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <button onClick={onNext} className="hidden">Continue</button>
    </div>
  );
}
