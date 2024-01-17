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
    progressEfficiency: 180,
    qualityEfficiency: 0,
    durability: 5,
    cp: 18,
  },
  注視作業: {
    progressEfficiency: 200,
    qualityEfficiency: 0,
    durability: 10,
    cp: 5,
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
  注視加工: {
    progressEfficiency: 0,
    qualityEfficiency: 150,
    durability: 10,
    cp: 18,
    inner: 1,
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
  ヘイスティタッチ: {
    progressEfficiency: 0,
    qualityEfficiency: 100,
    durability: 10,
    cp: 0,
    inner: 1,
    probability: 0.6, // 成功確率
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
  経過観察: {
    progressEfficiency: 0,
    qualityEfficiency: 0,
    durability: 0,
    cp: 7,
  },
  マスターズメンド: {
    progressEfficiency: 0,
    qualityEfficiency: 0,
    durability: 0,
    cp: 88,
  }
}

// 5段階目
const CONDITIONS_5 = [
  'normal', // 通常
  'good', // 高品質
  'pliant', // 高能率
  'centered', // 安定
  'sturdy', // 頑丈
  'good omen', // 良兆候
]
// 6段階目
const CONDITIONS_6 = [
  'normal', // 通常
  'good', // 高品質
  'pliant', // 高能率
  'sturdy', // 頑丈
  'malleable', // 高進捗
  'primed', // 長持続
  'good omen', // 良兆候
]
const CONDITION_MAP = {
  normal: '通常',
  good: '高品質',
  pliant: '高能率',
  centered: '安定',
  sturdy: '頑丈',
  'good omen': '良兆候',
  malleable: '高進捗',
  primed: '長持続',
}

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
      if (recipe.expertType === 5) {
        this.conditions = this._createSplendorous5Conditions()
      } else if (recipe.expertType === 6) {
        this.conditions = this._createSplendorous6Conditions()
      } else {
        // 通常レシピ
        this.conditions = [] // TODO: 通常レシピの状態配列を生成する
      }
    }
    this.turnIndex = 0
    this.history = []
  }

  // 5段階目の状態配列を生成
  _createSplendorous5Conditions() {
    const conditions = ['normal']
    while (conditions.length < 100) {
      // 通常が50%, 高品質5%, 良兆候5%, 安定・頑丈・高能率残り
      // 参考: https://jp.finalfantasyxiv.com/lodestone/character/5483630/blog/4382417/
      let next
      const r = Math.random()
      if (r < 0.5) {
        next = 'normal'
      } else if (r >= 0.95) {
        next = 'good'
      } else if (r >= 0.9) {
        next = 'good omen'
      } else {
        next = CONDITIONS_5[Math.floor(Math.random() * 3) + 2]
      }
      // 高品質は連続しない
      if (next === 'good' && conditions[conditions.length - 1] === 'good') {
        continue
      }
      conditions.push(next)
      // 良兆候の次は高品質
      if (next === 'good omen') {
        conditions.push('good')
      }
    }
    return conditions
  }

  // 6段階目の状態配列を生成
  // 高進捗と長持続が追加され、安定は発生しなくなる
  _createSplendorous6Conditions() {
    const conditions = ['normal']
    while (conditions.length < 100) {
      // 通常が50%, 高品質5%, 良兆候5%, 頑丈・高能率・高進捗・長持続残り
      // 参考: https://jp.finalfantasyxiv.com/lodestone/character/5483630/blog/4382417/
      let next
      const r = Math.random()
      if (r < 0.5) {
        next = 'normal'
      } else if (r >= 0.95) {
        next = 'good'
      } else if (r >= 0.9) {
        next = 'good omen'
      } else {
        next = CONDITIONS_6[Math.floor(Math.random() * 4) + 2]
      }
      // 高品質は連続しない
      if (next === 'good' && conditions[conditions.length - 1] === 'good') {
        continue
      }
      conditions.push(next)
      // 良兆候の次は高品質
      if (next === 'good omen') {
        conditions.push('good')
      }
    }
    return conditions
  }

  ac(action) {
    const a = ACTIONS[action]
    if (!a) {
      throw new Error(`${action} is not defined in ACTIONS.`)
    }

    let doAction = this.cp >= a.cp
    if (!doAction) {
      console.log('CP不足: ' + action)
    }
    // 集中作業・集中加工・秘訣は高品質時のみ利用可能
    if (
      ['集中作業', '集中加工', '秘訣'].includes(action) &&
      !this.hasRawCondition('good')
    ) {
      doAction = false
    }
    // 倹約加工・倹約作業は倹約効果中は利用不可
    if (['倹約加工', '倹約作業'].includes(action) && this.wasteNot > 0) {
      doAction = false
    }
    // 注視加工・注視作業は経過観察の後でしか利用できない
    if (['注視加工', '注視作業'].includes(action) && this.lastAction !== '経過観察') {
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
    this.history.push(action)

    let success = true
    if (a.probability) {
      success = Math.random() < a.probability
    }

    // 加工や作業
    let pe = a.progressEfficiency
    if (this.hasRawCondition('malleable')) {
      // 高進捗は1.5倍
      pe = Math.floor(pe * 1.5)
    }
    this.progress += this._getProgressValue(pe)
    let qe = a.qualityEfficiency
    if (action === 'ビエルゴの祝福') {
      qe += this.inner * 20
    }
    this.quality += success ? this._getQualityValue(qe) : 0
    let du = a.durability
    if (this.wasteNot > 0) {
      du /= 2
    }
    if (this.hasRawCondition('sturdy')) {
      du /= 2
    }
    this.durability -= Math.ceil(du)
    if (a.inner) {
      this.inner += success ? a.inner : 0
      if (this.inner > 10) {
        this.inner = 10
      }
    }
    // 効能率なら半減
    this.cp -= this.hasRawCondition('pliant') ? Math.ceil(a.cp / 2) : a.cp
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
        // console.log('マニピュレーションが無駄になった', action)
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
    if (action === 'マスターズメンド') {
      this.durability += 30
      if (this.durability > this.recipe.durability) {
      this.durability = this.recipe.durability
      }
    }

    // バフ追加
    if (action === 'マニピュレーション') {
      this.manipulation = this.hasRawCondition('primed') ? 10 : 8
    } else if (action === '確信') {
      this.muscleMemory = this.hasRawCondition('primed') ? 7 : 5
    } else if (action === 'ヴェネレーション') {
      this.veneration = this.hasRawCondition('primed') ? 6 : 4
    } else if (action === 'イノベーション') {
      this.innovation = this.hasRawCondition('primed') ? 6 : 4
    } else if (action === 'グレートストライド') {
      this.greatStrides = this.hasRawCondition('primed') ? 5 : 3
    } else if (action === '倹約') {
      this.wasteNot = this.hasRawCondition('primed') ? 6 : 4
    } else if (action === '長期倹約') {
      this.wasteNot = this.hasRawCondition('primed') ? 10 : 8
    }
    this.turnIndex += 1

    return {
      finish: this.hasMaxProgress() || this.durability <= 0,
      complete: this.hasMaxProgress(),
    }
  }

  // ステータスと効率から実際に上昇する量を返す
  _getProgressValue(progressEfficiency) {
    const value = this._calcProgress(progressEfficiency)
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

  _calcProgress(e) {
    // TODO: レシピ難易度に合わせる
    //       現在は★ 2以上のレシピ用の係数
    return Math.floor((Math.floor(this.status.craftmanship / 18 + 2) * e) / 100)
  }

  _getQualityValue(qualityEfficiency) {
    const value = this._calcQuality(qualityEfficiency)

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
    if (this.getRawCondition() === 'good') {
      goodRatio = 1.75
    }
    // インナークワイエットは乗算
    return Math.floor(value * ratio * (1 + 0.1 * this.inner) * goodRatio)
  }

  _calcQuality(e) {
    // TODO: レシピ難易度に合わせる
    //       現在は★ 2以上のレシピ用の係数
    return Math.floor((Math.floor(this.status.control / 18 + 35) * e) / 100)
  }

  getRawCondition() {
    return this.conditions[this.turnIndex]
  }
  hasRawCondition(condition) {
    return this.getRawCondition() === condition
  }
  // https://github.com/daemitus/SomethingNeedDoing/blob/master/SomethingNeedDoing/Misc/ICommandInterface.cs
  getCondition() {
    return CONDITION_MAP[this.conditions[this.turnIndex]]
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
