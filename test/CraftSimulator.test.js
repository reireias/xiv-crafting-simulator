import CraftSimulator from '../CraftSimulator.js'

const DUMMY_RECIPE = {
  durability: 60,
  progress: 6600,
  quality: 15368,
}
const DUMMY_STATUS = {
  craftmanship: 4027,
  control: 4056,
  cp: 672,
}
const MEISTER_STATUS = {
  craftmanship: 4047,
  control: 4076,
  cp: 687,
}
const DUMMY_CONDITION = new Array(100).fill('normal')

const createSimulator = () => {
  return new CraftSimulator(DUMMY_RECIPE, DUMMY_STATUS, DUMMY_CONDITION)
}

describe('constructor', () => {
  test('expertType', () => {
    const recipe = {
      durability: 60,
      progress: 6600,
      quality: 15368,
      expertType: 5,
    }
    let simulator = new CraftSimulator(recipe, DUMMY_STATUS, DUMMY_CONDITION)
    expect(simulator.conditions).toHaveLength(100)
    recipe.expertType = 6
    simulator = new CraftSimulator(recipe, DUMMY_STATUS, DUMMY_CONDITION)
    expect(simulator.conditions).toHaveLength(100)
  })
})

describe('ac', () => {
  test('invalid action', () => {
    const simulator = createSimulator()
    expect(() => simulator.ac('invalid')).toThrowError()
  })

  test('作業', () => {
    const simulator = createSimulator()
    simulator.ac('作業')
    expect(simulator.getProgress()).toBe(270)
    expect(simulator.getQuality()).toBe(0)
    expect(simulator.getDurability()).toBe(50)
    expect(simulator.inner).toBe(0)
  })

  test('加工', () => {
    const simulator = createSimulator()
    simulator.ac('加工')
    expect(simulator.getProgress()).toBe(0)
    expect(simulator.getQuality()).toBe(260)
    expect(simulator.getDurability()).toBe(50)
    expect(simulator.inner).toBe(1)
    // インナークワイエットの効果
    simulator.ac('加工')
    expect(simulator.getProgress()).toBe(0)
    expect(simulator.getQuality()).toBe(546)
    expect(simulator.getDurability()).toBe(40)
    expect(simulator.inner).toBe(2)
  })

  describe('CP', () => {
    test('消費', () => {
      const simulator = createSimulator()
      simulator.ac('下地加工')
      expect(simulator.getProgress()).toBe(0)
      expect(simulator.getQuality()).toBe(520)
      expect(simulator.getDurability()).toBe(40)
      expect(simulator.getCp()).toBe(672 - 40)
      expect(simulator.inner).toBe(2)
    })

    test('CP不足', () => {
      const simulator = createSimulator()
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      simulator.ac('マニピュレーション')
      expect(simulator.getCp()).toBe(0)
      simulator.ac('模範作業')
      expect(simulator.getProgress()).toBe(0)
      expect(simulator.getQuality()).toBe(0)
      expect(simulator.getDurability()).toBe(60)
      expect(simulator.getCp()).toBe(0)
    })
  })

  describe('マニピュレーション', () => {
    test('効果ターン', () => {
      const simulator = createSimulator()
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(50)
      simulator.ac('マニピュレーション')
      expect(simulator.manipulation).toBe(8)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(45)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(40)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(35)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(30)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(25)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(20)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(15)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(10)
      expect(simulator.manipulation).toBe(0)
      // マニピュレーション切れ
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(0)
    })

    test('回復上限', () => {
      const simulator = createSimulator()
      simulator.ac('マニピュレーション')
      expect(simulator.getDurability()).toBe(60)
      simulator.ac('グレートストライド')
      expect(simulator.getDurability()).toBe(60)
    })
  })

  describe('確信', () => {
    test('バフ', () => {
      const simulator = createSimulator()
      simulator.ac('確信')
      expect(simulator.getProgress()).toBe(675)
      expect(simulator.getDurability()).toBe(50)
      expect(simulator.muscleMemory).toBe(5)
      simulator.ac('グレートストライド') // 適当に経過
      expect(simulator.muscleMemory).toBe(4)
      simulator.ac('下地作業')
      expect(simulator.getProgress()).toBe(675 + 810 * 2)
      expect(simulator.getDurability()).toBe(30)
      expect(simulator.muscleMemory).toBe(0) // バフが消えること
    })

    test('バフ重複', () => {
      const simulator = createSimulator()
      simulator.ac('確信')
      expect(simulator.getProgress()).toBe(675)
      expect(simulator.getDurability()).toBe(50)
      expect(simulator.muscleMemory).toBe(5)
      simulator.ac('ヴェネレーション')
      expect(simulator.muscleMemory).toBe(4)
      simulator.ac('下地作業')
      expect(simulator.getProgress()).toBe(675 + Math.floor(810 * 2.5))
      expect(simulator.getDurability()).toBe(30)
      expect(simulator.muscleMemory).toBe(0) // バフが消えること
    })
  })

  describe('イノベーション', () => {
    test('効果上昇', () => {
      const simulator = createSimulator()
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260)
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260 + 260 * 1.1)
      simulator.ac('イノベーション')
      expect(simulator.innovation).toBe(4)
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260 + 260 * 1.1 + 260 * 1.5 * 1.2)
    })
  })

  describe('グレートストライド', () => {
    test('バフ', () => {
      const simulator = createSimulator()
      simulator.ac('グレートストライド')
      expect(simulator.greatStrides).toBe(3)
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260 * 2)
      simulator.ac('グレートストライド')
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260 * 2 + 260 * 2 * 1.1)
    })
  })

  describe('ビエルゴの祝福', () => {
    test('単体', () => {
      const simulator = createSimulator()
      simulator.ac('ビエルゴの祝福')
      expect(simulator.getQuality()).toBe(260)
    })

    test('インナークワイエット', () => {
      const simulator = createSimulator()
      simulator.ac('加工')
      expect(simulator.inner).toBe(1)
      simulator.ac('ビエルゴの祝福')
      expect(simulator.getQuality()).toBe(260 + Math.floor(312 * 1.1))
      expect(simulator.inner).toBe(0)
    })
  })

  describe('ヘイスティタッチ', () => {
    test('消費', () => {
      const simulator = createSimulator()
      simulator.ac('ヘイスティタッチ')
      expect(simulator.cp).toBe(DUMMY_STATUS.cp)
      expect(simulator.durability).toBe(50)
    })

    test('確率で成功したり失敗したり', () => {
      const q = []
      const inner = []
      for (let i = 1; i < 100; i++) {
        const simulator = createSimulator()
        simulator.ac('ヘイスティタッチ')
        q.push(simulator.getQuality())
        inner.push(simulator.inner)
      }
      expect(Math.min(...q)).toBe(0)
      expect(Math.max(...q)).toBe(260)
      expect(Math.min(...inner)).toBe(0)
      expect(Math.max(...inner)).toBe(1)
    })
  })

  describe('倹約', () => {
    test('耐久値', () => {
      const simulator = createSimulator()
      simulator.ac('倹約')
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(55)
      simulator.ac('下地加工')
      expect(simulator.getDurability()).toBe(45)
    })

    test('倹約加工・倹約作業が実行不可能', () => {
      const simulator = createSimulator()
      simulator.ac('倹約')
      simulator.ac('倹約加工')
      expect(simulator.getDurability()).toBe(60)
      simulator.ac('倹約作業')
      expect(simulator.getDurability()).toBe(60)
    })
  })

  describe('匠の神業', () => {
    test('耐久値減少なし', () => {
      const simulator = createSimulator()
      simulator.inner = 10
      simulator.ac('匠の神業')
      expect(simulator.getDurability()).toBe(60)
      expect(simulator.getQuality()).toBe(520)
    })

    test('インナークワイエット10限定', () => {
      const simulator = createSimulator()
      simulator.ac('匠の神業')
      expect(simulator.getDurability()).toBe(60)
      expect(simulator.getQuality()).toBe(0)
    })
  })

  describe('秘訣', () => {
    test('回復', () => {
      const conditions = ['normal', 'good']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      simulator.ac('マニピュレーション')
      expect(simulator.getCp()).toBe(672 - 96)
      simulator.ac('秘訣')
      expect(simulator.getCp()).toBe(672 - 96 + 20)
    })

    test('最大値を超えない', () => {
      const conditions = ['good']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      simulator.ac('秘訣')
      expect(simulator.getCp()).toBe(672)
    })

    test('高品質時限定', () => {
      const conditions = ['normal', 'normal']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      simulator.ac('マニピュレーション')
      expect(simulator.getCp()).toBe(672 - 96)
      simulator.ac('秘訣')
      expect(simulator.getCp()).toBe(672 - 96)
    })
  })

  describe('経過観察', () => {
    test('ターン経過', () => {
      const simulator = createSimulator()
      simulator.ac('経過観察')
      expect(simulator.getProgress()).toBe(0)
      expect(simulator.getQuality()).toBe(0)
      expect(simulator.getCp()).toBe(672 - 7)
      expect(simulator.turnIndex).toBe(1)
    })
  })

  describe('注視作業', () => {
    test('実行', () => {
      const simulator = createSimulator()
      simulator.ac('経過観察')
      simulator.ac('注視作業')
      expect(simulator.getProgress()).toBe(450)
      expect(simulator.getQuality()).toBe(0)
      expect(simulator.getDurability()).toBe(50)
    })

    test('経過観察なしで実行不可', () => {
      const simulator = createSimulator()
      simulator.ac('注視作業')
      expect(simulator.getProgress()).toBe(0)
      expect(simulator.getQuality()).toBe(0)
      expect(simulator.getDurability()).toBe(60)
    })
  })

  describe('注視加工', () => {
    test('実行', () => {
      const simulator = createSimulator()
      simulator.ac('経過観察')
      simulator.ac('注視加工')
      expect(simulator.getProgress()).toBe(0)
      expect(simulator.getQuality()).toBe(390)
      expect(simulator.getDurability()).toBe(50)
    })

    test('経過観察なしで実行不可', () => {
      const simulator = createSimulator()
      simulator.ac('注視加工')
      expect(simulator.getProgress()).toBe(0)
      expect(simulator.getQuality()).toBe(0)
      expect(simulator.getDurability()).toBe(60)
    })
  })

  describe('マスターズメンド', () => {
    test('回復', () => {
      const simulator = createSimulator()
      simulator.ac('加工')
      simulator.ac('加工')
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(30)
      simulator.ac('マスターズメンド')
      expect(simulator.getDurability()).toBe(60)
    })

    test('上限を超えない', () => {
      const simulator = createSimulator()
      simulator.ac('加工')
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(40)
      simulator.ac('マスターズメンド')
      expect(simulator.getDurability()).toBe(60)
    })
  })

  describe('突貫作業', () => {
    test('消費', () => {
      const simulator = createSimulator()
      simulator.ac('突貫作業')
      expect(simulator.cp).toBe(DUMMY_STATUS.cp)
      expect(simulator.durability).toBe(50)
    })

    test('確率で成功したり失敗したり', () => {
      const p = []
      const du = []
      for (let i = 1; i < 100; i++) {
        const simulator = createSimulator()
        simulator.ac('突貫作業')
        p.push(simulator.getProgress())
        du.push(simulator.getDurability())
      }
      expect(Math.min(...p)).toBe(0)
      expect(Math.max(...p)).toBe(1125)
      expect(Math.min(...du)).toBe(50)
      expect(Math.max(...du)).toBe(50)
    })
  })
})

