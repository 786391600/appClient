//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.windowWidth = res.windowWidth;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.navHeight = res.statusBarHeight + 46;
        console.log('设备信息：', res)
      }, fail(err) {
        console.log(err);
      }
    })
  },
  onShow (options) {
    if (options.scene === 1035 && options.query.type && options.query.type === 'middleSchool') {
      this.globalData.type = 'middleSchool'
    }
  }
})
