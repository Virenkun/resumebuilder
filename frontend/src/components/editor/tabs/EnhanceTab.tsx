export function EnhanceTab({
  resume,
  enhancingIndex,
  onEnhance,
}: {
  resume: any;
  enhancingIndex: number | null;
  onEnhance: (idx: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>AI Enhancement</strong> rewrites your bullet points with
          stronger action verbs, quantified impact, and the STAR method. Click
          "Enhance" on any experience to improve it.
        </p>
      </div>

      {resume.experience.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500">
            No experience entries to enhance. Add experience first.
          </p>
        </div>
      ) : (
        resume.experience.map((exp: any, idx: number) => (
          <div
            key={exp.id}
            className="bg-white rounded-lg shadow-sm border p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{exp.position}</h4>
                <p className="text-sm text-gray-600">{exp.company}</p>
              </div>
              <button
                onClick={() => onEnhance(idx)}
                disabled={enhancingIndex !== null}
                className="px-4 py-1.5 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50"
              >
                {enhancingIndex === idx ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Enhancing...
                  </span>
                ) : (
                  "Enhance"
                )}
              </button>
            </div>
            <ul className="space-y-2">
              {exp.bullets.map((bullet: string, bIdx: number) => (
                <li key={bIdx} className="text-sm text-gray-700 pl-4 relative">
                  <span className="absolute left-0 text-green-400">-</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
