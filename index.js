// @ts-nocheck
import SimulationManager from './SimulationManager.js'
import MacroA from './MacroA.js'
import MacroB from './MacroB.js'
import MacroC from './MacroC.js'
import MacroC2 from './MacroC2.js'
import MacroD from './MacroD.js'
import MacroE from './MacroE.js'

const RECIPE = {
  // モーエンツール
  splendorous: {
    // 5段階
    stage5: {
      durability: 60,
      progress: 6600,
      quality: 15368,
      // TODO: 難易度をもたせる
      expertType: 5, // モーエンツール5段階目
    },
    // 最終段階
    stage6: {
      durability: 60,
      progress: 7040,
      quality: 16308,
      expertType: 6, // モーエンツール6段階目
    },
  },
}

const STATUS = {
  // 4段階を装備 + チャイ
  stage4: {
    notMeister: {
      craftmanship: 4027, // 作業精度
      control: 4056, // 加工精度
      cp: 672,
    },
    meister: {
      craftmanship: 4047, // 作業精度
      control: 4076, // 加工精度
      cp: 687,
    },
  },
  // 5段階を装備 + チャイ
  stage5: {
    notMeister: {
      craftmanship: 4039, // 作業精度
      control: 4064, // 加工精度
      cp: 672,
    },
    // + 薬酒
    notMeisterMed: {
      craftmanship: 4039, // 作業精度
      control: 4064, // 加工精度
      cp: 672 + 21,
    },
    meister: {
      craftmanship: 4059, // 作業精度
      control: 4084, // 加工精度
      cp: 687,
    },
  },
}

const manager = new SimulationManager()

let th
// 1125~: 2
// 1500~: 3
th = [750, 1125, 1500]
// manager.simulate(RECIPE.splendorous.stage5, STATUS.stage4.notMeister, new MacroA(), 50000, th)
// manager.simulate(RECIPE.splendorous.stage5, STATUS.stage4.notMeister, new MacroB(), 50000, th)
// manager.simulate(RECIPE.splendorous.stage5, STATUS.stage4.meister, new MacroB(), 50000, th)

// 800~ : 1
// 1200~: 2
// 1600~: 3
th = [800, 1200, 1600]
// manager.simulate(RECIPE.splendorous.stage6, STATUS.stage5.notMeister, new MacroB(), 50000, th)
// manager.simulate(RECIPE.splendorous.stage6, STATUS.stage5.notMeister, new MacroC(), 10000, th)
// manager.simulate(RECIPE.splendorous.stage6, STATUS.stage5.meister, new MacroC(), 10000, th)
manager.simulate(RECIPE.splendorous.stage6, STATUS.stage5.meister, new MacroC2(), 10000, th)
// manager.debug(RECIPE.splendorous.stage6, STATUS.stage5.meister, new MacroC2())
// manager.simulate(RECIPE.splendorous.stage6, STATUS.stage5.notMeister, new MacroC(), 10000, th)
// manager.simulate(RECIPE.splendorous.stage6, STATUS.stage5.notMeister, new MacroD(), 10000, th)
// manager.simulate(RECIPE.splendorous.stage6, STATUS.stage5.notMeister, new MacroE(), 10000, th)
