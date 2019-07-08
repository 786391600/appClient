// miniprogram/pages/OrderList/index.js
const until = require('../../until/index.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updateData: {
      name: '',
      idCard: ''
    },
    showShade: false,
    riderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getRiderList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  addOrUpdateRider () {
    let that = this
    let query = this.data.updateData
    let message = '添加成功！'
    let varifi = this.verificationData(query)
    if (!varifi) {
      return
    }
    if (that.data.riderList.length === 0) {
      query.isDefault = true
    }
    if (query.id) {
      message = '更新成功！'
    }
    until.request({
      action: 'app.line.addOrupdateRider',
      data: query
    }).then(function (e) {
      if (e.data.success) {
        wx.showToast({
          title: message,
          icon: 'none'
        })
        that.getRiderList()
      }
    })
  },
  verificationData (data) {
    if (data.name && data.idCard) {
      let idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if (!idcardReg.test(data.idCard)) {
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none'
        })
        return false
      }
    } else {
      wx.showToast({
        title: '姓名和身份证号必填',
        icon: 'none'
      })
      return false
    }
    return true
  },
  getRiderList () {
    let that = this;
    until.request({
      action: 'app.line.getRiderList',
      data: {}
    }).then(function (e) {
      if (e.data.success) {
       let data = that.getSelectData(e.data.data) 
       that.setData({riderList: data || [], showShade: false})
      }
    })
  },
  bindNameInput (e) {
    this.data.updateData.name = e.detail.value
  },
  bindIdCardInput(e) {
    this.data.updateData.idCard = e.detail.value
  },
  addNewRider () {
    this.setData({showShade: true, updateData: {}})
  },
  editRider (e) {
    this.setData({updateData: e.target.dataset.rider, showShade: true})
  },
  cancle () {
    this.setData({ showShade: false})
  },
  removeRider (e) {
    let that = this;
    let id = e.target.dataset.rider.id;
    let index = e.target.dataset.index;
    until.request({
      action: 'app.line.removeRider',
      data: {id: id}
    }).then(function (e) {
      if (e.data.success) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        that.data.riderList.splice(index, 1)
        that.setData({riderList: that.data.riderList})
      }
    })
  },
  setDefaultRider (e) {
    let that = this
    let id = e.target.dataset.id
    let index = e.target.dataset.index
    until.request({
      action: 'app.line.setDefaultRider',
      data: { id: id }
    }).then(function (e) {
      if (e.data.success) {
        wx.showToast({
          title: '设置成功',
          icon: 'none'
        })
        let newArr = []
        that.data.riderList.forEach((item, itemIndex) => {
           if (index === itemIndex) {
             item.isDefault = true
           } else {
             item.isDefault = false
           }
           newArr.push(item)
        })
        that.setData({riderList: newArr})
      }
    })
  },
  checkboxClick (e) {
    let index = e.target.dataset.index
    this.data.riderList[index].select = !this.data.riderList[index].select
  },
  getSaveSelect () {
    let selectArr = []
    this.data.riderList.forEach((item)=>{
      if (item.select) {
        selectArr.push(item)
      }
    })
    if (selectArr.length > 3) {
      wx.showToast({
        title: '最多选择三位乘车人',
        icon: 'none'
      })
      return
    }
    this.toOrderPayment(selectArr)
  },
  toOrderPayment (arr) {
   app.globalData.selectRiderList = arr
    wx.navigateBack({
      url: '/pages/OrderPayment/index'
    })
  },
  getSelectData (arr) {
    let list = arr
    let appList = app.globalData.selectRiderList || []
    console.log(appList)
    console.log('appList====')
    for (var k = 0; k < appList.length; k++) {
      for (var i = 0; i <list.length; i++) {
        if (list[i].id === appList[k].id) {
          list[i].select = true
        }
      }
    }
    return list
  }
})