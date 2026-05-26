/** パネルの配置方向 */
export type PanelDirection = 'left' | 'right';

/**
 * サイドパネルのラッパー用クラス文字列を返す
 * @param isOpen - パネルが開いているかどうか
 * @param direction - パネルの配置方向 ('left' | 'right')
 */
export function getPanelClasses(isOpen: boolean, direction: PanelDirection): string {
  const border = direction === 'left' ? 'border-r' : 'border-l';
  const width = isOpen ? 'w-48' : 'w-10';
  return `main-theme ${border} theme-border shrink-0 min-h-screen overflow-hidden transition-[width] duration-700 ${width}`;
}
