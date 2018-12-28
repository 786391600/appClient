const App = getApp()
Component({

  behaviors: [],

  properties: {
    title: {type: String},
    isBack: {type: Boolean}
  },
  data: {
   
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      this.setData({
        navH: App.globalData.navHeight
      })
    },
    moved() { },
    detached() { },
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  ready() { },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() { },
    hide() { },
    resize() { },
  },
  methods: {
    navBack () {
      wx.navigateBack({
        
      })
    }
  }

})