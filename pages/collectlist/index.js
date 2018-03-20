var UserInfo = require('../userInfo/userInfo.js')

Page({
  showwordlist: function (e) {
    var id = e.target.dataset.mid
    wx.navigateTo({
      url: '../wordlist/index?morphemeId=' + id
    });
  },
  onLoad: function (options) {
    var sfz = UserInfo.tryGetSfz();

    var that = this;
    wx.request({
      url: 'https://odin.bajiaoshan893.com/CollectRoot/showRootCollectsByUser',
      data: {
        'userId': sfz
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
        var collectlist = dataObj.collects;
        var num = 1;
        for (var i = 0; i < collectlist.length;i++){
          collectlist[i]['num'] = num++
        }
        //--转换translation的<br/>

        that.setData({
          dataObj: dataObj
        });
      }
    });
  }
})
