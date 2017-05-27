var base64 = require("../images/base64");

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
    var morphemeId = options.morphemeId;
    var that = this
    wx.request({
      url: 'https://odin.bajiaoshan893.com/Morph/showWordsByMorphemeJson',
      data: {
        'morphemeId': morphemeId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var msg = res.data
        console.log(msg)
        if (msg == 'noresult') {
          return;
        }
        var dataObj = JSON.parse(msg);
        console.log(dataObj);

        that.setData({
          msg: msg
        });
      }
    })
  }
})
