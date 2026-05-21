/** サイドバーコンポーネントのProps */
interface SidebarProps {
  /** サイドバーが開いているかどうか (true: 展開, false: 折りたたみ) */
  isOpen: boolean;
  /** 開閉状態を切り替えるコールバック */
  onToggle: () => void;
}

/**
 * Sidebar コンポーネント
 * - isOpen が true のとき w-48、false のとき w-10 に切り替わる
 * - 幅の変化は CSS transition でアニメーションする
 */
export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    // サイドバー全体のラッパー: isOpen に応じて幅をアニメーション切り替え
    <div
      className={`main-theme border-r theme-border shrink-0 min-h-screen overflow-hidden transition-[width] duration-300 ${
        isOpen ? 'w-48' : 'w-10'
      }`}
    >
      <div className='flex flex-col'>
        {/* ハンバーガーアイコンボタン: クリックで onToggle を呼び出す */}
        <button
          onClick={onToggle}
          className='w-10 p-2 theme-icon-btn flex justify-center shrink-0'
          aria-label='Toggle sidebar'
        >
          {/* Font Awesome のハンバーガーアイコン */}
          <i className='fa-solid fa-bars text-lg'></i>
        </button>
        {/* サイドバーのコンテンツ領域 (今後ここにメニュー項目を追加) */}
      </div>
    </div>
  )
}
