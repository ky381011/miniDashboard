import { getPanelClasses } from '../../utils/panelClasses';

/** 都市の定義 */
export interface CityOption {
  id: string;   // JMA 地域コード
  label: string; // 表示名
}

/** 地方グループ */
export interface RegionGroup {
  region: string;   // 地方名
  cities: CityOption[];
}

/** 設定パネルコンポーネントのProps */
interface ConfigsProps {
  /** パネルが開いているかどうか (true: 展開, false: 折りたたみ) */
  isOpen: boolean;
  /** 開閉状態を切り替えるコールバック */
  onToggle: () => void;
  /** ダークモードかどうか (true: ダーク, false: ライト) */
  isDark: boolean;
  /** テーマを切り替えるコールバック */
  onThemeToggle: () => void;
  /** 地方でグループ化された都市一覧 */
  cityGroups: RegionGroup[];
  /** 現在表示中の都市 ID 一覧 */
  selectedCities: string[];
  /** 都市の表示/非表示を切り替えるコールバック */
  onToggleCity: (id: string) => void;
}

/**
 * Configs コンポーネント (設定パネル)
 * - 画面右端に配置し、isOpen に応じて w-48 / w-10 をアニメーション切り替え
 * - パネルが開いているときのみテーマ切り替えボタンとウィジェット選択を表示する
 */
export function Configs({ isOpen, onToggle, isDark, onThemeToggle, cityGroups, selectedCities, onToggleCity }: ConfigsProps) {
  return (
    // 設定パネル全体のラッパー: isOpen に応じて幅をアニメーション切り替え
    <div className={getPanelClasses(isOpen, 'right')}>
      <div className='flex flex-col h-full min-h-screen'>
        {/* 歯車アイコンボタン: クリックで onToggle を呼び出す */}
        <button
          onClick={onToggle}
          className='w-10 p-2 theme-icon-btn flex justify-center shrink-0 ml-auto'
          aria-label='Toggle configs'
        >
          <i className={`fa-solid fa-gear text-lg transition-colors duration-700 ${isOpen ? 'text-blue-400' : ''}`}></i>
        </button>

        {/* 表示都市リスト: isOpen に応じて opacity をアニメーション切り替え */}
        <div className={`flex-1 flex flex-col min-h-0 border-b theme-border transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <p className='theme-text-muted text-xs px-3 pt-3 pb-1 whitespace-nowrap shrink-0'>表示都市</p>
          <div className='flex-1 overflow-y-auto'>
            {cityGroups.map(group => (
              <div key={group.region}>
                <p className='px-3 pt-2 pb-0.5 text-xs theme-text-muted font-semibold border-t theme-border first:border-t-0 whitespace-nowrap'>
                  {group.region}
                </p>
                {group.cities.map(c => (
                  <label
                    key={c.id}
                    className='flex items-center gap-2 pl-5 pr-2 py-1 cursor-pointer theme-icon-btn w-full text-xs theme-text'
                  >
                    <input
                      type='checkbox'
                      checked={selectedCities.includes(c.id)}
                      onChange={() => onToggleCity(c.id)}
                      className='accent-blue-400 shrink-0'
                    />
                    <span className='truncate'>{c.label}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* テーマ切り替えセクション: isOpen に応じて opacity をアニメーション切り替え */}
        <div className={`p-3 border-t theme-border whitespace-nowrap overflow-hidden transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <p className='theme-text-muted text-xs mb-2'>テーマ</p>
          {/* テーマ切り替えボタン: isDark に応じてアイコンとラベルを切り替え */}
          <button
            onClick={onThemeToggle}
            className='flex items-center gap-2 theme-text hover:opacity-70 w-full'
            aria-label='Toggle theme'
          >
            <i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'} theme-text-muted`}></i>
            <span className='text-sm theme-text-subtle'>{isDark ? 'ダーク' : 'ライト'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
