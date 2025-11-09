# 🎮 MERN Game Store ｜全端遊戲商城專案

A full-stack **MERN-based Game Store** featuring user authentication, game browsing, shopping cart, and checkout flow.  
一個以 **MERN 架構**（MongoDB, Express, React, Node.js）打造的全端遊戲商城，支援會員登入、遊戲展示、購物車與結帳功能。

## 🚀 功能特色 ｜ Features

- 🔐 使用者註冊 / 登入（支援 Google OAuth）
- 🧑‍💼 管理者可新增 / 修改 / 刪除遊戲
- 🛒 一般使用者可瀏覽、搜尋、加入購物車並結帳
- 🖼️ 遊戲頁面支援主圖與縮圖輪播
- 💬 購物清單即時更新
- 📱 RWD 響應式設計，支援手機、平板、桌機

## 🧩 使用技術 ｜ Tech Stack

**Frontend 前端**

- React (Vite)
- TypeScript
- Tailwind CSS
- Axios
- GSAP (動畫)
- React Router

**Backend 後端**

- Node.js + Express
- MongoDB + Mongoose
- Passport.js（Google OAuth）
- bcrypt（密碼加密）
- dotenv（環境變數）

## ⚙️ 專案啟動方式 ｜ Installation & Setup

### 1️⃣ Clone 專案 / Clone Repository

git clone https://github.com/doriskuo/mern-game-store.git  
cd mern-game-store

### 2️⃣ 安裝前端套件 / Install Frontend Dependencies

cd client  
npm install  
npm run dev

### 3️⃣ 啟動後端伺服器 / Start Backend Server

cd ../server  
npm install  
npm start

### 4️⃣ 開啟瀏覽器 / Visit in Browser

前端：http://localhost:5173  
後端：http://localhost:3000

## 📂 專案結構 ｜ Project Structure

mern-game-store/  
│── client/ # 前端 React (Vite + Tailwind)  
│── server/ # 後端 Express + MongoDB  
│── .env # 環境變數設定  
│── package.json  
│── README.md  
│── Dockerfile (optional)

## 🧠 功能介紹 ｜ Key Pages & Features

### 🏠 首頁 Home

展示推薦遊戲與導覽列滾輪滾動互動式動畫效果。

### 🎮 Games

可瀏覽遊戲內容、大圖切換、依名稱搜尋。

### 🛍️ Shopping

顯示所有可購買遊戲，支援加入購物車與立即購買。

### 👤 Account

使用者登入後可查看購物清單、修改數量或結帳。

### ⚙️ Admin Page

管理者可建立 / 更新 / 刪除遊戲資料。

## 🔑 登入與權限 ｜ Auth & Roles

| 角色         | 權限說明                   |
| ------------ | -------------------------- |
| 使用者 User  | 可註冊、登入、購物         |
| 管理者 Admin | 可新增、修改、刪除遊戲資料 |

## 🧭 環境變數設定 ｜ Environment Variables

請在 `server/.env` 內新增以下內容：

MONGO_URI=你的 MongoDB 連線字串  
JWT_SECRET=你的 JWT 密鑰  
GOOGLE_CLIENT_ID=你的 Google OAuth ID  
GOOGLE_CLIENT_SECRET=你的 Google OAuth Secret

## 🔧 後續優化方向 ｜ Future Improvements

- 新增「收藏清單」與「評價系統」
- 整合 Redux / Zustand 進行狀態管理
- 加入 Jest 進行單元測試
- 強化購物流程與結帳頁面設計

## 📄 授權 ｜ License

本專案僅作為學習用途，無商業使用授權。  
This project is for educational purposes only.

## 👩‍💻 作者 ｜ Author

**Doris**  
📧 Email: [doris730105@gmail.com]  
🌐 Portfolio: [https://doriskuo.github.io/]  
💻 GitHub: [https://github.com/doriskuo](https://github.com/doriskuo)
