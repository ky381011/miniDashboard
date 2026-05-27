/** Atom フィードの1エントリ */
export interface FeedEntry {
  id: string
  title: string
  /** 情報種別コード (e.g., "VPFW50") — <id> URL から抽出 */
  infoType: string
  /** 地域コード (e.g., "130000") — <id> URL から抽出 */
  regionCode: string
  updated: string
  link: string
}

/** 予報期間 (時系列の1コマ) */
export interface ForecastPeriod {
  timeId: string
  /** M/D(曜) 形式の表示用文字列 */
  name: string
  dateTime: string
}

/** 地域ごとの天気予報 */
export interface AreaForecast {
  name: string
  code: string
  /** timeId -> 天気概況テキスト */
  weather: Record<string, string>
  /** timeId -> 降水確率 (%) */
  precip: Record<string, string>
}

/** 気温観測地点 */
export interface TempStation {
  name: string
  code: string
  maxTemp: string | null
  minTemp: string | null
}

/** parseWeatherXml の戻り値 */
export interface WeatherForecast {
  reportDateTime: string
  publishingOffice: string
  periods: ForecastPeriod[]
  areas: AreaForecast[]
  stations: TempStation[]
}

/**
 * 気象庁データの絶対 URL を Vite 開発プロキシ経由の相対 URL に変換する。
 */
export function toProxyUrl(absoluteUrl: string): string {
  return absoluteUrl.replace('https://www.data.jma.go.jp', '/jma')
}

// --- XML ユーティリティ ---

/** 任意の名前空間で name に一致する子孫要素一覧を返す */
function els(el: Element | Document, name: string): Element[] {
  return Array.from(el.getElementsByTagNameNS('*', name))
}

/** 最初に見つかった name 要素のテキストを返す */
function txt(el: Element | Document, name: string): string {
  return els(el, name)[0]?.textContent?.trim() ?? ''
}

/**
 * ISO 日時文字列 (+09:00 前提) を「M/D(曜)」形式に変換する。
 * JMA XML の DateTime は常に JST (+09:00) で表記される。
 */
function formatDateShort(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  // UTC timestamp + 9h のオフセットで JST の日付を取得
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  const wd = '日月火水木金土'[jst.getUTCDay()]
  return `${jst.getUTCMonth() + 1}/${jst.getUTCDate()}(${wd})`
}

/**
 * 気象庁防災情報 Atom フィード XML を解析してエントリ一覧を返す。
 *
 * 注意: フィードの <title> は日本語名 (例:"府県週間天気予報") であり、
 * 情報種別コードは <id> の URL ファイル名に埋め込まれている。
 * 例: …/20260527074057_0_VPFW50_380000.xml → infoType = "VPFW50"
 */
export function parseAtomFeed(xml: string): FeedEntry[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.querySelector('parsererror')) return []

  return els(doc, 'entry').map(e => {
    const title = txt(e, 'title')
    const id = txt(e, 'id')
    // URL パターン: <timestamp>_0_<InfoType>_<RegionCode>.xml
    const infoType = id.match(/_([A-Z0-9]+)_(\d+)\.xml$/)?.[1] ?? ''
    const regionCode = id.match(/_[A-Z0-9]+_(\d+)\.xml$/)?.[1] ?? ''
    return {
      id,
      title,
      infoType,
      regionCode,
      updated: txt(e, 'updated'),
      link: e.querySelector('link')?.getAttribute('href') ?? '',
    }
  })
}

/**
 * 府県週間天気予報 XML (VPFW50) を解析して WeatherForecast を返す。
 *
 * 実際の XML 構造 (名前空間: http://xml.kishou.go.jp/jmaxml1/):
 * - MeteorologicalInfos[@type="区域予報"]
 *   └ TimeSeriesInfo
 *     ├ TimeDefines / TimeDefine[@timeId]
 *     │   ├ DateTime
 *     │   └ Duration (Name 要素なし)
 *     └ Item (エリアごと)
 *       ├ Kind / Property / Type = "天気"
 *       │   └ WeatherPart / jmx_eb:Weather[@type="基本天気"][@refID]
 *       ├ Kind / Property / Type = "降水確率"
 *       │   └ ProbabilityOfPrecipitationPart / jmx_eb:ProbabilityOfPrecipitation[@refID]
 *       └ Area / Name・Code
 * - MeteorologicalInfos[@type="地点予報"]
 *   └ TimeSeriesInfo / Item
 *     ├ Kind / Property / Type = "最高気温"
 *     │   └ TemperaturePart / jmx_eb:Temperature[@type="最高気温"][@refID]
 *     ├ Kind / Property / Type = "最低気温"
 *     └ Station / Name・Code
 */
