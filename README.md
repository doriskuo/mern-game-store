# 🎮 MERN Game Store ｜全端遊戲商城專案

A full-stack **MERN-based Game Store** featuring authentication, admin dashboard, and shopping flow.  
以 **MERN 架構（MongoDB, Express, React, Node.js）** 打造的全端遊戲商城，  
支援 **Google OAuth 登入、遊戲查詢、購物車與後台 CRUD 管理系統**，  
並完整串接前後端環境變數、部署於 **Render + Vercel 雲端平台**。

---

## 🚀 功能特色 ｜ Features

- 🔐 使用者註冊 / 登入（含 Google OAuth2）
- 🧑‍💼 管理者可新增 / 修改 / 刪除 / 查詢遊戲
- 🛒 一般使用者可瀏覽、搜尋、加入購物車與結帳
- 🖼️ 遊戲頁面支援大圖與縮圖輪播展示
- 💬 購物清單即時同步更新
- 📱 RWD 響應式設計，支援手機、平板、桌機
- 🌐 環境變數自動區分本地與雲端，完整部署流程

---

## 🧩 使用技術 ｜ Tech Stack

**Frontend 前端**

- React 19 (Vite)
- TypeScript
- Tailwind CSS
- Axios
- GSAP（動畫）
- React Router v7

**Backend 後端**

- Node.js + Express
- MongoDB + Mongoose
- Passport.js（Google OAuth）
- JWT 驗證、bcrypt 密碼加密
- dotenv 管理環境變數

---

## ⚙️ 專案啟動方式 ｜ Installation & Setup

### 1️⃣ Clone 專案

\```
git clone https://github.com/doriskuo/mern-game-store.git
cd mern-game-store
\```

### 2️⃣ 安裝前端套件

\```
cd client
npm install
npm run dev
\```

### 3️⃣ 啟動後端伺服器

\```
cd ../server
npm install
npm start
\```

### 4️⃣ 開啟瀏覽器

- 前端：http://localhost:5173
- 後端：http://localhost:3000

---

## 📂 專案結構 ｜ Project Structure

mern-game-store/
│── client/ # 前端 React (Vite + Tailwind)
│── server/ # 後端 Express + MongoDB
│── .env # 環境變數設定
│── package.json
│── README.md
│── Dockerfile (optional)

---

## 🧠 主要頁面與功能 ｜ Key Pages & Features

### 🏠 Home

展示推薦遊戲與互動式滾動動畫（GSAP + SVG Nav）。

### 🎮 Games

支援搜尋、篩選與遊戲詳情查看，大圖 / 小圖輪播展示。

### 🛍️ Shopping

可將遊戲加入購物車並結帳，購物清單即時更新。

### 👤 Account

登入後可查看與管理購物清單。

### ⚙️ Admin Page

管理者可新增 / 更新 / 刪除 / 查詢遊戲資料，  
查詢功能支援以「遊戲名稱 / 建立者 / ID」檢索。

---

## 🔑 登入與權限 ｜ Auth & Roles

| 角色         | 權限說明                         |
| ------------ | -------------------------------- |
| 使用者 User  | 可註冊、登入、瀏覽、購物         |
| 管理者 Admin | 可新增、修改、刪除、查詢遊戲資料 |

---

## 🧭 環境變數設定 ｜ Environment Variables

請在 `server/.env` 內設定以下內容：

MONGO_URI=你的 MongoDB 連線字串
JWT_SECRET=你的 JWT 密鑰
GOOGLE_CLIENT_ID=你的 Google OAuth ID
GOOGLE_CLIENT_SECRET=你的 Google OAuth Secret

前端使用：

VITE_API_BASE_URL=你的後端 URL
VITE_IMG_BASE_URL=圖片伺服 URL

---

## 📜 專案亮點 ｜ Highlights

- 🌈 **前後端完全整合：** 支援雲端部署（Render + Vercel），含跨域驗證與環境切換
- 🔒 **安全性完善：** 採用 JWT、bcrypt、Google OAuth 登入
- 🛠 **完整 CRUD：** Admin 具備建立、更新、刪除與查詢功能
- 🎨 **互動體驗：** GSAP 動畫與 SVG 導覽列設計
- 📱 **全 RWD：** 支援桌機、平板與手機流暢瀏覽

---

## 🔧 後續優化方向 ｜ Future Improvements

- ✨ 收藏清單與遊戲評價系統
- 🧱 整合 Redux / Zustand 進行狀態管理
- 🧪 Jest 單元測試與 CI/CD 自動化
- 💳 強化結帳流程與 UI 設計

---

## 🌍 部署說明 ｜ Deployment Notes

**Render（後端）**

- 啟用環境變數：`MONGO_URI`、`CLIENT_URL`、`SERVER_URL`
- 設定 CORS 允許來源：`localhost` 與 `vercel.app`
- 部署指令自動啟動：`node index.js`

**Vercel（前端）**

- `.env` 內設定 `VITE_API_BASE_URL` 與 `VITE_IMG_BASE_URL`
- 自動對應後端伺服器 URL
- 自動處理 HTTPS 與環境切換（production / development）

---

## 👩‍💻 作者 ｜ Author

**Doris Kuo**  
📧 Email: [doris730105@gmail.com]  
🌐 Portfolio: [https://doriskuo.github.io/](https://doriskuo.github.io/)  
💻 GitHub: [https://github.com/doriskuo](https://github.com/doriskuo)
