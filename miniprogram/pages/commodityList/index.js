//index.js
const app = getApp()
const until = require('../../until/index.js')
Page({
  data: {
    listData:[]
  },
  onLoad: function() {
    var that = this;
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
  }
})
