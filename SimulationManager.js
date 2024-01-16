import CraftSimulator from './CraftSimulator.js'

export default class SimulationManager {
  // 指定されたマクロ(SNDのLuaスクリプト利用 = アルゴリズム)をcount回シミュレートする
  // 完成率や品質の情報を返す
  simulate(recipe, status, macro, count, th) {
    const results = []
    for (let i = 0; i < count; i++) {
      const simulator = new CraftSimulator(recipe, status)
      const result = macro.run(simulator)
      // console.log(i, result.complete, simulator.getProgress(), simulator.getQuality(), simulator.getDurability())
      results.push({
        complete: result.complete,
        progress: simulator.getProgress(),
        quality: Math.floor(simulator.getQuality() / 10),
      })
      if (!result.complete) {
        // console.log(simulator.turnIndex, simulator.getProgress(), simulator.getQuality(), simulator.getDurability(), simulator.lastAction)
      }
    }
    const completes = results.filter((r) => r.complete)
    const completeRatio = Math.floor((completes.length / count) * 100 * 10) / 10
    const zero = results.filter((r) => !r.complete || r.quality < th[0]).length
    const zeroRatio = Math.floor((zero / count) * 100 * 10) / 10
    const one = completes.filter(
      (r) => th[0] <= r.quality && r.quality < th[1]
    ).length
    const oneRatio = Math.floor((one / count) * 100 * 10) / 10
    const two = completes.filter(
      (r) => th[1] <= r.quality && r.quality < th[2]
    ).length
    const twoRatio = Math.floor((two / count) * 100 * 10) / 10
    const three = completes.filter((r) => th[2] <= r.quality).length
    const threeRatio = Math.floor((three / count) * 100 * 10) / 10
    console.log(`complete: ${completeRatio}% (${completes.length}/${count})`)
    console.log(
      `交換数: [${zeroRatio}%, ${oneRatio}%, ${twoRatio}%, ${threeRatio}%]`
    )
    const avg = Math.floor(
      completes.reduce((s, e) => s + e.quality, 0) / completes.length
    )
    console.log(`収集品価値 avg: ${avg}`)
    const min = Math.min(...completes.map((r) => r.quality))
    console.log(`収集品価値 min: ${min}`)
    const max = Math.max(...completes.map((r) => r.quality))
    console.log(`収集品価値 max: ${max}`)
  }
}
