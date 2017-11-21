var base64 = require("../images/base64");


Page({ 
  doLearn: function (e) {
    var group = e.target.dataset.group
    var wordId = e.target.dataset.wordid
    var status = e.target.dataset.status
    wx.redirectTo({
      url: '../learnwords/main?progress=next&group=' + group + '&wordId=' + wordId + '&status=' + status  
    });
  },
  onLoad: function (options) {
    var group = options.group
    if (group == null || group == undefined){
      group = 1
    }
    var progress = options.progress
    var wordId = options.wordId
    var status = options.status

    var sfz = wx.getStorageSync('sfz')
    var that = this;
    wx.request({
      url: 'https://odin.bajiaoshan893.com/LearnWord/doLearn',
      data: {
        'userId': sfz,
        'group': group,
        'progress': progress,
        'wordId': wordId,
        'status': status
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var msg = res.data
        var dataObj = JSON.parse(msg);

        //--转换translation的<br/>
        var trans = dataObj.nextWord[0].translation
        var tranArr = trans.split('<br/>')
        if (tranArr == null || tranArr == undefined || tranArr == '' || tranArr.length == 0) {
          //do nothing
        } else {
          tranArr = tranArr.slice(0, tranArr.length - 1)
          dataObj.nextWord[0].tranList = tranArr
        }
        //--转换translation的<br/>

        that.setData({
          dataObj: dataObj
        });
      }
    });
  }
})
