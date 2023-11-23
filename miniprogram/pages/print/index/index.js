// pages/print/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: 'http://mmbiz.qpic.cn/mmbiz_png/5XHic5LQPCDg9HwefRqhncnyzSAjZrnwLUoRXxfzc09ic8AxicD9DOxh49jMPFsBI93ib95oCHcwFd9VhSBuJ41cCw/0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getWxFile () {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['pdf', 'docx', 'ppt'],
      success: res => {
        let tempFile = res.tempFiles[0]
        console.log(tempFile, 'kkkkkkkkkkk')
        wx.navigateTo({
          url: '../fileUpload/fileUpload',
          success: res => {
            res.eventChannel.emit('accData', {
              data: tempFile
            })
          }
        })
        this.setData({
          modalName: null
        })
      }
    })
  },
  see () {
    console.log('ssssssssssssss', this.data.imageSrc)
    let that = this;
    wx.previewImage({
      current: that.data.imageSrc,
      urls: [that.data.imageSrc]
    })
  }
})