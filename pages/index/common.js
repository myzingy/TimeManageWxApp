var app = getApp();

function saveAndSubmit(data,success,fail){ 
    //  success();
    //  return;
    var param = {
      'resid': 541502768110,
      'data': data
    }
    
    app.HttpService.hourCalculate(param, function (data) {
      wx.stopPullDownRefresh();
      wx.hideLoading();

      if (data.data.error == 0) {
          success();
        
      } else {
        wx.showModal({
          title:'失败',
          content:data.data.message
        })
        fail();
      }
      
    }, function () {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      fail();
    });
  }

function successBack(){
    wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000,
          success:function(){
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
              success: function(res){
                // success
              },
              fail: function(res) {
                // fail
              },
              complete: function(res) {
                // complete
              }
            })
          }
        })
  }

  module.exports = {
      saveAndSubmit:saveAndSubmit,
      successBack:successBack
  }