import { useState } from "react";
import { Terminal, AlertTriangle, Activity, Gauge, Trash2, Filter, ScrollText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { TerminalView } from "@/app/components/ide/TerminalView";

interface BottomPanelProps {
  collapsed: boolean;
}

type Tab = "terminal" | "output" | "problems" | "debug" | "analyzer";

const PERF_DATA = [
  { name: 'Startup', time: 120 },
  { name: 'Compile', time: 450 },
  { name: 'Lint', time: 80 },
  { name: 'TypeCheck', time: 150 },
  { name: 'Render', time: 200 },
];

const MEMORY_DATA = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  usage: 50 + Math.random() * 30 + (i * 2),
}));

export function BottomPanel({ collapsed }: BottomPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("terminal");

  if (collapsed) return <div className="h-full bg-slate-950 border-t border-slate-800" />;

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-t border-slate-800">
      {/* Tabs */}
      <div className="flex items-center h-9 bg-[#010409] border-b border-slate-800 px-2">
        <TabButton id="terminal" label="Terminal" icon={Terminal} active={activeTab} onClick={setActiveTab} />
        <TabButton id="output" label="Output" icon={ScrollText} active={activeTab} onClick={setActiveTab} />
        <TabButton id="problems" label="Problems" icon={AlertTriangle} active={activeTab} onClick={setActiveTab} badge={1} />
        <TabButton id="debug" label="Debug Console" icon={Activity} active={activeTab} onClick={setActiveTab} />
        <TabButton id="analyzer" label="Analyzer" icon={Gauge} active={activeTab} onClick={setActiveTab} />
        
        <div className="flex-1" />
        
        <div className="flex gap-2 mr-2">
            <button className="text-slate-500 hover:text-slate-300"><Trash2 size={14} /></button>
            <button className="text-slate-500 hover:text-slate-300"><Filter size={14} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden"> 
        {/* Note: TerminalView has its own scroll handling, so we remove overflow-y-auto from parent for it, 
            but keeping it for others might be needed. Actually TerminalView handles its own full height.
            Let's make the container flex-col so children can take full height.
        */}
        
        {activeTab === "terminal" && <TerminalView />}

        <div className={`h-full overflow-y-auto p-4 font-mono text-xs ${activeTab === 'terminal' ? 'hidden' : ''}`}>
            {activeTab === "output" && (
                <div className="flex flex-col gap-1 text-slate-400">
                    <div className="flex gap-2">
                        <span className="text-slate-500">[10:42:01]</span>
                        <span className="text-emerald-400">BUILD SUCCESS</span>
                        <span>Target: debug/x86_64</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-500">[10:42:02]</span>
                        <span>Starting Nova Runtime...</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-500">[10:42:02]</span>
                        <span>Listening on port 8080</span>
                    </div>
                     <div className="flex gap-2">
                        <span className="text-slate-500">[10:42:05]</span>
                        <span className="text-blue-400">INFO</span>
                        <span>GET /api/users/me 200 OK (12ms)</span>
                    </div>
                </div>
            )}

            {activeTab === "problems" && (
                <div className="flex flex-col gap-0">
                    <div className="flex items-start gap-2 p-2 hover:bg-slate-800/50 rounded cursor-pointer group border border-transparent hover:border-slate-800">
                        <AlertTriangle size={14} className="text-red-400 mt-0.5" />
                        <div className="flex flex-col">
                            <span className="text-slate-300">Syntax Error: Unknown keyword 'reutrn'</span>
                            <span className="text-slate-500">src/models/user.nva [16, 5]</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 hover:bg-slate-800/50 rounded cursor-pointer group border border-transparent hover:border-slate-800">
                        <AlertTriangle size={14} className="text-yellow-400 mt-0.5" />
                        <div className="flex flex-col">
                            <span className="text-slate-300">Warning: Unused import 'DateTime'</span>
                            <span className="text-slate-500">src/models/user.nva [2, 34]</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "debug" && (
                <div className="flex h-full gap-4">
                     <div className="w-1/3 border-r border-slate-800 pr-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-400">VARIABLES</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <VarRow name="this" type="User" value="{ id: 42, ... }" />
                            <VarRow name="attempt" type="String" value="&quot;supersecret&quot;" />
                            <VarRow name="hash" type="String" value="&quot;a7f8g9...&quot;" />
                        </div>
                     </div>
                     <div className="flex-1">
                         <span className="text-slate-500 italic">Call Stack</span>
                         <div className="flex flex-col gap-1 mt-2">
                            <div className="text-emerald-400">User.verifyPassword (user.nva:15)</div>
                            <div className="text-slate-400">AuthController.login (auth_controller.nva:45)</div>
                            <div className="text-slate-600">Runtime.handleRequest (internal)</div>
                         </div>
                     </div>
                </div>
            )}

            {activeTab === "analyzer" && (
                <div className="flex h-full gap-8">
                    <div className="flex-1 flex flex-col">
                        <h3 className="text-slate-400 font-bold mb-4 flex items-center gap-2">
                            <Activity size={16} /> BUILD PERFORMANCE
                        </h3>
                        <div className="flex-1 w-full min-h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={PERF_DATA} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{fill: '#94a3b8', fontSize: 10}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}}
                                        itemStyle={{color: '#e2e8f0'}}
                                    />
                                    <Bar dataKey="time" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                        <h3 className="text-slate-400 font-bold mb-4 flex items-center gap-2">
                             <Gauge size={16} /> MEMORY USAGE (MB)
                        </h3>
                        <div className="flex-1 w-full min-h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={MEMORY_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="time" hide />
                                    <YAxis tick={{fill: '#94a3b8', fontSize: 10}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}}
                                        itemStyle={{color: '#e2e8f0'}}
                                    />
                                    <Line type="monotone" dataKey="usage" stroke="#10b981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ id, label, icon: Icon, active, onClick, badge }: any) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center gap-2 px-3 h-full border-b-2 text-xs transition-colors ${
                active === id 
                ? "border-indigo-500 text-slate-200 bg-slate-800/50" 
                : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
            }`}
        >
            <Icon size={14} />
            <span>{label}</span>
            {badge && (
                <span className="flex items-center justify-center bg-indigo-500 text-white text-[9px] rounded-full w-4 h-4">{badge}</span>
            )}
        </button>
    )
}

function VarRow({ name, type, value }: any) {
    return (
        <div className="flex gap-2 group hover:bg-slate-800/50 px-2 py-1 rounded">
            <span className="text-indigo-400 w-16 truncate">{name}</span>
            <span className="text-slate-500 w-12 truncate text-[10px] mt-0.5">{type}</span>
            <span className="text-orange-300 truncate font-mono">{value}</span>
        </div>
    )
}
