$(function () {
  //获取文章分类的列表
  initArtCateList();

  //为添加类别绑定点击事件
  var indexAdd = null;
  $('#btnAddCate').on('click', function () {
    indexAdd = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章类别',
      content: $('#dialog-add').html(),
    });
  });

  //通过代理的形式，为form-add表单绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    addCates(indexAdd);
  });

  //通过代理的形式，为btn-edit按钮绑定点击事件
  var indexEdit = null;
  $('tbody').on('click', '#btn-edit', function () {
    //弹出一个修改文章分类信息的层
    indexEdit = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章类别',
      content: $('#dialog-edit').html(),
    });
    var id = $(this).attr('data-id');
    addCatesById(id);
  });

  //通过代理的形式，为form-edit表单绑定点击事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    updateCateById(indexEdit);
  });

  //通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '#btn-delete', function () {
    var id = $(this).attr('data-id');
    //提示用户是否删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //删除分类数据
      deleteCateById(id);

      layer.close(index);
    });
  });
});

//获取文章分类的列表
function initArtCateList() {
  $.ajax({
    method: 'GET',
    url: '/my/cate/list',
    success: function (res) {
      var htmlStr = template('tpl-table', res);
      $('tbody').html(htmlStr);
    },
  });
}

//新增文章分类
function addCates(indexAdd) {
  $.ajax({
    method: 'POST',
    url: '/my/cate/add',
    data: $('#form-add').serialize(),
    success: function (res) {
      // console.log(res);
      layui.layer.msg(res.message);
      if (res.code === 0) {
        initArtCateList();
        // 根据索引关闭对应的弹出层
        layui.layer.close(indexAdd);
      }
    },
  });
}

//获取文章对应分类的数据
function addCatesById(id) {
  $.ajax({
    method: 'GET',
    url: '/my/cate/info',
    data: { id: id },
    success: function (res) {
      if (res.code !== 0) {
        return layui.layer.msg(res.message);
      }
      layui.form.val('form-edit', res.data);
    },
  });
}

// 根据id更新文章分类数据
function updateCateById(indexEdit) {
  $.ajax({
    method: 'PUT',
    url: '/my/cate/info',
    data: $('#form-edit').serialize(),
    success: function (res) {
      console.log(res);
      layui.layer.msg(res.message);
      if (res.code === 0) {
        initArtCateList();
        // 根据索引关闭对应的弹出层
        layui.layer.close(indexEdit);
      }
    },
  });
}

//根据id删除对应的文章分项数据
function deleteCateById(id) {
  $.ajax({
    method: 'DELETE',
    url: '/my/cate/del?id=' + id,
    success: function (res) {
      layui.layer.msg(res.message);
      if (res.code == 0) {
        initArtCateList();
      }
    },
  });
}
