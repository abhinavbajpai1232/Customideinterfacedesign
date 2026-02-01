import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Lightbulb, MoreHorizontal, Zap } from "lucide-react";

const CODE_LINES = [
  { text: '// User model definition for authentication module', type: 'comment' },
  { text: 'import { Model, String, Int, DateTime } from "nova:std/db";', type: 'code' },
  { text: 'import { Auth } from "nova:std/security";', type: 'code' },
  { text: '', type: 'empty' },
  { text: 'export model User extends Model {', type: 'code' },
  { text: '  id: Int @primary @autoincrement', type: 'code' },
  { text: '  username: String @unique @length(3, 20)', type: 'code' },
  { text: '  email: String @unique @validate(email)', type: 'code' },
  { text: '  password_hash: String @private', type: 'code' },
  { text: '  created_at: DateTime @default(now)', type: 'code' },
  { text: '  role: Role @default(USER)', type: 'code' },
  { text: '', type: 'empty' },
  { text: '  // Helper to verify password', type: 'comment' },
  { text: '  func verifyPassword(attempt: String) -> Bool {', type: 'code' },
  { text: '    let hash = Auth.hash(attempt, this.salt);', type: 'code' },
  { text: '    reutrn hash == this.password_hash;', type: 'code', error: true }, // Typo error
  { text: '  }', type: 'code' },
  { text: '}', type: 'code' },
  { text: '', type: 'empty' },
  { text: 'enum Role {', type: 'code' },
  { text: '  ADMIN,', type: 'code' },
  { text: '  USER,', type: 'code' },
  { text: '  GUEST', type: 'code' },
  { text: '}', type: 'code' },
];

