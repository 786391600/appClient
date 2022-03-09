Component({
  properties: {
    type: {
      type: String,
      observer: function (newObj) {
        console.log('type============', newObj)  
      }
    },
    msgList: {
      type: Array,
      value: []
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    index: 0
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
       
    },
    moved: function () { },
    detached: function () { },
  },
  methods: {
    toArticle (e) {
      let url = e.currentTarget.dataset.url;
      let title = e.currentTarget.dataset.title;
      if (!url) {
        wx.showModal({
          title: '提示',
          content: title,
          showCancel: false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return;
      }
      wx.navigateTo({
        url: '/pages/common/getWebView/index?url=' + url
      })
    },
    swiperChange(e) {
      let index = e.detail.current;
      this.setData({
        index: index
      })
    }
  }
})
