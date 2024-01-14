import MacroBase from './MacroBase.js'
export default class MacroA extends MacroBase {

  // 状態なしではギリ完成しないマクロ
  run(simulator) {
    this.simulator = simulator
    this.result = {
      finish: false,
      complete: false,
    }
    if (this.check(simulator.ac('確信'))) return this.result
    if (this.check(simulator.ac('マニピュレーション'))) return this.result
    if (this.check(simulator.ac('倹約加工'))) return this.result
    if (this.check(simulator.ac('ヴェネレーション'))) return this.result
    if (this.check(simulator.ac('倹約'))) return this.result
    if (this.check(simulator.ac('下地作業'))) return this.result
    if (this.check(simulator.ac('下地作業'))) return this.result
    if (this.check(simulator.ac('下地作業'))) return this.result
    if (this.check(simulator.ac('加工'))) return this.result
    if (this.check(simulator.ac('中級加工'))) return this.result
    if (this.check(simulator.ac('上級加工'))) return this.result
    if (this.check(simulator.ac('マニピュレーション'))) return this.result
    if (this.check(simulator.ac('イノベーション'))) return this.result
    if (this.check(simulator.ac('倹約加工'))) return this.result
    if (this.check(simulator.ac('加工'))) return this.result
    if (this.check(simulator.ac('中級加工'))) return this.result
    if (this.check(simulator.ac('上級加工'))) return this.result
    if (this.check(simulator.ac('イノベーション'))) return this.result
    if (this.check(simulator.ac('倹約加工'))) return this.result
    if (this.check(simulator.ac('倹約加工'))) return this.result
    if (this.check(simulator.ac('グレートストライド'))) return this.result
    if (this.check(simulator.ac('ビエルゴの祝福'))) return this.result
    if (this.check(simulator.ac('ヴェネレーション'))) return this.result
    if (this.check(simulator.ac('倹約作業'))) return this.result
    if (this.check(simulator.ac('模範作業'))) return this.result
    // あと1手必要だが通常状態だとCPも耐久もない
    return this.result
  }
}
