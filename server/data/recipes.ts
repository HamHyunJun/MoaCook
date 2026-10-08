/**
 * 초기 레시피 데이터
 * 메인 화면 "오늘의 추천 메뉴" 4종을 레시피 형태로 옮긴 것으로,
 * 저장소가 비어 있을 때 서버에서 처음 한 번 채워 넣는 용도로 사용한다.
 */

type IngredientSeed = [name: string, amount: string]

interface RecipeSeed extends Omit<Recipe, 'ingredients' | 'steps' | 'createdAt' | 'updatedAt'> {
  ingredients: IngredientSeed[]
  steps: string[]
}

const SEEDED_AT = '2026-10-08T00:00:00.000Z'

function toRecipe(seed: RecipeSeed): Recipe {
  return {
    ...seed,
    ingredients: seed.ingredients.map(([name, amount], index) => ({
      id: `${seed.id}-ingredient-${index + 1}`,
      name,
      amount,
    })),
    steps: seed.steps.map((description, index) => ({
      id: `${seed.id}-step-${index + 1}`,
      order: index + 1,
      description,
    })),
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  }
}

const recipeSeeds: RecipeSeed[] = [
  {
    id: 'tteokbokki',
    name: '떡볶이',
    image: '/images/recipes/tteokbokki.jpg',
    description: '집에서 분식집 분위기 만들기! 어렵지 않아요!',
    category: '한식',
    difficulty: 1,
    cookingTime: 25,
    ingredients: [
      ['떡볶이 떡', '400g'],
      ['어묵', '2장'],
      ['대파', '1대'],
      ['물', '500ml'],
      ['고추장', '2큰술'],
      ['고춧가루', '1큰술'],
      ['설탕', '1큰술'],
      ['간장', '1큰술'],
      ['다진 마늘', '1/2큰술'],
    ],
    steps: [
      '떡은 찬물에 10분 정도 담가 부드럽게 불린다.',
      '어묵은 먹기 좋은 크기로 자르고, 대파는 어슷하게 썬다.',
      '냄비에 물, 고추장, 고춧가루, 설탕, 간장, 다진 마늘을 넣고 끓인다.',
      '양념이 끓으면 떡과 어묵을 넣고 중불에서 저어 가며 8~10분 졸인다.',
      '국물이 걸쭉해지면 대파를 넣고 한 번 더 끓여 마무리한다.',
    ],
    youtubeQuery: '떡볶이 만들기',
  },
  {
    id: 'jeyuk-bokkeum',
    name: '제육볶음',
    image: '/images/recipes/jeyuk-bokkeum.jpg',
    description: '한국인이 제일 사랑하는 음식! 제육볶음 만들기',
    category: '한식',
    difficulty: 2,
    cookingTime: 30,
    ingredients: [
      ['돼지고기 앞다리살', '500g'],
      ['양파', '1/2개'],
      ['대파', '1대'],
      ['청양고추', '1개'],
      ['고추장', '2큰술'],
      ['고춧가루', '1큰술'],
      ['간장', '2큰술'],
      ['설탕', '1큰술'],
      ['다진 마늘', '1큰술'],
      ['참기름', '1큰술'],
    ],
    steps: [
      '돼지고기는 먹기 좋은 크기로 썬다.',
      '고추장, 고춧가루, 간장, 설탕, 다진 마늘을 섞어 양념장을 만든다.',
      '돼지고기에 양념장을 넣고 버무려 15분 정도 재운다.',
      '양파는 채 썰고, 대파와 청양고추는 어슷하게 썬다.',
      '달군 팬에 고기를 넣고 센불에서 익을 때까지 볶는다.',
      '채소를 넣고 숨이 죽을 때까지 볶은 뒤 참기름을 둘러 마무리한다.',
    ],
    youtubeQuery: '제육볶음 만들기',
  },
  {
    id: 'smoked-duck',
    name: '훈제오리 구이',
    image: '/images/recipes/smoked-duck.jpg',
    description: '지치고 더운 여름날 몸보신하기 딱 좋은 음식! 오리고기 먹자!',
    category: '한식',
    difficulty: 1,
    cookingTime: 20,
    ingredients: [
      ['훈제오리', '400g'],
      ['양파', '1개'],
      ['부추', '1줌'],
      ['깻잎', '10장'],
      ['머스터드 소스', '2큰술'],
      ['꿀', '1큰술'],
    ],
    steps: [
      '양파는 굵게 채 썰고, 부추는 5cm 길이로 썬다.',
      '기름을 두르지 않은 팬에 훈제오리를 올려 앞뒤로 노릇하게 굽는다.',
      '오리에서 나온 기름에 양파를 넣고 투명해질 때까지 볶는다.',
      '불을 끄고 부추를 넣어 잔열로 살짝 익힌다.',
      '머스터드 소스와 꿀을 섞어 곁들이고, 깻잎에 싸서 먹는다.',
    ],
    youtubeQuery: '훈제오리 부추볶음',
  },
  {
    id: 'fruit-crepe',
    name: '과일 크레페',
    image: '/images/recipes/fruit-crepe.jpg',
    description: '남녀노소 누구나 좋아할 법한 디저트 만들기!',
    category: '양식',
    difficulty: 2,
    cookingTime: 40,
    ingredients: [
      ['박력분', '100g'],
      ['우유', '250ml'],
      ['달걀', '2개'],
      ['설탕', '1큰술'],
      ['녹인 버터', '20g'],
      ['딸기', '6개'],
      ['바나나', '1개'],
      ['생크림', '100ml'],
    ],
    steps: [
      '볼에 달걀과 설탕을 풀고 우유를 넣어 섞는다.',
      '박력분을 체 쳐서 넣고 덩어리 없이 섞은 뒤 녹인 버터를 넣는다.',
      '반죽을 냉장고에서 20분 정도 휴지시킨다.',
      '약불로 달군 팬에 반죽을 한 국자 붓고 얇게 펴서 앞뒤로 굽는다.',
      '생크림은 단단해질 때까지 휘핑하고, 과일은 먹기 좋게 썬다.',
      '크레페에 생크림과 과일을 올려 접어서 완성한다.',
    ],
    youtubeQuery: '과일 크레페 만들기',
  },
]

export const seedRecipes: Recipe[] = recipeSeeds.map(toRecipe)
