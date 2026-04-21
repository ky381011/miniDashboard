interface ConfigsProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Configs({ isOpen, onToggle }: ConfigsProps) {
  return (
    <div
      className={`bg-mauve-950 border-l border-mauve-200 shrink-0 min-h-screen overflow-hidden transition-[width] duration-300 ${
        isOpen ? 'w-48' : 'w-10'
      }`}
    >
      <div className='flex flex-col'>
        <button
          onClick={onToggle}
          className='w-10 p-2 text-white hover:opacity-70 flex justify-center shrink-0 ml-auto'
          aria-label='Toggle configs'
        >
          <i className='fa-solid fa-gear text-lg'></i>
        </button>
        {/* Configs content goes here */}
      </div>
    </div>
  )
}
