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
      // if (simulator.getQuality() === 0) {
      //   console.log(i, simulator.lastAction)
      // }
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

  // 1回のみ実行し、詳細情報を表示する
  debug(recipe, status, macro, sample = undefined) {
    // sampleが与えられた場合、sampleと一致する結果が得られるまで実行
    // それ以外は1回だけ実行
    for (let i = 0; i < 100000; i++) {
      const simulator = new CraftSimulator(recipe, status)
      macro.run(simulator)
      if (sample === undefined) {
        this._print(simulator)
        break
      } else if (sample.length > 0 && sample.length === simulator.logs.length) {
        let matched = true
        for (let j = 0; j < sample.length; j++) {
          if (sample[j].action !== simulator.logs[j].action) {
            matched = false
            break
          }
        }
        if (matched) {
          this._print(simulator)
          break
        }
      }
    }
  }

  _print(simulator) {
    console.log('状態,アクション,作業,品質,耐久値,残CP,作業差分,品質差分')
    for (const log of simulator.logs) {
      const row = [log.condition, log.action, log.progress, log.quality,log.durability,log.cp,log.diff.progress, log.diff.quality]
      console.log(row.join(','))
    }
  }
}
