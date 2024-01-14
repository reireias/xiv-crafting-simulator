import MacroBase from './MacroBase.js'
export default class MacroB extends MacroBase {
  // 状態なしではギリ完成しないマクロ
  run(simulator) {
    this.simulator = simulator
    this.result = {
      finish: false,
      complete: false,
    }
    let action

    // 初期
    if (this.check(simulator.ac('確信'))) return this.result
    if (this.check(simulator.ac('マニピュレーション'))) return this.result
    action = simulator.hasCondition('sturdy') ? '加工' : '倹約加工'
    if (this.check(simulator.ac(action))) return this.result

    // 工数上げ
    if (this.check(simulator.ac('ヴェネレーション'))) return this.result
    action = simulator.hasCondition('pliant') ? '長期倹約' : '倹約'
    if (this.check(simulator.ac(action))) return this.result
    action = simulator.hasCondition('good') ? '集中作業' : '下地作業'
    if (this.check(simulator.ac(action))) return this.result
    action = simulator.hasCondition('good') ? '集中作業' : '下地作業'
    if (this.check(simulator.ac(action))) return this.result
    action = simulator.hasCondition('good') ? '集中作業' : '下地作業'
    if (this.check(simulator.ac(action))) return this.result

    // 品質上げ
    if (this.check(simulator.ac('加工'))) return this.result
    if (this.check(simulator.ac('中級加工'))) return this.result
    action = simulator.hasCondition('good') ? '集中加工' : '上級加工'
    if (this.check(simulator.ac(action))) return this.result
    if (this.check(simulator.ac('マニピュレーション'))) return this.result
    if (this.check(simulator.ac('イノベーション'))) return this.result
    if (this.check(simulator.ac('倹約加工'))) return this.result
    if (this.check(simulator.ac('加工'))) return this.result
    if (this.check(simulator.ac('中級加工'))) return this.result
    action = simulator.hasCondition('good') ? '集中加工' : '上級加工'
    if (this.check(simulator.ac(action))) return this.result

    // 余裕があれば上げるフェーズ
    // マニピュレーションの回復込みの残り耐久
    let restDu = simulator.getDurability() + 15 // 3ターン分

    while (true) {
      let oneMore = false
      if (simulator.hasCondition('good')) {
        if (restDu >= 36 + 10 && simulator.getCp() >= 167 + 18) {
          if (this.check(simulator.ac('集中加工'))) return this.result
          restDu -= 10
        } else {
          if (this.check(simulator.ac('秘訣'))) return this.result
        }
        oneMore = true
      }
      if (simulator.inner === 10 && simulator.getCp() >= 167 + 32) {
        if (this.check(simulator.ac('匠の神業'))) return this.result
        oneMore = true
      }
      if (restDu >= 36 + 10 && simulator.getCp() >= 167 + 18) {
        if (this.check(simulator.ac('加工'))) return this.result
        restDu -= 10
        oneMore = true
      }
      if (!oneMore) {
        break
      }
    }
    // ここから下で耐久36以上、CP167あればOK
    if (this.check(simulator.ac('イノベーション'))) return this.result
    if (simulator.hasCondition('good') && restDu > 35) {
      if (this.check(simulator.ac('集中加工'))) return this.result
      restDu -= 10
    } else {
      if (this.check(simulator.ac('倹約加工'))) return this.result
      restDu -= 5
    }
    action =
      simulator.hasCondition('good') && restDu > 30 ? '集中加工' : '倹約加工'
    if (this.check(simulator.ac(action))) return this.result
    if (this.check(simulator.ac('グレートストライド'))) return this.result
    if (this.check(simulator.ac('ビエルゴの祝福'))) return this.result

    // 仕上げ
    if (this.check(simulator.ac('ヴェネレーション'))) return this.result
    if (this.check(simulator.ac('倹約作業'))) return this.result
    if (simulator.hasCondition('good')) {
        if (this.check(simulator.ac('集中作業'))) return this.result
    } else {
      if (this.simulator.getCp() >= 18) {
        if (this.check(simulator.ac('倹約作業'))) return this.result
        if (this.check(simulator.ac('作業'))) return this.result
      } else {
        if (this.check(simulator.ac('模範作業'))) return this.result
        if (this.check(simulator.ac('作業'))) return this.result
      }
    }
    return this.result
  }
}
