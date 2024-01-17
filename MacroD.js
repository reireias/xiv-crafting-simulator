import MacroBase from './MacroBase.js'
export default class MacroB extends MacroBase {
  // 検証用
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

    // インナー6スタック溜め
    // 下地:
    //   イノベ無し: 1872, CP 176, 耐久30 (倹約@1)
    //   イノベ有り: 2808, CP 194, 耐久30 (倹約@1)
    // コンボ:
    //   イノベ無し: 2462, CP206, 耐久30 (倹約@1)
    //   イノベ有り: 3151, CP224, 耐久30 (倹約@1 + イノベ@1)
    //     + 下地: 4399, CP264, 耐久40

    // if (this.check(simulator.ac('イノベーション'))) return this.result
    // if (this.check(simulator.ac('倹約'))) return this.result
    // if (this.check(simulator.ac('下地加工'))) return this.result
    // if (this.check(simulator.ac('下地加工'))) return this.result
    // if (this.check(simulator.ac('下地加工'))) return this.result

    if (this.check(simulator.ac('長期倹約'))) return this.result
    if (this.check(simulator.ac('加工'))) return this.result
    if (this.check(simulator.ac('中級加工'))) return this.result
    if (this.check(simulator.ac('上級加工'))) return this.result
    if (this.check(simulator.ac('イノベーション'))) return this.result
    if (this.check(simulator.ac('加工'))) return this.result
    if (this.check(simulator.ac('中級加工'))) return this.result
    if (this.check(simulator.ac('上級加工'))) return this.result
    if (this.check(simulator.ac('下地加工'))) return this.result
    console.log(simulator.quality, simulator.status.cp - simulator.cp, simulator.durability)


    return this.result
  }
}
