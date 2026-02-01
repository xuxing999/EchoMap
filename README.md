# 🎵 台北音樂地圖 | Taipei Music Map

> 探索台北獨立音樂場景的互動式地圖應用程式
> 收錄 **88+ 精選音樂場所**，從 Live House、黑膠唱片行到音樂咖啡廳

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)
![React](https://img.shields.io/badge/React-19.0.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)
![MapLibre](https://img.shields.io/badge/MapLibre-4.7.1-green)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 專案簡介

**台北音樂地圖** 是一個專為音樂愛好者打造的互動式地圖應用，旨在呈現台北豐富而多元的獨立音樂生態系統。無論你是想挖掘稀有黑膠、聆聽現場演出，還是在文藝咖啡廳中感受音樂氛圍，這個應用都能幫助你找到最適合的去處。

### 🎯 核心理念

- **策展精神**：每個場所都經過精心挑選，附有原創短評與場景標籤
- **文藝美學**：採用極簡設計與 Glassmorphism 風格，呼應獨立音樂的優雅氣質
- **開放資料**：結構化資料設計，便於未來擴展與社群貢獻
- **完全免費**：使用 MapLibre GL + OpenFreeMap，無需任何 API Token

### 💡 解決的痛點

在 Google Maps 上搜尋音樂場所時，你是否遇過：
- ❌ 被大量無關結果淹沒（KTV、樂器行、音樂教室...）
- ❌ 無法依「音樂類型」或「氛圍場景」篩選
- ❌ 缺乏深度的場地介紹與文化脈絡
- ❌ 難以發掘小眾但精彩的獨立場所

**台北音樂地圖** 透過策展式精選與多維度篩選，讓你快速找到真正符合品味的音樂聖地。

---

## ✨ 主要功能

### 🗺️ 互動式地圖

- **88+ 音樂場所**：涵蓋 Live House、唱片行、樂器行、音樂咖啡廳、展覽空間
- **視覺化標記**：彩色標記依音樂類型區分（Jazz 墨綠、Rock 棕色、Indie 灰綠...）
- **即時互動**：點擊標記顯示彈出式卡片，展示場地詳情
- **流暢操作**：支援縮放、拖曳、觸控手勢

### 🔍 強大搜尋與篩選

- **即時搜尋**：輸入店名、音樂類型、地址關鍵字即時過濾結果
- **雙維度篩選**：
  - 🎵 **音樂類型 (Tags)**：Jazz、Rock、Indie、Punk、Electronic、Hip-Hop、古典、民謠等
  - 🎯 **情境場景 (Scenario)**：適合一個人、一群人瘋、約會、平價、精緻、挖寶、演唱會
- **組合查詢**：支援多重條件交集（如：Jazz + 約會）
- **結果統計**：即時顯示篩選結果數量（顯示 15 / 88 個場地）

### 📍 場地列表與詳情

- **側邊欄列表**：展示所有符合條件的場地卡片
- **精美卡片設計**：
  - 場地名稱與音樂類型標籤
  - 情境場景標籤
  - 原創短評（30-60 字）
  - 地址、營業時間、低消、電話
- **選中高亮**：點擊場地時地圖標記放大，卡片背景高亮
- **流暢動畫**：側邊欄滑入/滑出動畫，自定義捲軸樣式

### 🎨 現代化 UI/UX

- **Glassmorphism 設計**：磨砂玻璃效果（`backdrop-blur-md`）的 Header 與浮動元素
- **Google Fonts - Noto Sans TC**：專業中文字體，支援 400/500/700/900 字重
- **全圓角極簡設計**：`rounded-full` 按鈕與輸入框，降低視覺疲勞
- **微互動動畫**：Hover 縮放效果（`hover:scale-105`），提升操作反饋
- **響應式設計**：完美支援 Mobile、Tablet、Desktop

---

## 🛠️ 技術框架

### 前端技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 15.1.6 | React 全端框架，支援 App Router 與 SSR |
| **React** | 19.0.0 | UI 函式庫 |
| **TypeScript** | 5.7.2 | 型別安全與開發體驗 |
| **Tailwind CSS** | 3.4.17 | 原子化 CSS 框架 |
| **MapLibre GL JS** | 4.7.1 | 開源地圖引擎（Mapbox 替代方案）|
| **react-map-gl** | 7.1.7 | React 地圖元件封裝 |

### 地圖服務

- **OpenFreeMap**：100% 免費的地圖圖資服務，無需 API Token
- **MapLibre GL JS**：開源地圖渲染引擎，完全免費
- **地圖樣式**：`https://tiles.openfreemap.org/styles/bright`（文藝感淺色風格）

### 開發工具

- **Turbopack**：Next.js 15 的高效能打包工具
- **ESLint**：程式碼品質檢查
- **PostCSS + Autoprefixer**：CSS 相容性處理

---

## 📊 資料結構

### Venue 資料型別

```typescript
interface Venue {
  id: string;                    // 唯一識別碼
  name: string;                  // 場地名稱
  coordinates: [number, number]; // [經度, 緯度]
  tags: string[];                // 音樂類型標籤
  scenario: string[];            // 情境場景標籤
  original_review: string;       // 原創短評
  is_canary: boolean;            // 金絲雀資料（防爬蟲）
  address?: string;              // 地址
  opening_hours?: string;        // 營業時間
  minimum_charge?: string;       // 低消資訊
  phone?: string;                // 電話
  website?: string;              // 網站
}
```

### 資料來源

- **主資料檔案**：`data/venues.json`
- **資料版本**：2.0.0
- **最後更新**：2026-02-01
- **場地數量**：**88 筆**（不含 canary）

### 場地類型分佈

| 類型 | 數量 | 代表場地 |
|------|------|----------|
| **Live House** | 15+ | Legacy Taipei、The Wall、Revolver、EZ5 |
| **唱片行** | 20+ | 佳佳唱片、M@M RECORDS、White Rabbit Records |
| **樂器行** | 12+ | 阿通伯樂器、功學社、金螞蟻樂器 |
| **音樂咖啡廳** | 18+ | THT Records、Yaboo 鴉埠咖啡、浮光書店 |
| **音樂酒吧** | 15+ | Blue Note Taipei、Marsalis Home、KOR Taipei |
| **展覽/其他** | 8+ | 台北流行音樂中心、聲化感官實驗室 |

### 資料存取層 (Data Access Layer)

採用 **介面抽象設計**，便於未來無縫遷移至 Supabase：

```typescript
interface IVenueDataSource {
  getAllVenues(): Promise<Venue[]>;
  getVenueById(id: string): Promise<Venue | null>;
  getFilteredVenues(filter: VenueFilter): Promise<Venue[]>;
  searchVenues(query: string): Promise<Venue[]>;
}
```

- **當前實作**：`JSONVenueDataSource`（從 `venues.json` 讀取）
- **未來擴展**：`SupabaseVenueDataSource`（從 Supabase 讀取）

---

## 🚀 快速開始

### 環境需求

- **Node.js**: 18.x 或以上
- **npm**: 9.x 或以上（或使用 yarn / pnpm）
- **無需任何 API Token！** 🎉（使用 MapLibre + OpenFreeMap 完全免費方案）

### 安裝與執行

```bash
# 1. 克隆專案（或從檔案系統打開）
cd /path/to/台北音樂地圖

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器（使用 Turbopack）
npm run dev

# 4. 在瀏覽器中打開
open http://localhost:3000
```

### 生產環境打包

```bash
# 打包應用
npm run build

# 啟動生產伺服器
npm start
```

### 程式碼檢查

```bash
# 執行 ESLint
npm run lint
```

---

## 📁 專案結構

```
台北音樂地圖/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 根佈局（Google Fonts、全局樣式）
│   ├── page.tsx              # 首頁（地圖主介面）
│   └── globals.css           # 全局樣式（Tailwind + 自定義元件）
├── components/               # React 元件
│   ├── Map.tsx               # 地圖元件（MapLibre GL）
│   ├── SearchBar.tsx         # 搜尋欄
│   ├── FilterPanel.tsx       # 篩選面板
│   └── VenueCard.tsx         # 場地卡片
├── data/                     # 資料檔案
│   └── venues.json           # 88 筆音樂場所資料
├── lib/                      # 工具函式與資料存取層
│   └── data-source.ts        # 資料存取介面與實作
├── types/                    # TypeScript 型別定義
│   └── venue.ts              # Venue 資料型別
├── scripts/                  # 工具腳本
│   └── merge_venues.py       # 資料整合腳本（Python）
├── public/                   # 靜態資源
├── tailwind.config.ts        # Tailwind CSS 設定
├── tsconfig.json             # TypeScript 設定
└── package.json              # 專案依賴與腳本
```

---

## 🎨 設計系統

### 色彩配置

| 用途 | 色碼 | 說明 |
|------|------|------|
| **主色調 (Accent)** | `#4A5D4E` | 墨綠色，品牌識別色 |
| **背景色 (Background)** | `#FDFBF7` | 米白色，溫暖舒適感 |
| **玻璃效果** | `white/70` | 70% 不透明白色 |
| **邊框色** | `gray-200/50` | 柔和分隔線 |

### 字體系統

- **中文字體**：Noto Sans TC（Google Fonts）
  - 字重：400, 500, 700, 900
  - 顯示策略：`swap`（避免 FOIT）
  - Header 標題：`font-black` (900) + `tracking-wider`
- **英文字體**：系統預設 Sans-serif

### 動畫與過渡

- **過渡時長**：200ms（快速反饋）
- **微互動**：`hover:scale-105`（懸停放大 5%）
- **模糊效果**：`backdrop-blur-md`（12px blur）
- **緩動函數**：`ease`（自然流暢）

### UI 元件樣式

- **按鈕**：`rounded-full` 全圓角 + `transition-transform`
- **輸入框**：`rounded-full` + `focus:ring-2` 聚焦環
- **卡片**：`shadow-md` + `hover:shadow-lg` 懸停陰影
- **側邊欄**：`transform` + `transition-transform duration-300`

---

## 📝 資料管理

### 新增場地資料

#### 方法一：使用整合腳本（推薦）

編輯 `scripts/merge_venues.py`，將新資料加入 `NEW_VENUES_RAW` 陣列後執行：

```bash
python3 scripts/merge_venues.py
```

腳本會自動處理：
- ✅ **去重**：比對店名，避免重複
- ✅ **格式轉換**：`Categories` → `tags` 陣列
- ✅ **座標生成**：根據地址推測經緯度
- ✅ **Scenario 推測**：根據 Intro 關鍵字智能推測
- ✅ **電話格式統一**：`02-xxxx-xxxx` 格式

#### 方法二：手動編輯 JSON

直接編輯 `data/venues.json`，依照 Venue 型別添加資料：

```json
{
  "id": "unique-id-089",
  "name": "場地名稱",
  "coordinates": [121.5325, 25.0420],
  "tags": ["Jazz", "Live House"],
  "scenario": ["約會", "精緻"],
  "original_review": "場地簡介...",
  "is_canary": false,
  "address": "台北市XXX區XXX路XX號",
  "opening_hours": "19:00–01:00",
  "minimum_charge": "NT$500",
  "phone": "02-1234-5678"
}
```

### 金絲雀資料 (Canary Data)

為防止資料被未授權爬取，資料集中包含 1 筆 `is_canary: true` 的虛構場地。在實際應用中會被自動過濾，但若在其他網站發現此資料，即可證明資料被盜用。

**資料存取層會自動過濾這些數據，一般使用者不會看到。**

---

## 🌐 部署指南

### Vercel 部署（推薦）

1. 將專案推送至 GitHub
2. 前往 [Vercel](https://vercel.com)
3. 點擊 "Import Project"
4. 選擇你的 GitHub Repository
5. Vercel 會自動偵測 Next.js 並完成部署

**無需設定任何環境變數！** MapLibre + OpenFreeMap 完全免費。

### 其他平台

- **Netlify**：支援 Next.js Static Export
- **自架伺服器**：使用 `npm run build && npm start`

---

## 🔮 未來規劃

### 短期功能（1-2 個月）

- [ ] **深色模式**：支援系統主題切換
- [ ] **收藏功能**：使用者可收藏喜愛的場地（LocalStorage）
- [ ] **路線規劃**：點擊場地後顯示 Google Maps 導航連結
- [ ] **分享功能**：生成場地分享連結

### 中期目標（3-6 個月）

- [ ] **Supabase 整合**：將資料遷移至雲端資料庫
- [ ] **使用者認證**：支援登入與個人化功能
- [ ] **UGC 內容**：使用者可提交新場地與評論
- [ ] **進階篩選**：依價位區間、營業時間篩選
- [ ] **GPS 打卡**：「音樂護照」數位打卡功能

### 長期願景（6-12 個月）

- [ ] **多城市擴展**：台中、台南、高雄音樂地圖
- [ ] **社群功能**：音樂活動行事曆、樂團巡演資訊
- [ ] **AI 推薦**：根據使用者喜好推薦場地
- [ ] **行動 App**：React Native 版本
- [ ] **實體化商品**：台北音樂地圖裝飾海報

---

## 🤝 貢獻指南

歡迎貢獻新的場地資料或功能！

### 如何貢獻

1. **Fork** 本專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'feat: add amazing feature'`)
4. 推送至分支 (`git push origin feature/amazing-feature`)
5. 開啟 **Pull Request**

### 資料貢獻規範

- ✅ 確保場地資訊真實且最新
- ✅ 短評需原創且具描述性（30-60 字）
- ✅ 提供完整的地址與營業時間
- ✅ 標籤需符合現有分類體系
- ✅ 執行 `npm run lint` 確保程式碼品質

---

## 📄 授權

本專案採用 **MIT License** 授權。

### 資料使用聲明

- 場地資料由團隊精心策展，僅供個人學習與非商業用途
- 商業使用請聯繫專案維護者
- 禁止未授權爬取資料（含金絲雀資料偵測機制）

---

## 👥 團隊與致謝

### 核心團隊

- **專案發起人**：awei
- **技術架構**：Claude Code (Anthropic)
- **UI/UX 設計**：基於 Glassmorphism 與極簡美學

### 特別感謝

- **OpenFreeMap**：提供免費地圖圖資
- **MapLibre**：開源地圖引擎
- **台北獨立音樂社群**：提供場地推薦與靈感
- **所有音樂場所**：為台北的音樂文化貢獻心力

---

## 📞 聯絡方式

- **問題回報**：請至 GitHub Issues
- **功能建議**：歡迎開啟 Discussion
- **合作洽詢**：請透過 GitHub Profile 聯繫

---

## 🎵 探索台北的音樂靈魂

無論你是爵士樂迷、搖滾青年，還是黑膠收藏家，這張地圖都將帶你深入台北的音樂地下世界。

**立即開始你的音樂之旅** → http://localhost:3000

---

<div align="center">

**Made with 🎵 for Taipei's Music Community**

</div>
