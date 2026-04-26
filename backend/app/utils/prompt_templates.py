"""
Prompt templates for Claude API interactions
"""

PARSE_RESUME_PROMPT = """
Extract structured resume data from the following text and return ONLY valid JSON matching this schema:

{schema}

Resume text:
{resume_text}

Instructions:
- Extract all information accurately from the resume
- Format dates as YYYY-MM
- For bullets, extract the exact text as written
- If a field is not present, use empty string or empty array as appropriate
- Return ONLY the JSON object, no markdown formatting, no explanations, no additional text

JSON Response:
"""

ENHANCE_BULLETS_PROMPT = """
Rewrite these resume bullets to be more impactful using the STAR method (Situation, Task, Action, Result):

{bullets}

Guidelines:
- Start with strong action verbs (Led, Developed, Implemented, Designed, etc.)
- Avoid weak phrases like "Responsible for", "Worked on", "Helped with"
- Quantify achievements with metrics when possible (X% improvement, saved Y hours, managed Z users, etc.)
- Show clear results and impact
- Keep bullets concise (1-2 lines maximum)
- Maintain truthfulness - enhance phrasing, not facts
- Return in JSON array format: ["bullet 1", "bullet 2", ...]

Return ONLY the JSON array of enhanced bullets in the same order, no markdown, no explanations:
"""

ENHANCE_BULLETS_WITH_INSTRUCTION_PROMPT = """
Rewrite these resume bullets following the specific instruction provided:

{bullets}

Specific instruction: {instruction}

Guidelines:
- Follow the specific instruction above while keeping the content truthful
- Start with strong action verbs
- Keep bullets concise (1-2 lines maximum)
- Return in JSON array format: ["bullet 1", "bullet 2", ...]

Return ONLY the JSON array of enhanced bullets in the same order, no markdown, no explanations:
"""

TAILOR_TO_JD_PROMPT = """
Tailor this resume to match the job description and explain why each section changed.

Job Description:
{jd_text}

Current Resume:
{resume_json}

Instructions:
- Reorder and emphasize experience bullets that match job requirements
- Incorporate relevant keywords naturally from the job description
- Adjust skills section to highlight matching technologies
- Keep all content truthful (no fabrication or exaggeration)
- PRESERVE every existing `id` field exactly as it appears in the input resume
- Maintain the same JSON structure for the resume
- For each section/entry you change, write a short rationale (1-2 sentences) that
  cites the specific JD signal you matched (e.g. "Promoted Python bullets to the
  top because the JD requires '2+ years of Python'").
- If a section/entry is unchanged, omit its key from the rationale object.

Return ONLY valid JSON in this exact shape, with no markdown:
{{
  "resume": {{ ...the updated resume, same schema as input... }},
  "rationale": {{
    "summary": "why summary changed",
    "experience": {{ "<experience id>": "why this entry changed" }},
    "skills": "why skills changed",
    "projects": {{ "<project id>": "why this project changed" }},
    "education": "why education changed",
    "certifications": "why certifications changed"
  }}
}}
"""

GENERATE_FROM_JD_PROMPT = """
Based on this job description, generate a resume structure that would be a strong match:

Job Description:
{jd_text}

Instructions:
- Identify key skills and technologies mentioned
- Create relevant experience areas (use placeholder company names like "Tech Company", "Software Firm")
- Use placeholder dates (e.g., "2020-01 to Present")
- Generate bullet points that align with job requirements
- Include appropriate education background
- Add relevant skills section

Return a complete resume JSON structure with no markdown formatting:
"""

SCORE_ATS_PROMPT_GENERAL = """
Analyze this resume for general ATS (Applicant Tracking System) compatibility.

Resume:
{resume_json}

Evaluate:
1. Overall ATS score (0-100)
2. Formatting issues that may cause parsing errors
3. Missing or weak sections (summary, skills, quantified achievements)
4. Keyword density and action verb usage
5. Actionable improvements by priority

Return ONLY valid JSON in this exact format:
{{
  "score": 85,
  "keyword_match": null,
  "issues": {{
    "critical": ["list of critical issues"],
    "recommended": ["list of recommended improvements"],
    "optional": ["list of optional enhancements"]
  }},
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2"
  ]
}}

No markdown formatting, no explanations outside the JSON:
"""

SCORE_ATS_PROMPT_WITH_JD = """
Analyze this resume for ATS compatibility against the provided job description.

Resume:
{resume_json}

Job Description:
{jd_text}

Evaluate:
1. Overall ATS match score (0-100)
2. Keyword match percentage between resume and JD
3. Missing keywords or skills from the JD
4. Formatting issues that may cause parsing errors
5. Actionable improvements to better target this role

Return ONLY valid JSON in this exact format:
{{
  "score": 85,
  "keyword_match": 78,
  "issues": {{
    "critical": ["list of critical issues"],
    "recommended": ["list of recommended improvements"],
    "optional": ["list of optional enhancements"]
  }},
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2"
  ]
}}

No markdown formatting, no explanations outside the JSON:
"""

# Keep for backwards compatibility
SCORE_ATS_PROMPT = SCORE_ATS_PROMPT_GENERAL
