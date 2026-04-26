import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Brain, Sparkles, Key, ArrowRight, Code, FlaskConical,
    Languages, Calculator, Palette, Music, BookOpen, Globe,
    Cpu, Database, Shield, Cloud, Atom, TrendingUp, Target
} from "lucide-react";
import { useLearning } from "../context/LearningContext";
import { initializeGemini } from "../lib/gemini";

const TOPIC_CATEGORIES = [
    { id: "programming", label: "Programming", icon: Code, color: "from-violet-500 to-purple-600" },
    { id: "web-dev", label: "Web Development", icon: Globe, color: "from-blue-500 to-cyan-600" },
    { id: "data-structures", label: "Data Structures", icon: Database, color: "from-emerald-500 to-green-600" },
    { id: "algorithms", label: "Algorithms", icon: Cpu, color: "from-orange-500 to-red-600" },
    { id: "machine-learning", label: "Machine Learning", icon: Brain, color: "from-pink-500 to-rose-600" },
    { id: "system-design", label: "System Design", icon: Cloud, color: "from-sky-500 to-blue-600" },
    { id: "cybersecurity", label: "Cybersecurity", icon: Shield, color: "from-red-500 to-orange-600" },
    { id: "mathematics", label: "Mathematics", icon: Calculator, color: "from-amber-500 to-yellow-600" },
    { id: "science", label: "Science", icon: FlaskConical, color: "from-teal-500 to-emerald-600" },
    { id: "physics", label: "Physics", icon: Atom, color: "from-indigo-500 to-violet-600" },
    { id: "languages", label: "Languages", icon: Languages, color: "from-fuchsia-500 to-pink-600" },
    { id: "finance", label: "Finance", icon: TrendingUp, color: "from-lime-500 to-green-600" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function Landing() {
    const navigate = useNavigate();
    const { apiKey, setApiKey, setCurrentTopic, isSetupComplete, userProfile, setUserProfile } = useLearning();
    const [localKey, setLocalKey] = useState(apiKey || "");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [customTopic, setCustomTopic] = useState("");
    const [motivationText, setMotivationText] = useState(userProfile.learningMotivation || "");
    const [step, setStep] = useState(1); // 1: hero, 2: setup, 3: topic select
    const [localProfile, setLocalProfile] = useState(userProfile);

    const handleStart = () => {
        if (isSetupComplete) {
            setStep(3);
        } else {
            setStep(2);
        }
    };

    const handleSaveKey = () => {
        if (localKey.trim()) {
            setApiKey(localKey.trim());
            initializeGemini(localKey.trim());
        }
        setUserProfile(localProfile);
        setStep(3);
    };

    const handleLaunch = () => {
        const topic = customTopic.trim() || selectedTopic;
        if (topic) {
            setCurrentTopic(topic);
        }
        // Save the motivation into the user profile
        if (motivationText.trim()) {
            setUserProfile({ ...userProfile, learningMotivation: motivationText.trim() });
        }
        navigate("/learn");
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-mesh flex items-center justify-center p-4 sm:p-8">
            {step === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    {/* Floating brain icon */}
                    <motion.div
                        className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center glow-lg"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Brain className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
                        Learn <span className="text-gradient">Smarter</span>,{" "}
                        <br className="hidden sm:block" />
                        Not Harder
                    </h1>

                    <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
                        An AI-powered assistant that <span className="text-violet-300 font-semibold">personalizes content</span> and{" "}
                        <span className="text-indigo-300 font-semibold">adapts to your pace</span>. Master any concept with interactive lessons, quizzes, and guided learning paths.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleStart}
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl text-lg hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-105"
                        >
                            <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                            Start Learning
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {isSetupComplete && (
                            <button
                                onClick={() => navigate("/learn")}
                                className="px-8 py-4 text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all font-medium"
                            >
                                Continue Session
                            </button>
                        )}
                    </div>

                    {/* Feature highlights */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16"
                    >
                        {[
                            { icon: "🎯", title: "Adaptive Learning", desc: "Content adjusts to your understanding level" },
                            { icon: "🧠", title: "AI-Powered Tutor", desc: "Ask anything, get expert explanations" },
                            { icon: "📊", title: "Track Progress", desc: "Mastery scores and learning streaks" },
                        ].map((f) => (
                            <motion.div
                                key={f.title}
                                variants={itemVariants}
                                className="glass rounded-xl p-6 text-left hover:border-violet-500/20 transition-all"
                            >
                                <div className="text-3xl mb-3">{f.icon}</div>
                                <h3 className="font-bold text-white mb-1">{f.title}</h3>
                                <p className="text-sm text-zinc-500">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <Key className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Quick Setup</h2>
                            <p className="text-sm text-zinc-500">Configure your learning experience</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={localKey}
                                onChange={(e) => setLocalKey(e.target.value)}
                                placeholder="Paste your Gemini AI Studio key..."
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 font-mono text-sm"
                            />
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2"
                            >
                                Get a free API key →
                            </a>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Your Role
                                </label>
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
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Goal
                                </label>
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
                                Honest Self-Assessment
                            </label>
                            <textarea
                                value={localProfile.selfAssessment || ""}
                                onChange={(e) => setLocalProfile({ ...localProfile, selfAssessment: e.target.value })}
                                placeholder="e.g., 'I know React hooks but struggle with Redux. I'm a complete beginner at Node.js...'"
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 text-sm min-h-[80px]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                Paste Resume / Experience
                            </label>
                            <textarea
                                value={localProfile.resumeText || ""}
                                onChange={(e) => setLocalProfile({ ...localProfile, resumeText: e.target.value })}
                                placeholder="Paste your resume or list your professional experience here so the AI can tailor analogies to your background..."
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 text-sm min-h-[100px]"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={() => setStep(1)}
                            className="px-5 py-3 text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSaveKey}
                            className="flex-1 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all"
                        >
                            Continue →
                        </button>
                    </div>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-3xl"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">What do you want to learn?</h2>
                        <p className="text-zinc-500">Pick a category or type your own topic</p>
                    </div>

                    {/* Custom topic input */}
                    <div className="mb-6">
                        <input
                            type="text"
                            value={customTopic}
                            onChange={(e) => { setCustomTopic(e.target.value); setSelectedTopic(""); }}
                            placeholder="e.g., 'Neural Networks', 'React Hooks', 'Quantum Physics'..."
                            className="w-full px-6 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 text-lg"
                        />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8"
                    >
                        {TOPIC_CATEGORIES.map(({ id, label, icon: Icon, color }) => (
                            <motion.button
                                key={id}
                                variants={itemVariants}
                                onClick={() => { setSelectedTopic(label); setCustomTopic(""); }}
                                className={`group flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-200 ${selectedTopic === label
                                        ? "border-violet-500/50 bg-violet-500/10 glow-sm"
                                        : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-sm font-medium text-zinc-300">{label}</span>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Motivation — WHY are you learning this? */}
                    {(selectedTopic || customTopic.trim()) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mb-8"
                        >
                            <div className="glass rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-4 h-4 text-violet-400" />
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                        Why are you learning {customTopic.trim() || selectedTopic}?
                                    </label>
                                </div>
                                <textarea
                                    value={motivationText}
                                    onChange={(e) => setMotivationText(e.target.value)}
                                    placeholder={`e.g.,\n• Targeting FAANG interviews (specifically Google)\n• Want a job with 10-15 LPA salary\n• Preparing for upcoming campus placements\n• Building a side project that needs this skill`}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 text-sm min-h-[100px]"
                                />
                                <p className="text-[11px] text-zinc-600 mt-2 italic">The more specific you are, the better the AI tailors your roadmap, quizzes, and explanations.</p>
                            </div>
                        </motion.div>
                    )}

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => setStep(isSetupComplete ? 1 : 2)}
                            className="px-6 py-3 text-zinc-400 hover:text-white border border-white/10 rounded-xl transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleLaunch}
                            disabled={!selectedTopic && !customTopic.trim()}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:glow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <BookOpen className="w-5 h-5" />
                            Launch Learning Session
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
