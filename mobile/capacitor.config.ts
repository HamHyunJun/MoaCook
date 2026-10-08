import type { CapacitorConfig } from '@capacitor/cli'

/**
 * 앱이 열 웹 주소 (Vercel에 배포한 MoaCook 주소)
 * 배포 주소가 정해지면 바꾸고 `pnpm sync`를 실행한다.
 */
const APP_URL = 'https://moa-cook.vercel.app'

const config: CapacitorConfig = {
  appId: 'com.moacook.app',
  appName: 'MoaCook',
  // 인터넷에 연결되지 않았을 때 보여 줄 안내 화면
  webDir: 'www',
  server: {
    url: APP_URL,
    cleartext: false,
  },
  android: {
    // 웹뷰 안에서 http 콘텐츠를 섞어 쓰지 않는다
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'never',
  },
  plugins: {
    SystemBars: {
      // 상태 표시줄·하단 네비게이션바 아이콘을 흰 화면에 맞춰 어둡게 표시한다 (다크 모드에서도 동일)
      style: 'LIGHT',
      // 웹 화면이 viewport-fit=cover를 쓰므로 처음부터 맞춰 화면이 튀지 않게 한다
      initialViewportFitValueHint: 'cover',
    },
  },
}

export default config
