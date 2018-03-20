
function tryGetSfz(){
  var sfz = wx.getStorageSync('sfz')
  if(sfz == null || sfz == undefined){
    setSfz();
    setUserInfo();
  }
  return wx.getStorageSync('sfz')
}

function tryGetUserInfo() {
  var userInfo = wx.getStorageSync('userInfo')
  if (userInfo == null || userInfo == undefined) {
    setUserInfo();
  }
  return wx.getStorageSync('userInfo')
}

function setSfz(){
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
              if (jsondata.sfz != 0){
                wx.setStorage({
                  key: "sfz",
                  data: jsondata.sfz
                })
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });    
}

function setUserInfo(){
  wx.getUserInfo({
    success: function (res) {
      var userInfo = res.userInfo
      wx.setStorage({
        key: "userInfo",
        data: userInfo
      })
    }
  });
}

module.exports = {
  tryGetSfz: tryGetSfz,
  setUserInfo : setUserInfo
}