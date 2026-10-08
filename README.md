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
├── pages/               # 파일 기반 라우팅
├── components/
│   ├── layout/          # 헤더 등 레이아웃 컴포넌트
│   └── home/            # 메인 화면 섹션 컴포넌트
└── assets/images/       # 이미지 에셋
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

## 데이터 저장

- 레시피와 업로드 이미지는 서버의 `.data/` 폴더에 파일로 저장됩니다. (`.data/recipes`, `.data/uploads`, git 제외)
- 저장소가 처음 사용될 때 초기 레시피 4종이 자동으로 등록됩니다. 처음 상태로 되돌리려면 서버를 멈추고 `.data/` 폴더를 지웁니다.

## API

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/recipes?category=한식` | 레시피 목록 (category 선택) |
| GET | `/api/recipes/:id` | 레시피 상세 |
| POST | `/api/recipes` | 레시피 등록 |
| PUT | `/api/recipes/:id` | 레시피 수정 |
| DELETE | `/api/recipes/:id` | 레시피 삭제 |
| POST | `/api/uploads` | 이미지 업로드 (multipart, 필드 `image`) |
