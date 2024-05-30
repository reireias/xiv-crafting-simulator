import MacroBase from './MacroBase.js'
export default class MacroE extends MacroBase {
  // 最終段階用マクロ
  // 突貫採用型
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
    // 倹約作業 = 模範作業: 180 -> 406
    //   ヴェネ+高進捗: 915
    //   ヴェネ: 609
    // 注視作業: 200 -> 452
    //   ヴェネ: 678
    // 作業: 120 -> 271
    //   ヴェネ: 406
    // 突貫: 500 -> 1130
    //   確信+ヴェネ+高進捗: 4237
    //   確信+ヴェネ: 2825
    //   ヴェネ+高進捗: 2542
    //   ヴェネ: 1695
    //   高進捗: 1695

    let mani = 0
    let vene = 0
    let wasteNot = 0 // 倹約

    // 初期
    if (this.check(simulator.ac('確信'))) return this.result
    mani = simulator.hasCondition('長持続') ? 10 : 8
    if (this.check(simulator.ac('マニピュレーション'))) return this.result
    vene = simulator.hasCondition('長持続') ? 6 : 4
    if (this.check(simulator.ac('ヴェネレーション'))) return this.result
    mani -= 1

    // 確信+ヴェネを突貫作業か集中作業に乗せる
    // TODO: 高進捗なら下地作業もありか検証
    let success = false
    for (let i = 0; i < 3; i++) {
      let before = simulator.getProgress()
      let base = i === 2 ? '下地作業' : '突貫作業' // 最後のターンは下地作業
      action = simulator.hasCondition('高品質') ? '集中作業' : base
      if (this.check(simulator.ac(action))) return this.result
      vene -= 1
      mani -= 1
      success = simulator.getProgress() - before > 0
      if (success) break
    }
    // console.log(simulator.progress, simulator.durability, vene)
    // console.log(simulator.progress)
    // 残りの工数上げフェーズ
    while (true) {
      if (vene <= 0) {
        vene = simulator.hasCondition('長持続') ? 6 : 4
        vene += 1
        if (this.check(simulator.ac('ヴェネレーション'))) return this.result
      } else if (simulator.hasCondition('高進捗')) {
        // 突貫: 2542
        // 下地: 1830
        // 倹約: 915
        if (
          wasteNot > 0 &&
          simulator.getProgress() + 1830 < simulator.recipe.progress
        ) {
          if (this.check(simulator.ac('下地作業'))) return this.result
        } else if (simulator.getProgress() + 915 < simulator.recipe.progress) {
          action = wasteNot > 0 ? '模範作業' : '倹約作業'
          if (this.check(simulator.ac(action))) return this.result
        } else {
          break
        }
      } else if (simulator.hasCondition('高品質')) {
        // 集中: 1356
        // 倹約: 609
        if (simulator.getProgress() + 1356 < simulator.recipe.progress) {
          if (this.check(simulator.ac('集中作業'))) return this.result
        } else if (simulator.getProgress() + 609 < simulator.recipe.progress) {
          action = wasteNot > 0 ? '模範作業' : '倹約作業'
          if (this.check(simulator.ac(action))) return this.result
        } else {
          break
        }
      } else if (simulator.hasCondition('頑丈')) {
        // 下地: 1219
        // 倹約: 609
        if (simulator.getProgress() + 1219 < simulator.recipe.progress) {
          if (this.check(simulator.ac('下地作業'))) return this.result
        } else if (simulator.getProgress() + 609 < simulator.recipe.progress) {
          if (this.check(simulator.ac('模範作業'))) return this.result
        } else {
          break
        }
      } else if (simulator.hasCondition('高能率') && wasteNot <= 0) {
        wasteNot = 8 + 1
        if (this.check(simulator.ac('長期倹約'))) return this.result
        // } else if (simulator.hasCondition('長持続')) {
      } else {
        // 通常
        // 下地: 1219
        // 倹約: 609
        if (
          wasteNot > 0 &&
          simulator.getProgress() + 1219 < simulator.recipe.progress
        ) {
          if (this.check(simulator.ac('下地作業'))) return this.result
        } else if (simulator.getProgress() + 609 < simulator.recipe.progress) {
          action = wasteNot > 0 ? '模範作業' : '倹約作業'
          if (this.check(simulator.ac(action))) return this.result
        } else {
          break
        }
      }
      mani -= 1
      wasteNot -= 1
      vene -= 1
    }
    // 6133 - 7037
    // 15 - 60
    // 163 - 582
    console.log(simulator.progress)
    // console.log(Math.floor(simulator.cp / 100) * 100)
    // if (simulator.cp < 230) {
    //   console.log(simulator.history.join(', '))
    // }

    // 模範: 406, CP7, 耐久1~
    // 経注: 452, CP12, 耐久1~
    // 倹約, 模範: 812, CP25, 耐久6~
    // 倹約, 経注: 858, CP30, 耐久6~
    // ヴェネ, 倹約, 模範: 1218, CP43, 耐久6~
    // ヴェネ, 倹約, 経注: 1287, CP48, 耐久6~
    //
    // ヴェネ, 倹約, 倹約, 作業: 1624, CP54
    // ヴェネ, 倹約, 倹約, 模範: 1827, CP61
    // 倹約, ヴェネ, 下地, 下地, 下地, 作業: 4063, CP128
    // 倹約, ヴェネ, 下地, 下地, 下地, 模範: 4266, CP135

    return this.result
  }
}
