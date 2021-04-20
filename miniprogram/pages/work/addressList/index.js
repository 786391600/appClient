let app = getApp()
const until = require('../../../until/index.js')
const globleData = require('../globleData.js')
const workGlobelData = require('../globleData.js')
Page({
  data: {
    addressList: []
  },
  onLoad () {
     this.setData({
       addressList: globleData.getAdressList()
     })
  },
  toEditOrAdd (e) {
    const target = e.currentTarget.dataset
    let params = ''
    if (target.hasOwnProperty('index')) {
      params = '?index=' + target.index
    } 
    console.log('/pages/work/addressAdd/index'+ params)
    wx.navigateTo({
      url: '/pages/work/addressAdd/index'+ params
    })
  },
  selectAddress (e) {
    let currentAddress = e.currentTarget.dataset.address
    let pages = getCurrentPages(); //获取当前页面pages里的所有信息。
    let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    let form = prevPage.data.form
    form.address = currentAddress
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      form: form
    })
    wx.navigateBack({
      delta: 0
    })
  }
})
