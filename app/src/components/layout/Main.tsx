import { WeatherWidget } from '../weather/WeatherWidget'

export function Main() {
  return (
    <div className='main-theme flex-1 min-h-screen p-4'>
      <WeatherWidget />
    </div>
  )
}
