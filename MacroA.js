import MacroBase from './MacroBase.js'
export default class MacroA extends MacroBase {
  run(simulator) {
    this.simulator = simulator
    this.result = {
      finish: false,
      complete: false,
    }
    if (this.check(simulator.ac('作業'))) return this.result
    if (this.check(simulator.ac('作業'))) return this.result
    if (this.check(simulator.ac('作業'))) return this.result
    if (this.check(simulator.ac('作業'))) return this.result
    if (this.check(simulator.ac('作業'))) return this.result
    if (this.check(simulator.ac('作業'))) return this.result
    console.log('ここにはこないはず')
    return this.result
    // if (check(simulator.ac('加工'))) return result
    // if (xxx.getCondition() === 'xxx') {
    //   if (check(simulator.ac('作業'))) return result
    // } else {
    //   if (check(simulator.ac('加工'))) return result
    // }
  }
}
