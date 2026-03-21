"""Generate preview PDFs for all templates using sample data"""
import os
import sys
import subprocess

sys.path.insert(0, os.path.dirname(__file__))

from app.routers.compile import render_latex, prepare_template_data

SAMPLE_DATA = {
    "id": "preview",
    "personal": {
        "name": "Alex Johnson",
        "email": "alex.johnson@email.com",
        "phone": "(555) 123-4567",
        "location": "San Francisco, CA",
        "linkedin": "https://linkedin.com/in/alexjohnson",
        "github": "https://github.com/alexjohnson",
        "website": "",
    },
    "summary": "Full-stack software engineer with 5+ years of experience building scalable web applications. Passionate about clean architecture, developer experience, and shipping products that users love.",
    "experience": [
        {
            "id": "1",
            "company": "TechCorp Inc.",
            "position": "Senior Software Engineer",
            "location": "San Francisco, CA",
            "start_date": "2022-03",
            "end_date": "Present",
            "bullets": [
                "Led migration of monolithic Rails app to microservices architecture, reducing deploy times by 75% and improving system reliability to 99.95% uptime",
                "Designed and implemented real-time data pipeline processing 2M+ events/day using Kafka and Python, enabling instant analytics for 50K users",
                "Mentored 4 junior engineers through code reviews and pair programming, improving team velocity by 30%",
            ],
        },
        {
            "id": "2",
            "company": "StartupXYZ",
            "position": "Software Engineer",
            "location": "Remote",
            "start_date": "2019-06",
            "end_date": "2022-02",
            "bullets": [
                "Built React frontend serving 100K+ monthly active users with sub-200ms page loads using code splitting and SSR",
                "Developed RESTful API layer in Node.js handling 10K requests/minute with comprehensive test coverage (95%)",
                "Implemented CI/CD pipeline with GitHub Actions, reducing release cycle from 2 weeks to daily deploys",
            ],
        },
    ],
    "education": [
        {
            "id": "1",
            "institution": "University of California, Berkeley",
            "degree": "Bachelor of Science",
            "field": "Computer Science",
            "location": "Berkeley, CA",
            "graduation_date": "2019-05",
            "gpa": "3.7",
        }
    ],
    "skills": {
        "technical": ["Python", "TypeScript", "Go", "Java", "SQL"],
        "frameworks": ["React", "Next.js", "FastAPI", "Django", "Express"],
        "tools": ["Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis", "Git"],
        "languages": ["English (Native)", "Spanish (Conversational)"],
    },
    "projects": [
        {
            "id": "1",
            "name": "DevMetrics Dashboard",
            "description": "Open-source developer productivity dashboard aggregating GitHub, Jira, and CI/CD metrics with real-time WebSocket updates. 500+ GitHub stars.",
            "technologies": ["React", "Go", "PostgreSQL", "WebSocket"],
            "link": "https://github.com/alexj/devmetrics",
        }
    ],
    "certifications": [],
    "metadata": {},
}

TEMPLATES = ["jakes_resume", "modern", "classic", "minimal"]


def main():
    data = prepare_template_data(SAMPLE_DATA)

    for tpl in TEMPLATES:
        print(f"Generating preview for {tpl}...")
        try:
            latex_source = render_latex(tpl, data)
        except Exception as e:
            print(f"  RENDER FAILED: {e}")
            continue

        preview_dir = os.path.join("templates", tpl)
        tex_file = os.path.join(preview_dir, "preview.tex")
        pdf_file = os.path.join(preview_dir, "preview.pdf")

        with open(tex_file, "w") as f:
            f.write(latex_source)

        try:
            result = subprocess.run(
                ["tectonic", tex_file, "-o", preview_dir],
                capture_output=True,
                text=True,
                timeout=120,
            )
            if os.path.exists(pdf_file):
                print(f"  OK: {pdf_file}")
            else:
                print(f"  COMPILE FAILED: {result.stderr[:300]}")
        except Exception as e:
            print(f"  ERROR: {e}")


if __name__ == "__main__":
    main()
