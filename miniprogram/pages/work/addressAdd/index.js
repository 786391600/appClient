let app = getApp()
const until = require('../../../until/index.js')
const globleData = require('../globleData.js')
const workGlobelData = require('../globleData.js')
Page({
  data: {
    form: {
      schoolName: '',
      name: '',
      phone: '',
      address: ''
    },
    savedisabled: true,
    isAdd: true,
    upIndex: 0,
    schoolData: {},
    addressData: {}
  },
  onLoad (options) {
    if (options && options.hasOwnProperty('index')) {
      let addressList = workGlobelData.getAdressList()
      this.setData({
        isAdd: false
      })
      this.data.upIndex = parseInt(options.index)
      this.data.form = addressList[parseInt(options.index)]
    }
    this.initData()
  },
  bindKeyInput: function (e) {
    const key = e.target.dataset.key
    let setForm = this.data.form
    setForm[key] = e.detail.value
    this.setData({
      form: setForm
    })
    this.getSaveState()
  },
  getSaveState () {
    let that = this;
    let flag = false
    Object.keys(this.data.form).some((key) => {
      if (!that.data.form[key]) {
        flag = true
        return flag
      }
    })
    this.setData({
      savedisabled: flag
    })
  },
  saveClick () {
    if (this.data.savedisabled) {
      wx.showToast({
        title: '请核对信息',
        icon: 'none'
      })
      return
    }
    let addressList = globleData.getAdressList()
    if (this.data.isAdd) {
      if (addressList.length >= 5) {
        addressList.splice(0, 1)
      }
      addressList.push(this.data.form)
    } else {
      addressList[this.data.upIndex] = this.data.form
    }
    this.setAdressList({
      addressList: addressList
    })
    wx.navigateBack({})
  },
  initData() {
    const setForm = this.data.form
    if (!this.data.form.schoolName) {
      const schoolData = workGlobelData.schoolData
      setForm.schoolName = schoolData.name
    }
    this.setData({
      form: setForm
    })
  },
  deleteAddress() {
    let addressList = globleData.getAdressList()
    addressList.splice(this.data.upIndex, 1)
    this.setAdressList({
      addressList: addressList
    }, true)
    wx.navigateBack({})
  },
  setAdressList (obj, isDelete) {
    globleData.setAddressData(obj.addressList)
    let pages = getCurrentPages(); //获取当前页面pages里的所有信息。
    let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData(obj)
    if (isDelete) {
      pages[pages.length - 3].initAddress()
    }
  }
})
