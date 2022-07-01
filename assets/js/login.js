$(function () {
  //点击去注册的的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });
  //点击去登录的的链接
  $('#link_login').on('click', function () {
    $('.reg-box').hide();
    $('.login-box').show();
  });

  //从layui中获取from对象
  var form = layui.form;
  form.verify({
    //自定义一个pwd的校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 检验两次密码是否一致
    repwd: function (value) {
      // var password = $('#form_reg [name=password]').val();
      if (value !== $('#form_reg [name=password]').val()) {
        return '两次密码不一致!';
      }
    },
  });

  //监听注册表单提交事件
  $('#form_reg').on('submit', function (e) {
    //阻止默认提交请求
    e.preventDefault();
    // console.log($('#form_reg[name=password]').val());
    $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg     [name=password]').val() }, function (res) {
      // console.log(res.message);
      layui.layer.msg(res.message);
      if (res.status === 0) {
        $('#link_login').click();
      }
    });
  });

  //监听登录表单提交事件
  // var token = null;
  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    $.post('/api/login', { username: $('#form_login [name=username]').val(), password: $('#form_login     [name=password]').val() }, function (res) {
      // console.log(res.message);
      layui.layer.msg(res.message);
      // console.log(res.token);
      if (res.status === 0) {
        // 登录成功将token存入localStorage中
        localStorage.setItem('token', res.token);
        // 跳转到后台主页
        location.href = '/index.html';
      }
    });
  });
});
