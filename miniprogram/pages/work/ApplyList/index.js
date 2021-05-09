// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
const workGlobelData = require('../globleData.js')
Component({
  properties: {
    currentState: {
      type: Boolean,
      observer: function (newObj, oldObj) {
        if(newObj) {
          this.initSchool()
          this.getWorkList()
        }
      }
    }
  },
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
    schoolId: ''
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.setData({
        winHeight: app.globalData.windowHeight * app.globalData.changeWidth
      })
    },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      if (this.data.currentState) {
        this.initSchool()
        this.getWorkList() 
      }
    }
  },
  methods: {
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
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        const currentTabIndex = e.target.dataset.current
        that.setData({
          currentTab: e.target.dataset.current
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
      let orderId = e.currentTarget.dataset.orderid
      let query = {
        out_trade_no: orderId
      }
      until.request({
        action: 'app.crowd.grabbingOrders',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          let getdata = e.data.data
          that.setData({
            workList: getdata
          })
        } else {
          until.showToast(e.data.message, 'error');
        }
        wx.hideLoading()
      })
    },
    initSchool () {
      if (workGlobelData.currentSchool && Object.keys(workGlobelData.currentSchool).length > 0) {
        this.data.schoolId = workGlobelData.currentSchool.id;
      } else {
        wx.navigateTo({
          url: '/pages/work/schoolList/index'
        })
      }
    }
  }
})