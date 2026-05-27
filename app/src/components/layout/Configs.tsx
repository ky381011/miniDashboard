import { useEffect, useRef, useState } from 'react';
import { getPanelClasses } from '../../utils/panelClasses';

/** ウィジェットの定義 */
export interface WidgetOption {
  id: string;
  label: string;
  icon: string;
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
  /** 利用可能なウィジェット一覧 */
  widgets: WidgetOption[];
  /** 現在表示中のウィジェット ID 一覧 */
  visibleWidgets: string[];
  /** ウィジェットの表示/非表示を切り替えるコールバック */
  onToggleWidget: (id: string) => void;
}

/**
 * Configs コンポーネント (設定パネル)
 * - 画面右端に配置し、isOpen に応じて w-48 / w-10 をアニメーション切り替え
 * - パネルが開いているときのみテーマ切り替えボタンとウィジェット選択を表示する
 */
export function Configs({ isOpen, onToggle, isDark, onThemeToggle, widgets, visibleWidgets, onToggleWidget }: ConfigsProps) {
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
    visibleWidgets.length === 0
      ? 'なし'
      : visibleWidgets.length === widgets.length
      ? 'すべて'
      : `${visibleWidgets.length} / ${widgets.length}`;

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
        <div className={`p-3 border-b theme-border whitespace-nowrap overflow-hidden transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <p className='theme-text-muted text-xs mb-2'>表示ウィジェット</p>
          <div className='relative' ref={dropdownRef}>
            {/* ドロップダウントリガーボタン */}
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className='w-full flex items-center justify-between gap-1 text-xs theme-text border theme-border rounded px-2 py-1 hover:opacity-70'
            >
              <span>{selectionLabel}</span>
              <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* チェックボックスリスト */}
            {dropdownOpen && (
              <div className='absolute right-0 mt-1 w-full main-theme border theme-border rounded shadow-lg z-10'>
                {widgets.map(w => (
                  <label
                    key={w.id}
                    className='flex items-center gap-2 px-2 py-1.5 cursor-pointer theme-icon-btn w-full text-xs theme-text'
                  >
                    <input
                      type='checkbox'
                      checked={visibleWidgets.includes(w.id)}
                      onChange={() => onToggleWidget(w.id)}
                      className='accent-blue-400 shrink-0'
                    />
                    <i className={`fa-solid ${w.icon} theme-text-muted`} />
                    <span>{w.label}</span>
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
