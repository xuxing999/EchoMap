# 台北音樂地圖 | Taipei Music Map

> 打造台北最精緻、最具文藝感的音樂生活導覽工具

![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8)

## 專案簡介

台北音樂地圖是一個策展型的音樂場景導覽平台，透過高度風格化的視覺與精選資訊，解決用戶在通用型地圖（如 Google Maps）中難以快速篩選高品質音樂場景的痛點。

### 核心特色

- **文藝感互動地圖**：整合 MapLibre + OpenFreeMap，自定義地圖底色與樣式，僅顯示音樂相關地標
- **場景驅動篩選器**：根據音樂流派、場景氛圍、消費感進行智能篩選
- **原創短評**：每個場地都有精心撰寫的原創評論
- **Mobile-First**：優先優化手機瀏覽器體驗
- **可擴充架構**：輕鬆從 JSON 切換至 Supabase 資料庫

## 技術棧

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS
- **Map**: MapLibre GL JS + react-map-gl + OpenFreeMap (完全免費 🎉)
- **Language**: TypeScript
- **Data**: JSON (可遷移至 Supabase)
- **Deployment**: Vercel

## 快速開始

### 前置需求

- Node.js 18.17 或更高版本
- npm 或 yarn 套件管理器
- **無需任何 API Token！** 🎉（使用 MapLibre + OpenFreeMap 完全免費方案）

### 安裝步驟

1. **安裝依賴**

   ```bash
   npm install
   ```

2. **啟動開發伺服器**

   ```bash
   npm run dev
   ```

