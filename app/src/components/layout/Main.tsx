import type { CityOption } from './Configs'
import { WeatherWidget } from '../weather/WeatherWidget'

interface MainProps {
  cities: CityOption[];
}

export function Main({ cities }: MainProps) {
  return (
    <div className='main-theme flex-1 min-h-screen p-4'>
      {cities.length === 0 ? (
        <p className='theme-text-muted text-sm text-center mt-8'>
          表示する都市を右側の設定パネルで選択してください
        </p>
      ) : (
        <div className='flex flex-wrap gap-4'>
          {cities.map(city => (
            <div key={city.id} className='min-w-[320px] flex-1'>
              <WeatherWidget regionCode={city.id} cityLabel={city.label} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
