const until = require('../../../../until/index.js')
const np = require('../../../../until/number.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth: {
      phone: '',
      showAuth: false
    },
    info: {},
    isCanCode: false,
    orderInfo: {},
    showWriteMode: false,
    phoneStr: '' // 尾号
  },
  onLoad (options) {
    // this.getBusinessInfo();
  },
  onShow () {
    this.getBusinessInfo();
  },
  getBusinessInfo () {
    // if (this.data.showWriteMode) {
    //   return
    // }
    // if (this.data.isCanCode) {
    //   return
    // }
    wx.showLoading({
      title: '信息获取中...',
    })
    let that = this;
    until.request({
      action: 'app.school.getDvideInfo',
      data: {}
    }).then(function (e) {
      let res = e.data;
      if (res.success) {
        that.setData({
          info: res.data
        })
      } else {
        that.setData({
          auth: {
            showAuth: true,
            phone: ''
          }
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    })
  },
  setPhone (e) {
    console.log(e.detail.value)
    this.data.auth.phone = e.detail.value;
  },
  authBusiness () {
    let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    let phone = this.data.auth.phone;
    if (phone && reg.test(phone)) {
      this.bindBusiness()
    } else {
      wx.showToast({
        title: '请输入正确手机号！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  bindBusiness () {
    let that = this;
    until.request({
      action: 'app.school.bindDvideByPhone',
      data: {
        phone: this.data.auth.phone
      }
    }).then(function (e) {
      let res = e.data;
      if (res.success) {
        that.setData({
          info: res.data,
          auth: {
            showAuth: false
          }
        })
        wx.showModal({
          title: '绑定成功',
          content: '【' + that.data.info.title + '】！'
        })
      } else {
        wx.showModal({
          title: '绑定提示',
          content: '手机号未录入，请联系平台进行录入！'
        })
      }
      wx.hideLoading();
    })
  },
  businessWithdrawal () {
    let info = this.data.info;
    let fee = 0;
    if (!info.settlement || info.settlement < 1) {
      wx.showModal({
        title: '提示',
        content: '提现余额需大于1元!'
      })
      return
    } else {
      if (info.settlement > 200) {
        fee = 200;
      } else {
        fee = info.settlement
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
            action: 'app.school.dvideWithdrawalApplication',
            data: {
              spec: info.title + '提现',
              schoolId: info.schoolId,
              type: 'dvide',
              phone: info.phone,
              fee: fee
            }
          }).then(function (e) {
            let result = e.data;
            if (result.success) {
              let setData = that.data.info;
              setData.settlement = np.minus(setData.settlement, fee);
              that.setData({
                info: setData
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
  toWithdrawal () {
    wx.navigateTo({
      url: '/pages/work/business/withdrawal/index'
    })
  },
  toSettlementlist () {
    let Id = this.data.info.id;
    if (!Id) {
      return
    }
    wx.navigateTo({
      url: '/pages/work/dvide/settlementlist/index?id=' + Id
    })
  },
  onPullDownRefresh () {
    this.getBusinessInfo();
  },
  writeOffOprate () {
    let that = this;
    console.log('开始扫码')
    wx.showLoading({
      title: '核验中',
      mask: true
    })
    that.data.isCanCode = true
    wx.scanCode({
      success (res) {
        console.log(res)
        let scanCode = res.result
        // let scanCode = '20220723160642619'
        that.getWriteOffVerificationInfo(scanCode)
      },
      complete () {
        console.log('扫码结束')
        that.data.isCanCode = false
        wx.hideLoading({})
      }
    })
  },
  getWriteOffVerificationInfo (writeOffNumber) {
    let that = this;
    until.request({
      action: 'app.school.getWriteOffVerificationInfo',
      data: {
        shopId: that.data.shop.id,
        writeOffNumber: writeOffNumber
      }
    }).then(function (e) {
      let result = e.data;
      that.data.isCanCode = false
      if (result.success) {
        wx.hideLoading()
        let resultData = result.data
        if (resultData) {
          if (resultData.refound) {
            wx.showModal({
              title: '核验异常',
              content: '用户已退单，无法核销',
              showCancel: false,
            })
            return
          }
          if (!resultData.payState) {
            wx.showModal({
              title: '核验异常',
              content: '支付状态异常，无法核销',
              showCancel: false,
            })
            return
          }
          if (resultData.taskType !== 'idle') {
            wx.showModal({
              title: '核验异常',
              content: '此码已核验，无法再次核销',
              showCancel: false,
            })
            return
          }
          if (resultData.ststatus) {
            wx.showModal({
              title: '核验异常',
              content: '此码已核验，无法再次核销',
              showCancel: false,
            })
            return
          }
          const phone = resultData.address.phone || ''
          const phoneStr = phone.substr(-4)
          that.setData({orderInfo: resultData, showWriteMode: true, phoneStr: phoneStr})
        } else {
          wx.showModal({
            title: '核验异常',
            content: '此码无法使用',
            showCancel: false,
          })
          that.setData({orderInfo: {}, showWriteMode: false})
        }
      } else {
        wx.showModal({
          title: '核验异常',
          content: result.message,
          showCancel: false,
        })
        that.setData({orderInfo: {}, showWriteMode: false})
      }
    })
  },
  confirmWriteOff (e) {
    let id = e.target.dataset.id;
    let userId = e.target.dataset.userid;
    let shopName = e.target.dataset.shopname;
    console.log('核验中。。。。。')
    wx.showLoading({
      title: '核验中',
      mask: true
    })
    let that = this;
    until.request({
      action: 'app.school.confirmWriteOff',
      data: {
        out_trade_no: id,
        userId: userId,
        shopName: shopName
      }
    }).then(function (e) {
      let result = e.data;
      wx.hideLoading()
      if (result.success) {
        wx.showModal({
          title: '提示',
          content: '核销成功！',
          showCancel: false,
          success() {
            that.setData({
              showWriteMode: false,
              orderInfo: {}
            })
          }
        })
      } else {
        wx.showModal({
          title: '核验异常',
          content: '请稍后重试'
        })
      }
    })
  }
})