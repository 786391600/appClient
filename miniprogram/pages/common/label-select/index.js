// pages/common/label-select/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    labels: {
      value: [],
      type: Array
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    labelClick(e) {
      let that = this;
      let index = e.currentTarget.dataset.currentindex;
      this.setData({
        activeIndex: index
      })
      this.triggerEvent('change', {data: that.data.labels[index]})
    }
  }
})
