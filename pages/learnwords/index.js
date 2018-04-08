
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
  getTaskInfo: function () {
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
  toHardWords:function(){
    wx.navigateTo({
      url: '../learnwords/hardwords?&group=' + group
    });
  },
  resetLearnWords: function () {
    var that = this
    wx.showModal({
      title: '重置学习计划',
      content: '提示：本次操作将清除此列表的所有学习记录！确认重置吗？',
      confirmText: "确认",
      cancelText: "返回",
      success: function (res) {
        if (res.confirm) {
          var sfz = UserInfo.tryGetSfz();
          var sId = wx.getStorageSync('sId')
          wx.request({
            url: 'https://odin.bajiaoshan893.com/LearnWord/resetLearnWords',
            data: {
              'userId': sfz,
              'group': group
            },
            header: {
              'content-type': 'application/json',
              'Cookie': 'PHPSESSID='+sId
            },
            success: function (res) {
              var msg = res.data
              var dataObj = JSON.parse(msg);
              if (dataObj.result == "ok"){
                //操作成功
                wx.showToast({
                  title: '重置完成',
                  icon: 'success',
                  duration: 1000
                });
                that.getTaskInfo()
              } else if (dataObj.result == "wrongAuth"){
                UserInfo.initSfzAndSession()
                var sfz = wx.getStorageSync('sfz')
                var sId = wx.getStorageSync('sId')
                wx.request({
                  url: 'https://odin.bajiaoshan893.com/LearnWord/resetLearnWords',
                  data: {
                    'userId': sfz,
                    'group': group
                  },
                  header: {
                    'content-type': 'application/json',
                    'Cookie': 'PHPSESSID=' + sId
                  },
                  success: function (res) {
                    var msg = res.data
                    var dataObj = JSON.parse(msg);
                    if (dataObj.result == "ok") {
                      //操作成功
                      wx.showToast({
                        title: '重置完成',
                        icon: 'success',
                        duration: 1000
                      });
                      that.getTaskInfo()
                    } else {
                      wx.showToast({
                        title: '重置失败',
                        icon: 'failure',
                        duration: 3000
                      });
                    }
                  }
                });
              }else{
                wx.showToast({
                  title: '重置失败',
                  icon: 'failure',
                  duration: 3000
                });
              }
            }
          });
        } else {

        }
      }
    });
  },
  onShow: function () {
    this.getTaskInfo();
  },
  onLoad: function (options) {
    group = options.group
    if (group == null || group == undefined){
      group = 1
    }
  }
})
