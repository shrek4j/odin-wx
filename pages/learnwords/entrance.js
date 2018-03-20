
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
  onShareAppMessage: function () {
    return {
      title: '轻松记单词，了解一下？',
      path: '/pages/learnwords/entrance',
      success: function (res) {
        wx.showToast({
          title: '转发成功！',
          icon: 'success',
          duration: 1500
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败，请稍后再试',
          duration: 1500
        })
      }
    }
  },
  onLoad: function (options) {
   
  }
})
