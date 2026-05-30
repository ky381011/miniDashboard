import type { CityOption } from './Configs'
import { WeatherWidget } from '../weather/WeatherWidget'

interface MainProps {
  city: CityOption | null;
}

export function Main({ city }: MainProps) {
  return (
    <div className='main-theme flex-1 min-h-screen p-4'>
      {city === null ? (
        <p className='theme-text-muted text-sm text-center mt-8'>
          表示する都市を右側の設定パネルで選択してください
        </p>
      ) : (
        <WeatherWidget regionCode={city.id} cityLabel={city.label} />
      )}
    </div>
  )
}
