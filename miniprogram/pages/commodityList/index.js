//index.js
const app = getApp()
const until = require('../../until/index.js')
Page({
  data: {
    listData:[],
    navHeight: '150rpx'
  },
  onLoad: function() {
    var that = this;
    that.setData({navHeight: app.globalData.navHeight})
    this.getCommodityList()
  },
  getCommodityList: function(){
    var that = this;
    until.request({
      action: 'app.commodity.getCommodityList',
      data: {}
    }).then(function (e) {
      console.log(e.data.data)
      that.setData({listData: e.data.data})
    })
  },
  commodityDetails: function(e){
    var data = e.currentTarget.dataset.details;
    wx.navigateTo({
      url: "/pages/commodity/index?clickId="+data.id
    })
  }
})
