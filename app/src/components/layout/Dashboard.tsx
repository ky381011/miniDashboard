import { useEffect, useState } from "react";
import { Configs, type WidgetOption } from "./Configs";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";

/** 利用可能なウィジェット一覧 */
const ALL_WIDGETS: WidgetOption[] = [
  { id: 'weather', label: '天気予報', icon: 'fa-cloud-sun' },
];

export function Dashboard() {
  // サイドバーの開閉状態
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // 設定パネルの開閉状態
  const [configsOpen, setConfigsOpen] = useState(false);
  // ダークモードの状態
  const [isDark, setIsDark] = useState(true);
  // 表示中のウィジェット ID 一覧 (初期値: すべて表示)
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(ALL_WIDGETS.map(w => w.id));

  // isDark が変わるたびに html 要素の light クラスを切り替える
  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const handleToggleWidget = (id: string) => {
    setVisibleWidgets(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  return (
    <div className='main-theme min-h-screen min-w-full flex'>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <Main visibleWidgets={visibleWidgets} />
      <Configs
        isOpen={configsOpen}
        onToggle={() => setConfigsOpen(o => !o)}
        isDark={isDark}
        onThemeToggle={() => setIsDark(d => !d)}
        widgets={ALL_WIDGETS}
        visibleWidgets={visibleWidgets}
        onToggleWidget={handleToggleWidget}
      />
    </div>
  )
}
