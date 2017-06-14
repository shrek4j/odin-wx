var base64 = require("../images/base64");

//index.js
//获取应用实例
var app = getApp()
Page({
  onLoad: function (options) {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
    var wId = options.wId;
    console.log(wId)
    var that = this
    wx.request({
      url: 'https://odin.bajiaoshan893.com/Morph/showSimilarWordsJson',
      data: {
        'wId': wId
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
        for (var i = 0; i < wordList.length; i++) {
          wordList[i]['num'] = num++
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

        that.setData({
          dataObj: dataObj
        });
      }
    })
  }
})
