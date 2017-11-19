var base64 = require("../images/base64");


Page({ 
  showwordlist: function (e) {
    var id = e.target.dataset.mid
    wx.navigateTo({
      url: '../wordlist/index?morphemeId=' + id
    });
  },
  onLoad: function (options) {
    var group = options.group
    if (group == null || group == undefined){
      group = 1
    }
    var progress = options.progress

    var sfz = wx.getStorageSync('sfz')
    var that = this;
    wx.request({
      url: 'https://odin.bajiaoshan893.com/LearnWord/doLearn',
      data: {
        'userId': sfz,
        'group': group,
        'progress': progress,
        'wordId': null,
        'status':null
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

        //
        var word = dataObj.nextWord[0].word
        var roots = []
        for(var i=0;i<dataObj.roots.length;i++){
          var word_root = dataObj.roots[i].word_root.replace(/-/g, '')
          var word_roots = word_root.split(',')
          for(var j=0;j<word_roots.length;j++){
            roots[roots.length] = word_roots[j]
          }
        }


        //

        that.setData({
          dataObj: dataObj
        });
      }
    });
  }
})
