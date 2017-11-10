//app.js
App({
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) { 
          //发起网络请求
          wx.request({
            url: 'https://odin.bajiaoshan893.com/Login/onLogin',
            data: {
              code: res.code
            },
            success: function (res) {
              var jsondata = JSON.parse(res.data);
              wx.setStorage({
                key: "sfz",
                data: jsondata.sfz
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        wx.setStorage({
          key: "userInfo",
          data: userInfo
        })
      }
    });

    //调用API从本地缓存中获取数据
   // var logs = wx.getStorageSync('logs') || []
   // logs.unshift(Date.now())
   // wx.setStorageSync('logs', logs)
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