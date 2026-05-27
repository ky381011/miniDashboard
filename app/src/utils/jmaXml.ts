/** Atom フィードの1エントリ */
export interface FeedEntry {
  id: string
  title: string
  /** 情報種別コード (e.g., "VPFW50") */
  infoType: string
  updated: string
  link: string
}

/** 予報期間 (時系列の1コマ) */
export interface ForecastPeriod {
  timeId: string
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
 * `/jma` プレフィックスを付与するだけで、ホスト部分を除去する。
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
 * 気象庁防災情報 Atom フィード XML を解析してエントリ一覧を返す。
 * パースエラー時は空配列を返す。
 */
export function parseAtomFeed(xml: string): FeedEntry[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.querySelector('parsererror')) return []

  return els(doc, 'entry').map(e => {
    const title = txt(e, 'title')
    return {
      id: txt(e, 'id'),
      title,
      infoType: title.split(' ')[0] ?? '',
      updated: txt(e, 'updated'),
      link: e.querySelector('link')?.getAttribute('href') ?? '',
    }
  })
}

/**
 * 府県天気予報 XML (VPFW50) を解析して WeatherForecast を返す。
 * パースエラー・構造不正時は null を返す。
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
    const seriesList = els(areaInfoEl, 'TimeSeriesInfo')

    // 1番目の TimeSeriesInfo: 天気
    const wxSeries = seriesList[0]
    if (wxSeries) {
      periods.push(
        ...els(wxSeries, 'TimeDefine').map(td => ({
          timeId: td.getAttribute('timeId') ?? '',
          name: txt(td, 'Name'),
          dateTime: txt(td, 'DateTime'),
        })),
      )
      for (const item of els(wxSeries, 'Item')) {
        const code = txt(item, 'Code')
        const name = txt(item, 'Name')
        if (!areaMap.has(code)) {
          areaMap.set(code, { name, code, weather: {}, precip: {} })
        }
        const area = areaMap.get(code)!
        for (const w of els(item, 'Weather')) {
          const tid = w.getAttribute('timeIdRef') ?? ''
          area.weather[tid] = w.textContent?.trim() ?? ''
        }
      }
    }

    // 2番目の TimeSeriesInfo: 降水確率
    const precipSeries = seriesList[1]
    if (precipSeries) {
      for (const item of els(precipSeries, 'Item')) {
        const code = txt(item, 'Code')
        const name = txt(item, 'Name')
        if (!areaMap.has(code)) {
          areaMap.set(code, { name, code, weather: {}, precip: {} })
        }
        const area = areaMap.get(code)!
        for (const p of els(item, 'PrecipitationProbability')) {
          const tid = p.getAttribute('timeIdRef') ?? ''
          area.precip[tid] = p.textContent?.trim() ?? ''
        }
      }
    }
  }

  // ---- 気温 ----
  const tempInfoEl = allInfos.find(el => el.getAttribute('type') === '気温')
  const stationMap = new Map<string, TempStation>()

  if (tempInfoEl) {
    for (const series of els(tempInfoEl, 'TimeSeriesInfo')) {
      for (const item of els(series, 'Item')) {
        const code = txt(item, 'Code')
        const name = txt(item, 'Name')
        if (!stationMap.has(code)) {
          stationMap.set(code, { name, code, maxTemp: null, minTemp: null })
        }
        const station = stationMap.get(code)!
        for (const t of els(item, 'Temperature')) {
          const type = t.getAttribute('type')
          const val = t.textContent?.trim() ?? null
          if (type === '最高') station.maxTemp = val
          if (type === '最低') station.minTemp = val
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
