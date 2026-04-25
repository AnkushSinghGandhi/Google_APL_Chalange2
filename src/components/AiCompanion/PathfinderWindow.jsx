import { useState, useEffect } from "react";
import { generatePathfinder } from "../../lib/gemini";
import { Loader2, ArrowRightCircle, Code, Lightbulb, RefreshCw, Settings } from "lucide-react";

export default function PathfinderWindow({ context, onSetKey, userProfile }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPathInfo();
    }, [context]);

    const loadPathInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await generatePathfinder(context, userProfile);
            setData(result);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-green-500" />
                <p>Charting your course...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-6 font-mono text-sm max-w-md mx-auto">{error || "No data received"}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={loadPathInfo}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter"
                    >
                        <RefreshCw className="w-4 h-4" /> [RETRY_REQUEST]
                    </button>
                    <button
                        onClick={onSetKey}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-yellow-500/80 border border-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-400 transition-all font-mono text-xs uppercase tracking-tighter"
                    >
                        <Settings className="w-4 h-4" /> [SET_CUSTOM_KEY]
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto space-y-10 font-mono">

            {/* What to Learn Next */}
            <section className="bg-black border border-green-500/20 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1 bg-green-500/10 text-green-500 text-[8px] font-bold tracking-tighter uppercase">
                    REC_SYSTEM_V4
                </div>
                <div className="flex items-center gap-3 mb-4 text-green-500">
                    <ArrowRightCircle className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">Recommended_Next_Step</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {data.nextTopic?.title || "Advanced Concepts"}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed italic border-l-2 border-green-500/40 pl-4">
                    {data.nextTopic?.description}
                </p>
            </section>

            {/* Project Ideas */}
            <section>
                <div className="flex items-center gap-3 mb-6 text-zinc-500 px-1 border-b border-white/5 pb-2">
                    <Lightbulb className="w-4 h-4" />
                    <h4 className="font-bold uppercase tracking-widest text-[10px]">Project_Ideation_Forge</h4>
                </div>

                <div className="grid gap-4">
                    {data.projects?.map((project, idx) => (
                        <div key={idx} className="bg-black p-6 border border-white/5 hover:border-purple-500/50 transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                                <h5 className="font-bold text-base text-white group-hover:text-purple-400 transition-colors uppercase tracking-wide">
                                    {project.title}
                                </h5>
                                <span className={`
                                    px-2 py-0.5 text-[8px] font-bold uppercase tracking-tighter border
                                    ${project.difficulty === 'Beginner' ? 'border-green-500/50 text-green-500' : ''}
                                    ${project.difficulty === 'Intermediate' ? 'border-yellow-500/50 text-yellow-500' : ''}
                                    ${project.difficulty === 'Advanced' ? 'border-red-500/50 text-red-500' : ''}
                                `}>
                                    [{project.difficulty.substring(0, 3)}]
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                                {project.description}
                            </p>
                            <button className="text-[10px] font-bold text-zinc-600 group-hover:text-white flex items-center gap-2 transition-all uppercase tracking-widest">
                                <Code className="w-3 h-3" /> [Start_Initiative]
                            </button>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};
