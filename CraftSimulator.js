const ACTIONS = {
  作業: {
    progressEfficiency: 120,
    qualityEfficiency: 0,
    durability: 10,
    cp: 0,
  },
  確信: {
    progressEfficiency: 300,
    qualityEfficiency: 0,
    durability: 10,
    cp: 6,
  },
  模範作業: {
    progressEfficiency: 180,
    qualityEfficiency: 0,
    durability: 10,
    cp: 7,
  },
  下地作業: {
    progressEfficiency: 360,
    qualityEfficiency: 0,
    durability: 20,
    cp: 18,
  },
  集中作業: {
    progressEfficiency: 400,
    qualityEfficiency: 0,
    durability: 10,
    cp: 6,
  },
  精密作業: {
    progressEfficiency: 100,
    qualityEfficiency: 100,
    durability: 10,
    cp: 6,
    inner: 1,
  },
  倹約作業: {
    // TODO: 倹約、長期倹約中に実行を禁止する
    progressEfficiency: 180,
    qualityEfficiency: 0,
    durability: 5,
    cp: 18,
  },
  加工: {
    progressEfficiency: 0,
    qualityEfficiency: 100,
    durability: 10,
    cp: 18,
    inner: 1,
  },
  中級加工: {
    progressEfficiency: 0,
    qualityEfficiency: 125,
    durability: 10,
    cp: 18, // 加工からのコンボ前提
    inner: 1,
  },
  上級加工: {
    progressEfficiency: 0,
    qualityEfficiency: 150,
    durability: 10,
    cp: 18, // 中級加工からのコンボ前提
    inner: 1,
  },
  倹約加工: {
    // TODO: 倹約、長期倹約中に実行を禁止する
    progressEfficiency: 0,
    qualityEfficiency: 100,
    durability: 5,
    cp: 25,
    inner: 1,
  },
  集中加工: {
    progressEfficiency: 0,
    qualityEfficiency: 150,
    durability: 10,
    cp: 18,
    inner: 2,
  },
  下地加工: {
    progressEfficiency: 0,
    qualityEfficiency: 200,
    durability: 20,
    cp: 40,
    inner: 2,
  },
  ビエルゴの祝福: {
    progressEfficiency: 0,
    qualityEfficiency: 100,
    durability: 10,
    cp: 24,
  },
  匠の神業: {
    progressEfficiency: 0,
    qualityEfficiency: 100,
    durability: 0,
    cp: 32,
  },
  マニピュレーション: {
    progressEfficiency: 0,
    qualityEfficiency: 0,
    durability: 0,
    cp: 96,
  },
  ヴェネレーション: {
    progressEfficiency: 0,
    qualityEfficiency: 0,
    durability: 0,
    cp: 18,
  },
  グレートストライド: {
    progressEfficiency: 0,
    qualityEfficiency: 0,
    durability: 0,
    cp: 32,
  },
  イノベーション: {
    progressEfficiency: 0,
    qualityEfficiency: 0,
    durability: 0,
    cp: 18,
  },
  倹約: {
    progressEfficiency: 0,
    qualityEfficiency: 0,
    durability: 0,
    cp: 56,
  },
  長期倹約: {
    progressEfficiency: 0,
    qualityEfficiency: 0,
    durability: 0,
    cp: 98,
  },
  秘訣: {
    progressEfficiency: 0,
    qualityEfficiency: 0,
    durability: 0,
    cp: 0,
  },
}

// TODO: ステータスから計算して算出したい
const PROGRESS_VALUE_MAP = {
  4027: {
    0: 0,
    100: 225,
    120: 270,
    180: 405,
    200: 450,
    300: 675,
    360: 810,
    400: 900, // 算出
    500: 1125,
  },
  4047: {
    0: 0,
    100: 226,
    120: 271,
    180: 406,
    200: 452,
    300: 678,
    360: 813,
    400: 904, // 算出
    500: 1130,
  },
}
const QUALITY_VALUE_MAP = {
  4056: {
    0: 0,
    100: 260,
    120: 312, // 算出
    125: 325,
    150: 390,
    200: 520,
    300: 780,
  },
  4076: {
    0: 0,
    100: 261,
    120: 313, // 算出
    125: 326,
    150: 391,
    200: 522,
    300: 783,
  },
}

