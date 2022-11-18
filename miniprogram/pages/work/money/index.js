let app = getApp()
const until = require('../../../until/index.js');
const globleData = require('../globleData.js');
const np = require('../../../until/number.js');
Page({
  data: {
    withdrawalAmount: 0,
    // 认证码弹框
    showQrModel: false,
    imgurl: ''
  },
  onLoad (options) {
    this.getUserAuth()
  },
  // withdrawalClick () {
  //   wx.showModal({
  //     title: '提现提示',
  //     content: '自动提现功能暂未开放，提现请联系负责人！',
  //     showCancel: false
  //   })
  // },
  withdrawalClick () {
    let fee = 0;
    if (!this.data.withdrawalAmount || this.data.withdrawalAmount < 1) {
      wx.showModal({
        title: '提示',
        content: '提现余额需大于1元!'
      })
      return
    } else {
      if (this.data.withdrawalAmount > 200) {
        fee = 200;
      } else {
        fee = this.data.withdrawalAmount
      }
    }
    let that = this;
    wx.showModal({
      title: '提现确认',
      confirmText: '申请提现',
      content: '当前申请提现金额为' + fee + '元',
      success (res) {
        if (res.confirm) {
          until.request({
            action: 'app.school.studentWithdrawalApplication',
            data: {
              spec: '学生提现',
              schoolId: that.data.schoolId,
              type: 'student',
              phone: that.data.phone,
              fee: fee
            }
          }).then(function (e) {
            let result = e.data;
            if (result.success) {
              let withdrawalAmount = np.minus(that.data.withdrawalAmount, fee);
              that.setData({
                withdrawalAmount: withdrawalAmount
              });
              wx.showModal({
                title: '提交成功',
                content: '审核通过后将提现到您的微信账户！'
              })
            } else {
              wx.showModal({
                title: '提交失败',
                content: result.message
              })
            }
          })
        }
      }
    })
  },
  getUserCapital () {
    let that = this;
    app.getUserInfo(function(e){
      let capital = e.capital || 0;
      that.setData({
        withdrawalAmount: capital
      })
    }, true)
  },
  getUserAuth () {
    let that = this;
    wx.showLoading({
      title: '任务获取中...',
    })
    until.request({
      action: 'app.crowd.getUserAuth',
      data: {}
    }).then(function (e) {
      let res = e.data;
      if (res.success) {
        let resData = e.data.data;
        if (resData && resData.account) {
          let fee = resData.hasOwnProperty('settlement') ? resData['settlement'] : 0;
          that.setData({
            withdrawalAmount: fee,
            phone: resData.phone,
            schoolId: resData.account
          })
        } else {
          that.setData({
            noAuth: true
          })
        }
      } else {
        that.setData({
          noAuth: true
        })
      }
      wx.hideLoading()
    })
  },
  getQrImage: function(options){ 
   let that = this
   if (that.data.imgurl) {
     that.setData({
       showQrModel: true
     })
     return
   }
   until.request({
      action: 'app.crowd.getRiderQrImage',
      data: {
        str: 'wangtao'
      }
    }).then(function (e) {
      let res = e.data;
      if (res.success) {
        that.setData({
          imgurl: res.data,
          showQrModel: true
        })
      } else {
        
      }
      wx.hideLoading()
    })
  },
  hideCover () {
    this.setData({
      showQrModel: false
    })
  }
})
