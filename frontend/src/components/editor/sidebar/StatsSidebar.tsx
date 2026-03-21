import React from "react";

export function StatsSidebar({
  resume,
  scoreData,
}: {
  resume: any;
  scoreData: any;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(153,246,228,0.40)",
        boxShadow: "0 2px 16px rgba(13,148,136,0.06)",
      }}
    >
      <h3
        className="font-bold mb-3 text-sm tracking-wide"
        style={{ color: "#1b5e20" }}
      >
        Resume Stats
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Experience entries</span>
          <span className="font-medium">{resume.experience.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Education entries</span>
          <span className="font-medium">{resume.education.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total skills</span>
          <span className="font-medium">
            {Object.values(resume.skills).flat().length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Projects</span>
          <span className="font-medium">{resume.projects.length}</span>
        </div>
        {scoreData && (
          <div className="flex justify-between pt-2 border-t">
            <span className="text-gray-600">ATS Score</span>
            <span
              className={`font-bold ${
                scoreData.score >= 80
                  ? "text-green-600"
                  : scoreData.score >= 60
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {scoreData.score}/100
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
