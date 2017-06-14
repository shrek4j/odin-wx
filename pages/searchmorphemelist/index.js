var base64 = require("../images/base64");

//index.js
//获取应用实例
var app = getApp()
var morphemeId = 1
var letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
Page({
  data: {
    array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y','z'],
    index: 0
  },
  bindPickerChange: function (e) {
    var capital = letterArray[e.detail.value]
    console.log('picker发送选择改变，携带值为', capital)
    wx.navigateTo({
      url: '../morphemelist/index?capital=' + capital
    })
  },
  onLoad: function (options) {
    var capital = options.capital
    if (capital == null || capital == undefined) {
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
        var num = 1;
        for (var i = 0; i < morphList.length; i++) {
          morphList[i]['num'] = num++
        }
        //--转换translation的<br/>

        that.setData({
          dataObj: dataObj
        });
      }
    });

  }
})
