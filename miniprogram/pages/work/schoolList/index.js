let app = getApp()
const until = require('../../../until/index.js')
const workGlobelData = require('../globleData.js')
Page({
  data: {
    schoolList: [],
    schoolData: {},
    isShowAuthBtn: false
  },
  onLoad: function (option) {
    console.log(app.globalData, '99999999999999');
    this.getSchoolList()
  },
  getSchoolList () {
    let that = this
    wx.showLoading({
      title: '学校获取中...',
    })
    this.getLocation().then((coordinate) => {
      if (!coordinate) {
        wx.hideLoading();
        that.setData({
          isShowAuthBtn: true
        })
        return;
      }
      until.request({
        action: 'app.crowd.getSchoolList',
        data: {
          coordinate: coordinate
        }
      }).then(function (e) {
        if (e.data.success) {
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
    return new Promise((resolve, reject)=>{
      // wx.getLocation({
      //   success: (res) => {
      //     resolve([res.longitude, res.latitude])
      //   },
      //   fail(res){
      //     console.log(res, '999999999999999999')
      //     resolve(false);
      //   }
      // })
      resolve(['100', '120'])
    })
  },
  selectSchool (item) {
    const currentData = item.target.dataset.current
    workGlobelData.currentSchool = currentData
    workGlobelData.schoolData = currentData
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
  },
  openSetting () {
    let that = this;
    wx.openSetting({
      withSubscriptions: true,
      success(res){
        console.log(res)
        if (res.authSetting['scope.userLocation']) {
          that.setData({
            isShowAuthBtn: false
          });
          that.getSchoolList();
        }
      }
    })
  }
})
