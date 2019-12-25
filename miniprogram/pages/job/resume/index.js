// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
Component({
  properties: {
    searchData: {
      type: Object,
      observer: function (newObj, oldObj) {
        this.getTicketInfo(newObj)
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    startAddress: '请选择',
    endAddress: '请选择',
    HistoricalRecord: [],
    RecommendedRoute: [],
    type: ''
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {

    },
    moved: function () { },
    detached: function () { },
  },
  methods: {
    checkboxChange (checkObj) {
      console.log(checkObj)
    },
    toJobDetail () {
      
    }
  }
})