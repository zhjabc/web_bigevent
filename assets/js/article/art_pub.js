$(function () {
  //初始化文章分类
  initCate();

  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  const $image = $('#image');

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 为选择封面按钮，绑定点击事件
  $('#btnchooseCover').on('click', function () {
    $('#coverFile').click();
  });

  // 更换裁剪图片
  $('#coverFile').on('change', function (e) {
    var files = e.target.files;
    if (files.length === 0) return;
    // 根据文件创建对应的URL地址
    var newImageURL = URL.createObjectURL(files[0]);
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImageURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 定义发布文章的状态
  var art_state = '已发布';

  $('#btnSave').on('click', function () {
    art_state = '草稿';
  });

  // 为表单绑定submit提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault(); //阻止表单默认提交行为
    // 基于form表单，快速创建一个formData
    var fd = new FormData($(this)[0]);
    fd.append('state', art_state);

    //将裁剪后的图片，输入为文件
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        fd.append('cover_img', blob);
        addArticle(fd);
      });
  });
});

//初始化文章分类的方法
function initCate() {
  $.ajax({
    method: 'GET',
    url: '/my/cate/list',
    success: function (res) {
      console.log(res);
      if (res.code !== 0) return laui.layer.msg(res.message);
      var htmlStr = template('tpl-cate', res);
      $('#cate').html(htmlStr);
      layui.form.render();
    },
  });
}

// 定义发布文章的函数
function addArticle(fd) {
  $.ajax({
    method: 'POST',
    url: '/my/article/add',
    data: fd,
    // 如果提交的数据是formData格式的数据，必须添加以下2个配置项
    contentType: false,
    processData: false,
    success: function (res) {
      layui.layer.msg(res.message);
      if (res.code !== 0) return;
      location.href = '/article/art_list.html';
    },
  });
}
