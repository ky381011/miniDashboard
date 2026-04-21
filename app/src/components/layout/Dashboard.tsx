import { useEffect, useState } from "react";
import { Configs } from "./Configs";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [configsOpen, setConfigsOpen] = useState(true);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  return (
    <div className='main-theme min-h-screen min-w-full flex'>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <Main />
      <Configs
        isOpen={configsOpen}
        onToggle={() => setConfigsOpen(o => !o)}
        isDark={isDark}
        onThemeToggle={() => setIsDark(d => !d)}
      />
    </div>
  )
}
