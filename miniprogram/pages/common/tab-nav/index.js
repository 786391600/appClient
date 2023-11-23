Component({
  properties: {
    tabs: {
      value: [],
      type: Array
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0
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
        activeIndex: e.currentTarget.dataset.index
      });
      this.triggerEvent('change', {id: e.currentTarget.dataset.item.id})
    },
    refresh () {
      this.setData({
        activeIndex: 0
      })
    }
  }
})
