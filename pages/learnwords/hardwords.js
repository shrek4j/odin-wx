
var UserInfo = require('../userInfo/userInfo.js');
var group = 1;
var totalCount = 0;
Page({
  data: {
    pageNo: 0,
    start: 0,
    pageSize: 5,
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
  toRootPage: function (e) {
    var rootid = e.target.dataset.rootid
    wx.navigateTo({
      url: '../wordlist/index?morphemeId=' + rootid
    });
  },
  playAudio: function (e) {
    var word = e.target.dataset.word
    wx.playBackgroundAudio({
      dataUrl: "http://word.audio.odinseyedict.com/audio/word/" + word + ".mp3",
      title: '',
      coverImgUrl: ''
    })
  },
  setLearnt: function(e){
    var that = this;
    var wordId = e.target.dataset.wordid;
    var word = e.target.dataset.word;
    var sfz = UserInfo.tryGetSfz();
    wx.request({
      url: 'https://odin.bajiaoshan893.com/LearnWord/setLearnt',
      data: {
        'userId': sfz,
        'group': group,
        'wordId': wordId
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
        if(dataObj.result == 'ok'){
          for (var i = 0; i < that.data.contentList.length;i++){
            if (that.data.contentList[i].id == wordId){
              if (totalCount > 0) {
                totalCount -= 1
              }
              if (that.data.start > 0) {
                that.data.start -= 1
              }
              that.data.contentList[i].learnt = 1
            }
          }
        }
        that.setData({
          contentList: that.data.contentList,
          group: group,
          totalCount: totalCount
        });
        wx.showToast({
          title: '已设为已掌握',
        })
      }
    });
  },
  getHardWords:function (){
    var that = this;
    var sfz = UserInfo.tryGetSfz();
    wx.request({
      url: 'https://odin.bajiaoshan893.com/LearnWord/toHardWords',
      data: {
        'userId': sfz,
        'group': group,
        'start' : that.data.start,
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
        if (dataObj.totalCount != null && dataObj.totalCount != undefined){
          totalCount = dataObj.totalCount;
        }
        var wordList = dataObj.wordList;
        if (wordList == null || wordList == undefined || wordList.length == 0) {
          that.data.hasMoreData = false
          var title = '已经到底了'
          if (that.data.start == 0) {
            title = '暂无生词'
          }
          wx.showToast({
            title: title,
          })
          that.setData({
            group: group,
            totalCount: totalCount
          });
        } else {

          //判断是否到底的逻辑
          if (wordList.length < that.data.pageSize) {
            that.data.hasMoreData = false
          }

          var num = 1;
          for (var i = 0; i < wordList.length; i++) {
            wordList[i]['num'] = num + that.data.pageNo * that.data.pageSize
            num++
            var trans = wordList[i].translation
            var tranArr = trans.split('<br/>')
            if (tranArr == null || tranArr == undefined || tranArr == '' || tranArr.length == 0) {
              continue;
            } else {
              tranArr = tranArr.slice(0, tranArr.length - 1)
              wordList[i]['tranList'] = tranArr
            }
            for (var j = 0; j < wordList[i].roots.length; j++) {
              if (wordList[i].roots[j].true_root == null) {
                wordList[i].roots[j].true_root = wordList[i].roots[j].word_root
              }
            }
          }
          that.data.contentList = that.data.contentList.concat(wordList)
          that.setData({
            contentList: that.data.contentList,
            group: group,
            totalCount: totalCount
          });

          that.data.start += that.data.pageSize;
          that.data.pageNo += 1;
        }

      }
    });
  },
  onLoad: function (options) {
    group = options.group;
    this.getHardWords();
  }

})
