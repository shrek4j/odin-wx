var UserInfo = require('../userInfo/userInfo.js')

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
    index: 0,
    capital: 'a',
    pageNo: 0,
    pageSize: 10,
    hasMoreData : true,
    contentList: []
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
  learnWords: function (e) {
    var group = e.target.dataset.group
    wx.navigateTo({
      url: '../learnwords/index?group=' + group
    });
  },
  toggleThumbup: function () {
    var sfz = UserInfo.tryGetSfz();
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
  getMorphemes:function(){
    var that = this;
    wx.request({
      url: 'https://odin.bajiaoshan893.com/Morph/showMorphemesByCapitalJsonPaging',
      data: {
        'capital': that.data.capital,
        'pageNo': that.data.pageNo,
        'pageSize': that.data.pageSize
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
        
        var morphList = dataObj.morphList;
        if(morphList == null || morphList == undefined || morphList.length == 0){
          that.data.hasMoreData = false
          wx.showToast({
            title: '已经到底了',
          })
        }else{
          that.data.pageNo += 1
          
          //判断是否到底的逻辑
          if (that.data.capital == '100' || that.data.capital == '200' || that.data.capital == '300'){
            if (that.data.pageNo * that.data.pageSize == 100) {
              that.data.hasMoreData = false
            }
          }else{
            if (morphList.length < that.data.pageSize){
              that.data.hasMoreData = false
            }
          }
          
          shareType = dataObj.showType
          shareCapital = dataObj.capital
          var num = 1;
          for (var i = 0; i < morphList.length; i++) {
            morphList[i]['num'] = num + ((that.data.pageNo - 1) * that.data.pageSize)
            num++
          }
          that.data.contentList = that.data.contentList.concat(morphList)
          dataObj.morphList = that.data.contentList
          that.setData({
            dataObj: dataObj
          });
        }
        
      }
    });
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getMorphemes()
    } else {
      wx.showToast({
        title: '已经到底了',
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    that.data.capital = options.capital
    if (that.data.capital == null || that.data.capital == undefined){
      that.data.capital = 'a'
    }
    this.getMorphemes()
  //点赞
    if (that.data.capital == '100') {
      articleId = 3
    } else if (that.data.capital == '200') {
      articleId = 4
    } else if (that.data.capital == '300') {
      articleId = 5
    } else if (that.data.capital == 'a') {
      articleId = 6
    } else if (that.data.capital == 'b') {
      articleId = 7
    } else if (that.data.capital == 'c') {
      articleId = 8
    } else if (that.data.capital == 'd') {
      articleId = 9
    } else if (that.data.capital == 'e') {
      articleId = 10
    } else if (that.data.capital == 'f') {
      articleId = 11
    } else if (that.data.capital == 'g') {
      articleId = 12
    } else if (that.data.capital == 'h') {
      articleId = 13
    } else if (that.data.capital == 'i') {
      articleId = 14
    } else if (that.data.capital == 'j') {
      articleId = 15
    } else if (that.data.capital == 'k') {
      articleId = 16
    } else if (that.data.capital == 'l') {
      articleId = 17
    } else if (that.data.capital == 'm') {
      articleId = 18
    } else if (that.data.capital == 'n') {
      articleId = 19
    } else if (that.data.capital == 'o') {
      articleId = 20
    } else if (that.data.capital == 'p') {
      articleId = 21
    } else if (that.data.capital == 'q') {
      articleId = 22
    } else if (that.data.capital == 'r') {
      articleId = 23
    } else if (that.data.capital == 's') {
      articleId = 24
    } else if (that.data.capital == 't') {
      articleId = 25
    } else if (that.data.capital == 'u') {
      articleId = 26
    } else if (that.data.capital == 'v') {
      articleId = 27
    } else if (that.data.capital == 'w') {
      articleId = 28
    } else if (that.data.capital == 'x') {
      articleId = 29
    } else if (that.data.capital == 'y') {
      articleId = 30
    } else if (that.data.capital == 'z') {
      articleId = 31
    }
    var sfz = UserInfo.tryGetSfz();
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
