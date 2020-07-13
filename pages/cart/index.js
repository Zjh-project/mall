import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx'
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow () {
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      address
    })
    this.setCart(cart);
  },
  // 点击 收货地址
  async addressChoose () {
    try {
      // 获取权限
      const setting = await getSetting();
      const scopeAddress = setting.authSetting["scope.address"];
      // 获取地址权限状态
      // 不能取反，因为 undefined 时不走这个判断
      if (scopeAddress === false) {
        // 打开授权窗口
        await openSetting(); 
      }
      // 调用收获地址api
      let address = await chooseAddress();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error)
    }
  },
  // 选中商品
  handleItemChange (e) {
    const goods_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  setCart (cart) {
    // 计算全选
    let allChecked = true;
    // z总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num*v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })

    allChecked = cart.length > 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart);
  },
  // 商品全选功能
  handleItemAllChange () {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart)
  },
  // 商品数量
  async numChange (e) {
    const {opration, id} = e.currentTarget.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && opration === -1) {
      const res = await showModal('您是否要删除该商品？');
      if(res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += opration;
      this.setCart(cart)
    }
  },
  async allPlay () {
    const {address, totalNum} = this.data;
    if (!address.userName) {
      await showToast('请先添加收货地址!');
      return;
    }
    if (totalNum === 0) {
      await showToast('您还没有选购商品!');
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})