//index.js
//获取应用实例
var app = getApp()
var WxSearch = require('../../wxSearch/wxSearch.js')
var musicPlay;
var mUrl = "";
Page({
  toggleMusic: function(){
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        musicPlay = res.status
      }
    });
    var playState = "";
    if (musicPlay == undefined || musicPlay == 2) {//无音乐
      if (mUrl != null && mUrl != "" && mUrl != undefined){
        wx.playBackgroundAudio({
          dataUrl: mUrl
        });
        playState = "rotate";
      }else{
        return
      }
    }
    if(musicPlay == 1){//播放中
      playState = "";
      wx.pauseBackgroundAudio();
    }
    if(musicPlay == 0){//暂停中
      playState = "rotate";
      wx.playBackgroundAudio();
    }
    var that = this;
    that.setData({
      playState : playState,
      zoomIn : "zoomIn"
    });
  },
  onShareAppMessage: function () {
    return {
      title: '还在玩王者荣耀？大家都在学习英语词根，就差你了~',
      path: '/pages/index/index',
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
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //初始化的时候渲染wxSearchdata 第二个为你的search高度
    WxSearch.init(that, 43, ['weappdev', '小程序', 'wxParse', 'wxSearch', 'wxNotification']);
  //  WxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
    
    //播放背景音乐
    wx.request({
      url: 'https://odin.bajiaoshan893.com/Music/getMusicUrl',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var dataObj = JSON.parse(res.data)

        //设置mUrl
        var hasMusic = false
        if (dataObj.mUrl != null && dataObj.mUrl != "" && dataObj.mUrl != undefined){
          mUrl = dataObj.mUrl
          hasMusic = true
        }

        //设置brandName
        var wannaSay = dataObj.wannaSay
        if (wannaSay == null || wannaSay == "" || wannaSay == undefined){
          wannaSay = "ODIN'S EYE词根词典"
        }
        that.setData({
          playState : "",
          brandName : wannaSay,
          hasMusic : hasMusic
        });
      }
    });
    
  },
  onShow: function (){
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        musicPlay = res.status
      }
    });
    if(musicPlay == 0){
      var that = this;
      that.setData({
        playState: ""
      });
    }
    
  },
  previewImage() {
    wx.previewImage({
      current: 'http://or5tvkzs8.bkt.clouddn.com/image/promote/shrek4e.jpg', // 当前显示图片的http链接
      urls: ['http://or5tvkzs8.bkt.clouddn.com/image/promote/shrek4e.jpg'] // 需要预览的图片http链接列表
    })
  },
  wxSearchFn: function (e) {
    var that = this
    //WxSearch.wxSearchAddHisKey(that);

  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSearchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
    that.setData({
      showUserInfo : "none",
      showFooter : "none"
    });
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
    that.setData({
      showUserInfo: "flex",
      showFooter: "block"
    });
  }
})
