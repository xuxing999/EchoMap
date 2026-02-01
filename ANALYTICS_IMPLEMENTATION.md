# 📊 Vercel Analytics 實作指南

## 概述

本專案已成功整合 Vercel Analytics，實現全面的使用者行為追蹤，幫助您了解使用者如何與台北音樂地圖互動。

---

## ✅ 已實作功能

### 1. 基礎配置

- ✅ 安裝 `@vercel/analytics` 套件
- ✅ 在 `app/layout.tsx` 中加入 `<Analytics />` 組件
- ✅ 建立統一的追蹤工具函式庫 `lib/analytics.ts`

### 2. 事件追蹤矩陣

| 事件名稱 | 觸發時機 | 追蹤參數 | 實作位置 |
|---------|---------|---------|---------|
| **Venue_Click** | 使用者點擊場地 | venue_name, venue_id, tags, source | Map.tsx, SpiderfyMarkers.tsx, VenueCard.tsx |
| **Filter_Change** | 使用者變更篩選條件 | category, value, action | FilterPanel.tsx |
| **Cluster_Click** | 使用者點擊聚合點 | point_count, zoom, action | Map.tsx |

---

## 📍 詳細事件說明

### 1. Venue_Click（場地點擊）

**追蹤場景**：
- 🗺️ 地圖標記點擊 (`source: 'map'`)
- 🕷️ Spiderfy 展開後的標記點擊 (`source: 'spiderfy'`)
- 📋 側邊欄列表卡片點擊 (`source: 'list'`)
- 📱 底部抽屜卡片點擊 (`source: 'bottomsheet'`)

**追蹤參數**：
```typescript
{
  venue_name: "Blue Note Taipei",  // 場地名稱
  venue_id: "blue-note-002",       // 場地 ID
  tags: "Jazz,Live",                // 標籤（逗號分隔）
  source: "map"                     // 點擊來源
}
```

**實作範例**：
```typescript
// components/Map.tsx
trackVenueClick({
  name: venue.name,
  id: venue.id,
  tags: venue.tags,
  source: 'map',
});
```

**分析價值**：
- 了解使用者偏好的瀏覽方式（地圖 vs 列表）
- 識別最受歡迎的場地
- 分析場地標籤與點擊率的關聯

---

### 2. Filter_Change（篩選變更）

**追蹤場景**：
- 🎸 音樂流派篩選（Jazz, Rock, Indie, Punk, Electronic, etc.）
- 🎭 場景氛圍篩選（適合一個人, 約會, 平價, etc.）

**追蹤參數**：
```typescript
{
  category: "tags",          // 篩選類別（tags 或 scenario）
  value: "Jazz",             // 篩選值
  action: "add"              // 動作（add 或 remove）
}
```

**實作範例**：
```typescript
// components/FilterPanel.tsx
trackFilterChange({
  category: 'tags',
  value: 'Jazz',
  action: isRemoving ? 'remove' : 'add',
});
```

**分析價值**：
- 了解最常使用的篩選條件
- 分析篩選組合模式（例如「Jazz + 約會」的組合頻率）
- 優化篩選器 UI 順序

---

### 3. Cluster_Click（聚合點點擊）

**追蹤場景**：
- 🔍 點擊聚合點觸發縮放 (`action: 'zoom'`)
- 🕸️ 點擊聚合點觸發 Spiderfy 展開 (`action: 'spiderfy'`)

**追蹤參數**：
```typescript
{
  point_count: 5,            // 聚合點內的場地數量
  zoom: 14,                  // 當前縮放層級
  action: "zoom"             // 動作類型
}
```

**實作範例**：
```typescript
// components/Map.tsx
trackClusterClick({
  pointCount: clusterVenues.length,
  zoom: zoom,
  action: 'spiderfy',
});
```

**分析價值**：
- 了解使用者探索地圖的深度
- 分析聚合點密度與使用者行為的關係
- 優化聚合參數（radius, maxZoom）

---

## 🛠️ 技術實作

### 核心工具函式（lib/analytics.ts）

```typescript
import { track } from '@vercel/analytics';

// 場地點擊追蹤
export function trackVenueClick(params: VenueClickParams) {
  track('Venue_Click', {
    venue_name: params.name,
    venue_id: params.id,
    tags: params.tags?.join(',') || 'none',
    source: params.source,
  });
}

// 篩選變更追蹤
export function trackFilterChange(params: FilterChangeParams) {
  track('Filter_Change', {
    category: params.category,
    value: params.value,
    action: params.action,
  });
}

// 聚合點追蹤
export function trackClusterClick(params: ClusterClickParams) {
  track('Cluster_Click', {
    point_count: params.pointCount,
    zoom: params.zoom,
    action: params.action,
  });
}
```

