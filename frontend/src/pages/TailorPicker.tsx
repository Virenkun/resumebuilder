import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Target } from "lucide-react";
import apiClient from "../services/apiClient";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FadeInUp } from "@/components/motion";

interface ResumeListItem {
  id: string;
  name: string;
}

export default function TailorPicker() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeListItem[] | null>(null);
  const [resumeId, setResumeId] = useState<string>("");
  const [jd, setJd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<{ resumes: ResumeListItem[] }>("/api/resumes")
      .then((res) => {
        const list = res.data.resumes ?? [];
        setResumes(list);
        if (list.length > 0) setResumeId(list[0].id);
      })
      .catch(() => setResumes([]));
  }, []);

  const handleTailor = async () => {
    if (!resumeId || !jd.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/api/tailor", {
        resume_id: resumeId,
        job_description: jd,
      });
      navigate(`/tailor/${resumeId}`);
    } catch (e) {
      console.error(e);
      setError("Tailoring failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <FadeInUp>
        <h1 className="font-display text-5xl text-foreground">
          Tailor to a job
        </h1>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">
          Paste a job description and we'll rewrite your resume to match — then
          show you a side-by-side diff.
        </p>
      </FadeInUp>

      <div className="shadow-ring rounded-3xl bg-card p-6">
        <div className="space-y-1.5">
          <Label>Resume</Label>
          <Select value={resumeId} onValueChange={setResumeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a resume" />
            </SelectTrigger>
            <SelectContent>
              {resumes === null && (
                <SelectItem value="loading" disabled>
                  Loading…
                </SelectItem>
              )}
              {resumes?.length === 0 && (
                <SelectItem value="none" disabled>
                  No resumes yet
                </SelectItem>
              )}
              {resumes?.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name || "Untitled"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-5 space-y-1.5">
          <Label htmlFor="jd">Job description</Label>
          <Textarea
            id="jd"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={10}
            placeholder="Paste the target job posting here…"
            className="min-h-48 resize-none"
          />
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        <Button
          onClick={handleTailor}
          disabled={!resumeId || !jd.trim() || loading}
          className="mt-5"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Tailoring…
            </>
          ) : (
            <>
              <Target className="size-4" />
              Tailor resume
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
