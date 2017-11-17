var base64 = require("../images/base64");

//点赞
var count = 0;
var flag = "";
var articleId = -1

var app = getApp()
var morphemeId = 1
var shareType = 0
var shareCapital = ''
var letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
Page({
  data: {
    array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y','z'],
    index: 0
  },
  bindPickerChange: function (e) {
    var capital = letterArray[e.detail.value]
    wx.redirectTo({
      url: '../morphemelist/index?capital=' + capital
    })
  }, 
  showwordlist: function (e) {
    var id = e.target.dataset.mid
    wx.navigateTo({
      url: '../wordlist/index?morphemeId=' + id
    });
  },
  onShareAppMessage: function () {
    var title = ''
    var path = ''
    if (shareType == 1){
      title = "TOP1-100高频词根，这份武林宝典，请收好"
      path = "/pages/morphemelist/index?capital=100"
    } else if (shareType == 2) {
      title = "TOP101-200高频词根，这份武林宝典，请收好"
      path = "/pages/morphemelist/index?capital=200"
    } else if (shareType == 3) {
      title = "TOP201-300高频词根，这份武林宝典，请收好"
      path = "/pages/morphemelist/index?capital=300"
    } else {
      title = "首字母" + shareCapital + "的词根列表，这份武林宝典，请收好"
      path = "/pages/morphemelist/index?capital=" + shareCapital
    } 
    return {
      title: title,
      path: path,
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
  learnWords: function () {
    var group = e.target.dataset.group
    wx.navigateTo({
      url: '../learnWords/index?group=' + group
    });
  },
  toggleThumbup: function () {
    var sfz = wx.getStorageSync('sfz')
    var that = this;
    if (flag == "false") {
      wx.request({
        url: 'https://odin.bajiaoshan893.com/Thumbup/addThumbup',
        data: {
          "articleId": articleId,
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
          "articleId": articleId,
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
  onLoad: function (options) {
    var capital = options.capital
    if(capital == null || capital == undefined){
      capital = 'a'
    }

    var that = this;
    wx.request({
      url: 'https://odin.bajiaoshan893.com/Morph/showMorphemesByCapitalJson',
      data: {
        'capital': capital
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var msg = res.data
        if (msg == 'noresult') {
          return;
        }
        var dataObj = JSON.parse(msg);

        //--转换translation的<br/>
        var morphList = dataObj.morphList;
        shareType = dataObj.showType
        shareCapital = dataObj.capital
        var num = 1;
        for (var i = 0; i < morphList.length;i++){
          morphList[i]['num'] = num++
        }
        //--转换translation的<br/>

        that.setData({
          dataObj: dataObj
        });
      }
    });

  //点赞
    if (capital == '100') {
      articleId = 3
    } else if (capital == '200') {
      articleId = 4
    } else if (capital == '300') {
      articleId = 5
    } else if (capital == 'a') {
      articleId = 6
    } else if (capital == 'b') {
      articleId = 7
    } else if (capital == 'c') {
      articleId = 8
    } else if (capital == 'd') {
      articleId = 9
    } else if (capital == 'e') {
      articleId = 10
    } else if (capital == 'f') {
      articleId = 11
    } else if (capital == 'g') {
      articleId = 12
    } else if (capital == 'h') {
      articleId = 13
    } else if (capital == 'i') {
      articleId = 14
    } else if (capital == 'j') {
      articleId = 15
    } else if (capital == 'k') {
      articleId = 16
    } else if (capital == 'l') {
      articleId = 17
    } else if (capital == 'm') {
      articleId = 18
    } else if (capital == 'n') {
      articleId = 19
    } else if (capital == 'o') {
      articleId = 20
    } else if (capital == 'p') {
      articleId = 21
    } else if (capital == 'q') {
      articleId = 22
    } else if (capital == 'r') {
      articleId = 23
    } else if (capital == 's') {
      articleId = 24
    } else if (capital == 't') {
      articleId = 25
    } else if (capital == 'u') {
      articleId = 26
    } else if (capital == 'v') {
      articleId = 27
    } else if (capital == 'w') {
      articleId = 28
    } else if (capital == 'x') {
      articleId = 29
    } else if (capital == 'y') {
      articleId = 30
    } else if (capital == 'z') {
      articleId = 31
    }
    var sfz = wx.getStorageSync('sfz')
    var that = this;
    //TODO 
    wx.request({
      url: 'https://odin.bajiaoshan893.com/Thumbup/showThumbupByArticle',
      data: {
        "articleId": articleId,
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
})
