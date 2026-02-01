/**
 * Vercel Analytics 追蹤工具
 *
 * 統一管理所有使用者行為追蹤事件
 */

import { track } from '@vercel/analytics';

/**
 * 追蹤事件型別定義
 */
export type AnalyticsEvent =
  | 'Venue_Click'           // 場地點擊（地圖標記或列表卡片）
  | 'Filter_Change'         // 篩選器變更
  | 'Search'                // 搜尋
  | 'Geolocation_Click'     // 定位按鈕點擊
  | 'Cluster_Click'         // 聚合點點擊
  | 'BottomSheet_Expand'    // 底部抽屜展開
  | 'Map_Interaction';      // 地圖互動

/**
 * 場地點擊事件參數
 */
export interface VenueClickParams {
  name: string;              // 場地名稱
  id: string;                // 場地 ID
  tags?: string[];           // 場地標籤
  source: 'map' | 'list' | 'bottomsheet' | 'spiderfy'; // 點擊來源
}

/**
 * 篩選器變更事件參數
 */
export interface FilterChangeParams {
  category: 'tags' | 'scenario'; // 篩選類別
  value: string;                  // 篩選值
  action: 'add' | 'remove';      // 新增或移除
}

/**
 * 搜尋事件參數
 */
export interface SearchParams {
  query: string;            // 搜尋關鍵字
  resultsCount: number;     // 搜尋結果數量
}

/**
 * 定位事件參數
 */
export interface GeolocationParams {
  success: boolean;         // 是否成功定位
  error?: string;           // 錯誤訊息（如果失敗）
}

/**
 * 聚合點點擊參數
 */
export interface ClusterClickParams {
  pointCount: number;       // 聚合點內的場地數量
  zoom: number;             // 當前縮放層級
  action: 'zoom' | 'spiderfy'; // 動作類型
}

/**
 * 底部抽屜參數
 */
export interface BottomSheetParams {
  state: 'collapsed' | 'half' | 'full'; // 抽屜狀態
}

/**
 * 地圖互動參數
 */
export interface MapInteractionParams {
  type: 'pan' | 'zoom' | 'click'; // 互動類型
  zoom?: number;                   // 縮放層級（僅 zoom 時）
}

/**
 * 追蹤場地點擊
 * @param params 場地點擊參數
 */
export function trackVenueClick(params: VenueClickParams) {
  track('Venue_Click', {
    venue_name: params.name,
    venue_id: params.id,
    tags: params.tags?.join(',') || 'none',
    source: params.source,
  });
}

/**
 * 追蹤篩選器變更
 * @param params 篩選器變更參數
 */
export function trackFilterChange(params: FilterChangeParams) {
  track('Filter_Change', {
    category: params.category,
    value: params.value,
    action: params.action,
  });
}

/**
 * 追蹤搜尋
 * @param params 搜尋參數
 */
export function trackSearch(params: SearchParams) {
  track('Search', {
    query: params.query,
    results_count: params.resultsCount,
  });
}

/**
 * 追蹤定位按鈕點擊
 * @param params 定位參數
 */
export function trackGeolocation(params: GeolocationParams) {
  track('Geolocation_Click', {
    success: params.success,
    error: params.error || 'none',
  });
}

/**
 * 追蹤聚合點點擊
 * @param params 聚合點參數
 */
export function trackClusterClick(params: ClusterClickParams) {
  track('Cluster_Click', {
    point_count: params.pointCount,
    zoom: params.zoom,
    action: params.action,
  });
}

/**
 * 追蹤底部抽屜狀態變更
 * @param params 底部抽屜參數
 */
export function trackBottomSheet(params: BottomSheetParams) {
  track('BottomSheet_Expand', {
    state: params.state,
  });
}

/**
 * 追蹤地圖互動
 * @param params 地圖互動參數
 */
export function trackMapInteraction(params: MapInteractionParams) {
  track('Map_Interaction', {
    type: params.type,
    zoom: params.zoom,
  });
}
