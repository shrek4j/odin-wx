var UserInfo = require('../userInfo/userInfo.js')

var tempGroup = 1;
var tempPortionToday = 20;
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
  goCrazy: function (e) {
    var group = e.target.dataset.group
    var portionToday = e.target.dataset.portion
    wx.redirectTo({
      url: '../learnwords/main?progress=goCrazy&group=' + group + '&portionToday=' + portionToday
    });
  },
  toRootPage : function (e) {
    var rootid = e.target.dataset.rootid
    wx.navigateTo({
      url: '../wordlist/index?morphemeId=' + rootid
    });
  },
  goBack : function (e) {
    wx.navigateBack({
      delta: 2
    })
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
      dataUrl: "http://word.audio.odinseyedict.com/audio/word/" + word + ".mp3",
      title: '',
      coverImgUrl: ''
    })
  },
  onShareAppMessage: function () {
    return {
      title: '轻松记单词，了解一下？',
      path: '/pages/learnwords/entrance',
      success: function (res) {
        wx.showToast({
          title: '成功领取金币！',
          icon: 'success',
          duration: 2000
        })
        var sfz = UserInfo.tryGetSfz();
        wx.request({
          url: 'https://odin.bajiaoshan893.com/LearnWord/rewardCoin',
          data: {
            'userId': sfz
          },
          header: {
            'content-type': 'application/json'
          },
          success:function (res){
            wx.redirectTo({
              url: '../learnwords/main?progress=next&group=' + tempGroup + '&portionToday=' + tempPortionToday
            });
          }
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
    var group = options.group
    if (group == null || group == undefined){
      group = 1
    }
    var progress = options.progress
    var wordId = options.wordId
    var status = options.status
    var portionToday = options.portionToday

    var sfz = UserInfo.tryGetSfz();
    var that = this;
    wx.request({
      url: 'https://odin.bajiaoshan893.com/LearnWord/doLearnNew',
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

        var week = new Date().getDay();
        
        if (dataObj.isFinished == 'todayTrue'){
          //2. canvas绘制文字和图片
          var ctx = wx.createCanvasContext('myCanvas')
          
          var qrPath = '../images/miniqr_morpheme.jpg'
          var bgImgPath = '../images/bg1.jpg';

          ctx.drawImage(bgImgPath, 0, 0, 500, 800);

          ctx.setFillStyle('white')
          ctx.fillRect(0, 590, 500, 210);

          ctx.drawImage(qrPath, 350, 620, 130, 130);

          ctx.setFontSize(22)
          ctx.setFillStyle('#111111')
          ctx.fillText('已坚持学习', 80, 90)
          ctx.setFontSize(38)
          ctx.fillText(dataObj.learnDaysCount, 120, 138)
          ctx.setFontSize(22)
          ctx.fillText('Days', 110, 165)

          ctx.setFontSize(22)
          ctx.fillText('已学习单词', 310, 90)
          ctx.setFontSize(38)
          ctx.fillText(dataObj.learntCount, 340, 138)
          ctx.setFontSize(22)
          ctx.fillText('Words', 330, 165)

          ctx.setFontSize(20)
          ctx.setFillStyle('black')
          ctx.fillText('只要10天', 24, 650)
          ctx.fillText('牢记150+高频词根', 24, 700)
          ctx.fillText('轻松学会4000+单词', 24, 750)
          ctx.setFontSize(16)
          ctx.fillText('长按识别 高效学习' , 345, 770);
          ctx.draw();
        }
        

        if (dataObj.isFinished == 'noCoin'){
          tempGroup = dataObj.group
          tempPortionToday = dataObj.portionToday
        }
        console.log(dataObj)        
        that.setData({
          dataObj: dataObj,
          week:week
        });
      }
    });
  },

  saveSharePic : function (e){
    var ctx = wx.createCanvasContext('myCanvas')
    ctx.draw(true, wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 500,
      height: 800,
      destWidth: 500,
      destHeight: 800,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath);

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title: '保存成功',
              content: '图片成功保存到相册了，去发朋友圈吧~',
              showCancel: false,
              confirmText: '好哒',
              confirmColor: '#72B9C3',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
               
              }
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })

      },
      fail: function (res) {
        console.log(res)
      }
    }));
    
    
  }

})
