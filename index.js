import SimulationManager from './SimulationManager.js'
import MacroA from './MacroA.js'
import MacroB from './MacroB.js'
import MacroC from './MacroC.js'

// モーエンツール5段階
const SPLENDOROUS_5_RECIPE = {
  durability: 60,
  progress: 6600,
  quality: 15368,
  // TODO: 難易度をもたせる
  expertType: 5, // モーエンツール5段階目
}

const SPLENDOROUS_6_RECIPE = {
  durability: 60,
  progress: 7040,
  quality: 16308,
  expertType: 6, // モーエンツール6段階目
}

// 4段階を装備
// 非マイスター(飯: チャイ)
const NOT_MEISTER_STATUS4 = {
  craftmanship: 4027, // 作業精度
  control: 4056, // 加工精度
  cp: 672,
}

// マイスター(飯: チャイ)
const MEISTER_STATUS4 = {
  craftmanship: 4047, // 作業精度
  control: 4076, // 加工精度
  cp: 687,
}

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

const manager = new SimulationManager()
const macroA = new MacroA()
const macroB = new MacroB()
const macroC = new MacroC()

let th
// 1125~: 2
// 1500~: 3
th = [750, 1125, 1500]
// manager.simulate(SPLENDOROUS_5_RECIPE, NOT_MEISTER_STATUS4, macroA, 50000, th)
// manager.simulate(SPLENDOROUS_5_RECIPE, NOT_MEISTER_STATUS4, macroB, 50000, th)
// manager.simulate(SPLENDOROUS_5_RECIPE, MEISTER_STATUS4, macroB, 50000, th)

// 800~ : 1
// 1200~: 2
// 1600~: 3
th = [800, 1200, 1600]
// manager.simulate(SPLENDOROUS_6_RECIPE, NOT_MEISTER_STATUS5, macroB, 50000, th)
// manager.simulate(SPLENDOROUS_6_RECIPE, NOT_MEISTER_STATUS5, macroC, 50000, th)
manager.simulate(SPLENDOROUS_6_RECIPE, NOT_MEISTER_STATUS5, macroC, 10000, th)