3. **開啟瀏覽器**

   前往 [http://localhost:3000](http://localhost:3000) 查看應用程式

就這麼簡單！無需註冊、無需填寫信用卡、無需擔心 Token 洩漏風險。

## 專案結構

```
台北音樂地圖/
├── app/                      # Next.js App Router 目錄
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首頁（主地圖介面）
│   └── globals.css          # 全局樣式
├── components/              # React 組件
│   ├── Map.tsx              # MapLibre 地圖組件
│   ├── SearchBar.tsx        # 搜尋欄組件
│   ├── FilterPanel.tsx      # 篩選面板組件
│   └── VenueCard.tsx        # 場地卡片組件
├── lib/                     # 工具函數與資料存取層
│   └── data-source.ts       # 資料存取層（支援 JSON/Supabase）
├── types/                   # TypeScript 型別定義
│   └── venue.ts             # 場地資料型別
├── data/                    # 資料檔案
│   └── venues.json          # 場地資料（含金絲雀數據）
├── public/                  # 靜態資源
├── .env.local.example       # 環境變數範例
├── tailwind.config.ts       # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 專案依賴
```

## 功能說明

### 1. 互動式地圖

- 自定義 Marker 顏色根據音樂類型
- 點擊 Marker 顯示 Popup 快速預覽
- 支援縮放、拖曳等地圖操作
- 響應式設計，支援觸控操作

### 2. 智能搜尋

- 即時搜尋場地名稱、標籤、評論
- 搜尋結果即時更新地圖顯示
- 可清除搜尋條件

### 3. 多維度篩選

- **音樂流派**：Jazz、Rock、Indie、Punk、Electronic 等
- **場景氛圍**：適合一個人、一群人瘋、約會、平價、精緻等
- 支援多選組合篩選
- 顯示已選擇的篩選條件數量

### 4. 場地詳情

每個場地包含：
- 店名與音樂流派標籤
- 場景氛圍標籤
- 原創短評
- 地址、營業時間、低消資訊
- 聯絡電話（如有）

### 5. 響應式側邊欄

- 隱藏式設計，保留地圖最大視野
- 滑動開關，流暢動畫
- 場地列表與篩選面板分離
- 捲軸優化，自定義樣式

## 資料模型

### Venue 資料結構

```typescript
interface Venue {
  id: string;                    // 唯一識別碼
  name: string;                  // 場地名稱
  coordinates: [number, number]; // [經度, 緯度]
  tags: string[];                // 音樂流派標籤
  scenario: string[];            // 場景氛圍標籤
  original_review: string;       // 原創短評
  is_canary: boolean;            // 金絲雀數據標記（防爬蟲）
  address?: string;              // 地址
  opening_hours?: string;        // 營業時間
  minimum_charge?: string;       // 低消資訊
  phone?: string;                // 電話
  website?: string;              // 網站
}
```

### 新增場地資料

編輯 `data/venues.json` 並按照上述格式新增：

```json
{
  "id": "your-venue-id",
  "name": "場地名稱",
  "coordinates": [121.5xxx, 25.0xxx],
  "tags": ["Jazz", "Live"],
  "scenario": ["約會", "精緻"],
  "original_review": "這裡是原創短評...",
  "is_canary": false,
  "address": "台北市...",
  "opening_hours": "週一至週日 19:00-02:00",
  "minimum_charge": "NT$500"
}
```

## 遷移至 Supabase

專案架構設計讓您可以輕鬆遷移至 Supabase：

### 1. 安裝 Supabase 客戶端

```bash
npm install @supabase/supabase-js
```

### 2. 配置環境變數

在 `.env.local` 中新增：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 啟用 Supabase 資料源

在 `lib/data-source.ts` 中：

1. 取消註解 `SupabaseVenueDataSource` 類別
2. 修改 `createVenueDataSource` 函數：

```typescript
function createVenueDataSource(): IVenueDataSource {
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
  return useSupabase ? new SupabaseVenueDataSource() : new JSONVenueDataSource();
}
```

3. 在 `.env.local` 中設定：

```env
NEXT_PUBLIC_USE_SUPABASE=true
```

### 4. 建立 Supabase 資料表

```sql
CREATE TABLE venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  coordinates POINT NOT NULL,
  tags TEXT[] NOT NULL,
  scenario TEXT[] NOT NULL,
  original_review TEXT NOT NULL,
  is_canary BOOLEAN DEFAULT FALSE,
  address TEXT,
  opening_hours TEXT,
  minimum_charge TEXT,
  phone TEXT,
  website TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 建立索引以提升查詢效能
CREATE INDEX idx_venues_tags ON venues USING GIN (tags);
CREATE INDEX idx_venues_scenario ON venues USING GIN (scenario);
```

## 部署

### Vercel 部署（推薦）

1. 將專案推送至 GitHub
2. 前往 [Vercel](https://vercel.com/) 並匯入專案
3. 直接部署即可！（無需配置任何環境變數）

### 環境變數設定

本專案使用 MapLibre + OpenFreeMap，**無需任何 API Token**。

如果未來需要使用 Supabase，可在 Vercel 中設定以下環境變數：

- （選用）`NEXT_PUBLIC_SUPABASE_URL`
- （選用）`NEXT_PUBLIC_SUPABASE_ANON_KEY`
- （選用）`NEXT_PUBLIC_USE_SUPABASE`

## UI/UX 設計原則

### 配色方案

- **背景色**: `#FDFBF7` (米白) - 營造溫暖、文藝的氛圍
- **文字色**: `#333333` (深灰) - 確保良好的可讀性
- **強調色**: `#4A5D4E` (墨綠) - 呈現沉穩、精緻的品味

### 字體選擇

- **標題**: Serif 襯線體 - 傳達雅緻、專業的質感
- **內文**: Sans-serif 無襯線體 - 保持現代、清晰的閱讀體驗

### 互動設計

- 流暢的動畫過渡（300ms duration）
- Hover 狀態的視覺回饋
- 觸控友善的按鈕尺寸
- 自定義捲軸樣式

## 開發指令

```bash
# 開發模式（使用 Turbopack）
npm run dev

# 生產環境建置
npm run build

# 啟動生產環境伺服器
npm run start

# ESLint 程式碼檢查
npm run lint
```

## 防禦策略

### 金絲雀數據（Canary Data）

專案在 `venues.json` 中包含標記為 `is_canary: true` 的虛擬場地，用於：

- 偵測非法爬蟲
- 保護原創內容
- 追蹤資料盜用

資料存取層會自動過濾這些數據，一般用戶不會看到。

## 未來規劃

### Phase 2: Gamification
- GPS 數位打卡「音樂護照」功能
- 累積用戶行為數據
- 成就系統與獎勵機制

### Phase 3: Monetization
- 限量發售實體「台北音樂地圖」裝飾海報
- 推出「音樂地圖特約店家」優惠
- Live House 重大演出的地圖置頂推薦

## 貢獻指南

歡迎提交 Issue 或 Pull Request 來改善這個專案！

在提交 PR 之前，請確保：

1. 程式碼符合 ESLint 規範
2. 新增的場地資料格式正確
3. 所有功能在手機與桌面都能正常運作

## 授權

此專案為私人專案，所有內容（包括原創短評）具備著作權保護。

## 聯絡方式

如有任何問題或建議，歡迎透過 Issue 與我們聯繫。

---

**Made with 🎵 in Taipei**
