import {
  PanelResizeHandle,
  Panel,
  PanelGroup,
  ImperativePanelHandle
} from "react-resizable-panels";
import { TopBar } from "@/app/components/ide/TopBar";
import { ActivityBar, SidebarContent, View } from "@/app/components/ide/SidebarLeft";
import { SidebarRightContent } from "@/app/components/ide/SidebarRight";
import { Editor } from "@/app/components/ide/Editor";
import { BottomPanel } from "@/app/components/ide/BottomPanel";
import { useState, useRef } from "react";
import { Bot, Layers } from "lucide-react";

export function Layout() {
  const [activeLeftView, setActiveLeftView] = useState<View>("explorer");
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(false);
  
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  const handleActivityBarClick = (view: View) => {
    if (isLeftCollapsed) {
        setActiveLeftView(view);
        leftPanelRef.current?.expand();
    } else {
        if (activeLeftView === view) {
            leftPanelRef.current?.collapse();
        } else {
            setActiveLeftView(view);
        }
    }
  };

  const toggleRightPanel = () => {
      if (isRightCollapsed) {
          rightPanelRef.current?.expand();
      } else {
          rightPanelRef.current?.collapse();
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-300">
      <TopBar />
      <div className="flex-1 overflow-hidden flex">
        {/* Left Activity Bar */}
        <ActivityBar 
            activeView={activeLeftView} 
            onViewChange={handleActivityBarClick} 
        />

        <PanelGroup direction="horizontal">
          <Panel
            ref={leftPanelRef}
            defaultSize={20}
            minSize={15}
            maxSize={30}
            collapsible={true}
            onCollapse={() => setIsLeftCollapsed(true)}
            onExpand={() => setIsLeftCollapsed(false)}
            className={`transition-opacity duration-300 ${
                isLeftCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            <SidebarContent activeView={activeLeftView} />
          </Panel>
          
          <PanelResizeHandle className="w-1 bg-slate-900 hover:bg-indigo-500/50 transition-colors" />

          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30}>
                <Editor />
              </Panel>
              
              <PanelResizeHandle className="h-1 bg-slate-900 hover:bg-indigo-500/50 transition-colors" />
              
              <Panel
                defaultSize={30}
                minSize={10}
                collapsible={true}
                onCollapse={() => setIsBottomCollapsed(true)}
                onExpand={() => setIsBottomCollapsed(false)}
              >
                <BottomPanel collapsed={isBottomCollapsed} />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1 bg-slate-900 hover:bg-indigo-500/50 transition-colors" />

          <Panel
            ref={rightPanelRef}
            defaultSize={20}
            minSize={15}
            maxSize={30}
            collapsible={true}
            onCollapse={() => setIsRightCollapsed(true)}
            onExpand={() => setIsRightCollapsed(false)}
            className={`transition-opacity duration-300 ${
                isRightCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            <SidebarRightContent />
          </Panel>
        </PanelGroup>
        
        {/* Right Activity Bar */}
        <div className="w-[50px] h-full flex flex-col items-center py-4 gap-4 border-l border-slate-800 bg-slate-950 z-10 text-slate-500">
            <button
              onClick={toggleRightPanel}
              className={`p-2 rounded-md transition-all relative group ${
                !isRightCollapsed ? "text-indigo-400 bg-indigo-500/10" : "hover:text-slate-300 hover:bg-slate-800"
              }`}
              title="AI Assistant"
            >
              <Bot size={20} strokeWidth={1.5} />
              {!isRightCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-l-full -mr-[9px]" />
              )}
            </button>
            <button className="p-2 rounded-md transition-all text-slate-500 hover:text-slate-300 hover:bg-slate-800" title="Layout">
                <Layers size={20} strokeWidth={1.5} />
            </button>
        </div>
      </div>
      
      {/* StatusBar */}
      <div className="h-6 bg-[#0d1117] border-t border-slate-800 flex items-center px-4 text-[10px] text-slate-500 justify-between select-none">
         <div className="flex gap-4">
             <div className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>master*</span>
             </div>
             <div className="flex items-center gap-2">
                 <span className="hover:text-slate-300 cursor-pointer">0 errors</span>
                 <span className="hover:text-slate-300 cursor-pointer">0 warnings</span>
             </div>
         </div>
         <div className="flex gap-4">
             <span className="hover:text-slate-300 cursor-pointer">Ln 15, Col 34</span>
             <span className="hover:text-slate-300 cursor-pointer">UTF-8</span>
             <span className="hover:text-slate-300 cursor-pointer">Nova</span>
             <div className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>AI Ready</span>
             </div>
         </div>
      </div>
    </div>
  );
}
