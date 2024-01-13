import MacroA from '../MacroA.js'
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

test('run', () => {
  const simulator = new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS)
  const macro = new MacroA()
  const result = macro.run(simulator)
  expect(result.complete).toBeFalsy()
})
