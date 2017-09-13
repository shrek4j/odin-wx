var base64 = require("../images/base64");

//index.js
//获取应用实例
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
  }
})
