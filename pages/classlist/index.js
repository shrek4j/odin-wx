var base64 = require("../images/base64");
Page({
  onLoad: function () {
    this.setData({
      icon: base64.icon20
    });
  },
  previewImage(){
    wx.previewImage({
      current: 'http://or5tvkzs8.bkt.clouddn.com/image/promote/wechatClass1.png', // 当前显示图片的http链接
      urls: ['http://or5tvkzs8.bkt.clouddn.com/image/promote/wechatClass1.png'] // 需要预览的图片http链接列表
    })
  }
});