$(function () {
  // 自定义表单验证规则
  layui.form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格！'],
    samePwd: function (value) {
      if (value === $('#oldPwd').val()) {
        return '新密码和原密码不能相同！';
      }
    },
    rePwd: function (value) {
      if (value !== $('#newPwd').val()) {
        return '两次输入的密码不一致！';
      }
    },
  });

  //修改用户密码
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        layui.layer.msg(res.message);
        if (res.status === 0) {
          $('.layui-form')[0].reset(); //修改成功，重置表单
        }
      },
    });
  });
});
