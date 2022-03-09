// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
const workGlobelData = require('../globleData.js')
Page({
  // properties: {
  //   currentState: {
  //     type: Boolean,
  //     observer: function (newObj, oldObj) {
  //       if(newObj) {
  //         this.initSchool()
  //         this.getWorkList()
  //       }
  //     }
  //   }
  // },
  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    workList: [],
    scrollleft:0,
    currentTab: 'idle',
    triggered: false, // 是否在刷新
    schoolId: '',
    hasTodoWork: false, // 是否有未完成的工作 
    conactPhone: '',
    tabs: ['待接单', '执行中', '已完成'],
    activeIndex: 0,
    homeTabs: ['抢单中心', '车票任务', '招工任务', '我的钱包'],
    homeIndex: '0',
    noAuth: false
  },
  // lifetimes: {
  //   // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  //   attached: function () {
  //     this.setData({
  //       winHeight: app.globalData.windowHeight * app.globalData.changeWidth
  //     })
  //   },
  //   moved: function () { },
  //   detached: function () { },
  // },
  // pageLifetimes: {
  //   show: function() {
  //     // 页面被展示
  //     if (this.data.currentState) {
  //       this.initSchool()
  //       this.getWorkList() 
  //     }
  //   }
  // },
  onLoad (options) {
    this.data.conactPhone = options.conactPhone;
  },
  onShow () {
    // this.initSchool()
    this.getUserAuth();
    // 获取未完成标识
    this.getTodoState()
  },
  toJobDetail (obj) {
    let jobId = obj.currentTarget.dataset.jobobj.jobId
    wx.navigateTo({
      url: '/pages/job/jobDetail/index?jobId=' + jobId
    })
  },
  getWorkList () {
    let taskType = this.data.currentTab;
    let schoolId = this.data.schoolId;
    let query = {
      taskType: taskType,
      schoolId: schoolId
    }
    let that = this
    wx.showLoading({
      title: '任务获取中...',
    })
    until.request({
      action: 'app.crowd.getWorkList',
      data: query
    }).then(function (e) {
      if (e.data.success) {
        let getdata = e.data.data
        that.setData({
          workList: getdata
        })
        if (taskType === 'inprogress') {
          if (getdata.length > 0) {
            that.setTodoState(true);
          } else {
            that.setTodoState(false);
          }
        }
      } else {
        until.showToast(e.data.message, 'error');
      }
      wx.hideLoading()
      that._freshing = false
      that.setData({
        triggered: false
      })
    })
  },
  bindChange: function (e) {
    var that = this;
    that.setData({
        currentTab: e.detail.current
        });
  
      this.checkCor();
  },
  
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      const currentTabIndex = e.currentTarget.dataset.current
      that.setData({
        currentTab: e.currentTarget.dataset.current
      });
      this.getWorkList();
    }
  },
  checkCor:function(){
    if(this.data.currentTab>4){
      this.setData({
        scrollleft:300
      })
    }else{
      this.setData({
        scrollleft:0
      })
    }
  },
  onRefresh: function() {
    if (this._freshing) return
    this._freshing = true
    this.getWorkList()
  },
  grabbingOrders: function(e) {
    let orderId = e.currentTarget.dataset.orderid;
    let orderIndex = e.currentTarget.dataset.index;
    let that = this;
    let query = {
      out_trade_no: orderId
    }
    wx.showModal({
      title: '温馨提示',
      content: '抢单目前不可撤销，确定抢单？',
      success (res) {
        if (res.confirm) {
          until.request({
            action: 'app.crowd.grabbingOrders',
            data: query
          }).then(function (e) {
            if (e.data.success) {
              that.data.workList.splice(orderIndex, 1);
              that.setData({workList: that.data.workList});
              wx.showModal({
                title: '抢单成功',
                content: '快去执行任务吧！',
                showCancel: false
              })
              that.setTodoState(true);
            } else {
              // until.showToast(e.data.message, 'error');
              wx.showModal({
                title: '抢单失败',
                content: e.data.message,
                showCancel: false
              })
            }
            wx.hideLoading()
          })
        }
      }
    })
  },
  confirmOrder (e) {
    let orderId = e.currentTarget.dataset.orderid;
    let orderIndex = e.currentTarget.dataset.index;
    let orderInfo = e.currentTarget.dataset.orderinfo;
    let userId = orderInfo.userId;
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认完成？未完成将会扣除奖金！',
      success (res) {
        if (res.confirm) {
           that.completeWork(orderId, orderIndex, userId);
        }
      }
    })
  },
  initSchool () {
    // if (workGlobelData.currentSchool && Object.keys(workGlobelData.currentSchool).length > 0) {
    //   this.data.schoolId = workGlobelData.currentSchool.id;
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/work/schoolList/index'
    //   })
    // }

  },
  setTodoState (state) {
    this.setData({
      hasTodoWork: state
    })
    let setState = 'false'
    if (state) {
      setState = 'true'
    }
    wx.setStorageSync('hasTodoWork', setState);
  },
  getTodoState () {
    try {
    var value = wx.getStorageSync('hasTodoWork') === 'true'? true:false;

    this.setData({
      hasTodoWork: value
    })
    } catch (e) {
    // Do something when catch error
    }
  },
  completeWork (id, orderIndex, userId) {
    const that = this;
    until.request({
      action: 'app.crowd.completeWork',
      data: {
        out_trade_no: id,
        userId: userId
      }
    }).then(function (e) {
      if (e.data.success) {
        wx.showModal({
          title: '任务完成',
          content: '赏金审核后发放到您的钱包！',
          showCancel: false
        })
        that.data.workList.splice(orderIndex, 1);
        if (that.data.workList.length === 0) {
          that.setTodoState(false);
        }
        that.setData({workList: that.data.workList});
      } else {
        // until.showToast(e.data.message, 'error');
        wx.showModal({
          title: '确认失败',
          content: e.data.message,
          showCancel: false
        })
      }
    })
  },
  makePhoneCall (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  tabChange (e) {
    let activeIndex = e.detail.activeIndex;
    let currentType = this.getCurrentType(activeIndex);
    this.data.currentTab = currentType;
    this.getWorkList();
  },
  getCurrentType (index) {
    if (index === '0') {
      return 'idle'
    } else if (index === '1') {
      return 'inprogress'
    } else if (index === '2') {
      return 'complete'
    }
  },
  homeTabChange (e) {
    let activeIndex = e.detail.activeIndex;
    if (activeIndex === '3') {
      wx.navigateTo({
        url: '/pages/work/money/index'
      })
      this.setData({
        homeIndex: this.data.homeIndex
      })
      return
    }
    this.setData({
      homeIndex: activeIndex
    })
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
          that.data.schoolId = resData.account;
          that.getWorkList()
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
  }
})