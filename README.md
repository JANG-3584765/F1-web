<div align="center">

<img src="https://f1-web-delta.vercel.app/images/common/logo.png" alt="WhatisF1 로고" width="180"/>

# WhatisF1

**포뮬러 1 팬을 위한 올인원 정보 플랫폼 — 실제 운영 중인 서비스**

뉴스 · 하이라이트 · 경기 일정 · 레이스 결과 · 드라이버/컨스트럭터 순위 · 팬 투표를 한 곳에서

[![배포](https://img.shields.io/badge/배포-Vercel-black?style=flat-square&logo=vercel)](https://f1-web-delta.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5_strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)

🔗 **[f1-web-delta.vercel.app](https://f1-web-delta.vercel.app)** &nbsp;|&nbsp; 📸 **[Instagram @what_is_f1__](https://www.instagram.com/what_is_f1__)**

</div>

---

## 프로젝트 개요

바닐라 JS로 제작한 F1 정보 사이트를 **Next.js / React 기반으로 전면 재구축**한 프로젝트입니다. 단순 포팅을 넘어 관리자 뉴스 승인 시스템, 실시간 번역 에디터, OAuth 인증, ISR 캐시 전략, Supabase 기반 서버 상태 관리 등 프로덕션 수준의 기능을 직접 설계하고 운영 중입니다.

- **총 라우트:** 15개 페이지 + 8개 API Route
- **외부 API 연동:** Jolpica F1, YouTube Data API v3, OpenF1, Open-Meteo 4종
- **RSS 수집:** 8개 영문 F1 매체 → 한국어 번역 승인 후 서비스
- **하이라이트:** YouTube 플레이리스트 40개 자동 수집 (공식 F1 · 한국 인플루언서 채널)
- **서킷 이미지:** 25개 수록
- **실제 서비스 운영 중** (Vercel + Instagram 계정 연동)

---

## 기술 스택

| 분류 | 기술 | 비고 |
|------|------|------|
| **Framework** | Next.js 16.2.1 (App Router) | SSG / ISR / SSR / CSR 혼용 |
| **Language** | TypeScript 5 (strict mode) | 전 파일 타입 안전성 적용 |
| **UI** | React 19.2 | Server / Client Component 분리 |
| **Styling** | Tailwind CSS v4 | CSS Variables 기반 다크모드 |
| **Server State** | TanStack Query v5.100.10 | staleTime 폴링, optimistic update |
| **Auth** | Auth.js v5 beta (next-auth) | Google · Kakao OAuth, JWT 전략 |
| **Database** | Supabase (PostgreSQL) | RLS, 서비스 롤 키 분리 |
| **Deployment** | Vercel | CI/CD 자동화, 환경변수 관리 |
| **External APIs** | Jolpica F1 · YouTube Data API v3 · OpenF1 · Open-Meteo | |
| **RSS Parser** | xml2js | 8개 매체 피드 파싱 |
| **Icons** | flag-icons | 국가 국기 CSS 클래스 |

---

## 렌더링 전략 분포

| 전략 | 페이지 | 선택 이유 |
|------|--------|-----------|
| **SSG** | `/guide`, `/regulations`, `/policy/*` | 변경 없는 정적 콘텐츠 |
| **ISR 30분** | `/` (홈) | 뉴스·하이라이트 일 수회 변경 |
| **ISR 1시간** | `/highlights`, `/schedules`, `/standings` | 레이스 후에만 갱신되는 데이터 |
| **ISR 5분** | `/news`, `/results` | 뉴스 발행 즉각성 + 레이스 중 결과 |
| **SSR** | `/login`, `/signup` | 세션 상태 캐시 불가 |
| **100% CSR** | `/prediction` | localStorage + useSession 의존 |

---

## 페이지별 구현 내역

### 홈 (`/`)
- 다음 레이스 카운트다운 (1초 단위 갱신, `setInterval` + 클린업)
- 최신 뉴스 3건 · 최신 하이라이트 3건 프리뷰
- 드라이버/컨스트럭터 순위 TOP3
- 팬 투표 CTA 배너
- ISR 30분 캐시 + `Promise.all` 4개 API 병렬 호출

### 뉴스 (`/news`, `/news/[slug]`)
- **RSS 수집 매체 8개:** Autosport · Motorsport · BBC Sport · RaceFans · The Race · Crash.net · MSWeek · GPFans
- 날짜별 탭 UI + 매체 필터 + 가로 스크롤
- **관리자 전용 인라인 번역 에디터** — 제목·본문 한국어 번역 후 단계적 공개
- **승인 시스템:** 수집 기사 기본값 `is_published = false` → 관리자 번역 후 공개
  - 미승인 기사 7일 경과 시 Supabase 자동 삭제
- **공개 즉시 반영:** `revalidatePath('/news')` 호출로 ISR 캐시 무효화 → ~5초 내 전체 노출
- 기사별 이모지 반응 저장 (`news_reactions` 테이블, 세션 기반)
- `/news/[slug]`: Base64 URL 슬러그 인코딩 · 원문 링크 별도 제공 · 미번역 기사 EN 뱃지
- TanStack Query `staleTime: 30s` 폴링으로 관리자 화면 실시간 동기화

### 하이라이트 (`/highlights`)
- **YouTube 플레이리스트 40개** 자동 수집
  - 공식 F1 채널 (F1 · F2 · F3 · eSports)
  - 쿠팡플레이 (시즌·종류 키워드 자동 감지)
  - 한국 인플루언서 채널 3개 (원투피니시 · Box to Pass · 퍼플섹터)
- `Promise.allSettled` 병렬 수집 — 채널 하나 실패해도 나머지 정상 노출
- 시즌 / 콘텐츠 종류 / 채널 **3축 독립 필터** + `useMemo` 다단계 캐싱
- 쇼츠(60초 이하) 자동 감지 · 슬라이더 / 그리드 뷰 전환
- ISR 1시간 캐시

### 경기 일정 (`/schedules`)
- Jolpica F1 API 연동 — 2025 / 2026 시즌 지원
- `searchParams` Promise 처리 (Next.js 15+ 변경 사항 대응)
- URL 상태 기반 시즌 전환 (`router.push`)
- 라운드별 카드 UI (서킷 · 국가 · 세션 일정 · 결과 페이지 링크)

### 경기 결과 (`/results`)
- 레이스 · 퀄리파잉 · 스프린트 · FP1/2/3 · 피트스탑 · 타이어 전략 **6개 세션 탭**
- 가용 세션만 탭으로 자동 표시 (스프린트 없는 라운드에서 탭 미표시)
- Suspense 지연 로딩 — 빠른 데이터 먼저 표시 후 느린 데이터 점진적 로드
- **서킷 정보 카드:** 서킷 이미지 25개, 공식 레이스 거리, 랩 수, 첫 그랑프리, 랩 레코드
  - 레이스 거리: formula1.com 공식 데이터 직접 저장 (계산식 사용 안 함)
- **날씨 정보:**
  - 과거 레이스(2023년 이후): OpenF1 서킷 센서 실측값 (기온·트랙 온도·습도·풍속·강수)
  - 미래 레이스 / 센서 없는 경우: Open-Meteo 예보 API
- **레이스 통계 배너:** 완주자 수 / DNF 수 / 피트스탑 수 / 패스티스트 랩
- **수동 입력 데이터 구조 (`manualRaceData`):** 패스티스트 피트스탑 · 드라이버 오브 더 데이 (API 미제공 항목)
- 드롭다운 시즌·라운드 선택 시 즉시 자동 이동 (`onChange` 핸들러)
- LCP 최적화: 서킷 이미지 `priority + loading="eager"` 적용
- ISR 5분 캐시

### 순위 (`/standings`)

**현 시즌 순위**
- 드라이버 / 컨스트럭터 탭 전환
- **포디움 컬럼:** 레이스 결과 API에서 P1~P3 집계, 우승/포디움 횟수 구분 표시
- **순위 변동:** 직전 라운드 standings 병렬 호출 후 비교 → ▲N(초록) / ▼N(빨강) / — 표시
- 팀 컬러 도트 · 국기 · 드라이버 코드(VER 등) 표시
- 드라이버 이름 한국어 단독 표시 (영문 병기 제거)
- 컨스트럭터 챔피언십 시작(1958년) 이전 시즌 선택 시 탭 자동 비활성화
- 스켈레톤 로딩 UI (`loading.tsx`)

**역대 시즌 검색 (1950~현재)**
- Supabase `f1_standings` 테이블 직접 조회
- **성능:** Jolpica API 직접 호출 대비 **~70초 → ~2초** 단축
- `name.ilike + original_name.ilike` OR 필터 — 한국어·영어 동시 검색
- 특수문자 `,()` 사전 제거 (PostgREST OR 필터 파싱 오류 방지)
- 1900년대(~1999) / 2000년대(2000~) `Promise.all` 병렬 조회

### 팬 투표 (`/prediction`)
- 2026 시즌 12개 질문 (단일 선택 · 복수 선택 · 순위 선택 3종)
- **오프라인 퍼스트:** localStorage 즉시 저장 → 로그인 시 Supabase 동기화
- **디바운스 서버 동기화:** 마지막 변경 후 1.5초 후 API 호출 (불필요한 호출 방지)
- Supabase `upsert` — 제출 후 수정 시 INSERT/UPDATE 자동 분기
- 제출 후 잠금 · 초기화 기능
- **팀 컬러 카드 시스템:** 드라이버/팀별 공식 컬러 왼쪽 바 + 선택 시 배경 틴트
- 단일 선택 항목 재클릭 시 선택 해제 (토글)
- 복수 선택(Q11·12) 최대 3개 제한

### 가이드 / 용어사전 (`/guide`, `/regulations`)
- SSG — 빌드 시 완성, API 호출 없음
- `src/data/` 폴더 기반 정적 데이터 (팀·드라이버·규정 정보)
- **툴팁 각주 시스템 (`Term` 컴포넌트):** 용어에 빨간 점선 밑줄 + 호버 시 설명 팝업
  - `glossary.ts` 22개 용어 정의
  - div → span 교체 (인라인 요소 내 블록 요소 중첩 Hydration 오류 수정)

### 인증 (`/login`, `/signup`)
- Google · Kakao OAuth (Auth.js v5, JWT 세션 전략)
- `session.user.id` 주입으로 Supabase 사용자 연동
- `supabaseAdmin` (서비스 롤 키, 서버 전용) / `supabaseClient` (anon 키, 브라우저) 분리
- `trustHost: true` — Vercel 프록시 환경 OAuth 콜백 오류 해결

### 전역 레이아웃 (`layout.tsx`)
- **FOUC 방지:** `<head>` 내 인라인 스크립트로 `data-theme` 선적용 후 CSS 로드
- **CSS Variables 다크모드:** `--bg`, `--text`, `--accent` 등 전역 변수, `html[data-theme="dark"]`로 오버라이드
- `Providers.tsx`: `SessionProvider` + `QueryClientProvider` 래핑
- 3열 헤더 그리드 (로고 · 네비게이션 · 유저 영역)
- 인앱 브라우저 감지 알림 (`InAppBrowserNotice`)

---

## 주요 성능 개선 이력 (수치 포함)

| 항목 | 개선 전 | 개선 후 | 방법 |
|------|--------|--------|------|
| 역대 순위 검색 응답 시간 | ~70초 | ~2초 | Jolpica API 순차 호출 → Supabase 테이블 직접 조회 |
| 역대 순위 검색 API 호출 수 | ~150회 (77시즌 × 2) | 1회 | Supabase 사전 시딩 (`npm run seed:standings`) |
| 하이라이트 채널 장애 대응 | 전체 실패 | 실패 채널만 제외 | `Promise.all` → `Promise.allSettled` |
| 결과 페이지 초기 로드 | 전체 대기 | 빠른 데이터 선표시 | Suspense 분리 + 느린 API 지연 처리 |
| 서킷 이미지 LCP | 지연 로드 | 즉시 로드 | `priority + loading="eager"` 적용 |
| 레이스 거리 정확도 | 계산값 (최대 1.5km 오차) | 공식값 | formula1.com 공식 데이터 직접 저장 |

---

## 해결한 주요 버그

| 커밋 | 버그 | 원인 | 해결 |
|------|------|------|------|
| `0c34b13` | 순위·결과·하이라이트 3개 페이지 500 에러 | `TEAM_COLORS` 순환 의존성 (`A→B→A`) | `teamColors.ts`로 분리 |
| `7e9e589` | 관리자 공개 후 일반 사용자에게 기사 미노출 | `rowMap` 생성 후 INSERT → Map에 신규 항목 없음 | `?? false` → `?? true` |
| `7e9e589` | Vercel 배포 후 OAuth 콜백이 localhost로 이동 | Vercel 프록시 Host 헤더 불신 | `trustHost: true` 추가 |
| `6a2d3c0` | 아우디 팀 컬러 형광초록으로 표시 | `TEAM_COLORS` 소스 불일치 | `f1-2026.ts` 단일 소스 통일 |
| `32f99f6` | 검색어 `,()` 포함 시 Supabase OR 필터 오류 | PostgREST 특수문자 파싱 | 사전 sanitize `replace(/[,()]/g, '')` |
| `37edf88` | 가이드 페이지 `Hydration failed` | `<p>` 안에 `<div>` (블록 중첩) | `Term` 컴포넌트 `div → span` |

---

## Supabase 스키마

| 테이블 | 용도 |
|--------|------|
| `news_translations` | RSS 기사 캐시 + 한국어 번역 + 승인 상태 |
| `news_reactions` | 기사별 이모지 반응 (세션 기반) |
| `season_predictions` | 팬 투표 답변 (user_id + season 복합 키) |
| `f1_standings` | 1950~현재 전 시즌 드라이버/컨스트럭터 순위 캐시 |

```sql
-- f1_standings: 역대 순위 검색 고속화
CREATE TABLE f1_standings (
  id            BIGSERIAL PRIMARY KEY,
  type          TEXT    NOT NULL CHECK (type IN ('driver', 'constructor')),
  entity_id     TEXT    NOT NULL,
  name          TEXT,               -- 한국어 이름
  original_name TEXT,               -- 영어 원문
  year          INT     NOT NULL,
  position      INT,
  points        NUMERIC NOT NULL DEFAULT 0,
  wins          INT     NOT NULL DEFAULT 0,
  team          TEXT,
  team_color    TEXT    NOT NULL DEFAULT '#888888'
);

CREATE UNIQUE INDEX f1_standings_unique ON f1_standings (type, entity_id, year);
CREATE        INDEX f1_standings_name   ON f1_standings (name);
CREATE        INDEX f1_standings_orig   ON f1_standings (original_name);
```

---

## API Route 목록

| 엔드포인트 | 메서드 | 용도 |
|-----------|--------|------|
| `/api/auth/[...nextauth]` | GET · POST | Auth.js OAuth 콜백 처리 |
| `/api/news/publish` | PATCH | 기사 공개 + `revalidatePath` |
| `/api/news/translate` | POST · PATCH | 한국어 번역 저장 |
| `/api/news/react` | POST | 이모지 반응 추가 |
| `/api/news/reactions` | GET | 기사별 반응 조회 |
| `/api/standings/search` | GET | 드라이버/팀 역대 순위 검색 |
| `/api/prediction` | GET · POST | 팬 투표 조회 · 저장 |
| `/api/feedback` | POST | 피드백 저장 |

---

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build

# 역대 순위 데이터 Supabase 초기화 (최초 1회 또는 시즌 종료 후)
npm run seed:standings
```

### 환경 변수 (`.env.local`)

```env
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_KAKAO_CLIENT_ID=
AUTH_KAKAO_CLIENT_SECRET=
YOUTUBE_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
NEXT_PUBLIC_ADMIN_EMAIL=
```

---

## 앞으로 할 것 (Roadmap)

### 코드 품질 · 구조 개선
- [ ] 새 레포에서 페이지 단위 재구축 (이해 → 직접 작성 → 개선 순서로 이식)
- [ ] 공통 컴포넌트 추출 및 재사용성 개선
- [ ] API 응답 타입 정의 통일 (`src/types/`)
- [ ] 에러 바운더리 및 폴백 UI 보강

### 기능 개선
- [ ] **하이라이트:** 키워드 검색 필터 추가
- [ ] **뉴스:** UI/UX 전반 재설계, 초기 로드 성능 개선
- [ ] **결과 페이지:**
  - [ ] 라운드별 챔피언십 순위 변동 섹션
  - [ ] 드라이버별 포디움/우승 통계 섹션
  - [ ] 폴 포지션 · 패스티스트 피트스탑 API 연동 (현재 수동 입력)
- [ ] **홈:** F1 입문자용 용어 · 팀 · 드라이버 탭 섹션 추가

### 인프라
- [ ] 레포 private 전환 후 클린 이력으로 신규 레포 운영
- [ ] Supabase Edge Function으로 RSS 수집 자동화 (현재 수동 트리거)

---

## 법적 고지

WhatisF1은 팬이 제작한 비공식 프로젝트로, Formula 1®, FIA, 또는 어떤 F1 팀과도 공식 제휴 관계가 없습니다. 모든 상표, 로고, 브랜드명의 권리는 각 권리자에게 있습니다.

---

<div align="center">

© 2026 WhatisF1 &nbsp;·&nbsp; [Instagram](https://www.instagram.com/what_is_f1__) &nbsp;·&nbsp; whatisf1@gmail.com

</div>
