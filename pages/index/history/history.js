
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


module.exports = {
  gotoAddApply:gotoAddApply
}