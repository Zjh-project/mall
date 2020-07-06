const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
class request {
  get (url, data = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
          url: baseUrl + url,
          data,
          header: {'content-type':'application/json'},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (result)=>{
            resolve(result)
          },
          fail: (err)=>{
            reject(err)
          }
      });
    })
  }
}
export default new request();