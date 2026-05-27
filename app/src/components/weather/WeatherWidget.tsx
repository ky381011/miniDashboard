import { useJmaWeather } from '../../hooks/useJmaWeather'

/** 天気概況テキストから Font Awesome アイコン名を返す */
function weatherIcon(condition: string): string {
  if (!condition) return 'fa-question'
  if (condition.includes('雪')) return 'fa-snowflake'
  if (condition.includes('雷')) return 'fa-bolt'
  if (condition.includes('大雨') || condition.includes('激しい雨')) return 'fa-cloud-showers-heavy'
  if (condition.includes('雨') && (condition.includes('晴') || condition.includes('曇')))
    return 'fa-cloud-sun-rain'
  if (condition.includes('雨')) return 'fa-cloud-rain'
  if (condition.includes('曇') && condition.includes('晴')) return 'fa-cloud-sun'
  if (condition.includes('曇')) return 'fa-cloud'
  if (condition.includes('晴')) return 'fa-sun'
  return 'fa-smog'
}

/** ISO 日時を「M/D H:mm」形式 (JST) に変換する */
function formatDateTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  })
}

/** 東京都大田区が含まれる地域コード: 130000 (東京都)、エリア: 東京地方 */
export function WeatherWidget() {
  const { forecast, status, error, refresh } = useJmaWeather('130000')

  return (
    <div className="rounded-xl border theme-border p-4 w-full">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-cloud-sun theme-text-muted text-lg" />
          <span className="font-semibold theme-text text-sm">天気予報</span>
          {forecast && (
            <span className="theme-text-muted text-xs">({forecast.publishingOffice})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {forecast && (
            <span className="theme-text-muted text-xs">{formatDateTime(forecast.reportDateTime)}</span>
          )}
          <button
            onClick={refresh}
            disabled={status === 'loading'}
            className="theme-icon-btn p-1 rounded"
            aria-label="天気予報を更新"
          >
            <i className={`fa-solid fa-rotate-right text-sm ${status === 'loading' ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 読み込み中 */}
      {status === 'loading' && (
        <div className="flex justify-center items-center gap-2 py-6 theme-text-muted text-sm">
          <i className="fa-solid fa-circle-notch animate-spin" />
          読み込み中...
        </div>
      )}

      {/* エラー */}
      {status === 'error' && (
        <div className="text-red-400 text-sm py-4 text-center space-y-2">
          <p>
            <i className="fa-solid fa-triangle-exclamation mr-1" />
            {error}
          </p>
          <button onClick={refresh} className="theme-icon-btn px-3 py-1 rounded text-xs">
            再試行
          </button>
        </div>
      )}

      {/* 予報データ */}
      {status === 'success' && forecast && (
        <div className="space-y-3">
          {/* 期間ヘッダー行 */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `minmax(0,1.2fr) repeat(${forecast.periods.length}, minmax(0,1fr))` }}
          >
            <div />
            {forecast.periods.map(p => (
              <div key={p.timeId} className="text-center">
                <p className="theme-text-muted text-xs leading-tight truncate" title={p.name}>
                  {p.name}
                </p>
              </div>
            ))}
          </div>

          {/* 地域ごとの予報 */}
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {forecast.areas.map(area => (
              <div
                key={area.code}
                className="grid gap-1 border-t theme-border pt-1.5"
                style={{ gridTemplateColumns: `minmax(0,1.2fr) repeat(${forecast.periods.length}, minmax(0,1fr))` }}
              >
                {/* 地域名 */}
                <p className="theme-text text-xs font-medium self-center truncate" title={area.name}>
                  {area.name}
                </p>

                {/* 期間ごとの天気 + 降水確率 */}
                {forecast.periods.map(p => {
                  const wx = area.weather[p.timeId]
                  const pc = area.precip[p.timeId]
                  return (
                    <div key={p.timeId} className="flex flex-col items-center gap-0.5">
                      {wx ? (
                        <i
                          className={`fa-solid ${weatherIcon(wx)} text-base theme-text`}
                          title={wx}
                        />
                      ) : (
                        <span className="text-base">—</span>
                      )}
                      {pc !== undefined && pc !== '' && (
                        <span className="theme-text-muted text-xs">{pc}%</span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* 気温 */}
          {forecast.stations.length > 0 && (
            <div className="border-t theme-border pt-2">
              <p className="theme-text-muted text-xs mb-1">気温</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {forecast.stations.slice(0, 6).map(s => (
                  <div key={s.code} className="text-xs flex items-center gap-1">
                    <span className="theme-text-muted">{s.name}</span>
                    {s.maxTemp && <span className="text-orange-400">↑{s.maxTemp}°</span>}
                    {s.minTemp && <span className="text-blue-400">↓{s.minTemp}°</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 初期状態 */}
      {status === 'idle' && (
        <div className="text-center py-6">
          <button onClick={refresh} className="theme-icon-btn px-4 py-2 rounded text-sm">
            <i className="fa-solid fa-play mr-2" />
            天気予報を読み込む
          </button>
        </div>
      )}
    </div>
  )
}
