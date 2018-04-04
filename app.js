//app.js
var UserInfo = require('pages/userInfo/userInfo.js');

App({
  onLaunch: function () {
    UserInfo.initSfzAndSession();
    UserInfo.setUserInfo();
  },

  onHide: function(){
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var musicPlay = res.status
        if (musicPlay == 1) {//播放中
          wx.pauseBackgroundAudio();
        }
      }
    });
  }
})