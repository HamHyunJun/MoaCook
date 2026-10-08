<template>
  <form class="recipe-form" novalidate @submit.prevent="onSubmit">
    <section class="section">
      <h2 class="section-title">기본 정보</h2>

      <label class="field">
        <span class="label">요리 이름 <em>*</em></span>
        <input v-model="form.name" type="text" maxlength="100" placeholder="예: 김치찌개" required>
      </label>

      <div class="field">
        <span class="label">대표 이미지 <em>*</em></span>
        <div class="image-field">
          <div class="image-preview">
            <img v-if="form.image" :src="form.image" alt="대표 이미지 미리보기">
            <span v-else>이미지 없음</span>
          </div>
          <div class="image-controls">
            <label class="button button-outline file-button">
              {{ uploading ? '업로드 중…' : '이미지 업로드' }}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                :disabled="uploading"
                @change="onImageSelected"
              >
            </label>
            <input v-model="form.image" type="text" placeholder="또는 이미지 주소 입력">
            <p class="hint">JPG, PNG, WEBP, GIF / 4MB 이하</p>
          </div>
        </div>
      </div>

      <label class="field">
        <span class="label">설명 <em>*</em></span>
        <textarea v-model="form.description" rows="3" maxlength="2000" placeholder="예: 돼지고기와 김치를 이용한 간단한 찌개" required />
      </label>

      <div class="field-row">
        <label class="field">
          <span class="label">카테고리</span>
          <select v-model="form.category">
            <option v-for="category in RECIPE_CATEGORIES" :key="category" :value="category">{{ category }}</option>
          </select>
        </label>
        <label class="field">
          <span class="label">난이도</span>
          <select v-model.number="form.difficulty">
            <option v-for="level in DIFFICULTIES" :key="level" :value="level">{{ formatDifficulty(level) }}</option>
          </select>
        </label>
        <label class="field">
          <span class="label">조리 시간(분)</span>
          <input v-model.number="form.cookingTime" type="number" min="1" max="1440" inputmode="numeric" required>
        </label>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">재료</h2>
      <ul class="rows">
        <li v-for="(ingredient, index) in form.ingredients" :key="ingredient.key" class="row">
          <input v-model="ingredient.name" type="text" maxlength="100" :aria-label="`${index + 1}번째 재료 이름`" placeholder="재료 (예: 돼지고기)" required>
          <input v-model="ingredient.amount" type="text" maxlength="100" :aria-label="`${index + 1}번째 재료 분량`" placeholder="분량 (예: 300g)" class="amount">
          <button
            type="button"
            class="icon-button"
            :disabled="form.ingredients.length === 1"
            :aria-label="`${index + 1}번째 재료 삭제`"
            @click="removeRow(form.ingredients, index)"
          >
            ✕
          </button>
        </li>
      </ul>
      <button type="button" class="button button-outline add-button" @click="addIngredient">+ 재료 추가</button>
    </section>

    <section class="section">
      <h2 class="section-title">조리 과정</h2>
      <ol class="rows">
        <li v-for="(step, index) in form.steps" :key="step.key" class="row step-row">
          <span class="step-number">{{ index + 1 }}</span>
          <textarea v-model="step.description" rows="3" maxlength="2000" :aria-label="`${index + 1}번째 조리 과정`" placeholder="조리 과정을 입력해 주세요." required />
          <div class="step-actions">
            <button type="button" class="icon-button" :disabled="index === 0" :aria-label="`${index + 1}번째 과정 위로`" @click="moveRow(form.steps, index, -1)">↑</button>
            <button type="button" class="icon-button" :disabled="index === form.steps.length - 1" :aria-label="`${index + 1}번째 과정 아래로`" @click="moveRow(form.steps, index, 1)">↓</button>
            <button type="button" class="icon-button" :disabled="form.steps.length === 1" :aria-label="`${index + 1}번째 과정 삭제`" @click="removeRow(form.steps, index)">✕</button>
          </div>
        </li>
      </ol>
      <button type="button" class="button button-outline add-button" @click="addStep">+ 과정 추가</button>
    </section>

    <section class="section">
      <h2 class="section-title">참고 영상</h2>
      <label class="field">
        <span class="label">유튜브 검색 키워드</span>
        <input v-model="form.youtubeQuery" type="text" maxlength="100" placeholder="비워 두면 요리 이름으로 검색">
      </label>
    </section>

    <ul v-if="errorMessages.length" class="errors" role="alert">
      <li v-for="message in errorMessages" :key="message">{{ message }}</li>
    </ul>

    <div class="actions">
      <NuxtLink :to="cancelTo" class="button button-outline">취소</NuxtLink>
      <button type="submit" class="button button-primary" :disabled="submitting || uploading">
        {{ submitting ? '저장 중…' : submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface IngredientRow {
  key: string
  id?: string
  name: string
  amount: string
}

interface StepRow {
  key: string
  id?: string
  description: string
  image?: string
}

interface RecipeFormState {
  name: string
  image: string
  description: string
  category: RecipeCategory
  difficulty: RecipeDifficulty
  cookingTime: number
  ingredients: IngredientRow[]
  steps: StepRow[]
  youtubeQuery: string
}

const props = withDefaults(defineProps<{
  /** 수정할 레시피 (없으면 새 레시피 등록) */
  recipe?: Recipe
  submitLabel?: string
  submitting?: boolean
  /** 서버에서 받은 오류 메시지 */
  serverErrors?: string[]
  cancelTo?: string
}>(), {
  recipe: undefined,
  submitLabel: '저장',
  submitting: false,
  serverErrors: () => [],
  cancelTo: '/admin/recipes',
})

const emit = defineEmits<{
  submit: [input: RecipeInput]
}>()

const DIFFICULTIES: RecipeDifficulty[] = [1, 2, 3]

const { uploadImage } = useRecipes()

let rowSeq = 0
const nextKey = (): string => {
  rowSeq += 1
  return `row-${rowSeq}`
}

const emptyIngredient = (): IngredientRow => {
  return { key: nextKey(), name: '', amount: '' }
}

const emptyStep = (): StepRow => {
  return { key: nextKey(), description: '' }
}

const toFormState = (recipe?: Recipe): RecipeFormState => {
  if (!recipe) {
    return {
      name: '',
      image: '',
      description: '',
      category: RECIPE_CATEGORIES[0],
      difficulty: 1,
      cookingTime: 30,
      ingredients: [emptyIngredient()],
      steps: [emptyStep()],
      youtubeQuery: '',
    }
  }

  return {
    name: recipe.name,
    image: recipe.image,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    cookingTime: recipe.cookingTime,
    ingredients: recipe.ingredients.map(({ id, name, amount }) => ({ key: nextKey(), id, name, amount })),
    steps: [...recipe.steps]
      .sort((a, b) => a.order - b.order)
      .map(({ id, description, image }) => ({ key: nextKey(), id, description, image })),
    youtubeQuery: recipe.youtubeQuery ?? '',
  }
}

const form = reactive<RecipeFormState>(toFormState(props.recipe))
const clientErrors = ref<string[]>([])
const uploading = ref(false)

const errorMessages = computed<string[]>(() => [...clientErrors.value, ...props.serverErrors])

const addIngredient = (): void => {
  form.ingredients.push(emptyIngredient())
}

const addStep = (): void => {
  form.steps.push(emptyStep())
}

const removeRow = <T,>(rows: T[], index: number): void => {
  rows.splice(index, 1)
}

const moveRow = <T,>(rows: T[], index: number, offset: -1 | 1): void => {
  const target = index + offset
  const row = rows[index]
  const other = rows[target]
  if (row === undefined || other === undefined) return

  rows[index] = other
  rows[target] = row
}

const onImageSelected = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  clientErrors.value = []
  try {
    const { url } = await uploadImage(file)
    form.image = url
  }
  catch (error: unknown) {
    clientErrors.value = [getErrorMessage(error, '이미지를 업로드하지 못했습니다.')]
  }
  finally {
    uploading.value = false
    input.value = ''
  }
}

const validate = (): string[] => {
  const errors: string[] = []
  if (!form.name.trim()) errors.push('요리 이름을 입력해 주세요.')
  if (!form.image.trim()) errors.push('대표 이미지를 등록해 주세요.')
  if (!form.description.trim()) errors.push('설명을 입력해 주세요.')
  if (!Number.isInteger(form.cookingTime) || form.cookingTime < 1) errors.push('조리 시간을 1분 이상으로 입력해 주세요.')
  if (form.ingredients.some(ingredient => !ingredient.name.trim())) errors.push('재료 이름을 모두 입력해 주세요.')
  if (form.steps.some(step => !step.description.trim())) errors.push('조리 과정을 모두 입력해 주세요.')
  return errors
}

const onSubmit = (): void => {
  clientErrors.value = validate()
  if (clientErrors.value.length > 0) return

  const youtubeQuery = form.youtubeQuery.trim()
  emit('submit', {
    name: form.name.trim(),
    image: form.image.trim(),
    description: form.description.trim(),
    category: form.category,
    difficulty: form.difficulty,
    cookingTime: form.cookingTime,
    ingredients: form.ingredients.map(({ id, name, amount }) => ({ id, name: name.trim(), amount: amount.trim() })),
    steps: form.steps.map(({ id, description, image }) => ({ id, description: description.trim(), image })),
    ...(youtubeQuery ? { youtubeQuery } : {}),
  })
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 입력 묶음마다 테두리 상자로 나눠 한눈에 구역이 보이게 한다
.section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border: $border-width solid $line-color;
  border-radius: $radius-lg;
  background-color: $surface-color;
}

.section-title {
  margin: 0;
  font-size: 1.1875rem;
  font-weight: 800;
}

.field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.label {
  font-size: $font-size-small;
  font-weight: 700;

  em {
    color: $point-color;
    font-style: normal;
  }
}

input[type='text'],
input[type='number'],
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  min-height: 48px;
  padding: 11px 14px;
  border: $border-width solid $line-color;
  border-radius: $radius-md;
  background-color: $surface-color;
  color: $text-color;
  font: inherit;
  font-size: 1rem;
  font-weight: 500;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: $muted-text-color;
  }

  &:hover {
    border-color: $line-strong-color;
  }

  &:focus {
    border-color: $text-color;
    outline: none;
  }
}

