// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // 함수는 function 선언 대신 const 화살표 함수로 작성한다
    'func-style': ['error', 'expression'],
  },
})
