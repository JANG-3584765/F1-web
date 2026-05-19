# WhatisF1

Formula 1 데이터 플랫폼 — 뉴스, 일정, 결과, 순위, 하이라이트를 한 곳에서 확인하는 F1 팬 전용 웹앱.

> 바닐라 JS 원본 프로젝트를 Next.js / React로 이식하며 CS 기초 + 실전 배포 경험 축적 목적으로 개발.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| Auth | Auth.js v5 — Google · Kakao OAuth |
| Database | Supabase (PostgreSQL) |
| State | TanStack Query v5 |
| External APIs | Jolpica F1 API, YouTube Data API v3 |

---

## Features

### News (`/news`)
- 6개 RSS 피드 집계 (Autosport · Motorsport · BBC Sport · RaceFans · The Race · Crash.net)
- 날짜별 탭 (최근 7일), 매체 필터, 가로 스크롤 UI
- 기사별 이모지 반응 (Supabase 저장, 세션 기반 — 로그인 불필요)
- 내부 상세 페이지 `/news/[slug]` — 원문 링크 별도 제공
- 관리자 전용 한국어 번역 인라인 에디터 (미번역 기사에 EN 뱃지 표시)

### Race Schedule (`/schedules`)
- Jolpica F1 API — 2025 / 2026 시즌 지원
- 라운드별 카드 UI, 서킷 · 국가 · 날짜 표시, 결과 페이지 직접 연결

### Race Results (`/results`)
- 레이스 · 퀄리파잉 · 스프린트 · FP1/2/3 · 피트스탑 · 타이어 전략 데이터
- 가용 세션만 탭으로 자동 표시, 서킷 이미지 25개 수록

### Championship Standings (`/standings`)
- 드라이버 / 컨스트럭터 현 시즌 + 역대 시즌 드릴다운
- 이름 검색 API (`/api/standings/search`)

### Highlights (`/highlights`)
- YouTube Data API v3, 플레이리스트 13개 자동 수집, ISR 1시간 캐시
- 시즌 / 콘텐츠 종류 / 채널 3축 독립 필터
- 쇼츠 자동 감지, 슬라이더 / 그리드 뷰 전환

### Fan Prediction (`/prediction`)
- localStorage 기반 — 단일 · 복수 · 순위 선택(1·2·3위) 3종 질문 유형
- 제출 후 잠금, 초기화 버튼 포함

### Auth
- Google · Kakao OAuth (Auth.js v5, JWT 전략)
- 헤더에 프로필 이미지 및 이름 표시

---

## Getting Started

```bash
npm install
npm run dev
```

`.env.local`에 아래 환경 변수를 설정하세요:

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

## Supabase Tables

| Table | Purpose |
|---|---|
| `news_translations` | RSS 기사 캐시 + 한국어 번역 저장 |
| `news_reactions` | 기사별 이모지 반응 (세션 기반) |

---

## Project Structure

```
src/
├── app/
│   ├── (main)/          # 공개 페이지
│   │   ├── news/        # 뉴스 목록 + 상세
│   │   ├── schedules/   # 경기 일정
│   │   ├── results/     # 경기 결과
│   │   ├── standings/   # 순위
│   │   ├── highlights/  # 하이라이트 영상
│   │   └── prediction/  # 팬 투표
│   └── api/             # 서버 API 라우트
├── components/          # Header · Footer · Providers
└── lib/                 # API 클라이언트 · DB · 유틸
```

---

## Legal

WhatisF1 is a fan-made project and is not affiliated with or endorsed by Formula 1, FIA, or any F1 team.  
All trademarks, logos, and brand names are the property of their respective owners.