// TODO: 5段階と6段階で指定できるように
// これは5段階目
const CONDITIONS = [
  'normal', // 通常
  'good', // 高品質
  'pliant', // 高能率
  'centered', // 安定
  'sturdy', // 頑丈
  'good omen', // 良兆候 TODO: 実機でチェック
]

export default class CraftSimulator {
  constructor(recipe, status, conditions = undefined) {
    this.recipe = recipe
    this.status = status

    // 作業進捗
    this.progress = 0
    // 品質
    this.quality = 0
    // 耐久
    this.durability = recipe.durability
    // CP
    this.cp = status.cp
    // インナークワイエット
    this.inner = 0

    // バフ類
    this.manipulation = 0
    this.muscleMemory = 0 // 確信
    this.veneration = 0
    this.innovation = 0
    this.greatStrides = 0
    this.wasteNot = 0 // 倹約

    if (conditions) {
      // テスト用に状態の配列を指定可能
      this.conditions = conditions
    } else {
      // この時点でランダムに状態を100ターン分くらい決めておく
      this.conditions = ['normal']
      while (this.conditions.length < 100) {
        // 通常が50%, 高品質5%, 良兆候5%, 安定・頑丈・高能率残り
        // 参考: https://jp.finalfantasyxiv.com/lodestone/character/5483630/blog/4382417/
        let next
        const r = Math.random()
        if (r < 0.5) {
          next = 'normal'
        } else if (r >= 0.95) {
          next = 'good'
        } else if (r >= 0.90) {
          next = 'good omen'
        } else {
          next = CONDITIONS[Math.floor(Math.random() * 3) + 2]
        }
        // 高品質は連続しない
        if (
          next === 'good' &&
          this.conditions[this.conditions.length - 1] === 'good'
        ) {
          continue
        }
        this.conditions.push(next)
        // 良兆候の次は高品質
        if (next === 'good omen') {
          this.conditions.push('good')
        }
      }
    }
    this.turnIndex = 0
  }

  ac(action) {
    const a = ACTIONS[action]
    if (!a) {
      throw new Error(`${action} is not defined in ACTIONS.`)
    }

    let doAction = this.cp >= a.cp
    // 集中作業・集中加工・秘訣は高品質時のみ利用可能
    if (
      ['集中作業', '集中加工', '秘訣'].includes(action) &&
      !this.hasCondition('good')
    ) {
      doAction = false
    }
    // 匠の神業はインナークワイエット10でのみ利用可能
    if (action === '匠の神業' && this.inner < 10) {
      doAction = false
    }

    if (!doAction) {
      return {
        finish: this.hasMaxProgress() || this.durability <= 0,
        complete: this.hasMaxProgress(),
      }
    }
    this.lastAction = action

    // 加工や作業
    this.progress += this._getProgressValue(a.progressEfficiency)
    let qe = a.qualityEfficiency
    if (action === 'ビエルゴの祝福') {
      qe += this.inner * 20
    }
    this.quality += this._getQualityValue(qe)
    let du = a.durability
    if (this.wasteNot > 0) {
      du /= 2
    }
    if (this.hasCondition('sturdy')) {
      du /= 2
    }
    this.durability -= Math.ceil(du)
    if (a.inner) {
      this.inner += a.inner
      if (this.inner > 10) {
        this.inner = 10
      }
    }
    // 効能率なら半減
    this.cp -= this.hasCondition('pliant') ? Math.ceil(a.cp / 2) : a.cp
    if (action === '秘訣') {
      this.cp += 20
      if (this.cp > this.status.cp) {
        this.cp = this.status.cp
      }
    }

    // ターン経過処理
    if (this.manipulation > 0) {
      this.manipulation -= 1
      this.durability += 5
      if (this.durability > this.getMaxDurability()) {
        this.durability = this.getMaxDurability()
      }
    }
    if (this.muscleMemory > 0) {
      this.muscleMemory -= 1
    }
    if (this.veneration > 0) {
      this.veneration -= 1
    }
    if (this.innovation > 0) {
      this.innovation -= 1
    }
    if (this.greatStrides > 0) {
      this.greatStrides -= 1
    }
    if (this.wasteNot > 0) {
      this.wasteNot -= 1
    }
    if (action === 'ビエルゴの祝福') {
      this.inner = 0
    }
    this.turnIndex += 1

    // バフ追加
    if (action === 'マニピュレーション') {
      this.manipulation = 8
    } else if (action === '確信') {
      this.muscleMemory = 5
    } else if (action === 'ヴェネレーション') {
      this.veneration = 4
    } else if (action === 'イノベーション') {
      this.innovation = 4
    } else if (action === 'グレートストライド') {
      this.greatStrides = 3
    } else if (action === '倹約') {
      this.wasteNot = 4
    } else if (action === '長期倹約') {
      this.wasteNot = 8
    }

    return {
      finish: this.hasMaxProgress() || this.durability <= 0,
      complete: this.hasMaxProgress(),
    }
  }

