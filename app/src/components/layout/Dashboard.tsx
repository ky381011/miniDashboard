import { useState } from "react";
import { Configs } from "./Configs";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [configsOpen, setConfigsOpen] = useState(true);

  return (
    <div className='bg-mauve-950 min-h-screen min-w-full flex'>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <Main />
      <Configs isOpen={configsOpen} onToggle={() => setConfigsOpen(o => !o)} />
    </div>
  )
}
