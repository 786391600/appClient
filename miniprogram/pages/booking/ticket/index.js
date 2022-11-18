// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
Component({
  properties: {
    searchData: {
      type: Object,
      observer: function (newObj, oldObj) {
        this.getTicketInfo(newObj)
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    startAddress: '请选择',
    endAddress: '请选择',
    HistoricalRecord: [],
    RecommendedRoute: [],
    type: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTicketInfo(options)
    this.getHistorical()
    if (app.globalData.type && app.globalData.type === 'middleSchool') {
      wx.setNavigationBarTitle({
        title: '中学版'
      })
      this.setData({type: 'middleSchool'})
    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.getHistorical()
    },
    moved: function () { },
    detached: function () { },
  },
  methods: {
    /** 
  * 获取历史记录数据
 */
    getHistorical: function () {
      const value = wx.getStorageSync('Historical')
      if (value) {
        this.setData({
          HistoricalRecord: value
        })
      } else {
        wx.setStorageSync('Historical', [])
      }
    },
    //历史查询
    HistoricalQuery: function (e) {
      console.log(e.currentTarget.dataset)
      wx.requestSubscribeMessage({
        tmplIds: ['sRP9Y3eQiha6Vp9Ix2lhvDRppUMFyw6IO0A7xZuUJSg'],
        success(res) {}
      })
      wx.navigateTo({
        url: '../calendar/index?star=' + e.currentTarget.dataset.star + '&end=' + e.currentTarget.dataset.end
      })
    },
    /**
   * 变换地址
   */
    exchangeAddress: function () {
      let b;
      let a = this.data.startAddress;
      let c = this.data.endAddress;
      if (a && c) {
        b = a
        a = c
        c = b
        this.setData({ startAddress: a, endAddress: c })
        this.getLineManage({ start: a })
      } else {
        return
      }
    },
    /** 
     * 获取首页数据
    */
    getTicketInfo: function (options) {
      console.log(options, 'ooooooooooooooooiiiiiiii')
      // if (options.newIdena == "star") {
      //   this.setData({ startAddress: options.data, endAddress: options.data3 })
      // } else if (options.newIdena == "end") {
      //   this.setData({ startAddress: options.data2, endAddress: options.data })
      // }
      let addressObj = {}
      if (options.data) {
        addressObj.startAddress = options.data
      }
      if (options.data2) {
        addressObj.endAddress = options.data2
      }
      this.setData(addressObj)
    },
    //下拉刷新
    onPullDownRefresh: function () {
      var that = this;
      wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画。
      this.changetime();
      this.data.activityPage.page1 = 1;
      this.setActivityList({ page: 1, type: 'down' });
    },
    // 查询
    serch: function () {
      const value = wx.getStorageSync('Historical')
      console.log(value)
      if (this.data.startAddress == "请选择" || this.data.endAddress == "请选择") {
        wx.showModal({
          title: '提示',
          content: '请选择起止点',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定', res)
            }
          }
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: ['sRP9Y3eQiha6Vp9Ix2lhvDRppUMFyw6IO0A7xZuUJSg'],
          success(res) {
            console.log('iiiiiiiiiiii')
          }
        })
        if (this.checkAdult(value) == false) {
          value.unshift({ star: this.data.startAddress, end: this.data.endAddress })
          if (value.length > 4) {
            value.pop()
          }
          wx.setStorageSync('Historical', value)
          this.setData({
            HistoricalRecord: value
          })
        }
        wx.navigateTo({
          url: '../calendar/index?star=' + this.data.startAddress + '&end=' + this.data.endAddress
        })
      }
    },
    //查重
    checkAdult: function (data) {
      return data.star === this.data.startAddress && data.end === this.data.endAddress
    },
    //删除历史记录
    DelHistory: function () {
      wx.setStorageSync('Historical', [])
      this.setData({
        HistoricalRecord: []
      })
    },
    //选择起止点
    GoStar: function (e) {
      wx.navigateTo({
        url: '../selectCity/index?newIdena=' + e.currentTarget.dataset.address + '&star=' + this.data.startAddress + '&end=' + this.data.endAddress + '&type=' + this.data.type
      })
    },
    getLineManage: function (query) {
      let that = this
      return new Promise((resolve, reject) => {
        until.request({
          action: 'app.line.getLineManage',
          data: query
        }).then(function (e) {
          if (e.data.success) {
            resolve(e)
            console.log(e.data.data)
            let getdata = e.data.data
            that.setData({
              RecommendedRoute: getdata
            })
          } else {
            until.showToast(e.data.message, 'error');
          }
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getLineManage({start: this.data.startAddress, departureTime:{$regex:"2019-06"}})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})