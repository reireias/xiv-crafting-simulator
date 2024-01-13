import CraftSimulator from './CraftSimulator.js'

export default class SimulationManager {
  // 指定されたマクロ(SNDのLuaスクリプト利用 = アルゴリズム)をcount回シミュレートする
  // 完成率や品質の情報を返す
  simulate(recipe, status, macro, count) {
    for (let i = 0; i < count; i++) {
      const simulator = new CraftSimulator(recipe, status)
      const result = macro.run(simulator)
      console.log(i, result)
    }
  }
}
