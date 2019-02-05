const App = getApp()
const until = require('../../../until/index.js')
Component({

  behaviors: [],

  properties: {
   
  },
  data: {
    windowHeight: ''
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      var windowHeight = App.globalData.windowHeight;
      this.setData({windowHeight: windowHeight})
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
    bindGetUserInfo (e) {
      var that = this;
      if (e.detail.userInfo){
        until.setUserInfo({userInfo: e.detail.userInfo}).then((obj)=>{
          that.triggerEvent('setInfoSuccess', e.detail.userInfo)
        })
      }
    }
  }
})