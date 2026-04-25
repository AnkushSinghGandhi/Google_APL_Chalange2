import { useState, useEffect } from "react";
import { generateQuiz } from "../../lib/gemini";
import { CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw, Settings } from "lucide-react";

export default function QuizWindow({ context, onSetKey, userProfile }) {
    const [loading, setLoading] = useState(true);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadQuiz();
    }, [context]);

    const loadQuiz = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateQuiz(context, userProfile);
            setQuizData(data);
            setScore(0);
            setCurrentQuestion(0);
            setShowResult(false);
            setSelectedOption(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (index) => {
        if (selectedOption !== null) return; // Prevent changing answer
        setSelectedOption(index);

        // Check answer logic would happen here visually
    };

    const handleNext = () => {
        if (selectedOption === quizData.questions[currentQuestion].correctAnswer) {
            setScore(s => s + 1);
        }

        if (currentQuestion < quizData.questions.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedOption(null);
        } else {
            // Final tally check for last question
            if (selectedOption === quizData.questions[currentQuestion].correctAnswer) {
                setScore(s => s + 1);
            }
            setShowResult(true);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-purple-500" />
                <p>Analyzing content & generating questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-6 font-mono text-sm max-w-md mx-auto">{error}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={loadQuiz}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter"
                    >
                        <RefreshCw className="w-4 h-4" /> [RETRY_SYNC]
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

    if (showResult) {
        return (
            <div className="text-center py-8 animate-in fade-in zoom-in">
                <div className="text-6xl mb-4">
                    {score === quizData.questions.length ? "🏆" : score > 0 ? "👏" : "📚"}
                </div>
                <h3 className="text-2xl font-bold dark:text-white mb-2">Quiz Complete!</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    You scored <span className="font-bold text-purple-600 dark:text-purple-400">{score}</span> out of {quizData.questions.length}
                </p>
                <button
                    onClick={loadQuiz}
                    className="flex items-center gap-2 mx-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all"
                >
                    <RefreshCw className="w-4 h-4" />
                    Take New Quiz
                </button>
            </div>
        );
    }

    // Handle case where quizData.questions might be nested (Gemini sometimes wraps in 'questions' array)
    // The service tries to parse, but let's be safe.
    const questions = quizData.questions || quizData;
    const question = questions[currentQuestion];

    return (
        <div className="max-w-xl mx-auto font-mono text-zinc-300">
            {/* Progress Bar - Segmented Terminal Style */}
            <div className="flex gap-1 mb-8">
                {questions.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 border ${i < currentQuestion ? 'bg-purple-500 border-purple-500' :
                            i === currentQuestion ? 'bg-purple-900 border-purple-500/50 animate-pulse' :
                                'bg-zinc-900 border-zinc-800'
                            }`}
                    />
                ))}
            </div>

            <div className="mb-10 min-h-[100px]">
                <div className="text-[10px] text-zinc-600 mb-2 tracking-[0.2em] uppercase">
                    Question_{currentQuestion + 1}/{questions.length}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                    {question.question}
                </h3>
            </div>

            <div className="flex flex-col gap-3">
                {question.options.map((option, index) => {
                    let statusClass = "border-white/5 hover:border-purple-500/50 hover:bg-white/5";
                    if (selectedOption !== null) {
                        if (index === question.correctAnswer) {
                            statusClass = "border-green-500/50 bg-green-500/5 text-green-400";
                        } else if (index === selectedOption) {
                            statusClass = "border-red-500/50 bg-red-500/5 text-red-400";
                        } else {
                            statusClass = "opacity-30 border-white/5";
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={selectedOption !== null}
                            className={`p-4 border text-left transition-all relative group ${statusClass}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm">
                                    <span className="text-zinc-600 mr-3">[{String.fromCharCode(65 + index)}]</span>
                                    {option}
                                </span>
                                {selectedOption !== null && index === question.correctAnswer && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {selectedOption !== null && index === selectedOption && index !== question.correctAnswer && (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedOption !== null && (
                <div className="mt-8 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="bg-white/5 border border-white/10 p-4 mb-6">
                        <div className="text-[10px] text-zinc-500 mb-2 uppercase tracking-widest font-bold">Explanation_Data</div>
                        <div className="text-sm text-zinc-400 leading-relaxed italic">
                            {question.explanation}
                        </div>
                    </div>
                    <button
                        onClick={handleNext}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-purple-600/10 text-purple-400 border border-purple-500/40 font-bold hover:bg-purple-600 hover:text-white transition-all uppercase tracking-widest text-xs"
                    >
                        {currentQuestion < questions.length - 1 ? "Next_Entry" : "Finalize_Results"}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};
