// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
Component({
  properties: {
    currentState: {
      type: Boolean,
      observer: function (newObj, oldObj) {
        if (newObj) {
          // this.getUserResume()
          this.getUserWorkOrder()
          this.getUserInfo()
        }
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    resume: {},
    userInfo: {},
    triggered: false //是否在刷新 
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      
    },
    moved: function () { },
    detached: function () { },
  },
  methods: {
    toOprate (e) {
      const page = e.currentTarget.dataset.page;
      let that = this;
      wx.navigateTo({
        url: page
      })
    },
    getUserWorkOrder () {
      let that = this;
      until.request({
        action: 'app.crowd.getUserWorkOrderList',
        data: {}
      }).then(function (e) {
        if (e.data.success) {
          that.setData({
            workList: e.data.data
          })
        }
        wx.hideLoading();
        that._freshing = false;
        that.setData({
          triggered: false
        })
      })
    },
    workRefound (e) {
      let that = this;
      let currentIndex = e.currentTarget.dataset.currentindex;
      let out_trade_no = e.currentTarget.dataset.orderid;
      let fee = e.currentTarget.dataset.fee;
      let orderInfo = e.currentTarget.dataset.orderinfo;
      let allowRefound = this.getOrderTime(orderInfo.timestamp);
      console.log(allowRefound)

      if (orderInfo.refunding) {
        return;
      }
      if (!allowRefound) {
        wx.showModal({
          title: '退单提示',
          content: '20分钟没有帮手接单，才可以退单哦！',
          showCancel: false
        })
        return
      }
      wx.showModal({
        title: '退单提示',
        content: '确认要退单吗？',
        success (res) {
          if (res.confirm) {
            that.setRfoundStatus(currentIndex, true);
            until.request({
              action: 'app.crowd.workRefound',
              data: {
                fee: fee,
                out_trade_no: out_trade_no
              }
            }).then(function (e) {
              if (e.data.success) {
                wx.showModal({
                  title: '退单成功',
                  content: '退款随后到账，请查看微信钱包',
                  showCancel: false
                })
              } else {
                wx.showModal({
                  title: '退单失败',
                  content: e.data.message,
                  showCancel: false
                })
              }
            })
          }}
      })
    },
    getOrderTime (timestamp) {
      let dateNow = new Date().getTime();
      let timeDiff = dateNow - timestamp;
      let minutes = Math.floor(timeDiff / (60 * 1000)); // 计算剩余的分钟数
      console.log(minutes);
      return minutes > 20;
    },
    getUserInfo () {
      let that = this;
      app.getUserInfo(function(data){
        let userInfo = {}
        if (data && data !== 'null') {
          userInfo = data
        }
        that.setData({
          userInfo: userInfo
        })
      }, true);
    },
    getPhoneNumber (e) {
      let that = this;
      until.request({
        action: 'app.crowd.getUserPhone',
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        }
      }).then(function (e) {
        if (e.data.success) {
          let phone = e.data.data.phone;
          let userInfo = that.data.userInfo;
          app.setUserInfoByKey('phone', phone);
          userInfo.phone = phone;
          that.setData({
            userInfo: userInfo
          })
          wx.showModal({
            title: '绑定成功',
            content: '手机绑定成功！',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '绑定失败',
            content: e.data.message,
            showCancel: false
          })
        }
      })
    },
    orderTakingTip () {
      wx.showModal({
        title: '提示',
        content: '接单需要绑定手机，并且联系管理员开通！',
        showCancel: false
      })
    },
    onRefresh: function() {
      if (this._freshing) return
      this._freshing = true
      this.getUserWorkOrder()
    },
    toMyOrder: function (e) {
      let taskType = e.currentTarget.dataset.tasktype;
      var that = this;
      wx.navigateTo({
        url: '/pages/work/myorder/index?tasktype=' + taskType
      })
    },
    makePhoneCall () {
      wx.makePhoneCall({
        phoneNumber: '13934691550'
      })
    },
    partTimeJobClick () {
      wx.showModal({
        title: '提示',
        content: '点击确定复制管理员微信，添加联系我们即可。',
        showCancel: false,
        success() {
          wx.setClipboardData({
            data: '19801221002',
            success (res) {
              
            }
          })
        }
      })
    },
    setRfoundStatus (index, status) {
      this.data.workList[index].refunding = status;
      this.setData({
        workList: this.data.workList
      })
    }
  }
})