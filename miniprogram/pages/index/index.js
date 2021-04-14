//index.js
const app = getApp()
const until = require('../../until/index.js')
Page({
  data: {
    showJob: false
  },
  toTicket () {
    wx.reLaunch({
      url: '/pages/booking/index/index'
    })
  },
  toJob () {
    wx.reLaunch({
      url: '/pages/job/index/index'
    })
  },
  toWork () {
    wx.reLaunch({
      url: '/pages/work/index/index'
    })
  },
  imageLoad (ev) {
    this.setData({showImage: true})
  },
  showJob (isShow) {
    this.setData({showJob: isShow})
  }
})
