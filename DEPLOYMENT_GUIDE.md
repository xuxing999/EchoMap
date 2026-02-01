# 🚀 台北音樂地圖 - GitHub & Vercel 部署指南

## 📋 部署前準備檢查表

✅ Git 分支已合併至 main
✅ 生產環境配置已完成
✅ .gitignore 已設定完整
✅ 所有更改已提交

---

## 第一部分：推送至 GitHub

### 步驟 1：在 GitHub 建立新 Repository

1. **前往 GitHub**
   開啟瀏覽器，前往 https://github.com

2. **登入帳號**
   使用您的 GitHub 帳號登入

3. **建立新 Repository**
   - 點擊右上角 `+` 按鈕 → 選擇 `New repository`
   - **Repository name**：`taipei-music-map`（或您喜歡的名稱）
   - **Description**：`探索台北最精緻的音樂場所：Live House、Jazz Bar、黑膠唱片行與獨立音樂空間`
   - **Visibility**：選擇 `Public`（公開）或 `Private`（私人）
   - **❌ 不要勾選**：Initialize this repository with a README（因為我們已經有本地 repository）
   - 點擊 `Create repository`

### 步驟 2：連接本地 Repository 到 GitHub

在終端機（Terminal）執行以下指令：

```bash
# 1. 添加 GitHub 遠端倉庫（將 YOUR_USERNAME 替換為您的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/taipei-music-map.git

# 2. 驗證遠端倉庫已添加
git remote -v

# 3. 推送至 GitHub（首次推送）
git push -u origin main
```

**輸入帳密：**
- Username：您的 GitHub 用戶名
- Password：GitHub Personal Access Token（不是密碼！）

**如何獲取 Personal Access Token：**
1. GitHub → 右上角頭像 → Settings
2. 左側選單最下方 → Developer settings
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. 勾選 `repo` 權限
6. 複製 token（僅顯示一次！）

### 步驟 3：驗證推送成功

返回 GitHub repository 頁面，應該可以看到所有檔案已成功上傳。

---

## 第二部分：部署至 Vercel

### 步驟 1：註冊/登入 Vercel

1. **前往 Vercel**
   開啟 https://vercel.com

2. **登入方式（推薦使用 GitHub）**
   - 點擊 `Sign Up` 或 `Log In`
   - 選擇 `Continue with GitHub`
   - 授權 Vercel 存取您的 GitHub 帳號

### 步驟 2：從 GitHub 匯入專案

1. **進入 Dashboard**
   登入後會看到 Vercel Dashboard

2. **建立新專案**
   - 點擊 `Add New...` → `Project`
   - 或直接點擊 `Import Git Repository`

3. **選擇 Repository**
   - 搜尋或找到 `taipei-music-map`
   - 點擊 `Import`

### 步驟 3：配置專案設定

在 Configure Project 頁面：

1. **Project Name**
   - 保持預設或自訂（例如：`taipei-music-map`）
   - 這將成為您的網址：`taipei-music-map.vercel.app`

2. **Framework Preset**
   - 應自動偵測為 `Next.js`
   - 如果沒有，請手動選擇 `Next.js`

3. **Root Directory**
   - 保持預設 `./`（根目錄）

4. **Build and Output Settings**
   - Build Command：`npm run build` 或 `next build`（自動）
   - Output Directory：`.next`（自動）
   - Install Command：`npm install`（自動）

5. **Environment Variables（環境變數）**
   - 點擊 `Add Environment Variable`
   - 添加以下變數（如果需要）：

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_BASE_URL` | `https://taipei-music-map.vercel.app`（或您的自訂網址） |

   **注意**：Vercel 會自動在部署後提供正式網址，您可以稍後再回來更新此變數。

6. **點擊 Deploy**
   Vercel 開始建置與部署您的專案

### 步驟 4：等待部署完成

- **建置時間**：約 1-3 分鐘
- **進度顯示**：可以看到即時建置日誌
- **狀態變化**：
  - 🔨 Building...
  - 🚀 Deploying...
  - ✅ Ready

### 步驟 5：獲取正式網址

部署成功後：

1. **複製網址**
   - 畫面會顯示：`https://taipei-music-map.vercel.app`
   - 點擊 `Visit` 或複製網址

