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

  describe('倹約', () => {
    test('耐久値', () => {
      const simulator = createSimulator()
      simulator.ac('倹約')
      simulator.ac('加工')
      expect(simulator.getDurability()).toBe(55)
      simulator.ac('下地加工')
      expect(simulator.getDurability()).toBe(45)
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
      expect(simulator.getCondition()).toBe('normal')
      simulator.ac('加工')
      expect(simulator.getQuality()).toBe(260)
      expect(simulator.getCondition()).toBe('good')
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
})

describe('_calcProgress', () => {
  test.skip('value', () => {
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
  test.skip('value', () => {
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
