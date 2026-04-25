import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Brain, TrendingUp, BookOpen, Target, Clock, Flame,
    ArrowRight, Trophy, BarChart3, Sparkles
} from "lucide-react";
import { useLearning } from "../context/LearningContext";

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
    const navigate = useNavigate();
    const {
        streakDays, topicsExplored, quizHistory, masteryLevels,
        sessionHistory, currentTopic, setCurrentTopic
    } = useLearning();

    const totalQuizzes = quizHistory.length;
    const avgScore = totalQuizzes > 0
        ? Math.round(quizHistory.reduce((a, q) => a + (q.score / q.total) * 100, 0) / totalQuizzes)
        : 0;

    const masteryEntries = Object.entries(masteryLevels).sort((a, b) => b[1] - a[1]);

    const handleTopicClick = (topic) => {
        setCurrentTopic(topic);
        navigate("/learn");
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-mesh p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-1">Learning Dashboard</h1>
                    <p className="text-zinc-500">Track your progress and keep the streak alive</p>
                </motion.div>

                {/* Stats grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { icon: Flame, label: "Day Streak", value: streakDays, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                        { icon: BookOpen, label: "Topics Explored", value: topicsExplored.length, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
                        { icon: Brain, label: "Quizzes Taken", value: totalQuizzes, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
                        { icon: Target, label: "Avg Score", value: `${avgScore}%`, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    ].map(({ icon: Icon, label, value, color, bg, border }) => (
                        <motion.div
                            key={label}
                            variants={itemVariants}
                            className={`glass rounded-xl p-5 ${border} border hover:glow-sm transition-shadow`}
                        >
                            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-white mb-0.5">{value}</div>
                            <div className="text-xs text-zinc-500 font-medium">{label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Mastery Levels */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 glass rounded-xl p-6 border border-white/5"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-violet-400" />
                                <h2 className="font-bold text-white">Topic Mastery</h2>
                            </div>
                            {masteryEntries.length === 0 && (
                                <span className="text-xs text-zinc-500">Take quizzes to track mastery</span>
                            )}
                        </div>

                        {masteryEntries.length > 0 ? (
                            <div className="space-y-4">
                                {masteryEntries.map(([topic, mastery]) => (
                                    <button
                                        key={topic}
                                        onClick={() => handleTopicClick(topic)}
                                        className="w-full text-left group"
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                                {topic}
                                            </span>
                                            <span className={`text-xs font-bold ${mastery >= 70 ? "text-green-400" : mastery >= 40 ? "text-amber-400" : "text-red-400"
                                                }`}>
                                                {mastery}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${mastery}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full rounded-full ${mastery >= 70
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                                        : mastery >= 40
                                                            ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                                            : "bg-gradient-to-r from-red-500 to-orange-400"
                                                    }`}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                                <p className="text-zinc-500 mb-4">No mastery data yet</p>
                                <button
                                    onClick={() => navigate("/learn")}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600/15 text-violet-300 rounded-lg border border-violet-500/20 hover:bg-violet-600/25 transition-all text-sm font-medium"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Start a quiz to track mastery
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass rounded-xl p-6 border border-white/5"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <Clock className="w-5 h-5 text-indigo-400" />
                            <h2 className="font-bold text-white">Recent Topics</h2>
                        </div>

                        {topicsExplored.length > 0 ? (
                            <div className="space-y-2">
                                {topicsExplored.slice(-8).reverse().map((topic) => (
                                    <button
                                        key={topic}
                                        onClick={() => handleTopicClick(topic)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all group text-left"
                                    >
                                        <span className="text-sm text-zinc-400 group-hover:text-white truncate">{topic}</span>
                                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-400 transition-colors shrink-0" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                                <p className="text-sm text-zinc-500">No topics explored yet</p>
                            </div>
                        )}

                        {/* Quiz history summary */}
                        {quizHistory.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-white/5">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Recent Quizzes</h3>
                                <div className="space-y-2">
                                    {quizHistory.slice(-5).reverse().map((q, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <span className="text-zinc-400 truncate max-w-[60%]">{q.topic}</span>
                                            <span className={`font-bold ${q.score / q.total >= 0.7 ? "text-green-400"
                                                    : q.score / q.total >= 0.4 ? "text-amber-400"
                                                        : "text-red-400"
                                                }`}>
                                                {q.score}/{q.total}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* CTA */}
                {topicsExplored.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <button
                            onClick={() => navigate("/learn")}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:glow-md transition-all text-lg"
                        >
                            <TrendingUp className="w-5 h-5" />
                            Continue Learning
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
