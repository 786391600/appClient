// pages/upload_file/upload_file.js
// const {
//   default: api
// } = require("../../api/api");
const app = getApp();
const until = require('../../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileName: undefined,
    filePath: undefined,
    processNum: undefined,
    color: '0', // 黑白彩色
    paperFormat: 'A4',
    direction: '1',
    singleSide: '0',
    num: '1', // 打印份数
    remarks: '',
    fileHistory: [],
    fileTypeIcon: {
      pdf: 'http://mmbiz.qpic.cn/mmbiz_png/5XHic5LQPCDjj5QAmwoIUvJz6vxCZhNkGHda3TaG93jPeEomvkoqzP7UWI3SKhZfMsPXuEWo0nyia1wu6icPicmNZw/0',
      docx: 'http://mmbiz.qpic.cn/mmbiz_png/5XHic5LQPCDjj5QAmwoIUvJz6vxCZhNkGZNvzb2kZ7neBxHALdJTZU4cWgX7masDHcmnrwoXtibgtE9HaRMTscyw/0',
      pptx: 'http://mmbiz.qpic.cn/mmbiz_png/5XHic5LQPCDjj5QAmwoIUvJz6vxCZhNkGdN0tAA14bFcor0FyYfUiar1xyfaLCuC1nKkjaF6DdNicT9JZKOAP4OibQ/0'
    },
    fileType: 'pdf'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('accData', data => {
      let fileType = data.data.name.split('.')[data.data.name.split('.').length - 1]
      this.setData({
        fileName: data.data.name,
        fileType: fileType
      })
      this.data.fileName = data.data.name
      this.data.filePath = data.data.path
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.Progress()
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  // 自定义函数
  preview() {
    let that = this
    let filePath = this.data.filePath
    let index = filePath.lastIndexOf(".")
    let ext = filePath.substr(index + 1)
    if (this.isAssetTypeAnImage(ext) == true) {
      wx.previewImage({
        urls: [filePath],
        current: filePath
      })
    } else {
      wx.openDocument({
        filePath: that.data.filePath,
        success: res => {
          console.log(res)
        }
      })
    }
  },
  // 颜色
  isColor(event) {
    this.data.color = event.detail.value
    console.log(this.data.color)
  },
  // 纸张大小
  isPaperFormat(event) {
    this.data.paperFormat = event.detail.value
  },
  // 横纵
  isDirection(event) {
    this.data.direction = event.detail.value
  },
  // 单双
  isSingleSide(event) {
    this.data.singleSide = event.detail.value
  },
  // 打印份数
  onNum(event) {
    this.data.num = event.detail.value
  },
  // 备注
  onRemarks(event) {
    this.data.color = event.detail.value
  },
  textareaAInput(event) {
    this.data.remarks = event.detail.value
  },
  againPrint() {

  },
  // 上传
  upload(e) {
    let that = this
    that.setData({
      modalName: e.currentTarget.dataset.target
    })
    that.data.processNum = 0
    wx.showLoading({
      title: '文件上传中...',
    })
    until.printUpload({
      previewPath: that.data.filePath,
      printerid: 1,
      color: parseInt(that.data.color),
      paperFormat: that.data.paperFormat,
      fileName: that.data.fileName,
      direction: parseInt(that.data.direction),
      singleSide: parseInt(that.data.singleSide),
      num: parseInt(that.data.num),
      remarks: that.data.remarks
    }).then(()=>{
      wx.hideLoading()
    }).catch(()=>{
      wx.hideLoading()
    })
    // api.IUploadFile(that.data.filePath, {
    //   printerid: 1,
    //   color: parseInt(that.data.color),
    //   paperFormat: that.data.paperFormat,
    //   fileName: that.data.fileName,
    //   direction: parseInt(that.data.direction),
    //   singleSide: parseInt(that.data.singleSide),
    //   num: parseInt(that.data.num),
    //   remarks: that.data.remarks
    // }).then(res => {
    //   setTimeout(function () {
    //     that.setData({
    //       processNum: 100
    //     })
    //   }, 1000)
    //   wx.redirectTo({
    //     url: '/pages/fileHistory/fileHistory',
    //   })
    // }).catch(function (error) {
    //   console.log(error)
    // });
  },

  // 判断图片
  isAssetTypeAnImage(ext) {
    return [
      'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg',
    ].indexOf(ext.toLowerCase()) !== -1;
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  close () {
    wx.redirectTo({
      url: '/pages/print/index/index',
    })
  }
})