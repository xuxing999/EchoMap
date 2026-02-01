# Logo & Favicon 實作指南

## 概述
為「台北音樂地圖」設計並實作品牌 Logo，使用 Next.js 15 推薦的動態圖示生成方式，解決 `GET /favicon.ico 404` 錯誤。

## 設計理念

### 視覺元素
- **地圖 Pin**：代表地理位置與探索
- **黑膠唱片**：象徵音樂文化與復古情懷
- **音符裝飾**：增添音樂性與活力

### 色彩系統
- **主色**：`#4A5D4E`（深綠色）- 代表文藝、沉穩、自然
- **輔助色**：白色背景與留白設計

### 設計風格
- **極簡主義**：扁平化設計，無多餘裝飾
- **文青美學**：低飽和度色調，復古韻味
- **可識別性**：在小尺寸（32x32px）下仍清晰可辨

## 技術實作

### 1. 動態圖示生成 (`app/icon.tsx`)

使用 Next.js 15 的 `next/og` ImageResponse API 動態生成 favicon：

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    // SVG 設計內容
  );
}
```

**優點**：
- ✅ 無需手動生成多種尺寸的 PNG/ICO 檔案
- ✅ 支援動態渲染，可根據請求參數調整
- ✅ 自動優化為 WebP/PNG 格式
- ✅ 邊緣運算，快速響應

### 2. 圖示元素組成

#### 地圖 Pin（外層）
```tsx
<path
  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
  fill="#4A5D4E"
  stroke="white"
  strokeWidth="0.5"
/>
```

#### 黑膠唱片（中心）
- **外圈**：白色圓形背景（90% 不透明度）
- **紋路圈**：兩層同心圓，模擬唱片紋理
- **中心孔**：深綠色圓點，呼應主色

```tsx
<circle cx="12" cy="9" r="3.5" fill="white" opacity="0.9" />
<circle cx="12" cy="9" r="2.8" fill="none" stroke="#4A5D4E" strokeWidth="0.3" />
<circle cx="12" cy="9" r="2.2" fill="none" stroke="#4A5D4E" strokeWidth="0.3" />
<circle cx="12" cy="9" r="1.2" fill="#4A5D4E" />
```

#### 音符裝飾
```tsx
<path
  d="M13 7.5 L13 10 M13 7.5 L14.5 7 L14.5 9.5"
  stroke="white"
  strokeWidth="0.4"
/>
<circle cx="13" cy="10.2" r="0.4" fill="white" />
<circle cx="14.5" cy="9.7" r="0.4" fill="white" />
```

### 3. Metadata 配置 (`app/layout.tsx`)

#### 基本資訊
```tsx
export const metadata: Metadata = {
  title: "台北音樂地圖 | Taipei Music Map",
  description: "探索台北最精緻的音樂場所...",
  keywords: ["台北", "音樂", "Live House", ...],
  authors: [{ name: "Taipei Music Map" }],
  icons: { icon: '/icon' },
}
```

#### Viewport 配置（分離）
```tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#4A5D4E',
};
```

**重要**：Next.js 15 要求 `viewport` 和 `themeColor` 必須使用 `generateViewport` 或獨立的 `viewport` export，不可放在 `metadata` 中。

#### OpenGraph & Twitter Card
```tsx
openGraph: {
  title: "台北音樂地圖 | 探索城市音樂生活",
  description: "探索台北最精緻的音樂場所...",
  siteName: '台北音樂地圖',
  locale: 'zh_TW',
  type: 'website',
},
twitter: {
  card: 'summary',
  title: '台北音樂地圖 | Taipei Music Map',
}
```

## 使用方式

### 自動生成路徑
- **Favicon**：`/icon` 或 `/favicon.ico`（自動重定向）
- **Apple Touch Icon**：`/apple-icon`
- **帶版本號快取**：`/icon?{hash}`

### 瀏覽器支援
- ✅ Chrome/Edge：完整支援
- ✅ Safari：支援 PNG favicon
- ✅ Firefox：支援動態圖示
- ✅ 行動裝置：支援 Apple Touch Icon

## 效果驗證

### 檢查編譯狀態
```bash
✓ Compiled /icon in 629ms
GET /icon?81d6d9677df318eb 200 in 756ms
GET /icon 200 in 38ms
```

### 404 錯誤已解決
- ❌ 舊問題：`GET /favicon.ico 404 (Not Found)`
- ✅ 新狀態：`GET /icon 200 in 38ms`

### 視覺效果
1. 瀏覽器標籤頁顯示地圖 Pin + 黑膠唱片圖示
2. 書籤/收藏夾顯示品牌 Logo
3. 行動裝置主畫面顯示高解析度圖示

## 未來擴展

### 多尺寸支援
可新增 `app/apple-icon.tsx` 提供更高解析度（180x180px）：
```tsx
export const size = { width: 180, height: 180 };
```

### 暗色模式適配
可根據使用者偏好動態調整顏色：
```tsx
const isDark = searchParams.theme === 'dark';
const bgColor = isDark ? '#1a1a1a' : 'white';
```

### PWA 支援
在 `app/manifest.ts` 中引用：
```tsx
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '台北音樂地圖',
    icons: [{ src: '/icon', sizes: '64x64', type: 'image/png' }],
  };
}
```

## 技術優勢

### 效能優化
- **邊緣運算**：使用 `runtime = 'edge'` 加速全球訪問
- **快取機制**：自動添加 hash 版本號，長期快取
- **響應式**：可根據設備像素比（DPR）提供不同解析度

### 開發體驗
- **單一來源**：無需維護多個靜態檔案
- **動態調整**：可輕鬆修改顏色、尺寸、設計
- **類型安全**：完整的 TypeScript 支援

### SEO 友善
- **完整 Metadata**：標題、描述、關鍵字、OpenGraph
- **社群分享**：Twitter Card 優化分享預覽
- **語系標記**：`locale: 'zh_TW'` 明確標示繁體中文

## 參考資源

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js App Icons](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- [ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Viewport Configuration](https://nextjs.org/docs/app/api-reference/functions/generate-viewport)

---

**實作日期**：2026-02-01
**Next.js 版本**：15.5.11
**設計師**：Claude Code
