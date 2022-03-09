//app.js
const until = require('./until/index.js')
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
    // wx.getSystemInfo({
      //   success: function (res) {
      //     let clientHeight = res.windowHeight;
      //     let clientWidth = res.windowWidth;
      //     let changeHeight = 750 / clientWidth;
      //     let height = clientHeight * changeHeight;
      //     that.setData({
      //       height: height
      //     });
      // }})
    wx.getSystemInfo({
      success: res => {
        //导航高度
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth
        let changeWidth = 750 / clientWidth

        this.globalData.windowWidth = clientWidth;
        this.globalData.windowHeight = clientHeight;
        this.globalData.changeWidth = changeWidth;
        this.globalData.navHeight = res.statusBarHeight + 46;
        console.log('当前高度' + res.windowHeight / changeWidth + 'rpx')
        console.log('设备信息：', res)
      }, fail(err) {
        console.log(err);
      }
    })
    if (!this.globalData.systeminfo) {
      this.globalData = wx.getSystemInfoSync();
    }
  },
  onShow (options) {
    if (options.scene === 1035 && options.query.type && options.query.type === 'middleSchool') {
      this.globalData.type = 'middleSchool'
    }
  },
  getUserInfo (callback, isRequest) {
    let userStorage = wx.getStorageSync('userInfo');
    if (userStorage && !isRequest) {
      callback(userStorage)
    } else {
      let that = this;
      until.request({
        action: 'app.crowd.getUserInfo',
        data: {}
      }).then(function (e) {
        if (e.data.success) {
          let userData = e.data.data ? e.data.data : 'null';
          wx.setStorageSync('userInfo', userData);
          callback(userData);
        }
      })
    }
  },
  setUserInfoByKey (key, value) {
    let userStorage = wx.getStorageSync('userInfo');
    let setInfo = {}
    if (userStorage && userStorage !== 'null') {
      setInfo = userStorage;
    }
    setInfo[key] = value; 
    wx.setStorageSync('userInfo', setInfo);
  }
})
