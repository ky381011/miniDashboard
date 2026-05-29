import { useEffect, useState } from "react";
import { Configs, type CityOption, type RegionGroup } from "./Configs";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";

/** JMA 府県週間天気予報 (VPFW50) の地域コードを地方別に定義 */
const ALL_CITY_GROUPS: RegionGroup[] = [
  {
    region: '北海道',
    cities: [
      { id: '011000', label: '宗谷地方' },
      { id: '012000', label: '上川・留萌地方' },
      { id: '013000', label: '網走・北見・紋別地方' },
      { id: '014030', label: '十勝地方' },
      { id: '014040', label: '釧路地方' },
      { id: '014050', label: '根室地方' },
      { id: '016000', label: '胆振・日高地方' },
      { id: '017000', label: '渡島・檜山地方' },
    ],
  },
  {
    region: '東北',
    cities: [
      { id: '020000', label: '青森県' },
      { id: '030000', label: '岩手県' },
      { id: '040000', label: '宮城県' },
      { id: '050000', label: '秋田県' },
      { id: '060000', label: '山形県' },
      { id: '070000', label: '福島県' },
    ],
  },
  {
    region: '関東甲信',
    cities: [
      { id: '080000', label: '茨城県' },
      { id: '090000', label: '栃木県' },
      { id: '100000', label: '群馬県' },
      { id: '110000', label: '埼玉県' },
      { id: '120000', label: '千葉県' },
      { id: '130000', label: '東京都' },
      { id: '140000', label: '神奈川県' },
      { id: '190000', label: '山梨県' },
      { id: '200000', label: '長野県' },
    ],
  },
  {
    region: '北陸',
    cities: [
      { id: '150000', label: '新潟県' },
      { id: '160000', label: '富山県' },
      { id: '170000', label: '石川県' },
      { id: '180000', label: '福井県' },
    ],
  },
  {
    region: '東海',
    cities: [
      { id: '210000', label: '岐阜県' },
      { id: '220000', label: '静岡県' },
      { id: '230000', label: '愛知県' },
      { id: '240000', label: '三重県' },
    ],
  },
  {
    region: '近畿',
    cities: [
      { id: '250000', label: '滋賀県' },
      { id: '260000', label: '京都府' },
      { id: '270000', label: '大阪府' },
      { id: '280000', label: '兵庫県' },
      { id: '290000', label: '奈良県' },
      { id: '300000', label: '和歌山県' },
    ],
  },
  {
    region: '中国',
    cities: [
      { id: '310000', label: '鳥取県' },
      { id: '320000', label: '島根県' },
      { id: '330000', label: '岡山県' },
      { id: '340000', label: '広島県' },
      { id: '350000', label: '山口県' },
    ],
  },
  {
    region: '四国',
    cities: [
      { id: '360000', label: '徳島県' },
      { id: '370000', label: '香川県' },
      { id: '380000', label: '愛媛県' },
      { id: '390000', label: '高知県' },
    ],
  },
  {
    region: '九州',
    cities: [
      { id: '400000', label: '福岡県' },
      { id: '410000', label: '佐賀県' },
      { id: '420000', label: '長崎県' },
      { id: '430000', label: '熊本県' },
      { id: '440000', label: '大分県' },
      { id: '450000', label: '宮崎県' },
      { id: '460100', label: '鹿児島県' },
    ],
  },
  {
    region: '沖縄',
    cities: [
      { id: '471000', label: '沖縄本島地方' },
      { id: '472000', label: '大東島地方' },
      { id: '473000', label: '宮古島地方' },
      { id: '474000', label: '八重山地方' },
    ],
  },
];

/** 全都市のフラットな配列 */
const ALL_CITIES: CityOption[] = ALL_CITY_GROUPS.flatMap(g => g.cities);

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
        cityGroups={ALL_CITY_GROUPS}
        selectedCities={selectedCities}
        onToggleCity={handleToggleCity}
      />
    </div>
  )
}
