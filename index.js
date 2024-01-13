import SimulationManager from './SimulationManager.js'
import MacroA from './MacroA.js'

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

console.log('inidex')
const manager = new SimulationManager()
const macro = new MacroA()

manager.simulate(SPLENDOROUS_5_RECIPE, NOT_MEISTER_STATUS, macro, 1)