2. **更新環境變數（重要）**
   - 回到 Vercel Dashboard
   - 專案設定 → Settings → Environment Variables
   - 編輯 `NEXT_PUBLIC_BASE_URL` 為正式網址
   - 重新部署：Deployments → 最新部署旁的 `...` → Redeploy

---

## 第三部分：驗證部署

### ✅ 檢查清單

訪問您的正式網址，確認以下功能：

- [ ] **HTTPS 正常**：網址列顯示 🔒 鎖頭圖示
- [ ] **地圖載入**：OpenFreeMap 地圖瓦片正常顯示
- [ ] **標記顯示**：88 個音樂場地標記正常渲染
- [ ] **聚合功能**：縮小地圖時標記正確聚合
- [ ] **Spiderfy 展開**：點擊聚合點正常展開
- [ ] **搜尋功能**：搜尋欄可正常使用
- [ ] **篩選功能**：標籤篩選正常運作
- [ ] **定位按鈕**：點擊可獲取使用者位置（需允許權限）
- [ ] **行動版**：BottomSheet 在手機上正常運作
- [ ] **Favicon**：瀏覽器標籤顯示 Logo
- [ ] **觸控操作**：雙指縮放地圖正常（cooperative gestures）

### 🐛 常見問題排查

#### 問題 1：地圖無法載入
**原因**：MapLibre GL CSS 未載入
**解決**：檢查 `components/Map.tsx` 是否有 `import 'maplibre-gl/dist/maplibre-gl.css'`

#### 問題 2：環境變數未生效
**原因**：環境變數僅在部署時生效
**解決**：更新環境變數後，需重新部署（Redeploy）

#### 問題 3：Build 失敗
**原因**：依賴安裝錯誤或 TypeScript 編譯錯誤
**解決**：查看 Build Logs，修正錯誤後推送新 commit

#### 問題 4：Favicon 404
**原因**：`app/icon.tsx` 未正確生成
**解決**：確認 `app/icon.tsx` 存在且無語法錯誤

---

## 🔄 後續更新流程

### 本地開發 → GitHub → Vercel 自動部署

1. **本地開發**
   ```bash
   npm run dev
   # 在 http://localhost:3000 測試
   ```

2. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 新功能描述"
   ```

3. **推送至 GitHub**
   ```bash
   git push origin main
   ```

4. **Vercel 自動部署**
   - Vercel 偵測到 main 分支更新
   - 自動觸發建置與部署
   - 約 1-3 分鐘後更新完成

5. **查看部署狀態**
   - Vercel Dashboard → Deployments
   - 或收到 Email 通知

---

## 🎯 進階功能

### 自訂網域名稱

1. **購買網域**（選擇任一註冊商）
   - Namecheap
   - GoDaddy
   - Cloudflare

2. **在 Vercel 設定自訂網域**
   - 專案設定 → Domains
   - 輸入網域名稱（例如：`taipeimusic.com`）
   - 按照指示設定 DNS 記錄

3. **更新環境變數**
   - `NEXT_PUBLIC_BASE_URL` 改為自訂網域

### 效能監控

- **Vercel Analytics**：專案設定 → Analytics → Enable
- **Speed Insights**：監控頁面載入速度
- **Web Vitals**：追蹤 Core Web Vitals 指標

### Preview Deployments

- **功能**：每個 Pull Request 自動建立預覽環境
- **用途**：測試新功能，不影響正式環境
- **網址**：`taipei-music-map-git-branch-name.vercel.app`

---

## 📞 需要協助？

- **Vercel 文件**：https://vercel.com/docs
- **Next.js 部署指南**：https://nextjs.org/docs/deployment
- **GitHub 支援**：https://docs.github.com

---

## ✅ 部署完成檢查

- [ ] GitHub Repository 已建立且程式碼已推送
- [ ] Vercel 專案已建立且部署成功
- [ ] 正式網址可正常訪問
- [ ] HTTPS 啟用且證書有效
- [ ] 地圖與所有功能正常運作
- [ ] Favicon 與 Logo 正確顯示
- [ ] 行動版體驗良好
- [ ] 環境變數已設定正確
- [ ] 自動部署流程已測試

**恭喜！🎉 台北音樂地圖已成功部署至正式環境！**

---

**文件版本**：1.0
**最後更新**：2026-02-01
**適用版本**：Next.js 15.5.11 + Vercel
