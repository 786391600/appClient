let app = getApp()
const until = require('../../../until/index.js')
const globleData = require('../globleData.js')
const workGlobelData = require('../globleData.js')
Page({
  data: {
    tablist: [
      '不吃辣',
      '少放辣',
      '多放辣',
      '不吃蒜',
      '不吃香菜',
      '不吃葱'
    ],
    subText: ''
  },
  setTab(e) {
    let text = e.currentTarget.dataset.text;
    console.log(text)
    let setText = '';
    if (this.data.subText) {
      setText = this.data.subText + ',' + text;
    } else {
      setText = text;
    }
    this.setData({
      subText: setText
    })
  },
  textBlur(e) {
    console.log(e);
    let text = e.detail.value;
    this.data.subText = text;
  },
  bindFormSubmit () {
    console.log(this.data.subText)
    let text = this.data.subText;
    this.setPrevData(
      {
        remarks: text
      }
    )
    wx.navigateBack({})
  },
  setPrevData (obj, isDelete) {
    let pages = getCurrentPages(); //获取当前页面pages里的所有信息。
    let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData(obj)
  },
  onLoad(options) {
    if (options.remarks) {
      this.setData({
        subText: options.remarks
      })
    }
  }
})
