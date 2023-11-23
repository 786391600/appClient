// pages/work/shopList/index.js
const until = require('../../../until/index.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
    attached: function () {
      // this.getShopList()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shopList: [],
    loading: false,
    shopQuery: {
      page: 1, // 当前页
      tag: '' // 分类标签
    },
    loaded: false // 是否加载完毕
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getShopList (schoolId, tagId, refresh, setLimit) {
      if (this.data.loading) {
        return
      }
      let that = this;
      let limit = setLimit || 10
      let query = {
        schoolId: schoolId
      }
      if (tagId) {
        query.tag = tagId
      }
      if (refresh) {
        that.data.shopQuery.page = 1
        that.data.loaded = false
      } else {
        that.data.shopQuery.page = that.data.shopQuery.page + 1
      }
      if (that.data.loaded) {
        return
      }
      if (limit > 0) {
        query.limit = limit
      }
      query.page = that.data.shopQuery.page
      that.setData({loading: true, loaded: false})
      until.request({
        action: 'app.crowd.getShopList',
        data: query
      }).then(function (e) {
        let res = e.data;
        let setData = {
          loading: false
        }
        if (res.success && res.data) {
          if (res.data.length < limit) {
            setData.loaded = true;
          } else {
            setData.loaded = false;
          }
          if (query.page === 1) {
            setData.shopList = res.data || []
          } else {
            setData.shopList = that.data.shopList.concat(res.data)
          }
        }
        that.setData(setData)
      })
    },
    toShop (e) {
      let shopId = e.currentTarget.dataset.shopid;
      let schoolId = e.currentTarget.dataset.schoolid;
      wx.navigateTo({
        url: '/pages/work/shop/index?schoolId=' + schoolId + '&shopId=' + shopId
      })
    },
  }
})
