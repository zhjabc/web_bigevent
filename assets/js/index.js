$(function () {
  //调用getUserInfo 获取用户信息
  getUserInfo();

  //退出功能
  var layer = layui.layer;
  $('#btnLogout').on('click', function () {
    //提示用户是否退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      //1.情况本地存储的token
      localStorage.removeItem('token');
      //2.重新跳转到登录页面
      location.href = '/login.html';
      //3.关闭询问框
      layer.close(index);
    });
  });
});
//获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: { Authorization: localStorage.getItem('token') || '' },
    success: function (res) {
      // console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败');
      }
      //调用renderAvatar() 渲染头像
      renderAvatar(res.data);
    },
  });
}
//渲染用户头像
function renderAvatar(user) {
  //1.获取用户名称
  var name = user.nickname || user.username;
  //2.设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  //3.按需渲染头像
  if (user.user_pic === null) {
    //3.1渲染文本头像
    $('.layui-nav-img').hide();
    $('.text-avatar').html(name.charAt(0).toUpperCase()).show();
  } else {
    //3.2渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  }
}
