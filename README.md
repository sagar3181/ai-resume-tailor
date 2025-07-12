# 🤖 AI Resume Tailor + Job Match Scanner

An AI-powered web application that helps job seekers tailor their resumes to specific job descriptions using GPT and cloud services across AWS, Azure, and GCP. It analyzes keyword overlap, highlights missing skills, and suggests optimized resume bullet points — all while being ATS-friendly and recruiter-focused.

---

## 🚀 Features

- Upload or paste your **resume** (PDF or plain text)
- Paste a **job description** (from LinkedIn, Indeed, etc.)
- Get a:
  - ✅ **Match Score** (0–100)
  - ✅ List of **missing keywords/phrases**
  - ✅ Suggested **resume line rewrites**
  - ✅ Short **feedback paragraph** on alignment

---

## 🧠 Tech Stack

| Layer        | Technology Used                     |
|--------------|-------------------------------------|
| Frontend     | React.js + Tailwind CSS             |
| Backend      | Node.js or Flask                    |
| AI Models    | OpenAI GPT-3.5 (prompt engineered)  |
| Cloud (AWS)  | AWS S3 for resume storage           |
| Cloud (GCP)  | Vertex AI (for embeddings)          |
| Cloud (Azure)| Azure OpenAI / Text Analytics API   |
| Auth (optional)| Firebase or Auth0                 |
| Hosting      | Vercel (frontend) + Render (backend)|
| DB (optional)| MongoDB Atlas / Firestore           |

---

## 📦 Project Structure

```bash
ai-resume-tailor/
├── client/                # React frontend
│   ├── src/
│   └── public/
├── server/                # Node or Flask backend
│   ├── routes/
│   └── services/
├── prompts/
│   └── resume_prompt.txt  # Custom prompt for GPT
├── README.md
├── .env.example
└── package.json / requirements.txt
