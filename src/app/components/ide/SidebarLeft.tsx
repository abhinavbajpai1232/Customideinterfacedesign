import { useState } from "react";
import { Files, GitBranch, Database, Package, Blocks, Search, ChevronRight, ChevronDown, FileCode, MoreHorizontal, Folder } from "lucide-react";

export type View = "explorer" | "search" | "git" | "database" | "packages" | "extensions";

interface ActivityBarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

export function ActivityBar({ activeView, onViewChange }: ActivityBarProps) {
  const navItems = [
    { id: "explorer", icon: Files, label: "Explorer" },
    { id: "search", icon: Search, label: "Search" },
    { id: "git", icon: GitBranch, label: "Source Control" },
    { id: "database", icon: Database, label: "Database" },
    { id: "packages", icon: Package, label: "Packages" },
    { id: "extensions", icon: Blocks, label: "Extensions" },
  ];

  return (
    <div className="w-[50px] h-full flex flex-col items-center py-4 gap-4 border-r border-slate-800 bg-slate-950 z-10 text-slate-500">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id as View)}
          className={`p-2 rounded-md transition-all relative group ${
            activeView === item.id ? "text-indigo-400 bg-indigo-500/10" : "hover:text-slate-300 hover:bg-slate-800"
          }`}
          title={item.label}
        >
          <item.icon size={20} strokeWidth={1.5} />
          {activeView === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full -ml-[9px]" />
          )}
        </button>
      ))}
    </div>
  );
}

interface SidebarContentProps {
  activeView: View;
}

export function SidebarContent({ activeView }: SidebarContentProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["src", "src/models"]);

  const toggleFolder = (folder: string) => {
    if (expandedFolders.includes(folder)) {
      setExpandedFolders(expandedFolders.filter((f) => f !== folder));
    } else {
      setExpandedFolders([...expandedFolders, folder]);
    }
  };

  const titles: Record<View, string> = {
      explorer: "Explorer",
      search: "Search",
      git: "Source Control",
      database: "Database Manager",
      packages: "Packages",
      extensions: "Extensions"
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 border-r border-slate-800">
      <div className="h-10 flex items-center px-4 font-medium text-xs text-slate-400 tracking-wider uppercase border-b border-slate-800/50 justify-between bg-slate-950">
        <span>{titles[activeView]}</span>
        <MoreHorizontal size={14} className="cursor-pointer hover:text-slate-200" />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {activeView === "explorer" && (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 py-1 px-2 text-slate-400 hover:bg-slate-800/50 rounded cursor-pointer group">
                    <ChevronDown size={14} />
                    <span className="text-sm font-bold text-slate-300">HYPERION-CORE</span>
                </div>
                
                <FileTreeItem 
                    name="src" 
                    isFolder 
                    expanded={expandedFolders.includes("src")} 
                    level={1} 
                    onClick={() => toggleFolder("src")}
                />
                {expandedFolders.includes("src") && (
                    <>
                        <FileTreeItem 
                            name="controllers" 
                            isFolder 
                            expanded={expandedFolders.includes("src/controllers")} 
                            level={2} 
                            onClick={() => toggleFolder("src/controllers")} 
                        />
                        {expandedFolders.includes("src/controllers") && (
                            <FileTreeItem name="auth_controller.nva" level={3} />
                        )}
                        
                        <FileTreeItem 
                            name="models" 
                            isFolder 
                            expanded={expandedFolders.includes("src/models")} 
                            level={2} 
                            onClick={() => toggleFolder("src/models")} 
                        />
                        {expandedFolders.includes("src/models") && (
                            <>
                                <FileTreeItem name="user.nva" level={3} active />
                                <FileTreeItem name="product.nva" level={3} />
                            </>
                        )}
                         <FileTreeItem name="main.nva" level={2} />
                         <FileTreeItem name="utils.nva" level={2} />
                    </>
                )}
                
                <FileTreeItem name="tests" isFolder level={1} />
                <FileTreeItem name="config.nva" level={1} />
                <FileTreeItem name="package.json" level={1} icon={<Package size={14} className="text-orange-400/70" />} />
                <FileTreeItem name="README.md" level={1} icon={<FileCode size={14} className="text-blue-400/70" />} />
            </div>
        )}

        {activeView === "database" && (
            <div className="flex flex-col gap-4 p-2">
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400">CONNECTIONS</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Database size={14} className="text-indigo-400" />
                        <span>prod_db_v1</span>
                    </div>
                </div>
                
                <div>
                    <span className="text-xs font-bold text-slate-500 mb-2 block px-1">TABLES</span>
                    <div className="flex flex-col gap-1">
                        <TableItem name="users" count={1204} />
                        <TableItem name="products" count={45} />
                        <TableItem name="orders" count={892} />
                        <TableItem name="sessions" count={12} />
                    </div>
                </div>
            </div>
        )}
        
        {activeView === "packages" && (
            <div className="flex flex-col gap-2">
                 <div className="p-3 bg-slate-900/50 rounded border border-slate-800 mb-2">
                    <h3 className="text-xs font-bold text-slate-400 mb-2">INSTALLED</h3>
                    <div className="space-y-2">
                         <PackageItem name="nova-http" version="1.2.0" />
                         <PackageItem name="nova-sql" version="0.9.4" />
                         <PackageItem name="nova-test" version="2.0.1" />
                    </div>
                 </div>
                 <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded transition-colors">
                    Add Dependency
                 </button>
            </div>
        )}

        {/* Other views placeholders */}
        {(activeView === "git" || activeView === "search" || activeView === "extensions") && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                <span className="text-xs">Coming soon</span>
            </div>
        )}
      </div>
    </div>
  );
}

function FileTreeItem({ name, isFolder, expanded, level, active, onClick, icon }: any) {
    return (
        <div 
            onClick={onClick}
            className={`flex items-center gap-1 py-1 pr-2 rounded cursor-pointer select-none transition-colors ${
                active ? "bg-indigo-500/20 text-indigo-300" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
            {isFolder ? (
                <ChevronRight size={14} className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
            ) : (
                <div className="w-[14px] flex justify-center">
                    {icon || <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                </div>
            )}
            
            {isFolder ? (
                 <Folder size={14} className={expanded ? "text-indigo-400" : "text-slate-500"} />
            ) : null}
            
            <span className={`text-sm truncate ${active ? "font-medium" : ""}`}>{name}</span>
        </div>
    )
}

function TableItem({ name, count }: any) {
    return (
        <div className="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer group text-slate-400 hover:text-slate-200">
            <div className="flex items-center gap-2">
                <Database size={12} className="opacity-50" />
                <span className="text-sm font-mono">{name}</span>
            </div>
            <span className="text-[10px] text-slate-600 group-hover:text-slate-500">{count} rows</span>
        </div>
    )
}

function PackageItem({ name, version }: any) {
    return (
        <div className="flex items-center justify-between group">
            <span className="text-sm text-slate-300">{name}</span>
            <span className="text-xs text-slate-500 font-mono">v{version}</span>
        </div>
    )
}
