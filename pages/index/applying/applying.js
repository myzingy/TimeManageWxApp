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

function submit(e,self) {//提交
  let tag = e.target.dataset.tag;
  self.data.data[tag].C3_541449538456 = 'Y';
  let item = self.data.data[tag];
  common.saveAndSubmit(item, function () {
    self.setData({
      data: self.data.data
    })
  }, function () {
    self.data.data[tag].C3_541449538456 = 'N';
  });
}


module.exports = {
  gotoAddApply:gotoAddApply,
  submit: submit
}