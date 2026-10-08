# MoaCook

사용자가 직접 요리할 수 있도록 다양한 요리의 레시피를 제공하는 요리 레시피 서비스입니다.

## 기술 스택

- Nuxt 4 / Vue 3
- TypeScript
- SCSS
- pnpm
- Supabase (Postgres, Storage), Vercel 배포
- Capacitor (안드로이드·아이폰 웹뷰 앱)

배포와 앱 빌드 방법은 [docs/DEPLOY.md](docs/DEPLOY.md)를 참고합니다.

## 프로젝트 구조

```text
app/
├── app.vue              # 루트 컴포넌트
├── layouts/default.vue  # 공통 레이아웃 (헤더, 푸터)
├── pages/               # 파일 기반 라우팅 (홈 = 레시피 목록, recipes/[id] = 상세, admin = 관리)
├── components/
│   ├── layout/          # 헤더 등 레이아웃 컴포넌트
│   ├── recipe/          # 레시피 카드, 등록 폼, 참고 영상
│   └── common/          # 확인 창 등 공통 컴포넌트
└── assets/
    ├── images/          # 로고 이미지
    └── scss/            # 공통 SCSS 변수 (_variables.scss)
public/                  # 정적 파일 (favicon, 글꼴)
server/                  # API, 저장소(Supabase 또는 로컬 파일), 초기 레시피 데이터
supabase/schema.sql      # Supabase 테이블·버킷 생성 SQL
mobile/                  # Capacitor 앱 (android/, ios/)
docs/DEPLOY.md           # 배포 안내
```

## 실행 방법

```bash
pnpm install   # 의존성 설치
pnpm dev       # 개발 서버 (http://localhost:3000)
pnpm build     # 프로덕션 빌드
pnpm preview   # 빌드 결과 미리보기
pnpm lint      # ESLint 검사
pnpm typecheck # 타입 검사
```

## 환경변수

`.env.example`을 복사해 `.env`를 만들고 값을 채웁니다.

| 이름 | 설명 |
|---|---|
| `NUXT_YOUTUBE_API_KEY` | YouTube Data API v3 키. 서버에서만 사용되며, 없으면 상세 페이지에 유튜브 검색 링크만 표시됩니다. |
| `NUXT_ADMIN_PASSWORD` | 관리자 로그인 비밀번호. 없으면 레시피 등록·수정·삭제를 할 수 없습니다. |
| `NUXT_SESSION_SECRET` | 로그인 쿠키 암호화 키 (32자 이상) |
| `NUXT_SUPABASE_URL` | Supabase Project URL. 비워 두면 로컬 `.data/` 폴더에 저장합니다. |
| `NUXT_SUPABASE_SERVICE_ROLE_KEY` | Supabase secret(service_role) 키. 서버에서만 사용합니다. |
| `NUXT_SUPABASE_BUCKET` | 사진 버킷 이름 (기본 `recipe-images`) |

## 관리자

- 화면 맨 아래 **관리자** 링크(`/admin/login`)에서 `NUXT_ADMIN_PASSWORD`로 로그인합니다.
- 로그인하면 홈에 `+ 레시피 등록`, 상세 화면에 `수정하기`, 맨 아래에 `레시피 관리`(목록에서 수정·삭제)가 나타납니다.
- 등록·수정·삭제·이미지 업로드 API는 로그인하지 않으면 401을 돌려줍니다.

## 데이터 저장

- Supabase 환경변수가 있으면 레시피는 `recipes` 테이블에, 업로드 이미지는 `recipe-images` 버킷에 저장됩니다.
- 없으면 서버의 `.data/` 폴더에 파일로 저장됩니다. (`.data/recipes`, `.data/uploads`, git 제외)
- 저장소가 처음 사용될 때 초기 레시피 24종(`server/data/recipes.ts`)이 자동으로 등록됩니다. 처음 상태로 되돌리려면 서버를 멈추고 `.data/` 폴더를 지웁니다.
- 초기 레시피를 추가할 때는 `SEED_VERSION`을 올리고 새 레시피의 `since`에 같은 값을 적습니다. 이미 사용 중인 저장소에는 새 레시피만 추가되고, 사용자가 수정하거나 삭제한 레시피는 그대로 유지됩니다.
- 초기 레시피 사진은 [Unsplash](https://unsplash.com/license) 무료 이미지를 원본 주소로 불러옵니다(인터넷 연결 필요).

## API

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/recipes?q=떡&category=한식&difficulty=1&maxTime=30` | 레시피 목록 (검색어·카테고리·난이도·최대 조리시간 모두 선택) |
| GET | `/api/recipes/:id` | 레시피 상세 |
| POST | `/api/recipes` | 레시피 등록 (관리자) |
| PUT | `/api/recipes/:id` | 레시피 수정 (관리자) |
| DELETE | `/api/recipes/:id` | 레시피 삭제 (관리자) |
| POST | `/api/uploads` | 이미지 업로드 (관리자, multipart, 필드 `image`, 4MB 이하) |
| GET | `/api/auth/me` | 관리자 로그인 여부 |
| POST | `/api/auth/login` | 관리자 로그인 (`{ password }`) |
| POST | `/api/auth/logout` | 관리자 로그아웃 |
| GET | `/api/youtube/search?q=김치찌개` | 유튜브 참고 영상 검색 (6시간 캐시) |
