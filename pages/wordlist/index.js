var base64 = require("../images/base64");

//index.js
//获取应用实例
var app = getApp()
var morphemeId = 1
Page({
  //事件处理函数
  showSimilarWords: function (e) {
    var wId = e.target.dataset.id
    var root = e.target.dataset.root
    wx.navigateTo({
      url: '../similarwordlist/index?wId=' + wId
    })
  },
  onLoad: function (options) {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
    morphemeId = options.morphemeId;
    var that = this
    wx.request({
      url: 'https://odin.bajiaoshan893.com/Morph/showWordsByMorphemeJson',
      data: {
        'morphemeId': morphemeId
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
        var wordList = dataObj.wordList;
        var num = 1;
        for(var i=0;i<wordList.length;i++){
          wordList[i]['num'] = num++
          var trans = wordList[i].translation
          var tranArr = trans.split('<br/>')
          if(tranArr==null || tranArr == undefined || tranArr == '' || tranArr.length==0){
            continue;
          }else{
            tranArr = tranArr.slice(0,tranArr.length-1)
            wordList[i]['tranList'] = tranArr
          }
        }
        //--转换translation的<br/>

        that.setData({
          dataObj: dataObj
        });
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '我又掌握了一个英语词根，也分享给你学习一下吧~',
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
  }
})
