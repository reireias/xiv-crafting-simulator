import CraftSimulator from '../CraftSimulator.js'

const DUMMY_RECIPE = {
  durability: 60,
  progress: 6600,
  quality: 15368,
}
const DUMMY_STATUS = {
  craftmanship: 4027,
  control: 4056,
  cp: 672,
}

describe('ac', () => {
  test('invalid action', () => {
    const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
    expect(() => simulator.ac('invalid')).toThrowError()
  })

  test('作業', () => {
    const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
    simulator.ac('作業')
    expect(simulator.getProgress()).toBe(270)
    expect(simulator.getQuality()).toBe(0)
    expect(simulator.getDurability()).toBe(50)
    expect(simulator.inner).toBe(0)
  })

  test('加工', () => {
    const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
    simulator.ac('加工')
    expect(simulator.getProgress()).toBe(0)
    expect(simulator.getQuality()).toBe(260)
    expect(simulator.getDurability()).toBe(50)
    expect(simulator.inner).toBe(1)
    // インナークワイエットの効果
    simulator.ac('加工')
    expect(simulator.getProgress()).toBe(0)
    expect(simulator.getQuality()).toBe(546)
    expect(simulator.getDurability()).toBe(40)
    expect(simulator.inner).toBe(2)
  })

  describe('CP', () => {
    test('消費', () => {
      const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
      simulator.ac('下地加工')
      expect(simulator.getProgress()).toBe(0)
      expect(simulator.getQuality()).toBe(520)
      expect(simulator.getDurability()).toBe(40)
      expect(simulator.getCp()).toBe(672 - 40)
      expect(simulator.inner).toBe(2)
    })

    test('CP不足', () => {
      const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      expect(simulator.getCp()).toBe(0)
      simulator.ac('模範作業')
      expect(simulator.getProgress()).toBe(0)
      expect(simulator.getQuality()).toBe(0)
      expect(simulator.getDurability()).toBe(60)
      expect(simulator.getCp()).toBe(0)
    })
  })

  describe('マニピュレーション', () => {
    test('効果ターン', () => {
      const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(50)
      simulator.ac('マニピュレーション')
      expect(simulator.manipulation).toBe(8)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(45)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(40)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(35)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(30)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(25)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(20)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(15)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(10)
      expect(simulator.manipulation).toBe(0)
      // マニピュレーション切れ
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(0)
    })

    test('回復上限', () => {
      const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
      simulator.ac('マニピュレーション')
      expect(simulator.getDurability()).toBe(60)
      simulator.ac('グレートストライド')
      expect(simulator.getDurability()).toBe(60)
    })
  })

  describe('確信', () => {
    test('バフ', () => {
      const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
      simulator.ac('確信')
      expect(simulator.getProgress()).toBe(675)
      expect(simulator.getDurability()).toBe(50)
      expect(simulator.muscleMemory).toBe(5)
      simulator.ac('グレートストライド') // 適当に経過
      expect(simulator.muscleMemory).toBe(4)
      simulator.ac('下地作業')
      expect(simulator.getProgress()).toBe(675 + 675 * 2)
      expect(simulator.getDurability()).toBe(30)
      expect(simulator.muscleMemory).toBe(0) // バフが消えること
    })

    test('バフ重複', () => {
      const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
      simulator.ac('確信')
      expect(simulator.getProgress()).toBe(675)
      expect(simulator.getDurability()).toBe(50)
      expect(simulator.muscleMemory).toBe(5)
      simulator.ac('ヴェネレーション')
      expect(simulator.muscleMemory).toBe(4)
      simulator.ac('下地作業')
      expect(simulator.getProgress()).toBe(675 + Math.floor(675 * 2.5))
      expect(simulator.getDurability()).toBe(30)
      expect(simulator.muscleMemory).toBe(0) // バフが消えること
    })
  })

  describe('イノベーション', () => {
    test('効果上昇', () => {
      const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260)
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260 + 260 * 1.1)
      simulator.ac('イノベーション')
      expect(simulator.innovation).toBe(4)
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260 + 260 * 1.1 + 260 * 1.5 * 1.2)
    })
  })
})
