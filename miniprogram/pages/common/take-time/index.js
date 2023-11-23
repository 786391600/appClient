// pages/common/label-select/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentDay: {
      value: '',
      type: String
    },
    currentTime: {
      value: '',
      type: String
    },
    timeConfig: {
      value: [],
      type: Array
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    dayList: [],
    timeList: [],
    currentDateText: ''
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      // this.fun_date(0)
      let dayList = []
      for (let i = 0; i < 7; i ++) {
        let date = this.fun_date(i)
        let week = this.getWeekDate(i)
        if (i === 0) {
          week = '今天（'+ week + ')'
        }
        if (i === 1) {
          week = '明天（'+ week + ')'
        }
        dayList.push({
          title: week,
          date: date
        })
      }
      this.setData({
        dayList: dayList
      })
      this.getStartTime()
    },
    moved: function () { },
    detached: function () { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getWeekDate(aa) {
      var now = new Date();
      var date2 = new Date(now);  
      date2.setDate(now.getDate()+aa);
      var day = date2.getDay();
      var weeks = new Array(
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      );
      var week = weeks[day];
      console.log(week)
      return week;
    },
    fun_date(aa) {  
      var date1 = new Date(),  
      time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间  
      var date2 = new Date(date1);  
      date2.setDate(date1.getDate()+aa);  
      var time2 = date2.getFullYear()+"-"+ ((date2.getMonth()+1) < 10 ? '0' + (date2.getMonth()+1) : (date2.getMonth()+1)) +"-"+ (date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate());  
      console.log(time2)
      return time2
    },
    selectDay (e) {
      let currentDate = e.currentTarget.dataset.date;
      let currentDateText = e.currentTarget.dataset.title;
      this.getSelectTime(currentDate, currentDateText)
    },
    getSelectTime (currentDate, currentDateText) {
      let currentDateR = currentDate.replace(/-/g, '/')
      let timeConfig = this.data.timeConfig.length > 0 ? this.data.timeConfig : [
       ['07:00','08:20'],
       ['11:00','13:00'],
       ['17:30','19:30']
      ]
      let that = this;
      let currentTime = new Date(new Date().getTime() + (50 * 60 * 1000))
      let status = false // 是否找到开始时间
      let timeArr = []
      timeConfig.forEach((arr) => {
        let currentArr = [new Date(currentDateR + ' ' + arr[0]), new Date(currentDateR + ' ' + arr[1])];
        if (!status) {
          arr.some((time, index) => {
            if (status) {
              return
            }
            if (new Date(currentDateR + ' ' + time).getTime() > currentTime) {
              // 代表可选
              status = true
              if (index > 0) {
                currentArr = [new Date(currentTime), new Date(currentDateR + ' ' + time)]
              }
            }
          })  
        }
        if (status) {
          let splitArr = that.timeSplit(currentArr[0], currentArr[1], 4);
          console.log(splitArr, 'splitArrsplitArrsplitArr')
          timeArr = timeArr.concat(splitArr);
        }
      })

      this.setData({
        currentDate: currentDate,
        timeList: timeArr,
        currentDateText: currentDateText
      })
    },
    timeSplit(date1,date2,timeNm){
      let that = this;
      let times = timeNm - 1;
      // 计算差值
      let difsec = Math.abs((+new Date(date1)) - (+new Date(date2)));
      // 计算步长 秒
      let stepLen = (difsec / times) / 1000;

      let array = []

      if(stepLen == 0){
          for(let i=0;i<timeNm;i++){
              let text = that.getDateText(date1)
              array.push({
                  id:i,
                  time:that.getDateText(date1),
                  text: text.split(" ")[1].split(':')[0] + ':' + text.split(' ')[1].split(':')[1]
              })
          }
          return array;
      }
      //if(stepLen < 1){
          // 步长不足1s 先按1秒分，再补位
          for(let i=0;i<times;i++){
              let timestr = +new Date(date1)+(Math.max(1,stepLen)*1000*i);
              let text = that.getDateText(timestr)
              array.push({
                  id:i,
                  time: text,
                  text: text.split(" ")[1].split(':')[0] + ':' + text.split(' ')[1].split(':')[1]
              })
          }
      //}

      if(array.length != timeNm){
          let sn = array.length-1;
          for(let j=sn;j<times;j++){
            let text = that.getDateText(date2)
            array.push({
                id:j,
                time:that.getDateText(date2),
                text: text.split(" ")[1].split(':')[0] + ':' + text.split(' ')[1].split(':')[1]
            })
          }
      }
      console.log(array)
      return array;
    },
    getDateText (timestr) {
      function ik_pd(datas) {
        if(datas.toString().length == 1){
            return "0" + datas;
        }else{
            return datas;
        }
    }
      let time = new Date(timestr);
      let Y = time.getFullYear();
      let Mon = ik_pd(time.getMonth() + 1);
      let Day = ik_pd(time.getDate());
      let H = ik_pd(time.getHours());
      let Min = ik_pd(time.getMinutes());
      let S = ik_pd(time.getSeconds());
      return `${Y}-${Mon}-${Day} ${H}:${Min}:${S}`
    },
    getStartTime () {
      this.data.dayList.some((item) => {
        this.getSelectTime(item.date)
        if (this.data.timeList.length > 0) {
          this.data.currentDateText = item.title
          // this.triggerEvent('setTime', {text: item.title + ' ' + this.data.timeList[0].text, key: this.data.timeList[0].time})
          return true
        }
      })
    },
    selectTime (e) {
      // console.log(e, 'oooooooooooooooooooo')
      let title = this.data.currentDateText
      let text = e.currentTarget.dataset.text
      let time = e.currentTarget.dataset.time
      this.triggerEvent('setTime', {text: title + ' ' + text, key: time})
    }
  }
})
