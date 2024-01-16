import MacroBase from './MacroBase.js'
export default class MacroB extends MacroBase {
  // 最終段階用マクロ
  run(simulator) {
    this.simulator = simulator
    this.result = {
      finish: false,
      complete: false,
    }
    let action

    // メモ(非マイスター)
    // 工数 7040
    //
    // 確信: 300 -> 678
    // 下地作業: 360 -> 813
    //   確信+ヴェネ+高進捗: 3050
    //   確信+ヴェネ: 2032
    //   ヴェネ+高進捗: 1830
    //   ヴェネ: 1219
    // 集中作業: 400 -> 904
    //   ヴェネ: 1356
    // 倹約作業: 180 -> ?
    //   ヴェネ+高進捗: 915
    //   ヴェネ: 609

    // 初期
    if (this.check(simulator.ac('確信'))) return this.result
    if (this.check(simulator.ac('マニピュレーション'))) return this.result

    // 工数上げ
    let long = simulator.hasCondition('高能率') || simulator.hasCondition('長持続')
    action = simulator.hasCondition('高能率') ? '長期倹約' : '倹約'
    if (this.check(simulator.ac(action))) return this.result
    if (this.check(simulator.ac('ヴェネレーション'))) return this.result
    action = simulator.hasCondition('高品質') ? '集中作業' : '下地作業'
    if (this.check(simulator.ac(action))) return this.result
    action = simulator.hasCondition('高品質') ? '集中作業' : '下地作業'
    if (this.check(simulator.ac(action))) return this.result
    // 3929 - 5558
    if (simulator.hasCondition('高進捗')) {
      if (simulator.getProgress() + 1830 < 7040) {
        if (this.check(simulator.ac('下地作業'))) return this.result
      } else {
        if (this.check(simulator.ac('模範作業'))) return this.result
      }
    } else if (simulator.hasCondition('高品質')) {
      if (this.check(simulator.ac('集中作業'))) return this.result
    } else {
      if (this.check(simulator.ac('下地作業'))) return this.result
    }
    // 5148 - 6914

    // console.log(simulator.progress)
    if (long || simulator.hasCondition('頑丈')) {
      if (simulator.hasCondition('高進捗')) {
        // 下地作業 + ヴェネ + 高進捗 = 1830
        if (simulator.getProgress() + 1830 < 7040) {
          if (this.check(simulator.ac('下地作業'))) return this.result
        } else if (simulator.getProgress() + 915 < 7040) {
          if (this.check(simulator.ac('模範作業'))) return this.result
        } else {
          // console.log('もったいないA', simulator.progress)
        }
      } else {
        // 下地作業 + ヴェネ = 1219
        if (simulator.getProgress() + 1219 < 7040) {
          if (this.check(simulator.ac('下地作業'))) return this.result
        } else if (simulator.getProgress() + 915 < 7040) {
          if (this.check(simulator.ac('模範作業'))) return this.result
        } else {
          // console.log('もったいないB', simulator.progress)
        }
      }
    } else if (simulator.hasCondition('高品質')) {
      // 集中作業 + ヴェネ = 1356
      if (simulator.getProgress() + 1356 < 7040) {
        if (this.check(simulator.ac('集中作業'))) return this.result
      } else if (simulator.getProgress() + 609 < 7040) {
        if (this.check(simulator.ac('模範作業'))) return this.result
      } else {
        // console.log('もったいないC', simulator.progress)
      }
    } else {
      if (simulator.getProgress() + 609 < 7040) {
        if (this.check(simulator.ac('倹約作業'))) return this.result
      } else {
        // console.log('もったいないD', simulator.progress)
      }
    }
    console.log(simulator.progress)
    
    // if (this.check(simulator.ac('加工'))) return this.result
    // if (this.check(simulator.ac('ヴェネレーション'))) return this.result
    // if (this.check(simulator.ac('倹約作業'))) return this.result
    // if (this.check(simulator.ac('倹約作業'))) return this.result
    // if (this.check(simulator.ac('倹約作業'))) return this.result

    return this.result
  }
}
