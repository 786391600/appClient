//index.js
const app = getApp()
const until = require('../../until/index.js')
Page({
  data: {
    
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
  }
})
