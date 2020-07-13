  
import { request } from "../../request/index";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [{
            "order_number": "HMDD20190802000000000428",
            "order_price": 13999,
            "create_time": 1564731518
        }, {
            "order_number": "HMDD20190802000000000428",
            "order_price": 13999,
            "create_time": 1564731518
        }, {
            "order_number": "HMDD20190802000000000428",
            "order_price": 13999,
            "create_time": 1564731518
        }, {
            "order_number": "HMDD20190802000000000428",
            "order_price": 13999,
            "create_time": 1564731518
        }],
        //Tabs数据
        tabs: [{
            id: 0,
            value: '全部',
            isActive: true
        }, {
            id: 1,
            value: '待付款',
            isActive: false
        }, {
            id: 2,
            value: '待发货',
            isActive: false
        }, {
            id: 3,
            value: '退款/退货',
            isActive: false
        }]
    },
    onShow() {
        //判断是否登陆
        const token = wx.getStorageSync('token')
        if (!token) {
            wx.navigateTo({
                url: '/pages/auth/index',
            });
            return;
        }

        let pages = getCurrentPages();
        let { type } = pages[pages.length - 1].options;
        this.getOrderList(type)
    },
    //获取订单方法
    async getOrderList(type) {
        // const res = await request.get('/my/orders/all', type)
        // this.setData({
        //     orders: res.orders.map(v => ({...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
        // })
        //const res = await request.get(url: '/my/orders/all', type)
        let orders = this.data.orders;
        let newOrders = orders.map(v => ({...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
        this.setData({
            orders: newOrders
        })
    },
    //切换Tab栏
    tabsItemChange(e) {
        const id = e.detail.index;
        const tabs = this.data.tabs;
        tabs.forEach((v, i) => i === id ? v.isActive = true : v.isActive = false)
        this.setData({
            tabs
        })
    }
})