// 기본 화살표 대신 다른 화면과 같은 꺾쇠를 쓴다
select {
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2316181D' stroke-width='2.25' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 14px center;
  background-repeat: no-repeat;
  background-size: 16px;
  appearance: none;
  cursor: pointer;
}

textarea {
  line-height: 1.6;
  resize: vertical;
}

.image-field {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.image-preview {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 180px;
  border-radius: $radius-md;
  background-color: $fill-color;
  aspect-ratio: 4 / 3;
  color: $sub-text-color;
  font-size: $font-size-caption;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.image-controls {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.file-button {
  position: relative;
  align-self: flex-start;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
}

.hint {
  margin: 0;
  color: $sub-text-color;
  font-size: $font-size-caption;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  .amount {
    flex: 0 0 34%;
  }
}

.step-number {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  margin-top: 9px;
  border-radius: 50%;
  background-color: $point-color;
  color: #fff;
  font-size: $font-size-caption;
  font-weight: 800;
}

.step-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 22px;
  border: $border-width solid transparent;
  border-radius: $radius-md;
  font: inherit;
  font-size: $font-size-small;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.button-primary {
  background-color: $point-color;
  color: #fff;

  &:hover:not(:disabled) {
    background-color: $point-strong-color;
  }
}

.button-outline {
  border-color: $line-color;
  background-color: $surface-color;
  color: $text-color;

  &:hover:not(:disabled) {
    border-color: $text-color;
  }
}

.add-button {
  align-self: flex-start;
  height: 42px;
  padding: 0 16px;
  border-style: dashed;
  border-color: $line-strong-color;
}

.icon-button {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-top: 4px;
  border: $border-width solid $line-color;
  border-radius: 10px;
  background-color: $surface-color;
  color: $sub-text-color;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: $text-color;
    color: $text-color;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

.step-actions .icon-button {
  width: 36px;
  height: 32px;
  margin-top: 0;
}

.errors {
  margin: 0;
  padding: 14px 18px 14px 36px;
  border-radius: $radius-md;
  background-color: #FEF1F0;
  color: $error-color;
  font-size: $font-size-small;
  font-weight: 500;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (min-width: $tablet-max-width) {
  .field-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: $mobile-max-width) {
  .section {
    padding: 20px 16px;
  }

  .image-preview {
    width: 100%;
  }

  .actions .button {
    flex: 1;
  }
}
</style>
