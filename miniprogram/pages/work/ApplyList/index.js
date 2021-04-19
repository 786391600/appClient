// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
Component({
  properties: {
    currentState: {
      type: Boolean,
      observer: function (newObj, oldObj) {
        if(newObj) {
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
    applyList: [],
    scrollleft:0,
    currentTab: 0,
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
    }
  },
  methods: {
    toJobDetail (obj) {
      console.log(obj, 'lll')
      let jobId = obj.currentTarget.dataset.jobobj.jobId
      wx.navigateTo({
        url: '/pages/job/jobDetail/index?jobId=' + jobId
      })
    },
    getWorkList () {
      let query = {}
      let that = this
      wx.showLoading({
        title: '记录获取中...',
      })
      until.request({
        action: 'app.crowd.getWorkList',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          let getdata = e.data.data
          that.setData({
            applyList: getdata
          })
        } else {
          until.showToast(e.data.message, 'error');
        }
        wx.hideLoading()
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
        that.setData({
          currentTab: e.target.dataset.current
        })
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
    }
  }
})