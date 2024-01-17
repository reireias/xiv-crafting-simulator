export default class MacroBase {
  check(state) {
    // console.log(this.simulator.lastAction, this.simulator.getQuality(), this.simulator.conditions[this.simulator.turnIndex - 1])
    // stateの内容を確認し、マクロを終了する場合はtrueを返す
    // 終了する場合は結果を this.result に格納する
    if (state.finish) {
      this.result = {
        complete: state.complete
      }
      if (!state.complete) {
        const history = this.simulator.history
        console.log('未完成: ' + this.simulator.lastAction, this.simulator.turnIndex, history[history.length - 2], history[history.length - 3], history[history.length - 4])
      }
      return true
    }
    return false
  }
}
