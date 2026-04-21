interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <div
      className={`main-theme border-r border-mauve-200 shrink-0 min-h-screen overflow-hidden transition-[width] duration-300 ${
        isOpen ? 'w-48' : 'w-10'
      }`}
    >
      <div className='flex flex-col'>
        <button
          onClick={onToggle}
          className='w-10 p-2 text-white hover:opacity-70 flex justify-center shrink-0'
          aria-label='Toggle sidebar'
        >
          <i className='fa-solid fa-bars text-lg'></i>
        </button>
        {/* Sidebar content goes here */}
      </div>
    </div>
  )
}
