import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquareText, Brain, ListChecks, Map, Settings, Sparkles,
    ChevronLeft, ChevronRight, BookOpen, Search, Zap
} from "lucide-react";
import { useLearning } from "../context/LearningContext";
import { initializeGemini } from "../lib/gemini";
import TutorWindow from "../components/AiCompanion/TutorWindow";
import QuizWindow from "../components/AiCompanion/QuizWindow";
import RoadmapWindow from "../components/AiCompanion/RoadmapWindow";
import PathfinderWindow from "../components/AiCompanion/PathfinderWindow";

const MODES = [
    { id: "tutor", label: "AI Tutor", shortLabel: "Tutor", icon: MessageSquareText, color: "from-pink-500 to-rose-600", description: "Chat with your AI tutor" },
    { id: "quiz", label: "Test Knowledge", shortLabel: "Quiz", icon: Brain, color: "from-violet-500 to-purple-600", description: "Adaptive quizzes" },
    { id: "roadmap", label: "Learning Path", shortLabel: "Path", icon: ListChecks, color: "from-blue-500 to-cyan-600", description: "Step-by-step roadmap" },
    { id: "pathfinder", label: "Next Steps", shortLabel: "Next", icon: Map, color: "from-emerald-500 to-green-600", description: "What to learn next" },
];

