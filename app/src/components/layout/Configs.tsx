import { useEffect, useRef, useState } from 'react';
import { getPanelClasses } from '../../utils/panelClasses';

/** 都市の定義 */
export interface CityOption {
  id: string;   // JMA 地域コード
  label: string; // 表示名
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
  /** 利用可能な都市一覧 */
  cities: CityOption[];
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
export function Configs({ isOpen, onToggle, isDark, onThemeToggle, cities, selectedCities, onToggleCity }: ConfigsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // パネルが閉じられたらドロップダウンも閉じる
  useEffect(() => {
    if (!isOpen) setDropdownOpen(false);
  }, [isOpen]);

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const selectionLabel =
    selectedCities.length === 0
      ? 'なし'
      : selectedCities.length === cities.length
      ? 'すべて'
      : `${selectedCities.length} / ${cities.length}`;

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
          {/* Font Awesome の歯車アイコン */}
          <i className={`fa-solid fa-gear text-lg transition-colors duration-700 ${isOpen ? 'text-blue-400' : ''}`}></i>
        </button>

        {/* ウィジェット表示選択: isOpen に応じて opacity をアニメーション切り替え */}
        <div className={`p-3 border-b theme-border transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <p className='theme-text-muted text-xs mb-2 whitespace-nowrap'>表示都市</p>
          <div ref={dropdownRef}>
            {/* ドロップダウントリガーボタン */}
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className='w-full flex items-center justify-between gap-1 text-xs theme-text border theme-border rounded px-2 py-1 hover:opacity-70 whitespace-nowrap overflow-hidden'
            >
              <span>{selectionLabel}</span>
              <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* チェックボックスリスト (通常フローで展開) */}
            {dropdownOpen && (
              <div className='mt-1 border theme-border rounded overflow-hidden'>
                {cities.map(c => (
                  <label
                    key={c.id}
                    className='flex items-center gap-2 px-2 py-1.5 cursor-pointer theme-icon-btn w-full text-xs theme-text'
                  >
                    <input
                      type='checkbox'
                      checked={selectedCities.includes(c.id)}
                      onChange={() => onToggleCity(c.id)}
                      className='accent-blue-400 shrink-0'
                    />
                    <i className='fa-solid fa-location-dot theme-text-muted shrink-0' />
                    <span className='truncate'>{c.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* テーマ切り替えセクション: isOpen に応じて opacity をアニメーション切り替え */}
        <div className={`mt-auto p-3 border-t theme-border whitespace-nowrap overflow-hidden transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <p className='theme-text-muted text-xs mb-2'>テーマ</p>
          {/* テーマ切り替えボタン: isDark に応じてアイコンとラベルを切り替え */}
          <button
            onClick={onThemeToggle}
            className='flex items-center gap-2 theme-text hover:opacity-70 w-full'
            aria-label='Toggle theme'
          >
            {/* ダーク時は月アイコン、ライト時は太陽アイコン */}
            <i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'} theme-text-muted`}></i>
            <span className='text-sm theme-text-subtle'>{isDark ? 'ダーク' : 'ライト'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
