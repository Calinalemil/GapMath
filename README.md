# GapMath
### AI-Powered Math Knowledge Gap Analyzer

GapMath helps students understand **why** their math solution was wrong; not just what the correct answer is. Using AI, it identifies the specific knowledge gaps behind their mistakes and explains them at the student's level.

---

## The Problem

Students often use software to help them with math homework. These tools give the correct answer, but students still do not understand what went wrong in their own reasoning. The problem is not obtaining the solution, **the problem is understanding it.**

GapMath was born from real experience working with students who were stuck not because they lacked effort, but because they lacked the foundational knowledge to understand their mistakes.

---

## What GapMath Does

- Student submits a math exercise by **typing it** or **uploading a photo**
- Student selects their **grade level** (K-5, 6-8, 9-12, College)
- AI analyzes the solution and identifies **knowledge gaps**
- Each gap includes a **description**, a **how to improve tip**, and a **worked example**
- GapMath suggests **practice exercises** to fix each gap
- All sessions are saved to a database for future analytics

---

## Who It Is For

**V1 — Students**
Students can submit their exercises independently and receive instant, personalized feedback that guides their learning.

**V2 — Teachers (Coming Soon)**
Teachers will be able to monitor student gap patterns across the class and use GapMath to speed up homework review.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| AI | Google Gemini API |
| Database | SQLite |

---

## How to Run Locally

### Requirements
- Python 3.10+
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/Calinalemil/GapMath.git
cd GapMath
```

**2. Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**3. Create your `.env` file inside the `backend` folder:**
```
GEMINI_API_KEY=your-gemini-api-key-here
```

**4. Start the backend server:**
```bash
uvicorn main:app --reload --port 8001
```

**5. Open a new terminal and start the frontend server:**
```bash
cd frontend
python -m http.server 8000
```

**6. Open your browser and go to:**
```
http://localhost:8000
```

---

## Project Status

This is an MVP (Minimum Viable Product) — the core student experience is fully working.

| Feature | Status |
|---|---|
| Exercise text input | ✅ Done |
| Image upload | ✅ Done |
| Grade level selector | ✅ Done |
| AI gap analysis | ✅ Done |
| Worked examples | ✅ Done |
| Practice exercises | ✅ Done |
| Session database | ✅ Done |
| Student accounts | ⏳ V2 |
| Teacher dashboard | ⏳ V2 |
| Progress tracking | ⏳ V2 |
| Cloud deployment | ⏳ V3 |

---

## Roadmap

**V2 — Student Accounts**
Login and registration, personal gap history, progress tracking over time.

**V3 — Teacher Dashboard**
Class-level gap overview, student performance reports, homework review tools.

**V4 — Data Science Layer**
Predictive gap modeling, custom ML trained on student data, school trend reports, Azure cloud deployment.

---

## About

GapMath was created by a technology designer and coding educator who witnessed firsthand how students struggle not with getting answers, but with understanding them. This project is being built as part of a journey into Data Science and AI, with the mission of helping schools improve math outcomes for their students.

---

*GapMath — Bridging the gap between the answer and the understanding.*
