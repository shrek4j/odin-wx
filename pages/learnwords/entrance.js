
//index.js
//获取应用实例
var app = getApp()
Page({
  learnWords: function (e) {
    var group = e.target.dataset.group
    wx.navigateTo({
      url: '../learnwords/index?group=' + group
    });
  },
  onLoad: function (options) {
   
  }
})
