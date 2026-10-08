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
