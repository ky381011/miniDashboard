interface ConfigsProps {
  isOpen: boolean;
  onToggle: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Configs({ isOpen, onToggle, isDark, onThemeToggle }: ConfigsProps) {
  return (
    <div
      className={`main-theme border-l border-mauve-200 shrink-0 min-h-screen overflow-hidden transition-[width] duration-300 ${
        isOpen ? 'w-48' : 'w-10'
      }`}
    >
      <div className='flex flex-col h-full min-h-screen'>
        <button
          onClick={onToggle}
          className='w-10 p-2 text-white hover:opacity-70 flex justify-center shrink-0 ml-auto'
          aria-label='Toggle configs'
        >
          <i className='fa-solid fa-gear text-lg'></i>
        </button>

        {isOpen && (
          <div className='mt-auto p-3 border-t border-mauve-200'>
            <p className='text-mauve-400 text-xs mb-2'>テーマ</p>
            <button
              onClick={onThemeToggle}
              className='flex items-center gap-2 text-white hover:opacity-70 w-full'
              aria-label='Toggle theme'
            >
              <i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'} text-mauve-400`}></i>
              <span className='text-sm text-mauve-200'>{isDark ? 'ダーク' : 'ライト'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
