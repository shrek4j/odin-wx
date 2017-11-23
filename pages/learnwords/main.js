var base64 = require("../images/base64");


Page({ 
  doLearn: function (e) {
    var group = e.target.dataset.group
    var wordId = e.target.dataset.wordid
    var status = e.target.dataset.status
    var portionToday = e.target.dataset.portion
    wx.redirectTo({
      url: '../learnwords/main?progress=next&group=' + group + '&wordId=' + wordId + '&status=' + status + '&portionToday=' + portionToday 
    });
  },
  toRootPage : function (e) {
    var rootid = e.target.dataset.rootid
    wx.navigateTo({
      url: '../wordlist/index?morphemeId=' + rootid
    });
  },
  toSimilarWordsPage : function (e){
    var wId = e.target.dataset.wordid
    wx.navigateTo({
      url: '../similarwordlist/index?wId=' + wId
    })
  },
  playAudio: function(e){
    var word = e.target.dataset.word
    wx.playBackgroundAudio({
      dataUrl: "http://oztas5d9g.bkt.clouddn.com/audio/word/" + word + ".mp3",
      title: '',
      coverImgUrl: ''
    })
  },
  onLoad: function (options) {
    var group = options.group
    if (group == null || group == undefined){
      group = 1
    }
    var progress = options.progress
    var wordId = options.wordId
    var status = options.status
    var portionToday = options.portionToday

    var sfz = wx.getStorageSync('sfz')
    var that = this;
    wx.request({
      url: 'https://odin.bajiaoshan893.com/LearnWord/doLearn',
      data: {
        'userId': sfz,
        'group': group,
        'progress': progress,
        'wordId': wordId,
        'status': status,
        'portionToday': portionToday
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var msg = res.data
        var dataObj = JSON.parse(msg);

        if (dataObj.isFinished == 'false' || dataObj.isFinished == 'todayCrazy'){
          //--转换translation的<br/>
          if (dataObj.nextWord != null && dataObj.nextWord.length != 0){
            var trans = dataObj.nextWord[0].translation
            var tranArr = trans.split('<br/>')
            if (tranArr == null || tranArr == undefined || tranArr == '' || tranArr.length == 0) {
              //do nothing
            } else {
              tranArr = tranArr.slice(0, tranArr.length - 1)
              dataObj.nextWord[0].tranList = tranArr
            }
          }
          //--转换translation的<br/>
          
          //转换词根
          for (var i = 0; i < dataObj.roots.length;i++){
            if(dataObj.roots[i].true_root == null){
              dataObj.roots[i].true_root = dataObj.roots[i].word_root
            }
          }

          //当前是第几个
          dataObj.thisOneNum = parseInt(dataObj.todayLearntCount) + 1
        }

        if (dataObj.isFinished == 'todayTrue'){
          // 使用 wx.createContext 获取绘图上下文 context
          var ctx = wx.createCanvasContext('shareTodayCanvas')

          ctx.setFontSize(20)
          ctx.fillText('Hello', 150, 150)
          ctx.draw()
        }

        that.setData({
          dataObj: dataObj
        });
      }
    });
  }
})
