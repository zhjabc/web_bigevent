$(function () {
  //定义一个查询参数对象
  const q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: '',
  };

  //获取文章列表
  initTable(q);
  //初始化文章分类
  initCate();

  //为筛选标段绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    //获取表单中选中项的值
    var cate_id = $('#cate').val();
    var state = $('#state').val();
    q.cate_id = cate_id;
    q.state = state;
    initTable(q);
  });

  //通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '#btn-delete', function () {
    var id = $('#btn-delete').attr('data-id');

    layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
      // 根据Id删除文章数据
      delArticleById(id, q);
      layer.close(index);
    });
  });

  //通过代理的形式，为查看按钮绑定点击事件
  $('tbody').on('click', '#articleInfo', function () {
    var id = $(this).attr('data-id');
    //弹出一个文章预览的层
    articleInfo(id);

    layui.layer.open({
      type: 1,
      area: ['1300px', '500px'],
      title: '文章预览',
      content: $('#article-info').html(),
    });
  });
});

//定义美化时间过滤器
template.defaults.imports.dataFormat = function (data) {
  var dt = new Date(data);
  var y = dt.getFullYear();
  var m = padZero(dt.getMonth() + 1);
  var d = padZero(dt.getDate());
  var hh = padZero(dt.getHours());
  var mm = padZero(dt.getMinutes());
  var ss = padZero(dt.getSeconds());
  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
};

//获取文章列表数据
function initTable(q) {
  $.ajax({
    method: 'GET',
    url: '/my/article/list',
    data: q,
    success: function (res) {
      if (res.code !== 0) return layui.layer.msg(res.message);
      //获取成功之后使用模版引擎渲染页面
      console.log(res);
      var htmlStr = template('tpl-table', res);
      $('tbody').html(htmlStr);

      // 调用渲染分页的方法
      renderPage(res.total, q);
    },
  });
}

//初始化文章分类的方法
function initCate() {
  $.ajax({
    method: 'GET',
    url: '/my/cate/list',
    success: function (res) {
      if (res.code !== 0) return laui.layer.msg(res.message);
      var htmlStr = template('tpl-cate', res);
      $('#cate').html(htmlStr);
      layui.form.render();
    },
  });
}

//定义渲染分页的方法
function renderPage(total, q) {
  var laypage = layui.laypage;
  //执行一个laypage实例
  laypage.render({
    elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
    count: total, //数据总数，从服务端得到
    limit: q.pagesize, //每页显示的条数
    curr: q.pagenum, //起始页
    limits: [2, 3, 5, 10],
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    jump: function (obj, first) {
      //obj包含了当前分页的所有参数，比如：
      // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
      // console.log(obj.limit); //得到每页显示的条数
      //首次不执行
      q.pagenum = obj.curr;
      q.pagesize = obj.limit;
      if (!first) {
        initTable(q);
      }
    },
  });
}

//定义根据Id删除文章数据的方法
function delArticleById(id, q) {
  $.ajax({
    method: 'DELETE',
    url: '/my/article/info?id=' + id,
    contentType: 'application/json',
    success: function (res) {
      console.log(res);
      layui.layer.msg(res.message);
      if (res.code !== 0) return;
      //当数据删除之后，需判断当前页是否还存在数据，如果没有，页码-1
      var len = $('#btn-delete').length;
      if (len === 1) {
        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
      }
      initTable(q);
    },
  });
}

//定义根id查看文章详情的方法
function articleInfo(id) {
  $.ajax({
    method: 'GET',
    url: '/my/article/info',
    data: { id: id },
    success: function (res) {
      console.log(res);
      if (res.code !== 0) {
        return layui.layer.msg(res.message);
      }

      $('.title').html(res.data.title);
      $('.username').append(res.data.username);
      $('.pub_date').append(formatTime(res.data.pub_date));
      $('.cate_name').append(res.data.cate_name);
      $('.state').append(res.data.state);
      $('.detail img').attr('src', ' http://www.liulongbin.top:3008' + res.data.cover_img);
      $('.content').append(res.data.content);
    },
  });
}

定义时间函数;
function formatTime(data) {
  var dt = new Date(data);
  var y = dt.getFullYear();
  var m = padZero(dt.getMonth() + 1);
  var d = padZero(dt.getDate());
  var hh = padZero(dt.getHours());
  var mm = padZero(dt.getMinutes());
  var ss = padZero(dt.getSeconds());
  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
}

//定义补零函数
function padZero(n) {
  return n > 9 ? n : '0' + n;
}
