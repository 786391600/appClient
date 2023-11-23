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
    shopQuery: {
      loading: false,
      page: 1,
      tag: ''
    },
    triggered: false,
    _freshing: true,
    currentSchoolId: '',
    loading: false,
    scrollTop: 0,
    fixTop: 0
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
      this.getFixTop()
    },
    hide: function () { },
    resize: function () { },
  },
  methods: {
    getFixTop () {
      let query = this.createSelectorQuery();
      query.select('.xiding').boundingClientRect(rect=>{
        console.log(rect, 'rrrrrrrrrrrrrrrrrrr')
        this.setData({
          fixTop:rect.top,
        })
      }).exec();
    },
    bindscroll (e) {
      let self = this;
      let top = e.detail.scrollTop;
      self.setData({
        scrollTop: top
      });
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
          let tagList = res.data.schoolInfo.tagList || [];
          tagList.unshift({
            id: '',
            name: '全部'
          })
          res.data.schoolInfo.tagList = tagList;
          wx.setStorageSync('schoolData', res.data.schoolInfo);
          workGlobelData.currentSchool = res.data.schoolInfo;
          that.data.schoolId = res.data.schoolInfo.id;
          that.setData({schoolData: res.data.schoolInfo, triggered: false, currentSchoolId: res.data.schoolInfo.id});
          that.getShopList(null, true)
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
      this.shoptabrefresh()
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
      
    },
    getShopList (tagId, refresh) {
      let shopListBox = this.selectComponent('#shopList')
      shopListBox.getShopList(this.data.schoolId, tagId, refresh)
    },
    getSchoolShopList () {
      let id = this.data.tapId || null
      this.getShopList(id, false)
    },
    shopBindChange (e) {
      let id = e.detail.id;
      this.data.tapId = id
      if (id) {
        this.getShopList(id, true)
      } else {
        this.getShopList(null, true)
      }
    },
    shoptabrefresh () {
      let shopTab = this.selectComponent('#shoptab')
      shopTab.refresh()
    }
  },
  ready () {
    this.setCurrentSchool();
  }
})