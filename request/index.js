
let num = 0;
const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';

class request {
  get (url, data = {}) {
    // 开启loading
    wx.showLoading({
      title: '努力获取数据',
    });
    num++;
    return new Promise((resolve, reject) => {
      wx.request({
          url: baseUrl + url,
          data,
          header: {'content-type':'application/json'},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: result => {
            resolve(result.data.message)
            num--;
          },
          fail: err => {
            reject(err)
            num--;
          },
          complete: () => {
            // 关闭loading
            (num !== 0) || wx.hideLoading();
          }
      });
    })
  }
  post (url, data = {}, header = {}) {
    if (url.includes('/my/')) {
      header['Authorization'] = wx.getStorageSync('token');
    }
    // 开启loading
    wx.showLoading({
      title: '努力获取数据',
    });
    num++;
    return new Promise((resolve, reject) => {
      wx.request({
          url: baseUrl + url,
          data,
          header,
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: result => {
            resolve(result.data.message)
            num--;
          },
          fail: err => {
            reject(err)
            num--;
          },
          complete: () => {
            // 关闭loading
            (num !== 0) || wx.hideLoading();
          }
      });
    })
  }
}
export default new request();