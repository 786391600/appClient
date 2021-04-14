let app = getApp()
const until = require('../../../until/index.js')
const workGlobelData = require('../globleData.js')
Page({
  data: {
    schoolList: [],
    schoolData: {}
  },
  onLoad: function (option) {
    this.getSchoolList()
  },
  getSchoolList () {
    let that = this
    wx.showLoading({
      title: '学校获取中...',
    })
    this.getLocation().then((coordinate) => {
      until.request({
        action: 'app.crowd.getSchoolList',
        data: {
          coordinate: coordinate
        }
      }).then(function (e) {
        if (e.data.success) {
          console.log(e.data.data)
          let getdata = e.data.data
          that.setData({
            schoolList: getdata
          })
          that.setCurrentSchool()
        } else {
          until.showToast(e.data.message, 'error');
        }
        wx.hideLoading()
      })
    })
  },
  getLocation() {
    return new Promise((resolve)=>{
      wx.getLocation({
        success: (res) => {
          console.log(res, 'res')
          resolve([res.longitude, res.latitude])
        }
      })
    })
  },
  selectSchool (item) {
    const currentData = item.target.dataset.current
    workGlobelData.currentSchool = currentData
    wx.setStorage({
      key: 'schoolData',
      data: workGlobelData.currentSchool
    })
    wx.navigateBack({
      url: '../index/index'
    })
  },
  setCurrentSchool() {
    if (!workGlobelData.currentSchool || !Object.keys(workGlobelData.currentSchool).length > 0) {
      if (this.data.schoolList && this.data.schoolList.length > 0) {
        workGlobelData.currentSchool = this.data.schoolList[0]
      }
    }
    wx.setStorage({
      key: 'schoolData',
      data: workGlobelData.currentSchool
    })
    this.setData({schoolData: workGlobelData.currentSchool})
  }
})
