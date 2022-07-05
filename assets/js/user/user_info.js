$(function () {
  initUserInfo();
  var from = layui.form;
  from.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间！';
      }
    },
  });
  //初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        // console.log(res);
        if (res.code !== 0) {
          return layui.layer.msg('获取用户信息失败！');
        }
        // $('.layui-card-body [name=username]').val(res.data.username);
        // $('.layui-card-body [name=nickname]').val(res.data.nickname);
        // $('.layui-card-body [name=email]').val(res.data.email);
        // 调用layui form表单快速赋值方法form.val()
        from.val('formUserInfo', res.data);
      },
    });
  }

  //重置表单数据
  $('#btnReset').on('click', function (e) {
    //阻止表单默认提重置行为
    e.preventDefault();
    initUserInfo();
  });

  //更新用户的基本信息
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    UpdateUserInfo();
  });

  function UpdateUserInfo() {
    $.ajax({
      method: 'PUT',
      url: '/my/userinfo',
      data: $('.layui-form').serialize(),
      success: function (res) {
        // console.log(res);
        layui.layer.msg(res.message);
        // 调用父页面的方法，重新渲染用户信息
        window.parent.getUserInfo();
      },
    });
  }
});
