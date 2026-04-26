import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import LearnWorkspace from "./pages/LearnWorkspace";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/learn" element={<LearnWorkspace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <footer className="py-6 px-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">
          Developed by <a href="https://warriorwhocodes.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">Ankush Singh Gandhi</a>
        </p>
        <p className="text-[8px] text-zinc-700 uppercase tracking-widest mt-2 mt-1">
          Powered by AntiGravity • Gemini 3.1 Pro • Gemini 3 Flash • Deployed on Google Cloud
        </p>
      </footer>
    </div>
  );
}
