import CraftSimulator from '../CraftSimulator.js'

// ステータス
// 5段階を装備
// 非マイスター(飯: チャイ)
const NOT_MEISTER_STATUS5 = {
  craftmanship: 4039, // 作業精度
  control: 4064, // 加工精度
  cp: 672,
}

// マイスター(飯: チャイ)
const MEISTER_STATUS5 = {
  craftmanship: 4059, // 作業精度
  control: 4084, // 加工精度
  cp: 687,
}

// レシピ
const SPLENDOROUS_6_RECIPE = {
  durability: 60,
  progress: 7040,
  quality: 16308,
  expertType: 6, // モーエンツール6段階目
}

// コンディションセット
const DUMMY_CONDITION = new Array(100).fill('normal')

const createSimulator = (status, options = {}) => {
  const sim = new CraftSimulator(SPLENDOROUS_6_RECIPE, status, DUMMY_CONDITION)
  // 確信バフ
  if (options.muscleMemory) {
    sim.muscleMemory = 3
  }
  return sim
}

const innerAc = (status, action, options = {}) => {
  const sim = createSimulator(status)
  if (action === '集中作業') {
    sim.conditions = Array(100).fill('good')
  }
  if (action === '注視作業') {
    sim.lastAction = '経過観察'
  }
  if (options.veneration) {
    sim.veneration = 1
  }
  if (options.malleable) {
    sim.conditions = Array(100).fill('malleable')
  }
  if (options.muscleMemory) {
    sim.muscleMemory = 3
  }
  sim.ac(action)
  return sim.getProgress()
}

describe('Not Meister', () => {
  const ac = (action, options = {}) => innerAc(NOT_MEISTER_STATUS5, action, options)
  describe('progress', () => {
    test('normal', () => {
      expect(ac('作業')).toBe(271) // 120
      expect(ac('模範作業')).toBe(406) // 180
      expect(ac('注視作業')).toBe(452) // 200
      expect(ac('確信')).toBe(678) // 300
      expect(ac('下地作業')).toBe(813) // 360
      expect(ac('集中作業')).toBe(904) // 400
    })
    test('ヴェネ', () => { // +50%
      const options = { veneration: true }
      expect(ac('作業', options)).toBe(406) // 120
      expect(ac('模範作業', options)).toBe(609) // 180
      expect(ac('注視作業', options)).toBe(678) // 200
      expect(ac('下地作業', options)).toBe(1219) // 360
      expect(ac('集中作業', options)).toBe(1356) // 400
    })
    test('高進捗', () => { // +50%
      const options = { malleable: true }
      expect(ac('作業', options)).toBe(406) // 120
      expect(ac('模範作業', options)).toBe(610) // 180
      expect(ac('注視作業', options)).toBe(678) // 200
      expect(ac('下地作業', options)).toBe(1220) // 360
    })
    test('確信バフ', () => { // + 100%
      const options = { muscleMemory: true }
      expect(ac('作業', options)).toBe(542) // 120
      expect(ac('模範作業', options)).toBe(812) // 180
      expect(ac('注視作業', options)).toBe(904) // 200
      expect(ac('下地作業', options)).toBe(1626) // 360
    })
    test('ヴェネ+高進捗', () => {
      const options = { veneration: true, malleable: true }
      expect(ac('模範作業', options)).toBe(915) // 180
      expect(ac('下地作業', options)).toBe(1830) // 360
    })
    test('ヴェネ+確信バフ', () => {
      const options = { veneration: true, muscleMemory: true }
      expect(ac('下地作業', options)).toBe(2032) // 360
    })
    test('高進捗+確信バフ', () => {
      const options = { malleable: true, muscleMemory: true }
      expect(ac('下地作業', options)).toBe(2440) // 360
    })
    test('ヴェネ+高進捗+確信バフ', () => {
      const options = { veneration: true, malleable: true, muscleMemory: true }
      expect(ac('下地作業', options)).toBe(3050) // 360
    })
  })
})

describe('Meister', () => {
  const ac = (action, options = {}) => innerAc(MEISTER_STATUS5, action, options)
  describe('progress', () => {
    test('normal', () => {
      expect(ac('作業')).toBe(272) // 120
      expect(ac('模範作業')).toBe(408) // 180
      expect(ac('注視作業')).toBe(454) // 200
      expect(ac('確信')).toBe(681) // 300
      expect(ac('下地作業')).toBe(817) // 360
      expect(ac('集中作業')).toBe(908) // 400
    })
    test('ヴェネ', () => { // +50%
      const options = { veneration: true }
      expect(ac('作業', options)).toBe(408) // 120
      expect(ac('模範作業', options)).toBe(612) // 180
      expect(ac('注視作業', options)).toBe(681) // 200
      expect(ac('下地作業', options)).toBe(1225) // 360
      expect(ac('集中作業', options)).toBe(1362) // 400
    })
    test('高進捗', () => { // +50%
      const options = { malleable: true }
      expect(ac('作業', options)).toBe(408) // 120
      expect(ac('模範作業', options)).toBe(612) // 180
      expect(ac('注視作業', options)).toBe(681) // 200
      expect(ac('下地作業', options)).toBe(1225) // 360
    })
    test('確信バフ', () => { // + 100%
      const options = { muscleMemory: true }
      expect(ac('作業', options)).toBe(544) // 120
      expect(ac('模範作業', options)).toBe(816) // 180
      expect(ac('注視作業', options)).toBe(908) // 200
      expect(ac('下地作業', options)).toBe(1634) // 360
    })
    test('ヴェネ+高進捗', () => {
      const options = { veneration: true, malleable: true }
      expect(ac('模範作業', options)).toBe(918) // 180
      expect(ac('下地作業', options)).toBe(1837) // 360
    })
    test('ヴェネ+確信バフ', () => {
      const options = { veneration: true, muscleMemory: true }
      expect(ac('下地作業', options)).toBe(2042) // 360
    })
    test('高進捗+確信バフ', () => {
      const options = { malleable: true, muscleMemory: true }
      expect(ac('下地作業', options)).toBe(2450) // 360
    })
    test('ヴェネ+高進捗+確信バフ', () => {
      const options = { veneration: true, malleable: true, muscleMemory: true }
      expect(ac('下地作業', options)).toBe(3062) // 360
    })
  })
})
