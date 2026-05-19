import { useEffect, useState } from "react";
import { Configs } from "./Configs";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";

export function Dashboard() {
  // サイドバーの開閉状態
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // 設定パネルの開閉状態
  const [configsOpen, setConfigsOpen] = useState(true);
  // ダークモードの状態
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
