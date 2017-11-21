var base64 = require("../images/base64");


Page({
  toMainPage: function (e) {
    var progress = e.target.dataset.progress
    var group = e.target.dataset.group
    wx.navigateTo({
      url: '../learnwords/main?progress=' + progress + '&group=' + group
    });
  },
  onLoad: function (options) {
    var group = options.group
    if (group == null || group == undefined){
      group = 1
    }
    var sfz = wx.getStorageSync('sfz')
    var that = this;
    wx.request({
      url: 'https://odin.bajiaoshan893.com/LearnWord/showTaskInfo',
      data: {
        'userId': sfz,
        'group': group
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var msg = res.data
        var dataObj = JSON.parse(msg);

        that.setData({
          dataObj: dataObj
        });
      }
    });
  }
})