describe('condition', () => {
  describe('高品質', () => {
    test('補正', () => {
      const conditions = ['normal', 'good']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      expect(simulator.getCondition()).toBe('通常')
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260)
      expect(simulator.getCondition()).toBe('高品質')
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260 + Math.floor(260 * 1.1 * 1.75))
    })

    test('集中作業・集中加工', () => {
      const conditions = ['normal', 'good', 'good']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      simulator.ac('集中加工') // 実行されない
      expect(simulator.getDurability()).toBe(60)
      simulator.ac('集中作業') // 実行されない
      expect(simulator.getDurability()).toBe(60)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(50)
      simulator.ac('集中加工')
      expect(simulator.getDurability()).toBe(40)
      simulator.ac('集中作業')
      expect(simulator.getDurability()).toBe(30)
    })
  })

  describe('最高品質', () => {
    test('補正', () => {
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        ['excellent']
      )
      expect(simulator.getCondition()).toBe('最高品質')
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260 * 4)
    })

    test('集中作業・集中加工', () => {
      const conditions = ['normal', 'excellent', 'excellent']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      simulator.ac('集中加工') // 実行されない
      expect(simulator.getDurability()).toBe(60)
      simulator.ac('集中作業') // 実行されない
      expect(simulator.getDurability()).toBe(60)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(50)
      simulator.ac('集中加工')
      expect(simulator.getDurability()).toBe(40)
      simulator.ac('集中作業')
      expect(simulator.getDurability()).toBe(30)
    })
  })

  describe('低品質', () => {
    test('補正', () => {
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        ['poor']
      )
      expect(simulator.getCondition()).toBe('低品質')
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(Math.floor(260 * 0.5))
    })
  })

  describe('効能率', () => {
    test('消費CP半減', () => {
      const conditions = ['normal', 'pliant']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      simulator.ac('ヴェネレーション')
      expect(simulator.getCp()).toBe(672 - 18)
      simulator.ac('イノベーション')
      expect(simulator.getCp()).toBe(672 - 18 - 18 / 2)
    })
  })

  describe('頑丈', () => {
    test('消費耐久半減', () => {
      const conditions = ['normal', 'sturdy']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      expect(simulator.getDurability()).toBe(60)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(50)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(45)
    })

    test('重複', () => {
      const conditions = ['normal', 'sturdy', 'sturdy', 'sturdy']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      expect(simulator.getDurability()).toBe(60)
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(50)
      simulator.ac('倹約加工')
      expect(simulator.getDurability()).toBe(47)
      simulator.ac('倹約')
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(44)
    })
  })

  describe('高進捗', () => {
    test('進捗1.5倍', () => {
      const conditions = ['normal', 'malleable']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      simulator.ac('作業')
      expect(simulator.getProgress()).toBe(270)
      simulator.ac('作業')
      expect(simulator.getProgress()).toBe(270 + 270 * 1.5)
    })

    test('重複', () => {
      const conditions = ['normal', 'normal', 'malleable']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      simulator.ac('確信')
      expect(simulator.getProgress()).toBe(675)
      simulator.ac('ヴェネレーション')
      simulator.ac('作業')
      expect(simulator.getProgress()).toBe(675 + Math.floor(270 * 1.5 * 2.5))
    })
  })

  describe('長持続', () => {
    test('ターン増加', () => {
      const conditions = ['primed']
      const simulator = new CraftSimulator(
        DUMMY_RECIPE,
        DUMMY_STATUS,
        conditions
      )
      simulator.ac('ヴェネレーション')
      expect(simulator.veneration).toBe(6)
    })
  })
})

