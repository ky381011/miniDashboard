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
}

/**
 * Configs コンポーネント (設定パネル)
 * - 画面右端に配置し、isOpen に応じて w-48 / w-10 をアニメーション切り替え
 * - パネルが開いているときのみテーマ切り替えボタンを表示する
 */
export function Configs({ isOpen, onToggle, isDark, onThemeToggle }: ConfigsProps) {
  return (
    // 設定パネル全体のラッパー: isOpen に応じて幅をアニメーション切り替え
    <div
      className={`main-theme border-l theme-border shrink-0 min-h-screen overflow-hidden transition-[width] duration-700 ${
        isOpen ? 'w-48' : 'w-10'
      }`}
    >
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
