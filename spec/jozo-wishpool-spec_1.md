# Jōzō 揪作許願池 — 開發規劃書

> 給 Claude Code 的全端開發規格文件  
> 專案版本：v1.1  
> 部署目標：Zeabur（Next.js） + Supabase（PostgreSQL）

---

## 一、專案背景與目標

**Jōzō（揪做）** 是一個以臺中舊城為根據地的地方經紀與文化釀造平台。許願池是 Jōzō 網站「誰來揪作」頁面下的核心功能模組。

### 核心邏輯

任何人都可以在這裡發起一個想做的事，Jōzō 作為中介角色，協助媒合有技能、有資源、有時間的人加入。

```
發起人有想法 → 許願（無需登入）→ 社群討論 → 找到夥伴 → 揪作成真
```

### 主要功能目標

- 任何人無需登入，可以直接發起許願
- 任何人無需登入，可以留言討論、表達加入意願、互留 IG / Threads
- 專案可以分類瀏覽
- 管理員登入後可以刪除許願和留言

---

## 二、使用者角色

| 角色 | 登入需求 | 權限 |
|------|----------|------|
| 一般訪客 | 不需要 | 瀏覽、發起許願、留言、加入、留社群帳號 |
| 管理員（Jōzō） | 需要 | 以上全部 + 刪除任意許願、刪除任意留言、標記急需 |

---

## 三、核心功能規格

### 3.1 許願（Wish）

```typescript
interface Wish {
  id: string
  title: string          // 許願標題（必填，最多 50 字）
  category: string       // 分類（必填）
  description: string    // 描述（必填，最多 500 字）
  author_name: string    // 發起人名稱（必填）
  author_social: string  // IG / Threads handle（選填，公開）
  is_urgent: boolean     // 是否急需人手（預設 false）
  created_at: Date
}

// category 可選值
type WishCategory =
  | 'event'      // 活動策劃
  | 'collab'     // 協作計畫
  | 'media'      // 內容媒體
  | 'space'      // 空間場域
  | 'research'   // 研究調查
```

### 3.2 留言（Comment）

```typescript
interface Comment {
  id: string
  wish_id: string
  author_name: string    // 留言者名稱（必填）
  author_social: string  // IG / Threads handle（選填）
  content: string        // 留言內容（最多 300 字）
  created_at: Date
}
```

### 3.3 加入意願（Join）

```typescript
interface Join {
  id: string
  wish_id: string
  name: string           // 必填
  social: string         // IG / Threads（選填）
  message: string        // 簡短說明（最多 100 字，選填）
  created_at: Date
}
```

---

## 四、頁面結構

### 4.1 公開前台（無需登入）

```
/                  → 許願池首頁（卡片列表 + 分類篩選）
/wish/[id]         → 單一許願詳情（完整描述 + 留言 + 加入）
/wish/new          → 許願表單
```

### 4.2 管理後台（需要登入）

```
/admin             → 管理員登入頁
/admin/dashboard   → 許願列表（可刪除、可標記急需）
```

> 管理員後台以功能為主，不需要精緻 UI，能刪除和標記即可。

---

## 五、UI 功能細節

### 5.1 首頁列表

- 顯示所有許願，按建立時間降序
- 分類篩選 tab：全部 / 活動策劃 / 協作計畫 / 內容媒體 / 空間場域 / 研究調查 / 🔥 急需人手
- 卡片顯示：標題、分類 badge、描述前 80 字、發起人名稱、留言數、加入人數
- 急需人手卡片有紅色左邊框標記
- 每頁 12 張，分頁或無限滾動皆可

### 5.2 許願詳情頁

- 完整標題、分類、發起人資訊（名稱 + 社群帳號）
- 完整描述
- 「我來」按鈕 → 展開小表單（姓名、社群帳號選填、簡短說明選填）→ 送出後顯示感謝訊息
- 留言區：顯示所有留言，可新增（姓名必填、社群帳號選填、內容必填）

### 5.3 許願表單

必填：
- 許願標題
- 分類
- 描述
- 發起人名稱

選填：
- IG / Threads handle
- 急需人手 checkbox

送出後：直接公開顯示（無需審核）。

### 5.4 管理後台

- 帳密登入（單一管理員帳號）
- 列出所有許願，每筆可以：刪除許願、標記 / 取消急需
- 進入單一許願可以刪除任意留言

---

## 六、技術規格

### 6.1 技術選型

| 層級 | 選擇 | 說明 |
|------|------|------|
| 框架 | Next.js 14（App Router） | SSR + API Routes |
| 資料庫 | Supabase（PostgreSQL） | 免費方案足夠初期使用 |
| 資料庫 client | @supabase/supabase-js | 不需要 Prisma |
| 樣式 | Tailwind CSS | 快速開發 |
| 管理員認證 | NextAuth.js（Credentials） | 單一帳密登入 |
| 部署 | Zeabur | 只需部署 Next.js，DB 在 Supabase |

