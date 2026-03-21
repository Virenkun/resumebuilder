import { useState } from "react";

export function ScoreTab({
  scoreData,
  scoring,
  jobDescription,
  setJobDescription,
  onScore,
}: {
  scoreData: any;
  scoring: boolean;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  onScore: () => void;
}) {
  const [scoreMode, setScoreMode] = useState<"general" | "jd">("general");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-5">
        <h3 className="font-semibold text-gray-900 mb-3">
          ATS Compatibility Score
        </h3>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setScoreMode("general");
              setJobDescription("");
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
              scoreMode === "general"
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
            }`}
          >
            General ATS Score
          </button>
          <button
            onClick={() => setScoreMode("jd")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
              scoreMode === "jd"
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
            }`}
          >
            Match to Job Description
          </button>
        </div>

        {scoreMode === "general" ? (
          <p className="text-sm text-gray-600 mb-4">
            Analyze your resume for general ATS compatibility — formatting,
            keywords, section completeness, and readability.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Paste a job description to get keyword match percentage and
              tailored recommendations.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-4"
              rows={5}
              placeholder="Paste job description here..."
            />
          </>
        )}

        <button
          onClick={onScore}
          disabled={scoring || (scoreMode === "jd" && !jobDescription.trim())}
          className="px-6 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {scoring
            ? "Analyzing..."
            : scoreMode === "jd"
              ? "Score Against JD"
              : "Analyze Resume"}
        </button>
        {scoreMode === "jd" && !jobDescription.trim() && (
          <p className="text-xs text-gray-400 mt-2">
            Paste a job description above to enable scoring.
          </p>
        )}
      </div>

      {scoreData && (
        <div className="space-y-4">
          {/* Score Display */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center gap-6">
              <div
                className={`text-5xl font-bold ${
                  scoreData.score >= 80
                    ? "text-green-600"
                    : scoreData.score >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {scoreData.score}
                <span className="text-2xl text-gray-400">/100</span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {scoreMode === "jd" ? "JD Match Score" : "General ATS Score"}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  {scoreMode === "jd"
                    ? "Scored against job description"
                    : "General ATS compatibility"}
                </p>
                {scoreData.keyword_match != null && (
                  <span className="inline-block bg-green-50 text-green-800 text-sm font-medium px-2 py-0.5 rounded">
                    Keyword Match: {scoreData.keyword_match}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Issues */}
          {scoreData.issues && (
            <div className="bg-white rounded-lg shadow-sm border p-5">
              <h4 className="font-semibold text-gray-900 mb-3">Issues</h4>

              {scoreData.issues.critical?.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-red-700 mb-1">
                    Critical
                  </h5>
                  <ul className="space-y-1">
                    {scoreData.issues.critical.map(
                      (issue: string, i: number) => (
                        <li
                          key={i}
                          className="text-sm text-red-600 pl-4 relative"
                        >
                          <span className="absolute left-0">!</span>
                          {issue}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {scoreData.issues.recommended?.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-yellow-700 mb-1">
                    Recommended
                  </h5>
                  <ul className="space-y-1">
                    {scoreData.issues.recommended.map(
                      (issue: string, i: number) => (
                        <li key={i} className="text-sm text-yellow-700 pl-4">
                          - {issue}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {scoreData.issues.optional?.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-1">
                    Optional
                  </h5>
                  <ul className="space-y-1">
                    {scoreData.issues.optional.map(
                      (issue: string, i: number) => (
                        <li key={i} className="text-sm text-gray-500 pl-4">
                          - {issue}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {scoreData.suggestions?.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-5">
              <h4 className="font-semibold text-gray-900 mb-3">Suggestions</h4>
              <ul className="space-y-2">
                {scoreData.suggestions.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700 pl-4 relative">
                    <span className="absolute left-0 text-green-500">
                      {i + 1}.
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
