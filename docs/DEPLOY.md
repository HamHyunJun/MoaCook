# MoaCook 배포 안내

웹은 **Vercel**, 데이터와 사진은 **Supabase**에 두고, 안드로이드·아이폰 앱은 배포된 웹을 **웹뷰(Capacitor)**로 띄웁니다.

```text
[브라우저 / 앱 웹뷰] → [Vercel: Nuxt 서버] → [Supabase: recipes 테이블, recipe-images 버킷]
```

- Supabase 키는 Vercel 서버에만 두고 브라우저나 앱으로 보내지 않습니다.
- 레시피 등록·수정·삭제는 관리자 비밀번호로 로그인한 사람만 할 수 있습니다. 다른 사람들은 보기만 합니다.

## 1. Supabase 준비

1. [supabase.com](https://supabase.com)에서 새 프로젝트를 만듭니다. (Region은 `Northeast Asia (Seoul)` 권장)
2. 왼쪽 메뉴 **SQL Editor**에서 [`supabase/schema.sql`](../supabase/schema.sql) 내용을 붙여 넣고 **Run**을 누릅니다.
   - `recipes`, `app_settings` 테이블과 공개 이미지 버킷 `recipe-images`가 만들어집니다.
3. **Project Settings > API Keys**(또는 **API**)에서 아래 두 값을 복사해 둡니다.
   - Project URL (예: `https://abcd1234.supabase.co`)
   - secret 키(`sb_secret_...`) 또는 예전 방식의 `service_role` 키
   - `anon`/`publishable` 키가 아닙니다. secret 키는 절대 공개 저장소나 앱에 넣지 않습니다.

초기 레시피 24개는 사이트에 처음 접속할 때 서버가 자동으로 채워 넣습니다.

## 2. Vercel 배포

1. [vercel.com](https://vercel.com)에서 **Add New > Project**를 누르고 GitHub의 `MoaCook` 저장소를 가져옵니다.
2. Framework Preset은 **Nuxt.js**로 자동 선택됩니다. 빌드 설정은 바꾸지 않아도 됩니다.
3. **Environment Variables**에 아래 값을 넣습니다.

   | 이름 | 값 |
   |------|----|
   | `NUXT_SUPABASE_URL` | 1-3에서 복사한 Project URL |
   | `NUXT_SUPABASE_SERVICE_ROLE_KEY` | 1-3에서 복사한 secret(service_role) 키 |
   | `NUXT_ADMIN_PASSWORD` | 관리자 로그인 비밀번호 (직접 정함) |
   | `NUXT_SESSION_SECRET` | 32자 이상 임의 문자열 (터미널에서 `openssl rand -hex 32`) |
   | `NUXT_YOUTUBE_API_KEY` | (선택) YouTube Data API v3 키 |

4. **Deploy**를 누릅니다. 끝나면 `https://<프로젝트>.vercel.app` 주소가 생깁니다.
5. 이후 `main` 브랜치에 머지할 때마다 자동으로 다시 배포됩니다. 환경변수를 바꾼 뒤에는 **Redeploy**가 필요합니다.

### 배포 확인

- 주소에 접속하면 레시피 24개가 보여야 합니다. (Supabase **Table Editor > recipes**에도 24행이 생김)
- 맨 아래 **관리자**를 눌러 비밀번호로 로그인하면 홈에 `+ 레시피 등록`, 상세 화면에 `수정하기`가 나타납니다.
- 사진을 업로드하면 Supabase **Storage > recipe-images**에 파일이 생깁니다. (최대 4MB)

## 3. 안드로이드 · 아이폰 앱 (웹뷰)

앱은 `mobile/` 폴더의 Capacitor 프로젝트입니다. 앱 안에서 배포된 웹 주소를 그대로 열기 때문에, 웹을 고치면 앱을 다시 내지 않아도 바로 반영됩니다.

### 준비물

- Node.js 22 이상, pnpm
- 안드로이드: [Android Studio](https://developer.android.com/studio)
- 아이폰: macOS + Xcode 16 이상 (Apple Developer 계정은 실기기 설치·스토어 배포 때 필요)

### 앱이 열 주소 설정

[`mobile/capacitor.config.ts`](../mobile/capacitor.config.ts)의 `APP_URL`을 2단계에서 받은 Vercel 주소로 바꿉니다.

```ts
const APP_URL = 'https://<프로젝트>.vercel.app'
```

### 실행

```bash
cd mobile
pnpm install
pnpm sync      # 설정을 android/ios 프로젝트에 반영 (APP_URL을 바꿀 때마다 실행)
pnpm android   # Android Studio가 열리면 ▶ Run
pnpm ios       # Xcode가 열리면 Signing에서 Team 선택 후 ▶ Run
```

### 스토어 배포

- 안드로이드: Android Studio **Build > Generate Signed App Bundle**로 `.aab`를 만들어 Google Play Console에 올립니다.
- 아이폰: Xcode **Product > Archive** 후 App Store Connect로 업로드합니다.
- 앱 ID는 `com.moacook.app`입니다. 바꾸려면 `capacitor.config.ts`의 `appId`와 각 플랫폼 설정을 함께 바꿉니다.
- 지금 앱 아이콘과 스플래시는 Capacitor 기본 이미지입니다. 스토어에 내기 전에 교체해야 합니다.

## 로컬 개발

환경변수를 비워 두면 Supabase 대신 서버의 `.data/` 폴더에 저장합니다. 관리 기능을 써 보려면 `.env`에 `NUXT_ADMIN_PASSWORD`와 `NUXT_SESSION_SECRET`만 넣으면 됩니다. (`.env.example` 참고)
