import { useState, useEffect, useRef, FormEvent } from "react";

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
  directory?: string;
}

export function TerminalView() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'info', content: 'Nova v1.0.0 [Linux x64]'},
    { id: '2', type: 'info', content: 'Type "help" for more information.'},
  ]);
  const [input, setInput] = useState("");
  const [directory, setDirectory] = useState("~/projects/nova-app");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(" ");
    const command = args[0].toLowerCase();
    
    // Echo command
    setLines(prev => [...prev, { 
      id: Math.random().toString(36), 
      type: 'input', 
      content: cmd,
      directory 
    }]);

    if (!command) return;

    let output: TerminalLine | null = null;
    let extraOutput: TerminalLine[] = [];

    switch (command) {
      case 'help':
        output = { id: Math.random().toString(), type: 'output', content: 'Available commands: help, clear, ls, nova, cd, whoami, git' };
        break;
      case 'clear':
        setLines([]);
        return;
      case 'ls':
        output = { id: Math.random().toString(), type: 'output', content: 'src  public  package.json  README.md  nova.config.js' };
        break;
      case 'whoami':
        output = { id: Math.random().toString(), type: 'output', content: 'developer' };
        break;
      case 'git':
         if (args[1] === 'status') {
            output = { id: Math.random().toString(), type: 'output', content: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nworking tree clean' };
         } else {
            output = { id: Math.random().toString(), type: 'output', content: 'usage: git <command> [<args>]' };
         }
         break;
      case 'cd':
         if (args[1]) {
             setDirectory(prev => {
                 if (args[1] === '..') {
                    const parts = prev.split('/');
                    if (parts.length > 1) parts.pop();
                    return parts.join('/') || '~';
                 }
                 if (args[1].startsWith('/')) return args[1];
                 if (args[1] === '~') return '~';
                 return `${prev}/${args[1]}`;
             });
         }
         break;
      case 'nova':
        if (args[1] === 'run') {
           extraOutput = [
             { id: Math.random().toString(), type: 'info', content: 'Compiling main.nva...' },
             { id: Math.random().toString(), type: 'info', content: 'Build successful (450ms)' },
             { id: Math.random().toString(), type: 'output', content: '> Running application on localhost:8080' }
           ];
        } else if (args[1] === 'build') {
           extraOutput = [
               { id: Math.random().toString(), type: 'info', content: 'Building project target: debug/x86_64' },
               { id: Math.random().toString(), type: 'info', content: 'Optimizing resources...' },
               { id: Math.random().toString(), type: 'info', content: 'Success! Output: /dist/main' }
           ];
        } else if (args[1] === 'version') {
            output = { id: Math.random().toString(), type: 'output', content: 'Nova Compiler v1.0.0' };
        } else {
           output = { id: Math.random().toString(), type: 'output', content: 'Nova Compiler v1.0.0\nUsage: nova [run|build|test|version]' };
        }
        break;
      default:
        output = { id: Math.random().toString(), type: 'error', content: `bash: ${command}: command not found` };
    }

    if (output) {
       setLines(prev => [...prev, output!]);
    }
    if (extraOutput.length > 0) {
        // Add them one by one to simulate processing if needed, but here just batch add
        setLines(prev => [...prev, ...extraOutput]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
         // Just print a new line prompt
         setLines(prev => [...prev, { 
            id: Math.random().toString(36), 
            type: 'input', 
            content: '',
            directory 
        }]);
    } else {
        handleCommand(input);
    }
    setInput("");
  };

  return (
    <div 
        className="h-full w-full bg-[#0d1117] p-4 font-mono text-xs overflow-y-auto cursor-text"
        onClick={() => inputRef.current?.focus()}
    >
      {lines.map(line => (
        <div key={line.id} className="mb-1 leading-relaxed break-all whitespace-pre-wrap">
          {line.type === 'input' ? (
             <div className="flex flex-wrap gap-x-2 items-center">
                 <span className="text-emerald-400 font-bold">➜</span>
                 <span className="text-blue-400">{line.directory}</span>
                 <span className="text-slate-200">{line.content}</span>
             </div>
          ) : (
            <div className={`ml-4 ${
                line.type === 'error' ? 'text-red-400' : 
                line.type === 'info' ? 'text-blue-300' : 'text-slate-300'
            }`}>
                {line.content}
            </div>
          )}
        </div>
      ))}
      
      <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-1">
        <span className="text-emerald-400 font-bold shrink-0">➜</span>
        <span className="text-blue-400 shrink-0">{directory}</span>
        <input 
            ref={inputRef}
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-600 min-w-[50px]"
            autoFocus
            autoComplete="off"
            spellCheck="false"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
