var UserInfo = require('../userInfo/userInfo.js')
Page({
  onLoad: function () {
    try {
      var userInfo = tryGetUserInfo()
      if (userInfo) {
        var avatarUrl = userInfo.avatarUrl
        var nickName = userInfo.nickName
      }else {
        var avatarUrl = ""
        var nickName = "游客"
      }
    } catch (e) {
      var avatarUrl = ""
      var nickName = "游客"
    }
    this.setData({
      avatarUrl : avatarUrl,
      nickName : nickName
    });
  }
});