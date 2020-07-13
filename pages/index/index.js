import request from '../../request/index'
wx-Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  getSwiperList () {
    let url = '/home/swiperdata';
    request.get(url).then(res => {
      this.setData({
        swiperList: res
      })
    })
  },
  getCateList () {
    let url = '/home/catitems';
    request.get(url).then(res => {
      this.setData({
        catesList: res
      })
    })
  },
  getFloorList () {
    let url = '/home/floordata';
    request.get(url).then(res => {
      this.setData({
        floorList: res
      })
    })
  },
})