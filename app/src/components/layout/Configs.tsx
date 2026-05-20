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
      className={`main-theme border-l border-mauve-200 shrink-0 min-h-screen overflow-hidden transition-[width] duration-300 ${
        isOpen ? 'w-48' : 'w-10'
      }`}
    >
      <div className='flex flex-col h-full min-h-screen'>
        {/* 歯車アイコンボタン: クリックで onToggle を呼び出す */}
        <button
          onClick={onToggle}
          className='w-10 p-2 text-white hover:opacity-70 flex justify-center shrink-0 ml-auto'
          aria-label='Toggle configs'
        >
          {/* Font Awesome の歯車アイコン */}
          <i className='fa-solid fa-gear text-lg'></i>
        </button>

        {/* パネルが開いているときのみテーマ切り替えセクションを表示 */}
        {isOpen && (
          <div className='mt-auto p-3 border-t border-mauve-200'>
            <p className='text-mauve-400 text-xs mb-2'>テーマ</p>
            {/* テーマ切り替えボタン: isDark に応じてアイコンとラベルを切り替え */}
            <button
              onClick={onThemeToggle}
              className='flex items-center gap-2 text-white hover:opacity-70 w-full'
              aria-label='Toggle theme'
            >
              {/* ダーク時は月アイコン、ライト時は太陽アイコン */}
              <i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'} text-mauve-400`}></i>
              <span className='text-sm text-mauve-200'>{isDark ? 'ダーク' : 'ライト'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