### 6.2 環境變數

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # 管理員操作（刪除）用
NEXTAUTH_SECRET=random-secret-string
NEXTAUTH_URL=https://your-domain.zeabur.app
ADMIN_EMAIL=ivy@jozo.tw
ADMIN_PASSWORD_HASH=bcrypt-hash    # 用 bcrypt hash 儲存
```

### 6.3 Supabase 建表 SQL

直接貼進 Supabase SQL Editor 執行：

```sql
-- 許願
create table wishes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  author_name text not null,
  author_social text,
  is_urgent boolean not null default false,
  created_at timestamptz not null default now()
);

-- 留言
create table comments (
  id uuid primary key default gen_random_uuid(),
  wish_id uuid not null references wishes(id) on delete cascade,
  author_name text not null,
  author_social text,
  content text not null,
  created_at timestamptz not null default now()
);

-- 加入意願
create table joins (
  id uuid primary key default gen_random_uuid(),
  wish_id uuid not null references wishes(id) on delete cascade,
  name text not null,
  social text,
  message text,
  created_at timestamptz not null default now()
);

-- RLS：開放所有人讀取和新增，刪除只能透過 service role key
alter table wishes enable row level security;
alter table comments enable row level security;
alter table joins enable row level security;

create policy "anyone can read wishes" on wishes for select using (true);
create policy "anyone can insert wishes" on wishes for insert with check (true);

create policy "anyone can read comments" on comments for select using (true);
create policy "anyone can insert comments" on comments for insert with check (true);

create policy "anyone can read joins" on joins for select using (true);
create policy "anyone can insert joins" on joins for insert with check (true);

-- 刪除操作由後端用 service_role key 執行，繞過 RLS
```

### 6.4 API Routes

```
// 公開（使用 anon key）
GET    /api/wishes              列表（支援 ?category=&urgent=true&page=）
POST   /api/wishes              新增許願
GET    /api/wishes/[id]         單一許願詳情（含留言和加入人數）
POST   /api/wishes/[id]/comments  新增留言
POST   /api/wishes/[id]/join    加入意願

// 管理員（驗證 session，使用 service_role key）
DELETE /api/admin/wishes/[id]         刪除許願
DELETE /api/admin/comments/[id]       刪除留言
PATCH  /api/admin/wishes/[id]/urgent  切換急需標記
```

---

## 七、Zeabur 部署

### 7.1 服務結構

```
Zeabur Project: jozo-wishpool
└── Service: wishpool-web    (Next.js，連接外部 Supabase)
```

### 7.2 部署步驟

1. 將專案推上 GitHub
2. 在 Zeabur 建立新 Project → 新增 Service → 選 GitHub repo
3. Zeabur 自動偵測 Next.js
4. 在 Zeabur 設定環境變數（6.2 所列全部）
5. 部署完成後取得網域，填回 `NEXTAUTH_URL`

### 7.3 `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## 八、開發優先順序

### Phase 1 — 核心功能

- [ ] Supabase 建表（貼上 6.3 的 SQL）
- [ ] 許願列表頁（含分類篩選）
- [ ] 許願詳情頁（含留言區）
- [ ] 許願表單（送出即公開）
- [ ] 新增留言
- [ ] 「我來」加入功能

### Phase 2 — 管理功能

- [ ] 管理員登入（NextAuth Credentials）
- [ ] 後台許願列表（刪除、標記急需）
- [ ] 後台刪除留言

### Phase 3 — 優化

- [ ] Email 通知（有新許願時寄信給管理員）
- [ ] SEO meta tags
- [ ] Open Graph 分享預覽

---

## 九、資料驗證規則（使用 Zod）

| 欄位 | 規則 |
|------|------|
| 許願標題 | 必填，2–50 字 |
| 描述 | 必填，10–500 字 |
| 發起人名稱 | 必填，1–20 字 |
| 社群帳號 | 選填，若填寫以 `@` 開頭，最多 30 字 |
| 留言內容 | 必填，1–300 字 |
| 留言者名稱 | 必填，1–20 字 |

---

## 十、備註

- **無帳號系統**：所有使用者操作都不需要登入，只填姓名和選填社群帳號
- **無審核流程**：許願送出後直接公開，管理員事後刪除即可
- **垃圾內容防護**：初期用 honeypot 隱藏欄位，不需要 CAPTCHA
- **語言**：全繁體中文介面
- **響應式**：支援手機瀏覽

---

*Jōzō 揪作許願池 — 讓想法被看見，讓對的人找到彼此*