// NOTE: 実機で確認した値と一致するかのテスト
describe('_calcProgress', () => {
  test('value', () => {
    expect(createSimulator()._calcProgress(0)).toBe(0)
    expect(createSimulator()._calcProgress(100)).toBe(225)
    expect(createSimulator()._calcProgress(120)).toBe(270)
    expect(createSimulator()._calcProgress(180)).toBe(405)
    expect(createSimulator()._calcProgress(200)).toBe(450)
    expect(createSimulator()._calcProgress(300)).toBe(675)
    expect(createSimulator()._calcProgress(360)).toBe(810)
    // expect(createSimulator()._calcProgress(400)).toBe(900)
    expect(createSimulator()._calcProgress(500)).toBe(1125)

    // マイスターステータスでも検証
    const createMeisterSim = () => {
      return new CraftSimulator(DUMMY_RECIPE, MEISTER_STATUS, DUMMY_CONDITION)
    }
    expect(createMeisterSim()._calcProgress(0)).toBe(0)
    expect(createMeisterSim()._calcProgress(100)).toBe(226)
    expect(createMeisterSim()._calcProgress(120)).toBe(271)
    expect(createMeisterSim()._calcProgress(180)).toBe(406)
    expect(createMeisterSim()._calcProgress(200)).toBe(452)
    expect(createMeisterSim()._calcProgress(300)).toBe(678)
    expect(createMeisterSim()._calcProgress(360)).toBe(813)
    // expect(createMeisterSim()._calcProgress(400)).toBe(904)
    expect(createMeisterSim()._calcProgress(500)).toBe(1130)
  })
})

