const until = require('../../../until/index.js')
Page({
  data: {
    cruDataList: [],
    cruPDataList: [],
    weeklist: ['日', '一', '二', '三', '四', '五', '六'],
    itemIndex: 10,   //当前年份的数组下标    这个值和年份的前后一致的值相等，要注意就是年份访问时一当前年为切割点，前后年份范围的数值相等比较好计算，当然看需求而定啦。
    MonthlyTicket:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    star:'',
    end:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this;
    that.setData({
      star:options.star,
      end:options.end
    })
    var cur_year = new Date().getFullYear();
    var cur_month = new Date().getMonth();
    that.setData({
      dataTime: cur_year + "-" + cur_month + "-01"
    });

    that.calendar(cur_year, cur_month);
    //拿到当前的年月，渲染第一次进来小程序的日期数据
    that.setData({
      cur_year,
      cur_month,
    });
    console.log(cur_year + "-" + (cur_month + 1 > 9 ? cur_month + 1 : '0' + (cur_month + 1)))
    this.getLineManage({ start: options.star, end: options.end,departureTime: { $regex: cur_year + "-" + (cur_month + 1 > 9 ? cur_month + 1 : '0' + (cur_month + 1)) } })
  },
 

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '简单日历实现小程序版本',
      desc: '简单日历实现小程序版本',
      path: '/pages/index/index'
    };
  },

  //日历方法
  calendar: function (year, month) {
    this.setData({ loadingStatus: false });
    let fullDay = parseInt(new Date(year, month + 1, 0).getDate()),//当前月总天数
      startWeek = parseInt(new Date(year, month, 1).getDay()),  //当前月第一天周几
      lastMonthDay = parseInt(new Date(year, month, 0).getDate()), 
      totalDay = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7);//元素总个数
    //年份范围
    let newYearList = [], newMonthList = [], curYear = new Date().getFullYear();
    for (var i = curYear - 10; i < curYear + 10; i++) {
      newYearList.push(i);
    }
    //月份范围
    for (var i = 1; i <= 12; i++) {
      newMonthList.push(i);
    }

    let lastMonthDaysList = [], currentMonthDaysList = [], nextMonthDaysList = [];
    // 遍历日历格子
    for (let i = 0; i < totalDay; i++) {
      if (i < startWeek) {
        lastMonthDaysList.push(lastMonthDay - startWeek + 1 + i);
      } else if (i < (startWeek + fullDay)) {
        currentMonthDaysList.push(i + 1 - startWeek);
      } else {
        nextMonthDaysList.push((i + 1 - (startWeek + fullDay)));
      }
    }

    this.setData({
      monthList: newMonthList,//月份
      yearList: newYearList, //年份范围
      lastMonthDaysList,   //上月总天数
      currentMonthDaysList, //当前月总天数
      nextMonthDaysList  //下月总天数
    });

    var tmonth = month + 1;
    this.setData({
      dataTime: year + "-" + tmonth + "-01"
    });
    wx.setNavigationBarTitle({ title: this.data.star+'-'+this.data.end+' '+year + "年" + tmonth + "月" })
  },

  //选择月
  chooseMonth: function (e) {
    var chose_month = parseInt(e.detail.value) + 1 == 13 ? 1 : parseInt(e.detail.value);
    this.setData({
      cur_month: chose_month,
    });
    this.calendar(this.data.cur_year, this.data.cur_month)
    let newYear = this.data.cur_year
    let newMonth = this.data.cur_month
    this.getLineManage({ start: this.data.star, end: this.data.end, departureTime: { $regex: newYear + "-" + (newMonth + 1 > 9 ? newMonth + 1 : '0' + (newMonth + 1)) } })
  },

  //选择年
  chooseYear: function (e) {
    var idx = e.detail.value;
    var y = this.data.yearList[idx];
    console.log(idx)
    this.setData({
      itemIndex: idx,
      cur_year: y,
    });
    this.calendar(y, this.data.cur_month);
    let newYear = this.data.cur_year
    let newMonth = this.data.cur_month
    this.getLineManage({ start: this.data.star, end: this.data.end, departureTime: { $regex: newYear + "-" + (newMonth + 1 > 9 ? newMonth + 1 : '0' + (newMonth + 1)) } })
  },

  //操作月
  handleMonth: function (e) {
    let handle = '';
    if (e.currentTarget && e.currentTarget.dataset) {
      handle = e.currentTarget.dataset.handle
    } else {
      handle = e
    }
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    const index = this.data.itemIndex;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      let idx = index;
      if (newMonth < 0) {
        newYear = cur_year - 1;
        idx = index - 1;
        newMonth = 11;
      }
      this.getLineManage({ start: this.data.star, end: this.data.end,departureTime: { $regex: newYear + "-" + (newMonth + 1 > 9 ? newMonth + 1 : '0' + (newMonth + 1)) } })
      this.calendar(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        itemIndex: idx
      });

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      let idx = index;
      if (newMonth > 11) {
        newYear = cur_year + 1;
        idx = index + 1;
        newMonth = 0;
      }
      this.getLineManage({ start: this.data.star, end: this.data.end, departureTime: { $regex: newYear + "-" + (newMonth + 1 > 9 ? newMonth + 1 : '0' + (newMonth + 1)) } })
      this.calendar(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        itemIndex: idx
      });
    }
  },
  //选择日期
  SelectionDate:function (e){
    let haveTicket = e.currentTarget.dataset.haveticket
    if (!haveTicket) {
      return
    }
    let day = e.currentTarget.dataset.time < 10 ? '0' + e.currentTarget.dataset.time : e.currentTarget.dataset.time;
    let date=''
    if (this.data.cur_month + 1>9){
      date = this.data.cur_year + '-' + (this.data.cur_month + 1) + '-' + day
    }else{
      date = this.data.cur_year + '-0' + (this.data.cur_month + 1) + '-' + day
    }

    wx.navigateTo({
      url: '../VehicleList/index?star=' + this.data.star + '&end=' + this.data.end + '&date=' + date + '&lineInfo=' + JSON.stringify(this.data.lineInfo)
    })
  },
  //请求接口
  getLineManage: function (query) {
    let that = this
    wx.showLoading({
      title: '车票加载中...'
    })
    return new Promise((resolve, reject) => {
      until.request({
        action: 'app.line.getLineManage',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          resolve(e)
          let getdata = that.ticketStatistics(e.data.data.carList)
          that.setData({
            MonthlyTicket: getdata,
            lineInfo: e.data.data.lineInfo
          })
        } else {
          until.showToast(e.data.message, 'error');
        }
        wx.hideLoading()
      })
    })
  },
  //处理每日车票及数量
  ticketStatistics:function(data){
    let newMonthlyTicket = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    data.map((data,index)=>{
      console.log(data.departureTime.split("-")[2].split(" ")[0])
      newMonthlyTicket[data.departureTime.split("-")[2].split(" ")[0] - 1] = newMonthlyTicket[data.departureTime.split("-")[2].split(" ")[0] - 1]+1
    })
    return newMonthlyTicket
  },
  touchStart (e) {
    this.data.pageStartX = e.touches[0].pageX
  },
  touchEnd (e) {
    let endTouchX = e.changedTouches[0].pageX;
    let startTouchX = this.data.pageStartX;
    let changeX = endTouchX - startTouchX
    console.log(changeX)
    if (changeX > 100) {
      this.handleMonth('prev')
    } else if (changeX < -100) {
      this.handleMonth('next')
    }
  }
})