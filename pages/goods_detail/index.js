import { showToast } from '../../utils/asyncWx'
import request from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length -1];
    let options = currentPage.options;
    
    const {goods_id} = options;
    this.getGoodsDetail(goods_id)
  },
  // 获取商品详情数据
  async getGoodsDetail (goods_id) {
    const goodsObj = await request.get('/goods/detail', {goods_id});
    this.GoodsInfo = goodsObj;
    let collect = wx.getStorageSync('collect') || [];
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // .webp => .jpg
        goods_introduce: goodsObj.goods_introduce.replace('/\.webp/g', '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图放大预览
  handlePreviewImage (e) {
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls: urls
    });
  },
  // 点击 加入购物车
  async handleCartAdd () {
    let cart = wx.getStorageSync('cart') || [];
    // 获取购物车当前商品的下标
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 不存在时添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo)
    } else {
      // 存在时数量++
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    await showToast('加入成功', 'success', true)
  },
  async handleCollect () {
    let collect = wx.getStorageSync("collect") || [];
    let isCollect = false
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      collect.push(
        this.GoodsInfo
      );
      isCollect = true;
      await showToast('收藏成功', 'success')
    } else {
      collect.splice(index, 1)
      isCollect = false
      await showToast('取消收藏', 'none')
    }
    wx.setStorageSync("collect", collect)
    this.setData({ isCollect })
  }
})