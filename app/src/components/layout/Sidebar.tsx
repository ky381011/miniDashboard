import { useEffect, useState } from 'react';

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
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' });
  return (
    // サイドバー全体のラッパー: isOpen に応じて幅をアニメーション切り替え
    <div
      className={`main-theme border-r theme-border shrink-0 min-h-screen overflow-hidden transition-[width] duration-700 ${
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
          <i
            className={`fa-solid fa-bars text-lg transition-colors duration-700 ${isOpen ? 'text-blue-400' : ''}`}
          ></i>
        </button>
        {/* メニュー項目 */}
        {[
          { icon: 'fa-house',        label: 'ホーム' },
          { icon: 'fa-chart-bar',    label: 'レポート' },
          { icon: 'fa-users',        label: 'ユーザー' },
          { icon: 'fa-gear',         label: '設定' },
          { icon: 'fa-circle-info',  label: 'ヘルプ' },
        ].map(({ icon, label }) => (
          <button
            key={icon}
            className='w-full flex items-center gap-3 px-2 py-2 theme-icon-btn whitespace-nowrap overflow-hidden'
            title={label}
          >
            <i className={`fa-solid ${icon} text-lg w-6 shrink-0 text-center`}></i>
            <span className={`text-sm text-white transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              {label}
            </span>
          </button>
        ))}
        {/* 日本時間 */}
        <div className={`px-2 py-3 mt-2 border-t theme-border whitespace-nowrap overflow-hidden transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <p className='text-xs text-white text-center'>{dateStr}</p>
          <p className='text-lg text-white text-center font-mono tracking-widest'>{timeStr}</p>
          <p className='text-xs text-white text-center opacity-60'>JST</p>
        </div>
      </div>
    </div>
  )
}
