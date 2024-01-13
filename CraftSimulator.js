const ACTIONS = {
  '作業': {
    progressEfficiency: 120,
    qualityEfficiency: 0,
    durability: 10,
    cp: 0,
  },
  '確信': {
    progressEfficiency: 300,
    qualityEfficiency: 0,
    durability: 10,
    cp: 6,
  },
  '模範作業': {
    progressEfficiency: 180,
    qualityEfficiency: 0,
    durability: 10,
    cp: 7,
  },
  '下地作業': {
    progressEfficiency: 300,
    qualityEfficiency: 0,
    durability: 20,
    cp: 18,
  },
  '集中作業': {
    progressEfficiency: 400,
    qualityEfficiency: 0,
    durability: 10,
    cp: 6,
  },
  '精密作業': {
    progressEfficiency: 100,
    qualityEfficiency: 100,
    durability: 10,
    cp: 6,
    inner: 1,
  },
  '倹約作業': {
    progressEfficiency: 180,
    qualityEfficiency: 0,
    durability: 5,
    cp: 18,
  },
  '加工': {
    progressEfficiency: 0,
    qualityEfficiency: 100,
    durability: 10,
    cp: 18,
    inner: 1,
  },
  '中級加工': {
    progressEfficiency: 0,
    qualityEfficiency: 125,
    durability: 10,
    cp: 18, // 加工からのコンボ前提
    inner: 1,
  },
  '上級加工': {
    progressEfficiency: 0,
    qualityEfficiency: 150,
    durability: 10,
    cp: 18, // 中級加工からのコンボ前提
    inner: 1,
  },
  '倹約加工': {
    progressEfficiency: 0,
    qualityEfficiency: 100,
    durability: 5,
    cp: 25,
    inner: 1,
  },
  '集中加工': {
    progressEfficiency: 0,
    qualityEfficiency: 150,
    durability: 10,
    cp: 18,
    inner: 2,
  },
  '下地加工': {
    progressEfficiency: 0,
    qualityEfficiency: 200,
    durability: 20,
    cp: 40,
    inner: 2,
  },
}

// TODO: ステータスから計算して算出したい
const PROGRESS_VALUE_MAP = {
  '4027': {
    '0': 0,
    '100': 225,
    '120': 270,
    '180': 405,
    '200': 450,
    '300': 675,
    '360': 810,
    '500': 1125,
  },
  '4047': {
    '0': 0,
    '100': 226,
    '120': 271,
    '180': 406,
    '200': 452,
    '300': 678,
    '360': 813,
    '500': 1130,
  },
}
const QUALITY_VALUE_MAP = {
  '4056': {
    '0': 0,
    '100': 260,
    '125': 325,
    '150': 390,
    '200': 520,
  },
  '4076': {
    '0': 0,
    '100': 261,
    '125': 326,
    '150': 391,
    '200': 522,
  },
}

export default class CraftSimulator {
  constructor(recipe, status) {
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

    // この時点でランダムに状態を100ターン分くらい決めておく
  }

  ac(action) {
    const a = ACTIONS[action]
    if (!a) {
      throw new Error(`${action} is not defined in ACTIONS.`)
    }
    this.progress += this._getProgressValue(a.progressEfficiency)
    this.quality += this._getQualityValue(a.qualityEfficiency)
    this.durability -= a.durability
    if (a.inner) {
      this.inner += a.inner
      if (this.inner > 10) {
        this.inner = 10
      }
    }
    this.cp -= a.cp
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
    return value
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
    // インナークワイエット反映
    return Math.floor(value + value / 10 * this.inner)
  }

  // https://github.com/daemitus/SomethingNeedDoing/blob/master/SomethingNeedDoing/Misc/ICommandInterface.cs
  getCondition() {}
  hasCondition() {}
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
