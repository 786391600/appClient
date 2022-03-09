const until = require('../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerCurrent: 0, // 当前显示的banner
    bannerData: [
      {
        'image': 'http://mmbiz.qpic.cn/mmbiz_jpg/5XHic5LQPCDjLb0KM9VztR3qSkxZhCuV0mG1AIeHQnic3XibBzE4MINUdIRJu1tsDDztGJibmoUNlaYqm9WofWb6bw/0', 
        'img': 'https://www.duoguyu.com/dist/flip/flipImg-s1.jpg', 
        'name': '王涛', 
        'isOpenFilp': false, 
        'selfInfo': '“我们应该到那里去，我们属于那里。” \n“不，我们不属于任何地方，除了彼此身边。”', 
        'score': '7.6', 
        'school': '学校名称名称名称', 
        'major' : '专业',
        'sex': 'boy',
        'age': '25',
        'orterInfo':'Alita: Battle Angel',
        'number': 'A10001'
      },
      {
        'image': 'http://mmbiz.qpic.cn/mmbiz_jpg/5XHic5LQPCDjLb0KM9VztR3qSkxZhCuV0YsNEs4OQEM32V933D5fwHQHRfH9mQ1fyRXyibQZ0uEoELYOllQhuy9Q/0', 
        'name': '王涛', 
        'isOpenFilp': false, 
        'selfInfo': '“我们应该到那里去，我们属于那里。” \n“不，我们不属于任何地方，除了彼此身边。”', 
        'score': '7.6', 
        'school': '学校名称名称名称', 
        'major' : '专业',
        'sex': 'boy',
        'age': '25',
        'orterInfo':'Alita: Battle Angel',
        'number': 'A10001'
      }
    ],
  },

  // bannerSwiper
  bannerSwiper(e) {
    const that = this, bannerCurrent = e.detail.current;
    that.setData({
      bannerCurrent
    })
  },

  // 卡牌切换
  switchFlip: function (e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    const bannerData = that.data.bannerData;
    const isOpenFilp = that.data.bannerData[index].isOpenFilp ? false : true;
    bannerData[index].isOpenFilp = isOpenFilp;
    that.setData({
      bannerData
    });
  },
  onLoad (options) {
    this.getUserInfo();
  },
  getUserInfo (userId) {
    wx.showLoading({
      title: '信息获取中...',
    })
    let that = this;
    until.request({
      action: 'app.school.getDeorderUserInfoById',
      data: {
        userId: this.options.userId
      }
    }).then(function (e) {
      let res = e.data;
      if (res.success) {
        let infoArr = [res.data]
        that.setData({
          bannerData: infoArr
        })
      }
      wx.hideLoading();
    })
  }
})