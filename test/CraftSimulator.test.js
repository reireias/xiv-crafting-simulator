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

  test('CP', () => {
    const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
    simulator.ac('下地加工')
    expect(simulator.getProgress()).toBe(0)
    expect(simulator.getQuality()).toBe(520)
    expect(simulator.getDurability()).toBe(40)
    expect(simulator.getCp()).toBe(672 - 40)
    expect(simulator.inner).toBe(2)
  })
})
