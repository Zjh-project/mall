import request from '../../request/index'
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from '../../utils/asyncWx'
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow () {
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v => v.checked);
    this.setData({
      address
    })
    this.setCart(cart);
  },
  setCart (cart) {
    // z总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num*v.goods_price;
        totalNum += v.num;
      }
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
    })
  },
  async play () {
    try {
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      const order_price = this.data.totalPrice;
      const consignee_add = this.data.address.all;
      const cart = this.data.cart
      let goods = [];
      cart.forEach(v => goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.price
      }))
      const oderParams = { order_price, consignee_add, goods };
      //发送请求获取订单号参数
      const { order_number } = await request.post("/my/orders/create", oderParams);
      //发支付接口
      const { pay } = await request.post("/my/orders/req_unifiedorder", { order_number });
      //发起微信支付
      await requestPayment(pay)
          //查看后台订单状态
      const res = await request.post("/my/orders/chkOrder", { order_number });
      await showToast({ title: "支付成功" });
      //删除支付后对商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      // 支付成功了 跳转到订单页面
      wx.navigateTo({
          url: '/pages/order/index'
      });
    } catch (err) {
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        mask: true,
        success: () => {
          console.log(err);
        },
        complete: () => {
          wx.navigateBack({ 
            delta: 1
          });
        }
      });
    }
  }
})