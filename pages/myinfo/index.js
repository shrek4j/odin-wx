var base64 = require("../images/base64");
Page({
  onLoad: function () {
    try {
      var userInfo = wx.getStorageSync('userInfo')
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