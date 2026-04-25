import { useState, useEffect, useRef } from "react";
import { generateTutorStream } from "../../lib/gemini";
import { Send, User, Bot, Loader2, Sparkles, Trash2, Settings } from "lucide-react";

export default function TutorWindow({ context, onSetKey, userProfile }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your AI Expert. I can explain the concepts in this roadmap, help you debug code, or mock interview you. What's on your mind?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        const currentInput = input;
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // Add placeholder for assistant message
        setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

        let fullResponse = "";
        try {
            const history = messages.filter(m => m.role !== 'system');

            await generateTutorStream(history, currentInput, context, userProfile, (chunk) => {
                fullResponse += chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        role: 'assistant',
                        content: fullResponse
                    };
                    return newMessages;
                });
            });
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: `⚠️ CONNECTION_ERROR: My neural link is unstable. This often means the API key is invalid or has reached its quota. 

You can try to [RECONFIGURE_KEY] in the toolbox settings if you have your own.`
                };
                return newMessages;
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([
            { role: 'assistant', content: "Chat cleared. What else can I help you with?" }
        ]);
    };

    // Helper to render markdown-like simple formatting
    const renderContent = (content) => {
        // Split by code blocks
        const parts = content.split(/(```[\s\S]*?```)/g);
        return parts.map((part, index) => {
            if (part.startsWith('```')) {
                // Code block
                const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
                const lang = match ? match[1] : '';
                const code = match ? match[2] : part.slice(3, -3);
                return (
                    <div key={index} className="my-3 bg-zinc-950 rounded-none overflow-hidden border border-zinc-800">
                        {lang && <div className="px-3 py-1 bg-zinc-900 text-xs text-zinc-400 border-b border-zinc-800">{lang}</div>}
                        <pre className="p-3 overflow-x-auto text-sm font-mono text-zinc-300">
                            {code}
                        </pre>
                    </div>
                );
            }
            // Regular text with bolding
            return (
                <p key={index} className="whitespace-pre-wrap mb-2 last:mb-0">
                    {part.split(/(\*\*.*?\*\*)/g).map((subPart, i) => {
                        if (subPart.startsWith('**') && subPart.endsWith('**')) {
                            return <strong key={i} className="text-purple-400 dark:text-purple-300">{subPart.slice(2, -2)}</strong>;
                        }
                        return subPart;
                    })}
                </p>
            );
        });
    };

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto font-mono">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-[300px]">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`
                            w-6 h-6 flex items-center justify-center shrink-0 border
                            ${msg.role === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-purple-900/40 border-purple-500/50'}
                        `}>
                            {msg.role === 'user' ? <User className="w-3 h-3 text-zinc-400" /> : <Bot className="w-3 h-3 text-purple-400" />}
                        </div>

                        <div className={`
                            max-w-[90%] px-4 py-3 border
                            ${msg.role === 'user'
                                ? 'bg-zinc-900/50 border-white/5 text-zinc-300'
                                : 'bg-black border-purple-500/20 text-zinc-300'
                            }
                        `}>
                            {msg.content === "" ? (
                                <div className="flex gap-1 py-1">
                                    <span className="w-1.5 h-1.5 bg-purple-500/50 animate-pulse"></span>
                                    <span className="w-1.5 h-1.5 bg-purple-500/50 animate-pulse [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-purple-500/50 animate-pulse [animation-delay:0.4s]"></span>
                                </div>
                            ) : (
                                renderContent(msg.content)
                            )}
                        </div>
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-6 border-t border-white/5 pt-4">
                <div className="relative flex items-end gap-3">
                    <button
                        onClick={clearChat}
                        className="p-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-colors border border-transparent hover:border-red-500/20"
                        title="Clear Session"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="relative flex-1">
                        <div className="absolute left-4 top-4 text-purple-500/50 select-none">{">"}</div>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a command or question..."
                            className="w-full bg-black border border-white/10 rounded-none px-8 py-3 pr-12 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none min-h-[52px]"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-2 bottom-2 p-2 bg-purple-600/10 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-3 px-1">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-tighter">
                        SYSTEM_STATUS: READY // AI_MODEL: GEMINI_2.5_FLASH
                    </p>
                    <p className="text-[10px] text-zinc-500 italic">
                        Context-aware mode active
                    </p>
                </div>
            </div>
        </div>
    );
};
