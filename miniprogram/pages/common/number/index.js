const app = getApp()
Component({
  properties: {
    value: {
      type: Number,
      value: 1
    },
    unit: {
      type: String,
      value: '个'
    },
    config: {
      type: Object,
      value: {}
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
     
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      
    },
    moved: function () { },
    detached: function () { },
  },
  methods: {
    reduce () {
      let num = this.data.value - 1;
      if (!this.validate(num)) {
        return false;
      }
      this.triggerValue(num);
    },
    add () {
      let num = this.data.value + 1;
      console.log(this.validate(num));
      if (!this.validate(num)) {
        return false;
      }
      console.log(this, '===')
      this.triggerValue(num);
    },
    numberchange (e) {
      let num = Number(e.detail.value);
      if (this.validate(num)) {
        this.triggerValue(num);
      } else {
        this.triggerValue(this.data.value);
      }
    },
    validate (num) {
      let config = this.data.config;
      let unit = this.data.unit;
      if (config.hasOwnProperty('min')) {
        if (num < config['min']) {
          wx.showToast({
            title: '最少选' + config['min'] + unit,
            duration: 2000,
            icon: 'none'
          })
          return false
        }
      }
      if (config.hasOwnProperty('max')) {
        if (num > config['max']) {
          wx.showToast({
            title: '最多选' + config['max'] + unit,
            duration: 2000,
            icon: 'none'
          })
          return false
        }
      }
      return true
    },
    triggerValue (num) {
      let config = this.data.config;
      // reverse
      let returnObj = {per: 100, money: 0};
      if (config.ladder && config.ladder.length > 0){
        let ladder = config.ladder.reverse();
        for (let i = 0; i < ladder.length; i++) {
          if (num >= ladder[i].value) {
            returnObj = {
              per: ladder[i].pre,
              money: ladder[i].money
            }
            break;
          }
        }
      }
      this.triggerEvent('change', {value: num, computed: returnObj});
    }
  }
})
