// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
const workGlobelData = require('../globleData.js')
Component({
  properties: {
    currentState: {
      type: Boolean,
      observer: function (newObj, oldObj) {
        console.log(this.data, 'this.data')
        if(newObj) {
          let taskType = this.data.currentTab;
          let activeIndex = this.getActiveIndex(taskType);
          this.setData({
            currentTab: taskType,
            activeIndex: activeIndex
          })
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
    schoolId: '',
    hasTodoWork: false, // 是否有未完成的工作
    tabs: ["等待接单", "执行中", "已完成"],
    activeIndex: 0
  },
  methods: {
    getActiveIndex (type) {
      if (type === 'idle') {
        return '0'
      } else if (type === 'inprogress') {
        return '1'
      } else if (type === 'complete') {
        return '2'
      }
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
    onShow (e) {
      this.initSchool()
      this.getWorkList()
    },
    toJobDetail (obj) {
      let jobId = obj.currentTarget.dataset.jobobj.jobId
      wx.navigateTo({
        url: '/pages/job/jobDetail/index?jobId=' + jobId
      })
    },
    getWorkList () {
      let taskType = this.data.currentTab;
      let query = {
        taskType: taskType
      }
      let that = this
      wx.showLoading({
        title: '任务获取中...',
      })
      until.request({
        action: 'app.crowd.getMyWorkOrderList',
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
    initSchool () {
      if (workGlobelData.currentSchool && Object.keys(workGlobelData.currentSchool).length > 0) {
        this.data.schoolId = workGlobelData.currentSchool.id;
      } else {
        wx.navigateTo({
          url: '/pages/work/schoolList/index'
        })
      }
    },
    setTitle (type) {
      let title = '';
      if (type === 'idle') {
        title = '等待帮手接单'
      } else if (type === 'inprogress') {
        title = '任务进行中'
      } else if (type === 'complete') {
        title = '已完成'
      }
      wx.setNavigationBarTitle({
        title: title
      })
    },
    workRefound (e) {
      let currentIndex = e.currentTarget.dataset.currentindex;
      let that = this;
      let out_trade_no = e.currentTarget.dataset.orderid;
      let fee = e.currentTarget.dataset.fee;
      let orderInfo = e.currentTarget.dataset.orderinfo;
      if (orderInfo.refunding) {
        return;
      }

      if (!orderInfo.writeOff) {
        // 到店核销类型随时可退
        let allowRefound = this.getOrderTime(orderInfo.timestamp);
        if (!allowRefound) {
          wx.showModal({
            title: '退单提示',
            content: '20分钟没有帮手接单，才可以退单哦！',
            showCancel: false
          })
          return
        } 
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
          }
        }
      })
    },
    getOrderTime (timestamp) {
      let dateNow = new Date().getTime();
      let timeDiff = dateNow - timestamp;
      let minutes = Math.floor(timeDiff / (60 * 1000)); // 计算剩余的分钟数
      console.log(minutes);
      return minutes > 20;
    },
    makePhoneCall () {
      wx.makePhoneCall({
        phoneNumber: '18235288215'
      })
    },
    setRfoundStatus (index, status) {
      this.data.workList[index].refunding = status;
      this.setData({
        workList: this.data.workList
      })
    },
    tabChange (e) {
      let activeIndex = e.detail.activeIndex;
      let currentType = this.getCurrentType(activeIndex);
      this.data.currentTab = currentType;
      this.getWorkList();
    },
    toWriteOff (e) {
      const str = e.target.dataset.orderid
      const orderInfo = e.target.dataset.orderinfo
      const address = orderInfo.address || {}
      const shopInfo = address.shopAddressInfo || {}
      const phone = address.phone || '';
      const phoneSub = phone.substr(-4)
      let businessInfo = {
        name: orderInfo.body,
        address: orderInfo.address
      }
      wx.navigateTo({
        url: '/pages/work/QRcode/index?str=' + str + '&businessInfo=' + JSON.stringify(businessInfo)
      })
    }
  }
})