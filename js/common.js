//图表展示
$(function(){
  // 接口1，获取企业列表
  var company = [
    {
      id: 1,
      name: '企业1'
    },
    {
      id: 2,
      name: '企业2'
    },
    {
      id: 3,
      name: '企业3'
    },
    {
      id: 4,
      name: '企业4'
    },
  ];

  // 接口2，根据企业id和项目id,获取企业项目(如果没传项目id,获取所传企业id下的所有项目)
  var projects ={
    companyId: 1,
    companyName: '企业1',
    list: [
      {
        id: 11,
        name: '报表项目11',
        desc: 'xxxxxxxxx'
      },
      {
        id: 12,
        name: '报表项目12',
        desc: 'xxxxxxxxx'
      },
      {
        id: 13,
        name: '报表项目13',
        desc: 'xxxxxxxxx'
      },
      {
        id: 14,
        name: '报表项目14',
        desc: 'xxxxxxxxx'
      }
    ]
  };


    // 页面1
    // 调取接口，获取所有企业列表
    // 得到company list
    var $select = $('#select');
    if ($select.length) {
        var dom = '<option value="0">请选择企业</option>';
        for (var i = 0; i < company.length; i++) {
          dom += '<option value="' + company[i].id + '">' + company[i].name + '</option>';
        };
        $select.append(dom);

        $('#selectbtn').click(function(){
            var companyId = $('#select').val();
            if (companyId == '0') {
                alert('请选择企业！');
                return;
            }
           window.location.href="./select-data-report.html?companyId=" + companyId;
        });
    }

    // 页面二
    // 调取接口，传参companyId:1,获取companyId = 1的所有项目列表
    // 得到 projects list
    var $page2 = $('#page2');
    if ($page2.length) {
        var projectId = '';
        var $projectsContent = $('#projectsContent');
        var companyId = GetQueryString("companyId");
        var projectsList = projects.list;
        var dom = '';
        for (var i = 0; i < projectsList.length; i++) {
          dom += '<li>\
                      <i class="select-icon"></i>\
                      <input type="hidden" value="'+ projectsList[i].id +'">\
                      <span class="span-table">'+ projectsList[i].name +'</span>\
                      <p class="p-text">'+ projectsList[i].desc +'</p>\
                    </li>';
        };
        $projectsContent.append(dom);
        $("#spanTarget").html(projects.companyName);

        $projectsContent.find('i').click(function(){
          $(this).toggleClass('select-active');
          var val = $(this).siblings('input').val();
          if ($(this).hasClass('select-active')) {
            projectId += ',' + val;
          } else {
            projectId = projectId.replace(',' + val, '');
          }
        });

        //返回选择企业
        $('#backBtn').click(function() {
            history.go(-1);
        });

        //跳转到图表展示
        $('#sureBtn').click(function() {
            if(projectId.length <= 0){
                alert("请选择项目");
                return false;
            }
            window.location.href='./chart-display.html?companyId=' + companyId + '&projectId=' + projectId.replace(',','');
        });
    };

    // 页面三
    // 调取接口，传参projectId,获取projectId对应的项目列表
    var $page3 = $('#page3');
    if ($page3.length) {
      var projectId = GetQueryString("projectId");
      var projectIdArray = projectId.split(',').sort();
      var dom = '<dt name="'+ projectIdArray[0] +'" class="dt-item dt-active"><span class="span-list">报表项目'+ projectIdArray[0] +'</span></dt>';
      for (var i = 1; i < projectIdArray.length; i++) {
          dom += '<dt name="'+ projectIdArray[i] +'"class="dt-item"><span class="span-list">报表项目'+ projectIdArray[i] +'</span></dt>';
      };
      $('#dl-list').append(dom);

      // 传参projectId，获取projects
      var projectsList = projects.list;

      var nowTime = new Date();
      var getHour = nowTime.getHours();
      if(getHour<10){
        getHour = '0' + getHour;
      }
      var getMinute = nowTime.getMinutes();
      if(getMinute<10){
          getMinute = '0' + getMinute;
      }
      var sTime = nowTime.getFullYear() + "-" + (nowTime.getMonth()+1) + "-" + nowTime.getDate() + " " + getHour + ":" + getMinute;
      var dom = '';
      for (var i = 0; i < projectsList.length; i++) {
        dom += '<div class="article" id="pdf_'+projectsList[i].id+'">\
                  <h2 class="article-title">'+projectsList[i].name+'</h2>\
                  <p class="p-data">数据收集截止于<span id="getTime" class="get-text">'+sTime+'</span>\
                  </p>\
                  <div class="pdf-area" id="pdf"><iframe src="./pdf/'+projectsList[i].id+'.pdf" width="100%" height="100%"></iframe></div>\
                </div>';
      };
      $('#pdfContent').append(dom);

      $('#pdf_' + projectIdArray[0]).fadeIn(300);
      $('#spanSelect').html(projects.companyName);

      //新增项目
      // $('#plus').click(function() {
      //     var dts='<dt class=\"dt-item\"><span class=\"span-list\">报表项目</span></dt>';
      //     $('#dl-list').append(dts);
      // });

      // 切换pdf
      $('#dl-list').find('.dt-item').click(function() {
          if ($(this).hasClass('dt-active')) {
              return false;
          };
          var index = $(this).attr('name');
          $(this).addClass('dt-active').siblings().removeClass('dt-active');
          $('#pdf_' + index).fadeIn(300).siblings('.article').hide();
      });
    }
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
