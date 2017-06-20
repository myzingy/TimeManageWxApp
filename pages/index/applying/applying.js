import common from "../../../common/common"

var app = getApp();


function gotoAddApply(){
    wx.navigateTo({
      url: '/pages/index/addApply/addApply',
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

function submit(e,self,success) {//提交
  var tag = e.currentTarget.dataset.tag != undefined ? e.currentTarget.dataset.tag : e.target.dataset.tag;
  self.data.data[tag].C3_541449538456 = 'Y';
  var item = self.data.data[tag];
  common.customLoading();
  common.reSaveAndSubmit(item, function (resData) {
    if (success) success(resData);
  }, function () {
    self.data.data[tag].C3_541449538456 = 'N';
  });
}


module.exports = {
  gotoAddApply:gotoAddApply,
  submit: submit
}