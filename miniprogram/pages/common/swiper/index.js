const app = getApp()
Component({
  properties: {
    msgList: {
      type: Array,
      value: []
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
      indicatorDots: true, //小点
      indicatorColor: "white",//指示点颜色
      activeColor: "#FEAC08",//当前选中的指示点颜色
      autoplay: true, //是否自动轮播
      interval: 3000, //间隔时间
      duration: 100, //滑动时间
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      
    },
    moved: function () { },
    detached: function () { },
  },
  methods: {
    imageLoad (event) {
      let width = event.detail.width;
      let windowWidth = app.globalData.windowWidth;
      let bl = windowWidth / width;
      console.log(bl)
      let height = event.detail.height * bl;
      this.setData({
        widHeight: height
      })
    }
  }
})
