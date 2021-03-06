
//index.js
//获取应用实例
var app = getApp()
var UserInfo = require('../userInfo/userInfo.js')
var morphemeId = 1
var count = 0;
var flag = "";
Page({
  data: {
    pageNo: 0,
    pageSize: 10,
    hasMoreData: true,
    contentList: []
  },
  openExplanation: function (e) {
    wx.showModal({
      title: e.target.dataset.word,
      content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
      confirmText: "有用",
      cancelText: "关闭",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击主操作')
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
  },
  //事件处理函数
  showSimilarWords: function (e) {
    var wId = e.target.dataset.id
    var root = e.target.dataset.root
    wx.navigateTo({
      url: '../similarwordlist/index?wId=' + wId
    })
  },
  getWordList: function () {
    var that = this
    wx.request({
      url: 'https://odin.bajiaoshan893.com/Morph/showWordsByMorphemeJsonPaging',
      data: {
        'morphemeId': morphemeId,
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
        
          //--转换translation的<br/>
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
          //--转换translation的<br/>
          that.data.contentList = that.data.contentList.concat(wordList)
          dataObj.wordList = that.data.contentList
          that.setData({
            dataObj: dataObj
          });
        }
      }
    });
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getWordList()
    } else {
      wx.showToast({
        title: '已经到底了',
      })
    }
  },
  onLoad: function (options) {
    morphemeId = options.morphemeId;
    this.getWordList()
    var that = this
    var sfz = UserInfo.tryGetSfz();
    //TODO 
    wx.request({
      url: 'https://odin.bajiaoshan893.com/CollectRoot/showCollectByRoot',
      data: {
        "rootId": morphemeId,
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
          var collectRootClass = "done"
          var showText = "已收藏"
        } else {
          var collectRootClass = "undone"
          var showText = "收藏"
        }

        that.setData({
          count: count,
          collectRootClass: collectRootClass,
          showText: showText
        });
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: '天了噜！用这个词根，我一下记住了好多单词！',
      path: '/pages/wordlist/index?morphemeId=' + morphemeId,
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
  toggleCollectRoot: function () {
    var sfz = UserInfo.tryGetSfz();
    var that = this;
    if (flag == "false") {
      wx.request({
        url: 'https://odin.bajiaoshan893.com/CollectRoot/addCollectRoot',
        data: {
          "rootId": morphemeId,
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
            var collectRootClass = "done"
          }
          that.setData({
            count: count,
            collectRootClass: collectRootClass,
            showText:"已收藏"
          });
        }
      });
    } else {
      wx.request({
        url: 'https://odin.bajiaoshan893.com/CollectRoot/deleteCollectRoot',
        data: {
          "rootId": morphemeId,
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
            var collectRootClass = "undone"
          }
          that.setData({
            count: count,
            collectRootClass: collectRootClass,
            showText: "收藏"
          });
        }
      });
    }
  }
})
