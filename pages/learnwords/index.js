
var UserInfo = require('../userInfo/userInfo.js');
var group = 1;
Page({
  toMainPage: function (e) {
    var progress = e.target.dataset.progress
    var group = e.target.dataset.group
    var portionToday = e.target.dataset.portion
    wx.navigateTo({
      url: '../learnwords/main?progress=' + progress + '&group=' + group + '&portionToday=' + portionToday 
    });
  },
  onShow: function () {
    var sfz = UserInfo.tryGetSfz();
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
  },
  onLoad: function (options) {
    group = options.group
    if (group == null || group == undefined){
      group = 1
    }
  }
})
