interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <div
      className={`bg-mauve-900 flex-shrink-0 min-h-screen overflow-hidden transition-[width] duration-300 ${
        isOpen ? 'w-48' : 'w-10'
      }`}
    >
      <div className='flex flex-col'>
        <button
          onClick={onToggle}
          className='w-10 p-2 text-white hover:opacity-70 flex justify-center flex-shrink-0'
          aria-label='Toggle sidebar'
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <line x1='3' y1='6' x2='21' y2='6'/>
            <line x1='3' y1='12' x2='21' y2='12'/>
            <line x1='3' y1='18' x2='21' y2='18'/>
          </svg>
        </button>
        {/* Sidebar content goes here */}
      </div>
    </div>
  )
}
