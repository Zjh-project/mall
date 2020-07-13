import request from '../../request/index'
Page({
  data: {
    tabs: [{
      id: 0,
      value: '综合',
      isActive: true
    }, {
      id: 1,
      value: '销量',
      isActive: false
    }, {
      id: 2,
      value: '价格',
      isActive: false
    }],
    goodsList: []
  },
  totalPage: 1,
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },
  // 获取商品列表数据
  async getGoodsList () {
    let url = '/goods/search';
    let res = await request.get(url, this.QueryParams)
    const total = res.total;
    this.totalPage = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 关闭下拉刷新
    wx.stopPullDownRefresh();
  },
  // 标题点击事件，从子组件传递而来
  handleTabsItemChange (e) {
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs = tabs.map((v,i) => {
      v.isActive = i===index;
      return v;
    })
    this.setData({
      tabs
    })
  },
  // 滚动条触底事件
  onReachBottom () {
    if (this.QueryParams.pagenum >= this.totalPage) {
      wx.showToast({
        title: '没有下一页数据了',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList(); 
    }
  },
  // 下拉刷新
  onPullDownRefresh () {
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 发送请求
    this.getGoodsList();
  }
})