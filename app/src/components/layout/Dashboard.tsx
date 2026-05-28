import { useEffect, useState } from "react";
import { Configs, type CityOption } from "./Configs";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";

/** 利用可能な都市一覧 (JMA 府県週間天気予報 地域コード) */
const ALL_CITIES: CityOption[] = [
  { id: '016000', label: '北海道（網走・北見・紋別地方）' },
  { id: '130000', label: '東京都' },
  { id: '140000', label: '神奈川県' },
  { id: '230000', label: '愛知県' },
  { id: '270000', label: '大阪府' },
  { id: '400000', label: '福岡県' },
  { id: '471000', label: '沖縄本島地方' },
];

export function Dashboard() {
  // サイドバーの開閉状態
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // 設定パネルの開閉状態
  const [configsOpen, setConfigsOpen] = useState(false);
  // ダークモードの状態
  const [isDark, setIsDark] = useState(true);
  // 表示中の都市 ID 一覧 (初期値: 東京都のみ)
  const [selectedCities, setSelectedCities] = useState<string[]>(['130000']);

  // isDark が変わるたびに html 要素の light クラスを切り替える
  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const handleToggleCity = (id: string) => {
    setSelectedCities(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className='main-theme min-h-screen min-w-full flex'>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <Main
        cities={ALL_CITIES.filter(c => selectedCities.includes(c.id))}
      />
      <Configs
        isOpen={configsOpen}
        onToggle={() => setConfigsOpen(o => !o)}
        isDark={isDark}
        onThemeToggle={() => setIsDark(d => !d)}
        cities={ALL_CITIES}
        selectedCities={selectedCities}
        onToggleCity={handleToggleCity}
      />
    </div>
  )
}
