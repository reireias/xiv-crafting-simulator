import MacroBase from './MacroBase.js'
export default class MacroC extends MacroBase {
  // 最終段階用マクロ
  // マイスター用
  run(simulator) {
    this.simulator = simulator
    this.result = {
      finish: false,
      complete: false,
    }
    let action

    // メモ(マイスター)
    // 工数 7040
    //
    // 確信: 300 -> 681
    // 下地作業: 360 -> 817
    //   確信+ヴェネ+高進捗: 3062
    //   確信+ヴェネ: 2042
    //   ヴェネ+高進捗: 1837
    //   ヴェネ: 1225
    // 集中作業: 400 -> 908
    //   ヴェネ: 1362
    // 倹約作業 = 模範作業: 180 -> 408
    //   ヴェネ+高進捗: 918
    //   ヴェネ: 612
    // 注視作業: 200 -> 454
    //   ヴェネ: 681
    // 作業: 120 -> 272
    //   ヴェネ: 408

    // 初期
    if (this.check(simulator.ac('確信'))) return this.result
    if (this.check(simulator.ac('マニピュレーション'))) return this.result

    // 工数上げフェーズ
    let long =
      simulator.hasCondition('高能率') || simulator.hasCondition('長持続')
    action = simulator.hasCondition('高能率') ? '長期倹約' : '倹約'
    if (this.check(simulator.ac(action))) return this.result
    if (this.check(simulator.ac('ヴェネレーション'))) return this.result
    action = simulator.hasCondition('高品質') ? '集中作業' : '下地作業'
    if (this.check(simulator.ac(action))) return this.result
    action = simulator.hasCondition('高品質') ? '集中作業' : '下地作業'
    if (this.check(simulator.ac(action))) return this.result
    // 3929 - 5558
    if (simulator.hasCondition('高進捗')) {
      if (simulator.getProgress() + 1837 < 7040) {
        if (this.check(simulator.ac('下地作業'))) return this.result
      } else {
        if (this.check(simulator.ac('模範作業'))) return this.result
      }
    } else if (simulator.hasCondition('高品質')) {
      if (this.check(simulator.ac('集中作業'))) return this.result
    } else {
      if (this.check(simulator.ac('下地作業'))) return this.result
    }
    // 進捗: 5148 - 6914
    if (long || simulator.hasCondition('頑丈')) {
      if (simulator.hasCondition('高進捗')) {
        // 下地作業 + ヴェネ + 高進捗 = 1837
        if (simulator.getProgress() + 1837 < 7040) {
          if (this.check(simulator.ac('下地作業'))) return this.result
        } else if (simulator.getProgress() + 918 < 7040) {
          if (this.check(simulator.ac('模範作業'))) return this.result
        } else {
          // console.log('もったいないA', simulator.progress)
        }
      } else {
        // 下地作業 + ヴェネ = 1219
        if (simulator.getProgress() + 1225 < 7040) {
          if (this.check(simulator.ac('下地作業'))) return this.result
        } else if (simulator.getProgress() + 612 < 7040) {
          if (this.check(simulator.ac('模範作業'))) return this.result
        } else {
          // console.log('もったいないB', simulator.progress)
        }
      }
    } else if (simulator.hasCondition('高品質')) {
      // 集中作業 + ヴェネ = 1362
      if (simulator.getProgress() + 1362 < 7040) {
        if (this.check(simulator.ac('集中作業'))) return this.result
      } else if (simulator.getProgress() + 612 < 7040) {
        if (this.check(simulator.ac('模範作業'))) return this.result
      } else {
        // console.log('もったいないC', simulator.progress)
      }
    } else if (simulator.hasCondition('高進捗')) {
      if (simulator.getProgress() + 612 < 7040) {
        if (this.check(simulator.ac('倹約作業'))) return this.result
      } else {
        // console.log('もったいないD', simulator.progress)
      }
    } else {
      if (simulator.getProgress() + 408 < 7040) {
        if (this.check(simulator.ac('倹約作業'))) return this.result
      } else {
        // console.log('もったいないE', simulator.progress)
      }
    }
    // 残進捗から完成に必要な必要なCPと耐久を計算する
    let restProgress = 7040 - simulator.getProgress()
    // 1 - 1283
    let needCp
    let needDu
    let finishActions = []
    if (restProgress <= 408) {
      needCp = 7
      needDu = 1
      finishActions = ['模範作業']
    } else if (restProgress <= 454) {
      needCp = 12
      needDu = 1
      finishActions = ['経過観察', '注視作業']
    } else if (restProgress <= 408 + 408) {
      needCp = 25
      needDu = 6
      finishActions = ['倹約作業', '模範作業']
    } else if (restProgress <= 408 + 454) {
      needCp = 30
      needDu = 6
      finishActions = ['倹約作業', '経過観察', '注視作業']
    } else if (restProgress <= 612 + 612) {
      needCp = 43
      needDu = 6
      finishActions = ['ヴェネレーション', '倹約作業', '模範作業']
    } else if (restProgress <= 612 + 681) {
      needCp = 48
      needDu = 6
      finishActions = ['ヴェネレーション', '倹約作業', '経過観察', '注視作業']
    } else {
      console.log('到達しないはず')
    }
    // 仮: イノベ, 倹約, 倹約, グレスラ, ビエルゴ: CP124, 耐久20
    needDu += 20
    needCp += 124
    // 進捗: 5717 - 7039
    // 残CP: 424 - 523
    // 耐久: 40 - 60
    // 倹約: 0 - 4 残りターン
    // マニ: 2 - 5 残りターン

    // console.log(simulator.durability, simulator.wasteNot, simulator.manipulation)
    // console.log(simulator.wasteNot, simulator.manipulation)

    // 品質上げフェーズ
    // 倹約が残っている -> 下地加工
    // 高品質 -> 集中加工 or 秘訣
    // 途中からイノベかけつつ
    // その他 -> 倹約加工 ( or 匠の神業)
    // マニピュレーション切れ -> 再度マニピュレーション
    let restDu = simulator.durability + 5 * simulator.manipulation
    // 残っているバフを使い切る
    while (true) {
      if (simulator.inner >= 8) {
        break
      }
      // TODO: 状態によっては早めに切り上げる？
      if (simulator.wasteNot < 1) {
        if (simulator.hasCondition('高能率') && simulator.manipulation < 2) {
          break
        }
        if (simulator.hasCondition('長持続') && simulator.manipulation < 1) {
          break
        }
      }
      if (simulator.wasteNot > 0) {
        if (simulator.hasCondition('高品質')) {
          if (this.check(simulator.ac('集中加工'))) return this.result
          restDu -= 5
        } else {
          if (this.check(simulator.ac('下地加工'))) return this.result
          restDu -= 10
        }
      } else if (simulator.manipulation > 0) {
        if (simulator.hasCondition('高品質')) {
          if (this.check(simulator.ac('集中加工'))) return this.result
          restDu -= 10
        } else if (simulator.hasCondition('頑丈')) {
          if (needCp + 40 <= simulator.cp && needDu + 10 <= restDu) {
            if (this.check(simulator.ac('下地加工'))) return this.result
            restDu -= 10
          } else {
            break
          }
        } else {
          if (needCp + 25 <= simulator.cp && needDu + 5 <= restDu) {
            if (this.check(simulator.ac('倹約加工'))) return this.result
            restDu -= 5
          } else {
            break
          }
        }
      } else {
        break
      }
    }

    // 更新
    const maniCp = simulator.hasCondition('高能率') ? 48 : 96
    if (simulator.cp - maniCp >= needCp) {
      if (this.check(simulator.ac('マニピュレーション'))) return this.result
      restDu = simulator.durability + 5 * simulator.manipulation
    } else {
      console.log('来ないはず: マニをスキップ')
      console.log(simulator.history.join(', '))
      restDu = simulator.durability
    }

    // 後半
    // インナー上げ
    while (simulator.inner < 8) {
      if (simulator.hasCondition('高品質')) {
        if (needDu + 10 <= restDu && simulator.durability > 10 && needCp + 18 <= simulator.cp) {
          if (this.check(simulator.ac('集中加工'))) return this.result
          restDu -= 10
          continue
        } else {
          // console.log('まずこない？A')
        }
      } else if (simulator.hasCondition('頑丈')) {
        if (needDu + 10 <= restDu && simulator.durability > 10 && needCp + 40 <= simulator.cp) {
          if (this.check(simulator.ac('下地加工'))) return this.result
          restDu -= 10
          continue
        } else if (needDu + 5 <= restDu && simulator.durability > 5 && needCp + 18 <= simulator.cp) {
          if (this.check(simulator.ac('加工'))) return this.result
          restDu -= 5
          continue
        } else {
          // console.log('まずこない？B')
        }
      } else {
        if (needDu + 30 <= restDu && simulator.durability > 15 && needCp + 54 <= simulator.cp) {
          if (this.check(simulator.ac('加工'))) return this.result
          if (this.check(simulator.ac('中級加工'))) return this.result
          action = simulator.hasCondition('高品質') ? '集中加工' : '上級加工'
          if (this.check(simulator.ac(action))) return this.result
          restDu -= 30
          continue
        } else if (needDu + 5 <= restDu && simulator.durability > 5 && needCp + 25 <= simulator.cp) {
          if (this.check(simulator.ac('倹約加工'))) return this.result
          restDu -= 5
          continue
        } else {
          // console.log('まずこない？C')
        }
      }
      // 何も実行できない場合は抜ける
      break
    }
    // console.log(simulator.cp - needCp)
    // console.log(restDu - needDu)
    // 余力で品質上げ
    while (true) {
      // 耐久消費をしないアクションを使った際に、マニピュレーションが無駄になる量
      const lostRestDu = simulator.manipulation ? Math.max(simulator.durability + 5 - simulator.recipe.durability, 0) : 0
      if (simulator.hasCondition('高品質')) {
        if (needDu + 10 <= restDu && simulator.durability > 10 && needCp + 18 <= simulator.cp) {
          if (this.check(simulator.ac('集中加工'))) return this.result
          restDu -= 10
          continue
        } else if (needDu + lostRestDu <= restDu) {
          if (this.check(simulator.ac('秘訣'))) return this.result
          restDu -= lostRestDu
          continue
        }
      } else if (simulator.hasCondition('頑丈')) {
        if (needDu + 10 <= restDu && simulator.durability > 10 && needCp + 40 <= simulator.cp) {
          if (this.check(simulator.ac('下地加工'))) return this.result
          restDu -= 10
          continue
        } else if (needDu + 5 <= restDu && simulator.durability > 5 && needCp + 18 <= simulator.cp) {
          if (this.check(simulator.ac('加工'))) return this.result
          restDu -= 5
          continue
        }
      } else if (simulator.hasCondition('良兆候')) {
        if (needDu + 10 + lostRestDu <= restDu && simulator.durability > 5 && needCp + 25 <= simulator.cp) {
          if (this.check(simulator.ac('経過観察'))) return this.result
          restDu -= lostRestDu
          if (this.check(simulator.ac('集中加工'))) return this.result
          restDu -= 10
          continue
        }
      }

      if (simulator.inner === 10 && needDu + lostRestDu <= restDu && needCp + 32 <= simulator.cp) {
        if (this.check(simulator.ac('匠の神業'))) return this.result
        restDu -= lostRestDu
        continue
      }
      if (needDu + 10 <= restDu && simulator.durability > 10 && needCp + 18 <= simulator.cp) {
        if (this.check(simulator.ac('加工'))) return this.result
        restDu -= 10
        continue
      }
      const masterCp = simulator.hasCondition('高能率') ? 44 : 88
      if (needDu + lostRestDu <= restDu && needCp + masterCp <= simulator.cp && simulator.manipulation === 0) {
        const upDu = Math.min(simulator.recipe.durability - simulator.durability, 30)
        if (this.check(simulator.ac('マスターズメンド'))) return this.result
        restDu += upDu
        restDu -= lostRestDu
        continue
      }
      if (needDu + 10 <= restDu && simulator.durability > 10) {
        if (this.check(simulator.ac('ヘイスティタッチ'))) return this.result
        restDu -= 10
        continue
      }
      if (needDu + lostRestDu <= restDu && needCp + 7 <= simulator.cp && (needCp + 7 + 44 <= simulator.cp || needDu + 5 <= restDu)) {
        // console.log('経過観察')
        if (this.check(simulator.ac('経過観察'))) return this.result
        restDu -= lostRestDu
        continue
      }
      break
    }
    // console.log(simulator.cp - needCp)
    // console.log(restDu - needDu)
    // console.log(simulator.durability)
    // console.log(simulator.inner)

    if (simulator.cp < needCp) {
      console.log(simulator.history.join(', '))
    }
    // if (simulator.durability + 5 * simulator.manipulation < restDu) {
    //   console.log('ズレ発生')
    //   console.log(simulator.durability + 5 * simulator.manipulation, restDu)
    // }
    let x = restDu
    let z = simulator.durability
    // console.log(restDu, simulator.durability)
    // 仕上げフェーズ
    // イノベ, ?, ?, グレスラ, ビエルゴ
    // 仮: イノベ, 倹約, 倹約, グレスラ, ビエルゴ: CP124, 耐久20
    if (this.check(simulator.ac('イノベーション'))) return this.result
    if (!simulator.hasCondition('良兆候')) {
      if (this.check(simulator.ac('倹約加工'))) return this.result
      restDu -= 5
    }
    if (!simulator.hasCondition('良兆候')) {
      if (this.check(simulator.ac('倹約加工'))) return this.result
      restDu -= 5
    }
    // console.log(restDu, simulator.durability)
    if (this.check(simulator.ac('グレートストライド'))) return this.result
    if (this.check(simulator.ac('ビエルゴの祝福'))) return this.result
    restDu -= 10
    // console.log(simulator.durability, restDu, needDu)

    // 完成フェーズ
    for (const action of finishActions) {
      if (action === '倹約作業' && simulator.durability <= 5) {
        console.log('耐久不足', simulator.durability, needDu, z, x)
        console.log(simulator.history.join(', '))
      }
      if (this.check(simulator.ac(action))) return this.result
    }
    // if (this.check(simulator.ac('加工'))) return this.result
    // if (this.check(simulator.ac('ヴェネレーション'))) return this.result
    // if (this.check(simulator.ac('倹約作業'))) return this.result
    // if (this.check(simulator.ac('倹約作業'))) return this.result
    // if (this.check(simulator.ac('倹約作業'))) return this.result
    // 模範: 406, CP7, 耐久1~
    // 経注: 452, CP12, 耐久1~
    // 倹約, 模範: 812, CP25, 耐久6~
    // 倹約, 経注: 858, CP30, 耐久6~
    // ヴェネ, 倹約, 模範: 1218, CP43, 耐久6~
    // ヴェネ, 倹約, 経注: 1287, CP48, 耐久6~
    //
    // ヴェネ, 倹約, 倹約, 作業: 1624, CP54
    // ヴェネ, 倹約, 倹約, 模範: 1827, CP61

    return this.result
  }
}
