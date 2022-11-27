//window_move
var moveF = function (e) {
  moveT.px = moveT.px + e.pageX - moveT.x;
  moveT.py = moveT.py + e.pageY - moveT.y;
  moveT.x = e.pageX;
  moveT.y = e.pageY;
  $(moveT.tag).css({
    left: moveT.px + "px",
    top: moveT.py + "px",
  });
};
var moveT = {};
var moveD = function (e) {
  moveT.tag = this.parentElement.parentElement;
  moveT.x = e.pageX;
  moveT.y = e.pageY;
  moveT.px = $(moveT.tag).position().left;
  moveT.py = $(moveT.tag).position().top;
  $(this).attr("move", "true");
  $(document).bind("mousemove", moveF);
};
var moveU = function () {
  $(document).unbind("mousemove", moveF);
};
function movecontrol(tag) {
  unbind(tag);
  $(tag).mousedown(moveD).mouseup(moveU);
}

function unbind(tag) {
  $(tag).unbind("mousedown", moveD).unbind("mouseup", moveU);
}

//window_control
var winminsize = function (e) {
  var win = $(this).parent().parent();
  var body = $(win).find(".winbody");
  $(body[0]).css({ display: "none" });
};
var winmaxsize = function (e) {
  var win = $(this).parent().parent();
  var body = $(win).find(".winbody");
  $(body[0]).css({ display: "block" });
};
var winclose = function (e) {
  var win = $(this).parent().parent();
  $(win).detach();
};

var windowcontrol = function (minb, maxb, closeb) {
  $(minb).unbind();
  $(maxb).unbind();
  $(closeb).unbind();
  $(minb).click(winminsize);

  $(maxb).click(winmaxsize);
  $(closeb).click(winclose);
  $(document).bind("keydown", function (event) {
    if (event.ctrlKey)
      switch (event.keyCode) {
        case 81:
          if($(minb).data("minSizeDown")){
            $(maxb).click();
            $(minb).data("minSizeDown",false);
          }else{
            $(minb).click();
            $(minb).data("minSizeDown",true);
          }
          break;
        case 'x':
          $(closeb).click();
          break;
      }
  });
};
//window_menu
var menuFun = function (e) {
  var data = $(this).data();
  data.menuValue(this);
  $(".menubox").hide();
};

var menuObj = function (e) {
  var ishead = false;
  this.classList.forEach((item) => {
    if (item == "menuhead") {
      $(".menubox").hide();
      ishead = true;
    }
  });
  var v = $(this).data("menuChilds");
  $(v).toggle();
  if ($(this).hasClass("menuhead")) {
    $(v).css({
      left: $(this).offset().left + 3 + "px",
      top: $(this).offset().top + $(this).height() + "px",
    });
  } else {
    $(v).css({
      left: $(this).offset().left + $(this).width() + 3 + "px",
      top: $(this).offset().top - 1 + "px",
    });
  }
};

var menuMes = function (e) {
  alert($(this).attr("menumessage"));
  $(".menubox").hide();
};
var activemenu = function (tag, obj) {
  if (typeof obj == "function") {
    $(tag).click(menuFun);
    $(tag).data("menuValue", obj);
  } else if (typeof obj == "object") {
    $(tag).data("menuValue", obj);
    var menubox = c("menubox", obj);
    $(tag).data("menuChilds", menubox);
    $("#INJECTION").append(menubox);
    windowmenu($(menubox).children().toArray(), obj);
    $(tag).unbind("click", menuObj).click(menuObj);
  } else {
    $(tag).attr("menumessage", obj);
    $(tag).click(menuMes);
  }
};
var windowmenu = function (menus, menuclass) {
  for (var i = 0; i < menus.length; i++) {
    activemenu(menus[i], menuclass[menus[i].getAttribute("menuName")]);
  }
};
function activeWindow(win) {
  movecontrol($(win).find(".winheadfill, .winmove"));
  windowcontrol(
    $(win).find(".minsize"),
    $(win).find(".maxsize"),
    $(win).find(".close")
  );
  windowmenu($(win).find(".menuhead"), WINDOW_MENU);
  $(win).find(".menubox").hide();
}