export function Editor() {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [breakpoints, setBreakpoints] = useState<number[]>([14]);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const toggleBreakpoint = (lineIndex: number) => {
    if (breakpoints.includes(lineIndex)) {
      setBreakpoints(breakpoints.filter(b => b !== lineIndex));
    } else {
      setBreakpoints([...breakpoints, lineIndex]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-sm font-mono overflow-hidden relative">
      {/* Tab Bar */}
      <div className="flex bg-[#010409] border-b border-slate-800">
        <div className="px-4 py-2 bg-[#0d1117] border-t-2 border-t-indigo-500 text-slate-200 text-xs flex items-center gap-2 min-w-[150px]">
          <span className="text-indigo-400 font-bold">N</span>
          <span>user.nva</span>
          <div className="ml-auto w-2 h-2 rounded-full bg-transparent hover:bg-slate-700 cursor-pointer flex items-center justify-center text-[10px]">×</div>
        </div>
        <div className="px-4 py-2 bg-transparent text-slate-500 hover:bg-[#0d1117]/50 text-xs flex items-center gap-2 cursor-pointer border-r border-slate-800/50">
          <span className="text-yellow-500 font-bold">JS</span>
          <span>utils.js</span>
        </div>
        <div className="px-4 py-2 bg-transparent text-slate-500 hover:bg-[#0d1117]/50 text-xs flex items-center gap-2 cursor-pointer border-r border-slate-800/50">
          <span className="text-blue-400 font-bold">#</span>
          <span>README.md</span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="flex min-h-full pb-20">
          {/* Gutter */}
          <div className="w-[60px] flex-shrink-0 bg-[#0d1117] border-r border-slate-800/30 flex flex-col items-end py-4 select-none text-slate-600 text-xs leading-6">
            {CODE_LINES.map((_, i) => (
              <div 
                key={i} 
                className="h-6 w-full pr-3 relative flex items-center justify-end cursor-pointer hover:text-slate-400 group"
                onMouseEnter={() => setHoveredLine(i)}
                onMouseLeave={() => setHoveredLine(null)}
                onClick={() => toggleBreakpoint(i)}
              >
                {/* Breakpoint Dot */}
                {(breakpoints.includes(i) || (hoveredLine === i)) && (
                   <div className={`absolute left-3 w-2.5 h-2.5 rounded-full transition-all ${
                     breakpoints.includes(i) 
                        ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" 
                        : "bg-red-500/30"
                   }`} />
                )}
                
                {/* Line Number */}
                <span className={breakpoints.includes(i) ? "text-slate-300 font-medium" : ""}>{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Code Area */}
          <div className="flex-1 py-4 pl-4 relative">
             {CODE_LINES.map((line, i) => (
                 <div key={i} className="h-6 leading-6 whitespace-pre font-ligatures relative group">
                     {/* Active Line Highlight */}
                     {i === 15 && (
                         <div className="absolute inset-0 -left-4 bg-indigo-500/5 pointer-events-none border-l-2 border-indigo-500/50" />
                     )}
                     
                     {/* Code content */}
                     <SyntaxHighlighter text={line.text} type={line.type} error={line.error} />
                     
                     {/* Error Underline & Widget */}
                     {line.error && (
                         <div className="absolute left-[8ch] bottom-0 w-[5ch] h-[2px] bg-red-500/80 wave-underline cursor-pointer"
                              onClick={() => setShowErrorDetails(!showErrorDetails)}
                         ></div>
                     )}

                     {/* AI Ghost Text */}
                     {i === 14 && (
                        <span className="opacity-30 italic ml-2">{'// Verifies the password hash against stored salt'}</span>
                     )}
                 </div>
             ))}

             {/* Floating AI Suggestion Card */}
             <AnimatePresence>
                 {showErrorDetails && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-[200px] top-[400px] z-20 w-[400px] bg-[#161b22] border border-slate-700 rounded-lg shadow-2xl overflow-hidden"
                    >
                        <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-red-900/10">
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle size={16} />
                                <span className="font-semibold text-xs">Syntax Error: Unknown Keyword</span>
                            </div>
                            <span className="text-[10px] text-slate-500">Ln 16, Col 5</span>
                        </div>
                        <div className="p-4">
                            <p className="text-slate-300 text-xs mb-3">
                                The keyword <code className="bg-slate-800 px-1 rounded text-red-300">reutrn</code> is not recognized. Did you mean <code className="bg-slate-800 px-1 rounded text-emerald-300">return</code>?
                            </p>
                            <div className="flex gap-2">
                                <button className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded flex items-center justify-center gap-2">
                                    <Zap size={12} />
                                    <span>Fix Typo</span>
                                </button>
                                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded flex items-center gap-2">
                                    <Lightbulb size={12} />
                                    <span>Explain</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                 )}
             </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Editor Footer / Breadcrumbs */}
      <div className="h-6 bg-[#010409] border-t border-slate-800 flex items-center px-4 text-[10px] text-slate-500 gap-2">
        <span className="hover:text-indigo-400 cursor-pointer">src</span>
        <span>/</span>
        <span className="hover:text-indigo-400 cursor-pointer">models</span>
        <span>/</span>
        <span className="text-slate-300 font-medium">user.nva</span>
        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">User</span>
        <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">verifyPassword</span>
      </div>
    </div>
  );
}

function SyntaxHighlighter({ text, type, error }: { text: string, type: string, error?: boolean }) {
    if (type === 'comment') return <span className="text-slate-500 italic">{text}</span>;
    if (type === 'empty') return <span>&nbsp;</span>;
    
    // Simple parser for mockup
    const parts = text.split(/(\s+|[(){}:,;.]|"[^"]*"|\/\/[^\n]*)/g).filter(Boolean);
    
    return (
        <span>
            {parts.map((part, i) => {
                let className = "text-slate-300";
                
                if (['import', 'export', 'model', 'func', 'return', 'enum', 'let', 'extends'].includes(part)) {
                    className = "text-indigo-400 font-bold";
                } else if (['Int', 'String', 'DateTime', 'Role', 'Bool', 'Model'].includes(part)) {
                    className = "text-emerald-400"; // Types
                } else if (part.startsWith('@')) {
                    className = "text-yellow-400"; // Decorators
                } else if (part.startsWith('"')) {
                    className = "text-orange-300"; // Strings
                } else if (['true', 'false', 'this'].includes(part)) {
                    className = "text-blue-400 italic";
                } else if (part === 'User' || part === 'Auth') {
                    className = "text-emerald-300";
                } else if (part.match(/^[A-Z][A-Z_]+$/)) {
                    className = "text-purple-400"; // Constants/Enums
                } else if (error && part === 'reutrn') {
                    className = "text-red-400 font-bold decoration-wavy underline decoration-red-500";
                }

                // Function names
                if (i > 1 && parts[i-2] === 'func') {
                    className = "text-blue-300";
                }
                
                return <span key={i} className={className}>{part}</span>;
            })}
        </span>
    );
}
