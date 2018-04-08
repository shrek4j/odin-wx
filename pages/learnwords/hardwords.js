
var UserInfo = require('../userInfo/userInfo.js');
var group = 1;

Page({
  data: {
    pageNo: 0,
    pageSize: 10,
    hasMoreData: true,
    contentList: []
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getHardWords();
    } else {
      wx.showToast({
        title: '已经到底了',
      })
    }
  },
  getHardWords:function (){
    var that = this;
    var sfz = UserInfo.tryGetSfz();
    wx.request({
      url: 'https://odin.bajiaoshan893.com/LearnWord/toHardWords',
      data: {
        'userId': sfz,
        'group': group,
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

        var wordList = dataObj.wordList;
        if (wordList == null || wordList == undefined || wordList.length == 0) {
          that.data.hasMoreData = false
          wx.showToast({
            title: '已经到底了',
          })
        } else {
          that.data.pageNo += 1

          //判断是否到底的逻辑
          if (wordList.length < that.data.pageSize) {
            that.data.hasMoreData = false
          }

          var num = 1;
          for (var i = 0; i < wordList.length; i++) {
            wordList[i]['num'] = num + ((that.data.pageNo - 1) * that.data.pageSize)
            num++
            var trans = wordList[i].translation
            var tranArr = trans.split('<br/>')
            if (tranArr == null || tranArr == undefined || tranArr == '' || tranArr.length == 0) {
              continue;
            } else {
              tranArr = tranArr.slice(0, tranArr.length - 1)
              wordList[i]['tranList'] = tranArr
            }
          }
          that.data.contentList = that.data.contentList.concat(wordList)
          dataObj.wordList = that.data.contentList
          that.setData({
            dataObj: dataObj
          });
        }

      }
    });
  },
  onLoad: function (options) {
    group = options.group;
    this.getHardWords();
  }

})