export function parseWeatherXml(xml: string): WeatherForecast | null {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.querySelector('parsererror')) return null

  const reportDateTime = txt(doc, 'ReportDateTime')
  const publishingOffice = txt(doc, 'PublishingOffice')

  const allInfos = els(doc, 'MeteorologicalInfos')

  // ---- 区域予報 (天気 + 降水確率) ----
  const areaInfoEl = allInfos.find(el => el.getAttribute('type') === '区域予報')
  const periods: ForecastPeriod[] = []
  const areaMap = new Map<string, AreaForecast>()

  if (areaInfoEl) {
    const wxSeries = els(areaInfoEl, 'TimeSeriesInfo')[0]
    if (wxSeries) {
      // 予報期間を取得 (Name 要素なし → DateTime から生成)
      periods.push(
        ...els(wxSeries, 'TimeDefine').map(td => {
          const dateTime = txt(td, 'DateTime')
          return {
            timeId: td.getAttribute('timeId') ?? '',
            name: formatDateShort(dateTime),
            dateTime,
          }
        }),
      )

      // エリアごとの予報を取得
      for (const item of els(wxSeries, 'Item')) {
        const areaEl = els(item, 'Area')[0]
        const code = areaEl ? txt(areaEl, 'Code') : ''
        const name = areaEl ? txt(areaEl, 'Name') : ''
        if (!code) continue

        if (!areaMap.has(code)) {
          areaMap.set(code, { name, code, weather: {}, precip: {} })
        }
        const area = areaMap.get(code)!

        for (const kind of els(item, 'Kind')) {
          const propType = txt(kind, 'Type')

          if (propType === '天気') {
            // jmx_eb:Weather[@type="基本天気"][@refID] (condition="値なし" はスキップ)
            for (const w of els(kind, 'Weather')) {
              if (w.getAttribute('condition') === '値なし') continue
              if (w.getAttribute('type') !== '基本天気') continue
              const refId = w.getAttribute('refID') ?? ''
              area.weather[refId] = w.textContent?.trim() ?? ''
            }
          } else if (propType === '降水確率') {
            // jmx_eb:ProbabilityOfPrecipitation[@refID]
            for (const p of els(kind, 'ProbabilityOfPrecipitation')) {
              if (p.getAttribute('condition') === '値なし') continue
              const refId = p.getAttribute('refID') ?? ''
              area.precip[refId] = p.textContent?.trim() ?? ''
            }
          }
        }
      }
    }
  }

  // ---- 地点予報 (気温) ----
  const tempInfoEl = allInfos.find(el => el.getAttribute('type') === '地点予報')
  const stationMap = new Map<string, TempStation>()

  if (tempInfoEl) {
    for (const series of els(tempInfoEl, 'TimeSeriesInfo')) {
      for (const item of els(series, 'Item')) {
        const stationEl = els(item, 'Station')[0]
        const code = stationEl ? txt(stationEl, 'Code') : ''
        const name = stationEl ? txt(stationEl, 'Name') : ''
        if (!code) continue

        if (!stationMap.has(code)) {
          stationMap.set(code, { name, code, maxTemp: null, minTemp: null })
        }
        const station = stationMap.get(code)!

        for (const kind of els(item, 'Kind')) {
          const propType = txt(kind, 'Type')

          if (propType === '最高気温' && station.maxTemp === null) {
            // 最初の有効な最高気温 (condition="値なし" はスキップ)
            for (const t of els(kind, 'Temperature')) {
              if (t.getAttribute('condition') === '値なし') continue
              if (t.getAttribute('type') === '最高気温') {
                station.maxTemp = t.textContent?.trim() ?? null
                break
              }
            }
          } else if (propType === '最低気温' && station.minTemp === null) {
            for (const t of els(kind, 'Temperature')) {
              if (t.getAttribute('condition') === '値なし') continue
              if (t.getAttribute('type') === '最低気温') {
                station.minTemp = t.textContent?.trim() ?? null
                break
              }
            }
          }
        }
      }
    }
  }

  return {
    reportDateTime,
    publishingOffice,
    periods,
    areas: Array.from(areaMap.values()),
    stations: Array.from(stationMap.values()),
  }
}

