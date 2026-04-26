# LearnWise AI — Adaptive Learning Assistant

**Google APL Challenge 2 Submission**

An intelligent, adaptive learning platform that unifies an AI Tutor, dynamic Quizzes, automated Roadmaps, and a Pathfinder into a single, seamless workspace. Powered by Google's Gemini models, LearnWise adapts its explanations and difficulty based on your real-time learning progress.

---

## 👨‍💻 Developer Credits
**Developed by:** [Ankush Singh Gandhi](https://warriorwhocodes.com)
**Technologies Used:** React, Vite, TailwindCSS, Framer Motion
**AI Infrastructure:** AntiGravity, Gemini 3.1 Pro, Gemini 3 Flash
**Deployment:** Google Cloud

---

## 💡 The Idea & Thought Process
The vision for LearnWise AI was born out of a desire to solve "fragmented learning." Often, learners have to juggle between YouTube, ChatGPT, documentation, and quiz platforms. 

I wanted to transform a standard web template into a **centralized, interactive learning workspace**. By utilizing Google's Gemini API, the assistant doesn't just answer questions—it tracks your mastery. If you score poorly on a quiz, the AI automatically dials back the complexity of its future explanations (adapting to a "Beginner" level). If you ace it, the AI challenges you with "Advanced" concepts. 

The UI was intentionally designed with a dark-themed, glassmorphism aesthetic to reduce eye strain and provide a focused, distraction-free environment.

---

## 🚀 What I Could Have Done More (Future Scope)
While the current MVP is highly functional, there are several exciting features I would love to build out in the future:
1. **Cloud Persistence:** Currently, progress and streaks are saved in the browser's `localStorage`. Migrating to a proper backend (like Firebase or PostgreSQL) would allow cross-device syncing.
2. **Spaced Repetition System (SRS):** Upgrading the Quiz module to implement SRS algorithms (like Anki) to optimize memory retention over time.
3. **Voice Integration:** Adding speech-to-text and text-to-speech capabilities so users can converse naturally with the AI Tutor hands-free.
4. **Live Resource Fetching:** Enhancing the "Pathfinder" module to not just suggest project ideas, but actually scrape and recommend the best live YouTube tutorials or free courses for that specific topic.
5. **Multiplayer Study Rooms:** Allowing friends to sync their workspaces and tackle AI-generated challenges together.

---

## 🤖 Prompts Used to Build This (via AntiGravity)
To rapidly prototype and build this application, I utilized an agentic workflow with AntiGravity. Here are some of the key prompts I used to guide the AI in building my vision:

> *"Create a LearnWorkspace component that serves as the main dashboard. It should integrate the Tutor, Quiz, Roadmap, and Pathfinder components into a single window. Ensure it uses a dark-themed glassmorphism design with a sidebar for switching tools."*

> *"Implement an adaptive difficulty system using a React Context (`LearningContext`). When a user takes a quiz, track their score and use it to adjust the complexity of the prompts sent to Gemini (e.g., beginner vs advanced explanations)."*

> *"Fix the 'Invalid hook call' errors occurring when switching tabs between the Roadmap and Pathfinder. Refactor the components from arrow functions to standard named function exports to ensure proper React lifecycle tracking."*

> *"Add details like developed by ankush singh Gandhi - warriorwhocodes.com using AntiGravity, gemini 3.1 pro and gemini 3 flash and deployed using google cloud to the application footer."*

---

## 🛠️ How to Run Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY_PRIMARY="your_api_key_here"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.