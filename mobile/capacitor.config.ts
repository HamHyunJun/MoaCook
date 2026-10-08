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
}

export default config
