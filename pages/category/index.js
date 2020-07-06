import request from '../../request/index'
// pages/category/index.js
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],
  onLoad: function (options) {
    // 添加缓存(相当于localStorage)，没有数据时再请求数据
    const Cates = wx.getStorageSync("cates");
    // 1min后,数据超时，重新发送请求
    let flag = Date.now() - Cates.time > 1000*60;
    if (!Cates || flag) {
      // 没有数据或数据超时，发送请求
      this.getCates();
      return;
    }
    // 数据未过期，使用数据
    this.Cates = Cates.data;
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 获取分类数据
  async getCates() {
    let url = '/categories';
    let res = await request.get(url)
    this.Cates = res.data.message;
    wx.setStorageSync("cates", {time: Date.now(), data: this.Cates});;
    // 构建左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单栏的点击事件
  handleItemTap(e) {
    const {index} = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }

})