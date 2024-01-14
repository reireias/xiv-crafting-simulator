import SimulationManager from './SimulationManager.js'
import MacroA from './MacroA.js'
import MacroB from './MacroB.js'

// モーエンツール5段階
const SPLENDOROUS_5_RECIPE = {
  durability: 60,
  progress: 6600,
  quality: 15368,
  // TODO: 難易度をもたせる
}

// 非マイスター(飯: チャイ)
const NOT_MEISTER_STATUS = {
  craftmanship: 4027, // 作業精度
  control: 4056, // 加工精度
  cp: 672,
}

// マイスター(飯: チャイ)
const MEISTER_STATUS = {
  craftmanship: 4047, // 作業精度
  control: 4076, // 加工精度
  cp: 687,
}

const manager = new SimulationManager()
const macroA = new MacroA()
const macroB = new MacroB()

// 750~ : 1
// 1125~: 2
// 1500~: 3
manager.simulate(SPLENDOROUS_5_RECIPE, NOT_MEISTER_STATUS, macroA, 50000)
manager.simulate(SPLENDOROUS_5_RECIPE, NOT_MEISTER_STATUS, macroB, 50000)
manager.simulate(SPLENDOROUS_5_RECIPE, MEISTER_STATUS, macroB, 50000)
