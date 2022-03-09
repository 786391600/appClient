Component({
  properties: {
    tabs: {
      value: [],
      type: Array
    },
    activeIndex: {
      value: 0,
      type: Number
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
    tabClick: function(e) {
      this.setData({
        activeIndex: e.currentTarget.id
      });
      this.triggerEvent('change', {activeIndex: e.currentTarget.id})
    }
  }
})
