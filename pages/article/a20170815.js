var count = 0;
var flag = "";
Page({
  toggleThumbup: function () {
    var sfz = wx.getStorageSync('sfz')
    var that = this;
    if (flag == "false") {
      wx.request({
        url: 'https://odin.bajiaoshan893.com/Thumbup/addThumbup',
        data: {
          "articleId": 2,
          'userId': sfz
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var dataObj = JSON.parse(res.data)
          var result = dataObj.result
          if (result == "success") {
            flag = "true"
            count += 1
            var thumbupClass = "done"
          }
          that.setData({
            count: count,
            thumbupClass: thumbupClass
          });
        }
      });
    } else {
      wx.request({
        url: 'https://odin.bajiaoshan893.com/Thumbup/deleteThumbup',
        data: {
          "articleId": 2,
          'userId': sfz
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var dataObj = JSON.parse(res.data)
          var result = dataObj.result
          if (result == "success") {
            flag = "false"
            count -= 1
            var thumbupClass = "undone"
          }
          that.setData({
            count: count,
            thumbupClass: thumbupClass
          });
        }
      });
    }
  },
  onShareAppMessage: function () {
    return {
      title: '揭秘英语单词学习的正确方法',
      path: '/pages/article/a20170815',
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
    var sfz = wx.getStorageSync('sfz')
    var that = this;
    //TODO 
    wx.request({
      url: 'https://odin.bajiaoshan893.com/Thumbup/showThumbupByArticle',
      data: {
        "articleId": 2,
        'userId': sfz
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var dataObj = JSON.parse(res.data)
        count = parseInt(dataObj.cnt)
        flag = dataObj.flg
        if (flag == "true") {
          var thumbupClass = "done"
        } else {
          var thumbupClass = "undone"
        }

        that.setData({
          count: count,
          thumbupClass: thumbupClass
        });
      }
    });
  }
});