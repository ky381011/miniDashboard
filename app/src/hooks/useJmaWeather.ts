import { useCallback, useEffect, useState } from 'react'
import { parseAtomFeed, parseWeatherXml, toProxyUrl, type WeatherForecast } from '../utils/jmaXml'

type Status = 'idle' | 'loading' | 'success' | 'error'

export interface UseJmaWeatherResult {
  forecast: WeatherForecast | null
  status: Status
  error: string | null
  refresh: () => void
}

/** 気象庁防災情報 Atom フィード (定期配信) の URL (Vite プロキシ経由) */
const FEED_URL = '/jma/developer/xml/feed/regular.xml'
/** 取得対象の情報種別: 府県週間天気予報 */
const TARGET_TYPE = 'VPFW50'

/**
 * 気象庁防災情報 XML フォーマットから府県週間天気予報を取得するフック。
 *
 * @param regionCode 取得対象の地域コード (デフォルト: '130000' = 東京都)
 */
export function useJmaWeather(regionCode = '130000'): UseJmaWeatherResult {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [revision, setRevision] = useState(0)

  const refresh = useCallback(() => setRevision(r => r + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      setError(null)

      try {
        // Step 1: Atom フィードを取得してパース
        const feedRes = await fetch(FEED_URL)
        if (!feedRes.ok) throw new Error(`フィード取得失敗 (HTTP ${feedRes.status})`)
        const feedXml = await feedRes.text()

        const entries = parseAtomFeed(feedXml)
        const target = entries.find(
          e => e.infoType === TARGET_TYPE && e.regionCode === regionCode,
        )
        if (!target)
          throw new Error(`${TARGET_TYPE} (地域: ${regionCode}) のエントリが見つかりません`)

        // Step 2: 天気予報 XML を取得してパース
        const dataRes = await fetch(toProxyUrl(target.link))
        if (!dataRes.ok) throw new Error(`天気 XML 取得失敗 (HTTP ${dataRes.status})`)
        const dataXml = await dataRes.text()

        const result = parseWeatherXml(dataXml)
        if (!result) throw new Error('天気 XML の解析に失敗しました')

        if (!cancelled) {
          setForecast(result)
          setStatus('success')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
          setStatus('error')
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [revision, regionCode])

  return { forecast, status, error, refresh }
}