  // ステータスと効率から実際に上昇する量を返す
  _getProgressValue(progressEfficiency) {
    const map = PROGRESS_VALUE_MAP[this.status.craftmanship]
    if (map === undefined) {
      throw new Error(`Invalid craftmanship: ${this.status.craftmanship}`)
    }
    const value = map[progressEfficiency]
    if (value === undefined) {
      throw new Error(`Invalid progressEfficiency: ${progressEfficiency}`)
    }
    let ratio = 1
    // 確信バフ
    if (this.muscleMemory > 0 && progressEfficiency > 0) {
      ratio += 1
      this.muscleMemory = 0
    }
    if (this.veneration > 0) {
      ratio += 0.5
    }
    return Math.floor(value * ratio)
  }

  _getQualityValue(qualityEfficiency) {
    const map = QUALITY_VALUE_MAP[this.status.control]
    if (map === undefined) {
      throw new Error(`Invalid control: ${this.status.control}`)
    }
    const value = map[qualityEfficiency]
    if (value === undefined) {
      throw new Error(`Invalid qualityEfficiency: ${qualityEfficiency}`)
    }

    let ratio = 1
    // グレートストライド
    if (this.greatStrides > 0 && qualityEfficiency > 0) {
      ratio += 1
      this.greatStrides = 0
    }
    // イノベーション
    if (this.innovation > 0) {
      ratio += 0.5
    }
    // 高品質
    let goodRatio = 1
    if (this.getCondition() === 'good') {
      goodRatio = 1.75
    }
    // インナークワイエットは乗算
    return Math.floor(value * ratio * (1 + 0.1 * this.inner) * goodRatio)
  }

  // https://github.com/daemitus/SomethingNeedDoing/blob/master/SomethingNeedDoing/Misc/ICommandInterface.cs
  getCondition() {
    return this.conditions[this.turnIndex]
  }
  hasCondition(condition) {
    return this.getCondition() === condition
  }
  getProgress() {
    return this.progress
  }
  getMaxProgress() {
    return this.recipe.progress
  }
  hasMaxProgress() {
    return this.progress >= this.recipe.progress
  }
  getQuality() {
    return this.quality
  }
  getMaxQuality() {
    return this.recipe.quality
  }
  hasMaxQuality() {
    return this.quality >= this.recipe.quality
  }
  getDurability() {
    return this.durability
  }
  getMaxDurability() {
    return this.recipe.durability
  }
  getCp() {
    return this.cp
  }
  getMaxCp() {
    return this.status.cp
  }
}
