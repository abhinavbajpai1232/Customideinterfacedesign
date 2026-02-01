import { Send, Bot, Sparkles, MessageSquare, CornerDownLeft, X } from "lucide-react";
import { useState } from "react";

export function SidebarRightContent() {
  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800">
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-slate-800/50 bg-slate-950">
        <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm">
            <Bot size={16} />
            <span>AI Assistant</span>
        </div>
        <div className="flex gap-2">
            <button className="text-slate-500 hover:text-slate-300">
                <X size={14} />
            </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <ChatMessage 
            role="ai" 
            text="Hello! I see you're working on the `User` model. I noticed a typo on line 16. Would you like me to fix it automatically?" 
            timestamp="10:42 AM"
        />
        
        <div className="flex flex-col gap-2">
            <button className="text-left p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors group">
                <div className="flex items-center gap-2 mb-1 text-indigo-300 text-xs font-semibold">
                    <Sparkles size={12} />
                    <span>Suggestion</span>
                </div>
                <p className="text-slate-300 text-xs">Fix `reutrn` to `return`</p>
            </button>
             <button className="text-left p-3 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors group">
                <div className="flex items-center gap-2 mb-1 text-emerald-400 text-xs font-semibold">
                    <MessageSquare size={12} />
                    <span>Explain</span>
                </div>
                <p className="text-slate-300 text-xs">Why is the `verifyPassword` function returning a boolean directly?</p>
            </button>
        </div>

        <ChatMessage 
            role="user" 
            text="Yes, please fix the typo. Also, can you optimize the hashing method?" 
            timestamp="10:43 AM"
        />
        
        <ChatMessage 
            role="ai" 
            text="I've corrected the typo. Regarding the hashing method, using `Auth.hash` is secure, but since you are calling it frequently, we could cache the result if the salt hasn't changed. Here is an example:" 
            timestamp="10:43 AM"
        />
        
        <div className="p-3 bg-[#0d1117] rounded border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
                <span className="text-[10px] text-slate-500">SUGGESTED CHANGE</span>
                <button className="text-[10px] text-indigo-400 hover:underline">APPLY</button>
            </div>
            <pre className="text-emerald-400">
{`func verifyPassword(attempt: String) -> Bool {
  return Auth.verify(attempt, this.hash);
}`}
            </pre>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="relative">
            <textarea 
                placeholder="Ask anything about your code..." 
                className="w-full h-20 bg-slate-900 border border-slate-800 rounded-lg p-3 pr-10 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
            <button className="absolute right-2 bottom-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors">
                <CornerDownLeft size={14} />
            </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
            <span>Context: Active File (user.nva)</span>
            <span>NovaAI v2.1</span>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ role, text, timestamp }: { role: 'user' | 'ai', text: string, timestamp: string }) {
    const isAi = role === 'ai';
    return (
        <div className={`flex flex-col gap-1 ${isAi ? "items-start" : "items-end"}`}>
            <div className={`flex items-center gap-2 text-[10px] text-slate-500 ${isAi ? "" : "flex-row-reverse"}`}>
                <span className="font-semibold">{isAi ? "Nova AI" : "You"}</span>
                <span>{timestamp}</span>
            </div>
            <div className={`max-w-[90%] p-3 rounded-lg text-xs leading-relaxed ${
                isAi 
                ? "bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-none" 
                : "bg-indigo-600 text-white rounded-tr-none"
            }`}>
                {text}
            </div>
        </div>
    )
}