### TypeScript 型別定義

```typescript
export interface VenueClickParams {
  name: string;
  id: string;
  tags?: string[];
  source: 'map' | 'list' | 'bottomsheet' | 'spiderfy';
}

export interface FilterChangeParams {
  category: 'tags' | 'scenario';
  value: string;
  action: 'add' | 'remove';
}

export interface ClusterClickParams {
  pointCount: number;
  zoom: number;
  action: 'zoom' | 'spiderfy';
}
```

---

## 📈 在 Vercel Dashboard 查看數據

### 1. 前往 Analytics 頁面
```
Vercel Dashboard → 選擇專案 → Analytics
```

### 2. 查看事件統計
- **Events**：所有自訂事件列表
- **Venue_Click**：場地點擊次數、來源分布
- **Filter_Change**：篩選使用頻率、熱門標籤
- **Cluster_Click**：聚合互動統計

### 3. 建立自訂報告
- **漏斗分析**：篩選 → 瀏覽 → 點擊轉換率
- **熱門場地**：依 `venue_name` 分組
- **來源分布**：比較 map、list、bottomsheet 的點擊比例

---

## 🎯 未來擴展建議

### 1. 搜尋追蹤
```typescript
// 建議追蹤搜尋行為
export function trackSearch(params: SearchParams) {
  track('Search', {
    query: params.query,
    results_count: params.resultsCount,
  });
}
```

### 2. 定位追蹤
```typescript
// 建議追蹤定位按鈕使用
export function trackGeolocation(params: GeolocationParams) {
  track('Geolocation_Click', {
    success: params.success,
    error: params.error || 'none',
  });
}
```

### 3. 底部抽屜狀態追蹤
```typescript
// 建議追蹤底部抽屜互動
export function trackBottomSheet(params: BottomSheetParams) {
  track('BottomSheet_Expand', {
    state: params.state, // collapsed, half, full
  });
}
```

### 4. 地圖互動追蹤
```typescript
// 建議追蹤地圖縮放/拖曳
export function trackMapInteraction(params: MapInteractionParams) {
  track('Map_Interaction', {
    type: params.type,  // pan, zoom, click
    zoom: params.zoom,
  });
}
```

---

## 🔧 維護指南

### 新增新事件

**步驟 1：在 `lib/analytics.ts` 定義型別**
```typescript
export interface NewEventParams {
  // 定義參數型別
}
```

**步驟 2：建立追蹤函式**
```typescript
export function trackNewEvent(params: NewEventParams) {
  track('New_Event', {
    // 轉換參數
  });
}
```

**步驟 3：在組件中使用**
```typescript
import { trackNewEvent } from '@/lib/analytics';

// 在適當的時機呼叫
trackNewEvent({ /* params */ });
```

---

## 📊 數據隱私

### GDPR & CCPA 合規
- ✅ Vercel Analytics 不使用 cookies
- ✅ 不追蹤個人識別資訊 (PII)
- ✅ 符合 GDPR 與 CCPA 規範
- ✅ 使用者可在 Vercel Dashboard 管理資料保留政策

### 追蹤的資料
- ✅ **匿名行為數據**：點擊、篩選、互動
- ✅ **聚合統計**：總點擊數、平均使用時間
- ❌ **不追蹤**：使用者姓名、Email、IP 位址

---

## ✅ 部署檢查清單

- [x] `@vercel/analytics` 已安裝
- [x] `<Analytics />` 已加入 layout.tsx
- [x] `lib/analytics.ts` 已建立
- [x] 場地點擊追蹤已整合（4 個來源）
- [x] 篩選變更追蹤已整合
- [x] 聚合點追蹤已整合
- [x] Build 測試通過
- [x] 推送至 GitHub
- [ ] Vercel 自動部署完成
- [ ] Analytics Dashboard 驗證事件正常

---

## 📞 參考資源

- **Vercel Analytics 官方文件**：https://vercel.com/docs/analytics
- **事件追蹤指南**：https://vercel.com/docs/analytics/custom-events
- **TypeScript SDK**：https://www.npmjs.com/package/@vercel/analytics

---

**實作完成日期**：2026-02-01
**版本**：1.0
**實作者**：Claude Code
**專案**：台北音樂地圖 (Taipei Music Map)

🎉 **恭喜！您的音樂地圖現在具備完整的使用者行為追蹤能力！**
