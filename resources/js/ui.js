(function($) {
  "use strict"; // Start of use strict
  // 네비게이션 클릭 효과
  $(".nav-link").on("click", function(){
      $(this).closest('.nav-item').addClass('active')
      $(this).closest('.nav-item').siblings().removeClass('active')
  });

  // 메인 탭
  $('.tab-menu-item').on('mouseover',function(e){
      $(this).children('.ui_comp').addClass('on')
      $(this).siblings().children('.ui_comp').removeClass('on')
  })
  $('.tab-menu-item').on('mouseout',function(e){
      $('.ui_comp').removeClass('on')
  })

  // date picker
  $("#start_day").datepicker();
  $("#end_day").datepicker();

  // 20210114 메뉴 댑스 수정
  // 3뎁스 메뉴 위치 변경
  var navPop = $('.sh_nav-toggle')
  var navPopItem = $('.depth2_item')

  // 3뎁스 메뉴 활성화
  $(navPop).on('click',function(e){
      if($(this).has(e.target).length == 0 & $(this).hasClass('active')){
          $(this).removeClass('active');
      }else{
          $(this).addClass('active');
          $(this).siblings(navPop).removeClass('active')
      }
  })
  
  // 클릭 효과
  $(navPopItem).on('click',function(e){
      $('#accordionSidebar').find(navPopItem).removeClass('active')
      $(this).addClass('active');
  })

  // 기본 테이블 마우스 오버 효과
  var tableRow = $('.sh_table tbody tr, .table_ty3 tbody tr');
  tableRow.on('mouseover',function(e){
      $(this).addClass('active');
      $(this).siblings().removeClass('active')
  })
  tableRow.on('mouseout',function(e){
      $(this).removeClass('active')
  })


  // ZTREE
  var $treeRoot = $("#treeMenu")

  var folderArray = [
    // 홈
    {name: "대시보드", id : "1", open:true, checked:true, children: [
      {name: "절감시간", id : "11", checked:true, chkDisabled:true},
      {name: "ROI", id : "12", checked:true},
      {name: "업무현황", id : "13", checked:true},
      {name: "신규업무", id : "14", chkDisabled:true},
    ]},
    // 마이페이지
    {name: "마이페이지", id : "2", children: [
      {name:"나의과제", id : "21"},
      {name: "나의요청", id : "22", children: [
        {name:"개발요청", id : "221"},
        {name:"정기실행요청", id : "222"},
      ]},
      {name:"과제개발", id : "23"},
      {name:"개발진행사항", id : "24"}
    ]},
    // 헬프데스크
    {name: "헬프데스크", id : "3", children: [
      {name:"공지사항", id : "31"},
      {name:"FAQ", id : "31"},
      {name:"Q&A", id : "31"},
      {name:"담당자안내", id : "31"},
      {name:"탬플릿관리", id : "31"},
      {name:"영업일조회", id : "31"},
    ]},
    // 관리자
    {name: "관리자", id : "4", children: [
      {name:"나의할일", id : "41", children: [
        {name:"과제접수", id : "411"},
        {name:"과제개발", id : "412"},
        {name:"정기실행관리", id : "413"},
      ]},
      {name:"과제관리", id : "42"},
      {name:"사용자관리", id : "43"},
      {name:"권한관리", id : "44"},
      {name:"기준정보관리", id : "45"},
      {name:"자원관리", id : "46"},
    ]},
    {name: "통계", id : "5", children: [
      {name:"과제별", id : "51"},
      {name:"프로세스별", id : "52"},
      {name:"BOT별", id : "53"},
      {name:"유형별", id : "54"},
      {name:"부서별", id : "55"},
      {name:"업무현황", id : "56"},
    ]},
    {name: "커뮤니티", id : "6", children: [
      {name:"지식관리", id : "61"},
      {name:"학습콘텐츠", id : "61"},
      {name:"개발가이드", id : "61"},
      {name:"Best Practice", id : "61"},
      {name:"Best Store", id : "61"},
    ]}
  ];

  const setting = {
    // view: {
    //   showIcon: showIconForTree
    // },
    async: {
      enable: false
    },
    data  : {
      simpleData: {
        enable: true,
        idKey: "id",
        pIdKey: "pId",
        rootPId: 0
      }
    },
    edit: {
      enable: true,
      drag: {
        autoOpenTime: 0
      }
    },
    check: {
      enable: true,
      setChkDisabled: true 
    },
  }

  // 체크 박스
  var code;

  function setCheck() {
    var zTree = $.fn.zTree.getZTreeObj("treeMenu"),
    py = $("#py").attr("checked")? "p":"",
    sy = $("#sy").attr("checked")? "s":"",
    pn = $("#pn").attr("checked")? "p":"",
    sn = $("#sn").attr("checked")? "s":"",
    // type = { "Y":py + sy, "N":pn + sn};
    type = { "Y" : "ps", "N" : "ps" };
    zTree.setting.check.chkboxType = type;
    showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
  }

  function showCode(str) {
    if (!code) code = $("#code");
    code.empty();
    code.append("<li>"+str+"</li>");
  }

  // 아이콘 안보이게
  function showIconForTree(treeId, treeNode) {
    return !treeNode.isParent;
  };

  // disable
  function disabledNode(e) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
    disabled = e.data.disabled,
    nodes = zTree.getSelectedNodes();
    if (nodes.length == 0) {
      alert("Please select one node at first...");
    }
    if (disabled) {
      inheritParent = $("#py").attr("checked");
      inheritChildren = $("#sy").attr("checked");
    } else {
      inheritParent = $("#pn").attr("checked");
      inheritChildren = $("#sn").attr("checked");
    }

    for (var i=0, l=nodes.length; i<l; i++) {
      zTree.setChkDisabled(nodes[i], disabled, inheritParent, inheritChildren);
    }
  }

  // $.fn.zTree.init($treeRoot, setting, folderArray);
  // setCheck();
  // $("#py").bind("change", setCheck);
  // $("#sy").bind("change", setCheck);
  // $("#pn").bind("change", setCheck);
  // $("#sn").bind("change", setCheck);
  // $("#disabledTrue").bind("click", {disabled: true}, disabledNode);
  // $("#disabledFalse").bind("click", {disabled: false}, disabledNode);



})(jQuery); // End of use strict
