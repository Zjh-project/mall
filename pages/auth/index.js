import request from '../../request/index'
import { login } from '../../utils/asyncWx'

Page({
  async handleGetUserInfo (e) {
    try {
      const {encryptedData, rawData, iv, signature} = e.detail;
      const {code} = await login();
      const loginParams = {encryptedData, rawData, iv, signature, code};
      const res = await request.post('/users/wxlogin', loginParams);
      wx.setStorageSync('token', res ? res.token : "021xRW7i11b5Ev0uiSC7i1SL48i1xRW7Q")
      wx.navigateBack({
        delta: 1
      });
    } catch (err) {
      console.log(err);
    }
  }
})