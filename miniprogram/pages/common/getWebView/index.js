// pages/Testpage/ActivityOne/index.js
const app = getApp()
const until = require('../../../until/index.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: 'https://vw.usdoc.cn/?m=5&src=http://usdoc.cn/vw/%E6%96%87%E4%BB%B6%E6%A8%A1%E6%9D%BF.docx'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   if (options.url) {
     console.log(options.url, 'options.url')
     let url = decodeURIComponent(options.url)
     this.setData({url: url})
   }
  },
  getSetting (e) {
    let that = this;
    wx.getSetting({
      success(res){
        if (res.authSetting['scope.writePhotosAlbum']){
          that.downloadImage()
        } else {
          that.setData({userAuth: true});
        }
      }
    })
  },
  handleSetting (e) {
    let that = this;
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      return;
    } else {
      that.setData({
        userAuth: false
      })
      that.downloadImage()
    }
  }
})