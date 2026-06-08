<div align="center">

<img src="https://f1-web-delta.vercel.app/images/common/logo.png" alt="WhatisF1 로고" width="180"/>

# WhatisF1

**포뮬러 1 팬을 위한 올인원 데이터 플랫폼**

뉴스 · 하이라이트 · 경기 일정 · 결과 · 순위 · 팬 투표를 한 곳에서

[![배포](https://img.shields.io/badge/배포-Vercel-black?style=flat-square&logo=vercel)](https://f1-web-delta.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)

🔗 **[f1-web-delta.vercel.app](https://f1-web-delta.vercel.app)** | 📸 **[Instagram @what_is_f1__](https://www.instagram.com/what_is_f1__)**

</div>

---

## 📖 프로젝트 소개

바닐라 JS로 제작한 원본 F1 정보 사이트를 **Next.js / React 기반으로 전면 재이식**한 프로젝트입니다.

단순한 포팅을 넘어 뉴스 승인 시스템, 관리자 번역 에디터, OAuth 인증, ISR 캐시 전략 등 실전 수준의 기능을 직접 설계·구현하며 CS 기초와 풀스택 배포 경험을 쌓는 것을 목적으로 합니다.

---

## 🛠 Tech Stack

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Auth** | Auth.js v5 — Google · Kakao OAuth (JWT 전략) |
| **Database** | Supabase (PostgreSQL) |
| **Server State** | TanStack Query v5 |
| **External APIs** | Jolpica F1 API, YouTube Data API v3 |
| **Deployment** | Vercel |
| **RSS Parser** | xml2js |
| **국기 아이콘** | flag-icons |

---

## 🗂 프로젝트 구조

```
F1-web/
├── public/
│   └── images/
│       ├── circuits/          # 서킷 이미지 25개
│       └── common/            # 로고 등 공통 이미지
│
├── src/
│   ├── app/
│   │   ├── (main)/            # 공개 라우트 그룹
│   │   │   ├── page.tsx       # 홈 — 다음 레이스, 최신 뉴스, 순위 TOP3, 팬 투표 CTA
│   │   │   ├── news/
│   │   │   │   ├── page.tsx           # 뉴스 목록 (날짜 탭 + 매체 필터)
│   │   │   │   └── [slug]/page.tsx    # 뉴스 상세 페이지
│   │   │   ├── highlights/
│   │   │   │   └── page.tsx           # 하이라이트 영상 (3축 필터)
│   │   │   ├── schedules/
│   │   │   │   └── page.tsx           # 경기 일정 (2025/2026 시즌)
│   │   │   ├── results/
│   │   │   │   └── page.tsx           # 경기 결과 (세션별 탭)
│   │   │   ├── standings/
│   │   │   │   └── page.tsx           # 드라이버/컨스트럭터 순위
│   │   │   └── prediction/
│   │   │       └── page.tsx           # 팬 투표
│   │   │
│   │   ├── api/               # Next.js API Route 핸들러
│   │   │   ├── news/
│   │   │   │   ├── fetch/     # RSS 수집 + Supabase 저장
│   │   │   │   ├── publish/   # 기사 공개 (PATCH) + revalidatePath
│   │   │   │   └── translate/ # 한국어 번역 저장
│   │   │   └── standings/
│   │   │       └── search/    # 드라이버/팀 이름 검색
│   │   │
│   │   ├── policy/            # 정책 페이지
│   │   │   ├── terms/         # 이용약관
│   │   │   ├── privacy/       # 개인정보처리방침
│   │   │   └── policy/        # 운영정책
│   │   │
│   │   └── layout.tsx         # 루트 레이아웃 (메타데이터, 폰트, Provider)
│   │
│   ├── components/
│   │   ├── Header.tsx         # 네비게이션 + 다크모드 토글 + 모바일 햄버거
│   │   ├── Footer.tsx         # 소셜 링크 + 법적 고지 + 정책 링크
│   │   └── Providers.tsx      # TanStack Query + Auth.js Provider 래퍼
│   │
│   └── lib/
│       ├── f1api.ts           # Jolpica F1 API 클라이언트 (일정/결과/순위)
│       ├── youtube.ts         # YouTube Data API v3 클라이언트
│       ├── supabase.ts        # Supabase 클라이언트 초기화
│       └── utils.ts           # 날짜 포맷, slug 인코딩 등 유틸
│
├── next.config.ts             # 이미지 허용 도메인 8개, poweredByHeader 제거
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## ✨ 주요 기능

### 🏠 홈 (`/`)
- 다음 레이스 카운트다운 및 세션 일정 표시
- 최신 뉴스 3건 프리뷰
- 최신 하이라이트 3건 프리뷰
- 드라이버/컨스트럭터 순위 TOP 3
- 팬 투표 CTA

### 📰 뉴스 (`/news`)
8개 RSS 피드(Autosport · Motorsport · BBC Sport · RaceFans · The Race · Crash.net · MSWeek · GPFans)를 집계하여 한국어로 제공합니다.

- 날짜별 탭 UI + 매체 필터 + 가로 스크롤
- 기사별 이모지 반응 (Supabase `news_reactions` 저장, 로그인 기반)
- 내부 상세 페이지 `/news/[slug]` — Base64 slug, 원문 링크 별도 제공
- 미번역 기사에 **EN 뱃지** 표시
- **관리자 전용 인라인 번역 에디터** — 제목/본문 한국어 번역 후 "공개하기"
- **승인 시스템**: 신규 수집 기사는 `is_published = false` → 관리자 번역 승인 후 공개
  - 미승인 기사는 7일 경과 시 자동 삭제
- **ISR 5분 캐시** + 공개 시 `revalidatePath` 즉시 무효화 → ~5초 내 전체 반영

#### 뉴스 공개 흐름

```
관리자 "공개하기" 클릭
  → PATCH /api/news/publish
  → Supabase: is_published = true
  → revalidatePath('/news') — ISR 캐시 즉시 무효화
  → 관리자 화면: "미승인" 배지 즉시 사라짐 (optimistic update)
  → 일반 사용자: 다음 /news 접속 시 해당 기사 노출
```

#### DB 일괄 공개 (초기 마이그레이션 시)

```sql
-- 번역 완료 기사만
UPDATE news_translations SET is_published = true WHERE title_kr IS NOT NULL;

-- 전체 공개
UPDATE news_translations SET is_published = true;
```

### 🎬 하이라이트 (`/highlights`)
- YouTube Data API v3, 플레이리스트 13개 자동 수집
- **ISR 1시간 캐시**
- 시즌 / 콘텐츠 종류 / 채널 **3축 독립 필터**
- 쇼츠 자동 감지, 슬라이더 / 그리드 뷰 전환

### 📅 경기 일정 (`/schedules`)
- Jolpica F1 API 연동 — **2025 / 2026 시즌** 지원
- 라운드별 카드 UI (서킷 · 국가 · 날짜 표시)
- 결과 페이지 직접 연결

### 🏆 경기 결과 (`/results`)
- 레이스 · 퀄리파잉 · 스프린트 · FP1/2/3 · 피트스탑 · 타이어 전략 데이터
- 가용 세션만 탭으로 자동 표시
- 서킷 이미지 25개 수록

### 📊 순위 (`/standings`)
- 드라이버 / 컨스트럭터 현 시즌 + 역대 시즌 드릴다운
- 이름 검색 API (`/api/standings/search`)

### 🗳 팬 투표 (`/prediction`)
- localStorage 기반 — 단일 선택 · 복수 선택 · 순위 선택(1·2·3위) 3종 질문 유형
- 제출 후 잠금, 초기화 버튼 포함

### 🔐 인증 (Auth)
- Google · Kakao OAuth (Auth.js v5, JWT 전략)
- 헤더에 프로필 이미지 및 이름 표시

### 📄 정책 페이지
- 이용약관 · 개인정보처리방침 · 운영정책

---

## 🗄 Supabase 테이블

| 테이블 | 용도 |
|--------|------|
| `news_translations` | RSS 기사 캐시 + 한국어 번역 + 승인 상태 저장 |
| `news_reactions` | 기사별 이모지 반응 (세션 기반) |

---

## ⚙️ 캐싱 전략

| 페이지/API | 전략 | 갱신 조건 |
|-----------|------|----------|
| `/news` | ISR 5분 | 관리자 기사 공개 시 즉시 무효화 |
| `/highlights` | ISR 1시간 | 자동 만료 |
| `/schedules`, `/results`, `/standings` | Jolpica API 응답 기반 | — |

---

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 환경 변수 설정 (`.env.local`)

```env
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_KAKAO_CLIENT_ID=
AUTH_KAKAO_CLIENT_SECRET=
YOUTUBE_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
ADMIN_EMAIL=
NEXT_PUBLIC_ADMIN_EMAIL=
```

---

## 📌 개발 배경 및 목적

| 목표 | 내용 |
|------|------|
| 프레임워크 전환 | 바닐라 JS → Next.js App Router로 이식하며 SSR/ISR 원리 체득 |
| 풀스택 경험 | API Route 직접 설계, Supabase DB 스키마 설계 및 운영 |
| 인증 구현 | Auth.js v5 JWT 전략으로 OAuth 플로우 직접 구현 |
| 배포 자동화 | Vercel CI/CD 연동, 환경 변수 관리 |
| 콘텐츠 운영 | RSS 집계 + 번역 승인 시스템으로 실제 서비스 운영 경험 |

---

## 🗺 개발 현황 & 로드맵

### ✅ 완료

| 페이지 | 상태 |
|--------|------|
| 홈 (`/`) | 완료 — 다음 레이스 카운트다운, 최신 뉴스/하이라이트 프리뷰, 순위 TOP3, 팬 투표 CTA |
| 경기 일정 (`/schedules`) | 완료 — 2025/2026 시즌, 라운드별 카드 UI |
| 팬 투표 (`/prediction`) | 완료 — 3종 질문 유형, 제출 잠금 |
| 하이라이트 기본 (`/highlights`) | 완료 — 3축 필터, 슬라이더/그리드 뷰, 쇼츠 감지 |

---

### 🔧 진행 중

#### 하이라이트 (`/highlights`)
- [ ] 키워드 검색 필터 추가

#### 뉴스 (`/news`)
- [ ] UI 전반 정리 및 개선
- [ ] 로딩 성능 최적화 (느린 초기 로드 개선)
- [ ] 전체적인 레이아웃/UX 재검토

#### 경기 결과 (`/results`)
- [ ] UI 전반 정리 및 개선
- [ ] 로딩 성능 최적화
- [ ] 세부 데이터 확장
  - [ ] 레이스 당일 현지 날씨 데이터 표시
  - [ ] 드라이버별 포디움 횟수 / 우승 횟수 통계 섹션
  - [ ] 라운드별 결과에 따른 챔피언십 순위 변동 섹션

---

### 💡 기획 중 (향후 추가 예정)

#### 홈 (`/`) — F1 입문 가이드 섹션
- [ ] F1 뉴비를 위한 입문 콘텐츠 탭 추가
  - 유튜버 입문 영상 큐레이션 모음
  - 또는 자체 제작 입문 가이드 탭 (룰, 타이어, 세이프티카 등)

---

## ⚠️ 법적 고지

WhatisF1은 팬이 제작한 비공식 프로젝트로, Formula 1®, FIA, 또는 어떤 F1 팀과도 공식 제휴 관계가 없습니다.  
모든 상표, 로고, 브랜드명의 권리는 각 권리자에게 있습니다.

---

<div align="center">

© 2026 WhatisF1 · [인스타그램](https://www.instagram.com/what_is_f1__) · whatisf1@gmail.com

</div>
