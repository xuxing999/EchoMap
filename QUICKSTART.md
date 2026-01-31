# 快速啟動指南

## 立即開始使用台北音樂地圖

### 步驟 1: 安裝依賴

```bash
npm install
```

### 步驟 2: 啟動開發伺服器

```bash
npm run dev
```

### 步驟 3: 開啟瀏覽器

前往 [http://localhost:3000](http://localhost:3000)

**就這麼簡單！** 🎉 無需註冊帳號、無需填寫信用卡、無需任何 API Token。
本專案使用 MapLibre GL JS + OpenFreeMap 提供完全免費的地圖服務。

## 功能使用說明

### 🗺️ 地圖操作

- **縮放**: 使用滑鼠滾輪或觸控板雙指縮放
- **拖曳**: 按住左鍵拖曳地圖
- **點擊 Marker**: 顯示場地快速預覽

### 🔍 搜尋功能

1. 在頂部搜尋欄輸入關鍵字
2. 即時顯示符合的場地
3. 點擊 X 按鈕清除搜尋

### 🎯 篩選功能

1. 點擊頂部「篩選」按鈕
2. 選擇音樂流派或場景氛圍
3. 支援多選組合篩選
4. 點擊「清除全部」重置篩選

### 📋 場地列表

1. 點擊頂部「列表」按鈕
2. 瀏覽所有符合條件的場地
3. 點擊場地卡片查看詳情
4. 地圖會自動聚焦到選中的場地

## 常見問題

### Q: 地圖無法顯示？

**A**: 請確認：
1. 網路連線正常（地圖圖層需要從 OpenFreeMap CDN 載入）
2. 檢查瀏覽器 Console 是否有錯誤訊息
3. 重新啟動開發伺服器（`npm run dev`）

### Q: 如何新增場地資料？

**A**: 編輯 `data/venues.json` 檔案，按照現有格式新增場地資訊。

### Q: 如何修改地圖樣式？

**A**: 在 `components/Map.tsx` 中修改 `mapStyle` 變數，可選用其他 OpenFreeMap 樣式：
- `https://tiles.openfreemap.org/styles/bright` (明亮風格)
- `https://tiles.openfreemap.org/styles/positron` (淺色簡約)
- `https://tiles.openfreemap.org/styles/liberty` (經典風格)

### Q: 如何修改配色？

**A**: 編輯 `tailwind.config.ts` 中的 `colors` 設定。

### Q: 如何部署到線上？

**A**: 請參考 README.md 中的「部署」章節。部署到 Vercel 完全免費且無需任何配置！

## 下一步

- 查看完整的 [README.md](./README.md) 了解更多功能
- 探索 `components/` 目錄中的組件程式碼
- 閱讀 PRD 文件了解產品規劃

## 需要協助？

如果遇到問題，請：

1. 檢查瀏覽器主控台的錯誤訊息
2. 確認所有依賴已正確安裝（`npm install`）
3. 查看 README.md 中的詳細文件
4. 提交 Issue 尋求協助

---

祝您使用愉快！🎵
