const until = require('../../../until/index.js')
Component({
  properties: {
    labelList: {
      value: [],
      type: Array
    },
    showTip: {
      value: false,
      type: Boolean
    },
    config: {
      value: null,
      type: Object,
      observer(value){
        if (Object.keys(value).length > 0) {
          let arr = []
          for(let key in value) {
            for (let i = 0; i < value[key].length; i++) {
              let obj = value[key][i];
              obj.setType = key;
              obj.setIndex = i;
              arr.push(obj);
            }
          }
          this.setData({
            configList: arr
          })
        }
      }
    },
    setIndex: {
      value: null,
      type: Number
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: -1,
    configList: []
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      
    },
    moved: function () { },
    detached: function () { }
  },
  observers: {
    'labelList': function() {
      if (this.data.labelList && this.data.labelList.length > 0) {
        if (this.data.labelList.length === 1) {
          this.setData({
            activeIndex: 0
          })
        } else {
          if (this.data.setIndex !== -1) {
            this.setData({
              activeIndex: this.data.setIndex
            })
          } else {
            return false;
          }
        }
        let spec = this.data.labelList[this.data.activeIndex].spec || [];
          for(let i = 0; i<spec.length; i++) {
            spec[i].index = 0
          }
          // 业务功能设置
          let labelConfig = this.data.labelList[this.data.activeIndex].funConfig || {
            content: true,
            address: true,
            placeholder: ''
          }
          // 业务名称
          let labelName = this.data.labelList[this.data.activeIndex].label
          // 业务费用
          let labelFee = this.data.labelList[this.data.activeIndex].price
          // 分成方案
          let payOffConfig = this.data.labelList[this.data.activeIndex].payOffConfig || {
            per: 0,
            money: 0
          }
          this.setTitle(labelName);
          wx.nextTick(() => {
            this.triggerEvent('select', {spec: spec, labelFee: labelFee, payOffConfig: payOffConfig, labelName: labelName, labelConfig: labelConfig})
          })
      }
    },
    'activeIndex': function(index) {
      let labelName = this.data.labelList[index].label
      this.setTitle(labelName);
    }
  },
  methods: {
    labelClick (e) {
      let labelIndex = e.currentTarget.dataset.index;
      this.setData({
        activeIndex: labelIndex
      })
      let spec = this.data.labelList[labelIndex].spec || [];
      for(let i = 0; i<spec.length; i++) {
        spec[i].index = 0
      }

      // 业务功能设置
      let labelConfig = this.data.labelList[this.data.activeIndex].funConfig || {
        content: true,
        address: true,
        placeholder: ''
      }
      // 业务名称
      let labelName = this.data.labelList[this.data.activeIndex].label
      // 业务费用
      let labelFee = this.data.labelList[this.data.activeIndex].price
      // 分成方案
      let payOffConfig = this.data.labelList[this.data.activeIndex].payOffConfig || {
        per: 0,
        money: 0
      }
      this.triggerEvent('select', {spec: spec, labelFee: labelFee, payOffConfig: payOffConfig, labelName: labelName, labelConfig: labelConfig})
    },
    indexLabelClick (e) {
      const taskType = e.currentTarget.dataset.tasktype
      const labelIndex = e.currentTarget.dataset.labelindex;
      wx.navigateTo({
        url: '/pages/work/workForm/index?type=' + taskType + '&businessIndex=' + labelIndex
      })
    },
    setTitle (title) {
      wx.setNavigationBarTitle({
        title: title || '么么校园' 
      })
    }
  }
})