export default function LearnWorkspace() {
    const {
        currentTopic, setCurrentTopic, apiKey, setApiKey, userProfile, setUserProfile,
        getDifficultyLevel, topicsExplored, addSessionEntry, isSetupComplete, masteryLevels
    } = useLearning();

    const [activeMode, setActiveMode] = useState("tutor");
    const [topicInput, setTopicInput] = useState(currentTopic || "");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [localKey, setLocalKey] = useState(apiKey || "");
    const [localProfile, setLocalProfile] = useState(userProfile);

    const envKey = import.meta.env.VITE_GEMINI_API_KEY_PRIMARY || import.meta.env.VITE_GEMINI_API_KEY_FALLBACK;

    useEffect(() => {
        const key = apiKey || envKey;
        if (key) initializeGemini(key);
    }, [apiKey]);

    const context = currentTopic
        ? `Learning Topic: ${currentTopic}\nDifficulty Level: ${getDifficultyLevel(currentTopic)}\n\nThe user is studying "${currentTopic}". Adapt explanations to their ${getDifficultyLevel(currentTopic)} level. Focus on building understanding progressively.`
        : "General learning assistance. Ask the user what they'd like to learn.";

    const handleTopicSubmit = (e) => {
        e.preventDefault();
        if (topicInput.trim()) {
            setCurrentTopic(topicInput.trim());
            addSessionEntry({ type: "topic_change", topic: topicInput.trim() });
        }
    };

    const handleSaveSettings = () => {
        if (localKey.trim()) {
            setApiKey(localKey.trim());
            initializeGemini(localKey.trim());
        }
        setUserProfile(localProfile);
        setShowSettings(false);
    };

    const activeConfig = MODES.find((m) => m.id === activeMode);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[var(--bg-secondary)] border-r border-white/5 flex flex-col overflow-hidden shrink-0"
                    >
                        <div className="p-4 border-b border-white/5">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">AI Tools</h3>
                            <div className="space-y-1">
                                {MODES.map(({ id, label, icon: ModeIcon, color }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveMode(id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeMode === id
                                            ? "bg-violet-600/15 text-violet-300 border border-violet-500/20"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${color} flex items-center justify-center`}>
                                            <ModeIcon className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topics explored */}
                        <div className="p-4 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Recent Topics</h3>
                            {topicsExplored.length > 0 ? (
                                <div className="space-y-1">
                                    {topicsExplored.slice(-10).reverse().map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => { setCurrentTopic(t); setTopicInput(t); }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${currentTopic === t
                                                ? "bg-white/5 text-white"
                                                : "text-zinc-500 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <span className="truncate">{t}</span>
                                            {masteryLevels[t] !== undefined && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${masteryLevels[t] >= 70 ? "bg-green-500/15 text-green-400"
                                                    : masteryLevels[t] >= 40 ? "bg-amber-500/15 text-amber-400"
                                                        : "bg-red-500/15 text-red-400"
                                                    }`}>
                                                    {masteryLevels[t]}%
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-600 italic">No topics explored yet</p>
                            )}
                        </div>

                        {/* Settings */}
                        <div className="p-4 border-t border-white/5">
                            <button
                                onClick={() => setShowSettings(true)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <Settings className="w-4 h-4" />
                                Configure AI
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 bg-[var(--bg-secondary)]">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <form onSubmit={handleTopicSubmit} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            type="text"
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                            placeholder="What do you want to learn? (e.g., 'Binary Search Trees')..."
                            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/8 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40 text-sm"
                        />
                    </form>

                    {currentTopic && (
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-lg">
                            <Zap className="w-3.5 h-3.5 text-violet-400" />
                            <span className="text-xs font-medium text-violet-300 capitalize">
                                {getDifficultyLevel(currentTopic)}
                            </span>
                        </div>
                    )}

                    {/* Mobile mode switcher */}
                    <div className="flex sm:hidden items-center gap-1">
                        {MODES.map(({ id, shortLabel, icon: ModeIcon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveMode(id)}
                                className={`p-2 rounded-lg transition-all ${activeMode === id ? "bg-violet-600/15 text-violet-300" : "text-zinc-500"
                                    }`}
                                title={shortLabel}
                            >
                                <ModeIcon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active mode header */}
                <div className="px-6 py-4 flex items-center gap-3 border-b border-white/[0.03]">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeConfig.color} flex items-center justify-center`}>
                        {(() => {
                            const ActiveIcon = activeConfig.icon;
                            return <ActiveIcon className="w-4 h-4 text-white" />;
                        })()}
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-sm">{activeConfig.label}</h2>
                        <p className="text-[11px] text-zinc-500">{activeConfig.description} • {currentTopic || "General"}</p>
                    </div>
                </div>

                {/* Tool content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-primary)]">
                    {activeMode === "tutor" && (
                        <TutorWindow context={context} onSetKey={() => setShowSettings(true)} userProfile={userProfile} />
                    )}
                    {activeMode === "quiz" && (
                        <QuizWindow context={context} onSetKey={() => setShowSettings(true)} userProfile={userProfile} />
                    )}
                    {activeMode === "roadmap" && (
                        <RoadmapWindow context={context} onSetKey={() => setShowSettings(true)} userProfile={userProfile} />
                    )}
                    {activeMode === "pathfinder" && (
                        <PathfinderWindow context={context} onSetKey={() => setShowSettings(true)} userProfile={userProfile} />
                    )}
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-2xl p-6 w-full max-w-lg"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Settings className="w-5 h-5 text-violet-400" />
                            <h3 className="text-lg font-bold">AI Settings</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Gemini API Key
                                </label>
                                <input
                                    type="password"
                                    value={localKey}
                                    onChange={(e) => setLocalKey(e.target.value)}
                                    placeholder="Paste AI Studio Key..."
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 font-mono text-sm"
                                />
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-1.5 text-xs text-violet-400 hover:text-violet-300 underline"
                                >
                                    Get a free key →
                                </a>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Role</label>
                                    <select
                                        value={localProfile.occupation}
                                        onChange={(e) => setLocalProfile({ ...localProfile, occupation: e.target.value })}
                                        className="w-full px-3 py-3 bg-black/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50"
                                    >
                                        <option value="">Select...</option>
                                        <option value="student">Student</option>
                                        <option value="professional">Professional</option>
                                        <option value="self-learner">Self-Learner</option>
                                        <option value="researcher">Researcher</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Goal</label>
                                    <select
                                        value={localProfile.goal}
                                        onChange={(e) => setLocalProfile({ ...localProfile, goal: e.target.value })}
                                        className="w-full px-3 py-3 bg-black/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50"
                                    >
                                        <option value="">Select...</option>
                                        <option value="career">Career Growth</option>
                                        <option value="academic">Academic Study</option>
                                        <option value="curiosity">Curiosity</option>
                                        <option value="project">Build Projects</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Your Skills
                                </label>
                                <input
                                    type="text"
                                    value={localProfile.skills}
                                    onChange={(e) => setLocalProfile({ ...localProfile, skills: e.target.value })}
                                    placeholder="Python, React, etc."
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-5 py-2.5 text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                className="flex-1 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-lg transition-all"
                            >
                                Save Settings
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