describe('_calcQuality', () => {
  test('value', () => {
    expect(createSimulator()._calcQuality(0)).toBe(0)
    expect(createSimulator()._calcQuality(100)).toBe(260)
    // expect(createSimulator()._calcQuality(120)).toBe(312)
    expect(createSimulator()._calcQuality(125)).toBe(325)
    expect(createSimulator()._calcQuality(150)).toBe(390)
    expect(createSimulator()._calcQuality(200)).toBe(520)
    expect(createSimulator()._calcQuality(300)).toBe(780)

    // マイスターステータスでも検証
    const createMeisterSim = () => {
      return new CraftSimulator(DUMMY_RECIPE, MEISTER_STATUS, DUMMY_CONDITION)
    }
    expect(createMeisterSim()._calcQuality(0)).toBe(0)
    expect(createMeisterSim()._calcQuality(100)).toBe(261)
    // expect(createMeisterSim()._calcQuality(120)).toBe(313)
    expect(createMeisterSim()._calcQuality(125)).toBe(326)
    expect(createMeisterSim()._calcQuality(150)).toBe(391)
    expect(createMeisterSim()._calcQuality(200)).toBe(522)
    expect(createMeisterSim()._calcQuality(300)).toBe(783)
  })
})

describe('logs', () => {
  test('logs record', () => {
    const sim = createSimulator()
    sim.ac('作業')
    sim.ac('加工')
    sim.ac('倹約')
    expect(sim.logs).toHaveLength(3)
    expect(sim.logs[0].action).toBe('作業')
    expect(sim.logs[0].rawCondition).toBe('normal')
    expect(sim.logs[0].condition).toBe('通常')
    expect(sim.logs[0].diff.progress).toBe(270)
    expect(sim.logs[0].diff.quality).toBe(0)
    expect(sim.logs[0].diff.durability).toBe(-10)
    expect(sim.logs[0].diff.cp).toBe(0)
    expect(sim.logs[0].progress).toBe(270)
    expect(sim.logs[0].quality).toBe(0)
    expect(sim.logs[0].durability).toBe(50)
    expect(sim.logs[0].cp).toBe(672)
    expect(sim.logs[0].success).toBe(true)
    expect(sim.logs[1].action).toBe('加工')
    expect(sim.logs[1].rawCondition).toBe('normal')
    expect(sim.logs[1].condition).toBe('通常')
    expect(sim.logs[1].diff.progress).toBe(0)
    expect(sim.logs[1].diff.quality).toBe(260)
    expect(sim.logs[1].diff.durability).toBe(-10)
    expect(sim.logs[1].diff.cp).toBe(-18)
    expect(sim.logs[1].progress).toBe(270)
    expect(sim.logs[1].quality).toBe(260)
    expect(sim.logs[1].durability).toBe(40)
    expect(sim.logs[1].cp).toBe(654)
    expect(sim.logs[1].success).toBe(true)
    expect(sim.logs[2].action).toBe('倹約')
    expect(sim.logs[2].rawCondition).toBe('normal')
    expect(sim.logs[2].condition).toBe('通常')
    expect(sim.logs[2].diff.progress).toBe(0)
    expect(sim.logs[2].diff.quality).toBe(0)
    expect(sim.logs[2].diff.durability).toBe(0)
    expect(sim.logs[2].diff.cp).toBe(-56)
    expect(sim.logs[2].progress).toBe(270)
    expect(sim.logs[2].quality).toBe(260)
    expect(sim.logs[2].durability).toBe(40)
    expect(sim.logs[2].cp).toBe(598)
    expect(sim.logs[2].success).toBe(true)
    expect(sim.logs[2].buff.wasteNot).toBe(4)
  })
})
