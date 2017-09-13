Page({
  thumpsUp: function(){

  },
  onShareAppMessage: function () {
    return {
      title: '我为什么要做词根词典网站？',
      path: '/pages/article/a20170815',
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
    //TODO 
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
});