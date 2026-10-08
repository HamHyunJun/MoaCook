# MoaCook

사용자가 직접 요리할 수 있도록 다양한 요리의 레시피를 제공하는 요리 레시피 서비스입니다.

## 기술 스택

- Nuxt 4 / Vue 3
- TypeScript
- SCSS
- pnpm

## 프로젝트 구조

```text
app/
├── app.vue              # 루트 컴포넌트
├── layouts/default.vue  # 공통 레이아웃 (헤더)
├── pages/               # 파일 기반 라우팅 (홈 = 레시피 목록, recipes/[id] = 상세, admin = 관리)
├── components/
│   ├── layout/          # 헤더 등 레이아웃 컴포넌트
│   ├── recipe/          # 레시피 카드, 등록 폼, 참고 영상
│   └── common/          # 확인 창 등 공통 컴포넌트
└── assets/
    ├── images/          # 로고 이미지
    └── scss/            # 공통 SCSS 변수 (_variables.scss)
public/                  # 정적 파일 (favicon 등)
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

## 데이터 저장

- 레시피와 업로드 이미지는 서버의 `.data/` 폴더에 파일로 저장됩니다. (`.data/recipes`, `.data/uploads`, git 제외)
- 저장소가 처음 사용될 때 초기 레시피 24종(`server/data/recipes.ts`)이 자동으로 등록됩니다. 처음 상태로 되돌리려면 서버를 멈추고 `.data/` 폴더를 지웁니다.
- 초기 레시피를 추가할 때는 `SEED_VERSION`을 올리고 새 레시피의 `since`에 같은 값을 적습니다. 이미 사용 중인 저장소에는 새 레시피만 추가되고, 사용자가 수정하거나 삭제한 레시피는 그대로 유지됩니다.
- 초기 레시피 사진은 [Unsplash](https://unsplash.com/license) 무료 이미지를 원본 주소로 불러옵니다(인터넷 연결 필요).

## API

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/recipes?q=떡&category=한식&difficulty=1&maxTime=30` | 레시피 목록 (검색어·카테고리·난이도·최대 조리시간 모두 선택) |
| GET | `/api/recipes/:id` | 레시피 상세 |
| POST | `/api/recipes` | 레시피 등록 |
| PUT | `/api/recipes/:id` | 레시피 수정 |
| DELETE | `/api/recipes/:id` | 레시피 삭제 |
| POST | `/api/uploads` | 이미지 업로드 (multipart, 필드 `image`) |
| GET | `/api/youtube/search?q=김치찌개` | 유튜브 참고 영상 검색 (6시간 캐시) |
