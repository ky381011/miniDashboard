import { WeatherWidget } from '../weather/WeatherWidget'

interface MainProps {
  visibleWidgets: string[];
}

export function Main({ visibleWidgets }: MainProps) {
  return (
    <div className='main-theme flex-1 min-h-screen p-4'>
      {visibleWidgets.includes('weather') && <WeatherWidget />}
    </div>
  )
}
