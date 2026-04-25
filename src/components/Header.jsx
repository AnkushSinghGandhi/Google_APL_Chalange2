import { Link, useLocation } from "react-router-dom";
import { Brain, LayoutDashboard, Sparkles, BookOpen } from "lucide-react";
import { useLearning } from "../context/LearningContext";

export default function Header() {
    const location = useLocation();
    const { streakDays, topicsExplored } = useLearning();

    const navItems = [
        { path: "/", label: "Home", icon: Sparkles },
        { path: "/learn", label: "Learn", icon: BookOpen },
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ];

    return (
        <header className="glass-strong sticky top-0 z-50 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center glow-sm group-hover:glow-md transition-shadow">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold tracking-tight text-gradient">LearnWise AI</h1>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1">
                        {navItems.map(({ path, label, icon: Icon }) => {
                            const isActive = location.pathname === path;
                            return (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? "bg-violet-600/15 text-violet-300 border border-violet-500/20"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Stats pill */}
                    <div className="hidden md:flex items-center gap-4 text-xs text-zinc-500 font-mono">
                        {streakDays > 0 && (
                            <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20">
                                🔥 {streakDays}d streak
                            </span>
                        )}
                        <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            {topicsExplored.length} topic{topicsExplored.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
