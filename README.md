# meeting_summarizer_api
 🧠 Meeting Summarizer & Action Item Extractor API

A backend API that takes **audio or text transcripts** of meetings and returns a **concise summary** along with **action items (to-dos / next steps)** using state-of-the-art NLP models. Designed for teams and professionals to quickly understand key points and actionable outcomes of any meeting.

---

## 🚀 Features

- 🔊 Accepts **audio input** (using Whisper for speech-to-text)
- 📝 Supports direct **text input** (meeting transcripts)
- 📄 Returns:
  - **Meeting Summary** (using BART-based summarization)
  - **Action Items** / To-Dos (keyword & pattern-based extraction)
- 💾 Stores meeting data using **SQLite3**
- 🌐 Built as a **RESTful API** using Node.js + Express.js
- 🐍 Integrates Python scripts via `child_process` for ML tasks
- 🐳 Dockerized for deployment
- 🔄 CI/CD with GitHub Actions

---

## 🛠️ Tech Stack

| Layer         | Tools / Frameworks                             |
|---------------|------------------------------------------------|
| Frontend UI   | HTML, CSS, JavaScript                          |
| Backend       | Node.js, Express.js                            |
| ML & NLP      | Python, Whisper, Transformers (BART), NLTK     |
| Database      | SQLite3 (using Python `sqlite3` module)        |
| Deployment    | Docker, GitHub Actions                         |

---



## 🖼️ Screenshots


<img width="1909" height="918" alt="Screenshot 2025-07-23 161251" src="https://github.com/user-attachments/assets/d091feec-266c-4098-b08e-06890dbcdf50" />
<img width="1903" height="911" alt="Screenshot 2025-07-23 161327" src="https://github.com/user-attachments/assets/52c559c1-0588-4176-a0d3-c346dfb6cdc4" />
<img width="1902" height="907" alt="Screenshot 2025-07-23 162026" src="https://github.com/user-attachments/assets/d6f8f76d-7698-4560-a49d-032f38797ee1" /><img width="1901" height="910" alt="Screenshot 2025-07-23 162036" src="https://github.com/user-attachments/assets/e0c48713-448d-4e6a-b006-de82793ae9f2" />



🐳 Docker Instructions
# Build the Docker image
docker build -t meeting-summarizer .

# Run the container
docker run -p 5000:5000 meeting-summarizer
⚙️ Run Locally (Without Docker)
1. Clone the repository
git clone https://github.com/SanthoshS3E/meeting_summarizer_api
cd meeting-summarizer
2. Install Node dependencies
npm install
3. Install Python requirements
cd server/python
pip install -r requirements.txt
4. Start the server
npm start
✅ Future Enhancements
User real time meeting summary
Frontend UI dashboard
Multilingual support
Slack/Email integration for action item reminders

🧑‍💻 Authors
Santhosh S - https://www.linkedin.com/in/santhoshs2004/

Contributions welcome! Feel free to fork and raise a PR.


