export default class MacroBase {
  check(state) {
    // console.log(this.simulator.lastAction, this.simulator.getQuality(), this.simulator.conditions[this.simulator.turnIndex - 1])
    // stateの内容を確認し、マクロを終了する場合はtrueを返す
    // 終了する場合は結果を this.result に格納する
    if (state.finish) {
      this.result = {
        complete: state.complete
      }
      return true
    }
    return false
  }
}
