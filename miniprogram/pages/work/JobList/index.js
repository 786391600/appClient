// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
const workGlobelData = require('../globleData.js')
Component({
  properties: {
    currentState: {
      type: Boolean,
      observer: function (newObj, oldObj) {
        if (newObj) {
          
        }
      }
    },
    schoolId: {
      type: String
    },
    bs: {
      type: String,
      default: ''
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    schoolData: {
      notifyConfig: [],
      swiperConfig: [],
      labelConfig: {}
    },
    shopList: [],
    triggered: false,
    _freshing: true,
    currentSchoolId: ''
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      if (workGlobelData.currentSchool && Object.keys(workGlobelData.currentSchool).length > 0) {
        if (this.data.currentSchoolId !== workGlobelData.currentSchool.id) {
          // 选择校园
          this.getSchoolInfo(workGlobelData.currentSchool.id);
          return;
        }
        if (this.data.schoolId !== workGlobelData.currentSchool.id) {
          // 扫码进入
          this.getSchoolInfo(this.data.schoolId);
          return;
        }
      }
      // this.setCurrentSchool();
    },
    hide: function () { },
    resize: function () { },
  },
  methods: {
    getShopList () {
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhh')
    },
    toSchoolSelect () {
      wx.navigateTo({
        url: '/pages/work/schoolList/index'
      })
    },
    setCurrentSchool () {
      let schoolId = ''
      if (this.data.schoolId) {
        schoolId = this.data.schoolId;
      } else {
        if (workGlobelData.currentSchool && Object.keys(workGlobelData.currentSchool).length > 0) {
          schoolId = workGlobelData.currentSchool.id;
        } else {
          const schoolData = wx.getStorageSync('schoolData')
          if (schoolData && Object.keys(schoolData).length > 0){
            schoolId = schoolData.id;
          }
        }
      }
      if (schoolId) {
        this.data.currentSchoolId = schoolId;
        this.getSchoolInfo(schoolId);
      }
      wx.setNavigationBarTitle({
        title: '校帮手'
      })
    },
    toWorkForm (e) {
      const taskType = e.currentTarget.dataset.tasktype
      if (Object.keys(this.data.schoolData).length === 0) {
        this.toSchoolSelect()
        return
      }
      wx.navigateTo({
        url: '/pages/work/workForm/index?type=' + taskType
      })
    },
    toShop (e) {
      let shopId = e.currentTarget.dataset.shopid;
      let schoolId = this.data.schoolData.id;
      wx.navigateTo({
        url: '/pages/work/shop/index?schoolId=' + schoolId + '&shopId=' + shopId
      })
    },
    getSchoolInfo (schoolId) {
      wx.showLoading({
        title: '加载中~',
        mask: true
      })
      let that = this;
      let query = {
        schoolId: schoolId
      }
      until.request({
        action: 'app.crowd.getSchoolInfo',
        data: query
      }).then(function (e) {
        let res = e.data;
        if (res.success && res.data) {
          wx.setStorageSync('schoolData', res.data.schoolInfo);
          workGlobelData.currentSchool = res.data.schoolInfo;
          that.data.schoolId = res.data.schoolInfo.id;
          that.setData({schoolData: res.data.schoolInfo, shopList: res.data.shopList, triggered: false, currentSchoolId: res.data.schoolInfo.id});
          if (that.data.bs) {
            let bsArr = that.data.bs.split('-');
            that.data.bs = '';
            wx.navigateTo({
              url: '/pages/work/workForm/index?type=' + bsArr[0] + '&businessIndex=' + bsArr[1]
            })
          }
        }
        that.data._freshing = false;
        wx.hideLoading();
      })
    },
    onRefresh () {
      if (this.data._freshing) return
      this.data._freshing = true
      this.setCurrentSchool();
    },
    concatClick () {
      let schoolInfo = workGlobelData.currentSchool;
      if (schoolInfo.contactConfig) {
        if (schoolInfo.contactConfig.url) {
          let url = schoolInfo.contactConfig.url;
          wx.previewImage({
            urls: [url]
          })
          return;
        }
        if (schoolInfo.contactConfig.phone) {
          wx.makePhoneCall({
            phoneNumber: schoolInfo.contactConfig.phone
          })
          return;
        }
      } else {
        wx.makePhoneCall({
          phoneNumber: '13934691550'
        })
      }
    },
    officialBinderror (detail) {
      console.log(detail, '00000000000000000000000');
    }
  },
  ready () {
    this.setCurrentSchool();
  }
})