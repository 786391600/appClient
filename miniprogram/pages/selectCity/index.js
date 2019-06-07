// pages/demo/demo.js
let City = require('./testData.js');

Page({
  data: {
    city: [],
    config: {
      horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
      animation: true, // 过渡动画是否开启
      search: true, // 是否开启搜索
      searchHeight: 45, // 搜索条高度
      suctionTop: false // 是否开启标题吸顶
    },
    newIdena:""
  },
  onLoad(options) {
    console.log(options)
    // wx.showLoading({
    //   title: '加载数据中...',
    // })
    // // 模拟服务器请求异步加载数据
    // setTimeout(()=>{
    this.setData({
      city: City,
      newIdena: options.newIdena,
      opt: { star: options.star, end: options.end}
    })
    //   wx.hideLoading()
    // },2000)

  },
  bindtap(e) {
    console.log(e.detail)
    wx.reLaunch({
      url: '../ticket/index?newIdena=' + this.data.newIdena + '&data=' + e.detail.name + '&data2=' + this.data.opt.star + '&data3=' + this.data.opt.end
    })
  }

})