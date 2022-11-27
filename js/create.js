String.format = function () {
  var str = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    str = str.replace(reg, arguments[i + 1]);
  }
  return str;
};

WINDOW_MENU = {
  文件: {
    导入: "功能未完善！",
    导出: () => {
      content = $("html").clone();
      content.find("#INJECTION").remove();
      content = content[0].outerHTML;
      filename = $("title").text()
        ? $("title").text() + ".html"
        : "default.html";
      funcDownload(content, filename);
    },
  },
  tags: {
    HTML: {
      describe: "文件类型，放在档案的开头与结尾",
      parent: ["root"],
    },
    TITLE: {
      describe: "文件标题，必须放在[文头]区块内",
      parent: ["HEAD"],
    },
    HEAD: {
      describe: "文头，描述性资料，像是[主题]",
      parent: ["HTML"],
    },
    BODY: {
      describe: "文件本体",
      parent: ["HTML"],
    },
    H: {
      name: "[1-6]",
      describe: "标题有六层选择,数值高字越小",
      attribute: {
        ALIGN: {
          describe: "对齐方式",
          value: "LEFT|CENTER|RIGHT",
        },
      },
    },
    P: {
      describe: "区分，片段",
      attribute: {
        PALIGN: {
          describe: "对齐",
          value: "LEFT|RIGHT|CENTER|JUSTIFY",
        },
      },
    },
  },
  编辑: {
    功能未完善: "功能未完善！",
  },
  关于: "本插件由何圆圆制作，\n当前版本1.0.0，谢谢使用！！！",
};

var __CREATE__ = {
  box: `
      <div class="boxname">{0}</div>
      <div class="boxvalue"></div>
    `,
  pair: `
      <div class="pairkey" contenteditable="true">{0}</div>
      <div class="pairfill"></div>
      <div class="pairvalue" contenteditable="true">{1}</div>
    `,
  win: `
      <div class="winhead">
        <div class="winmove"></div>
        <div class="winname">{0}</div>
        <div class="winheadfill"></div>
        <div class="minsize wincontroll">-</div>
        <div class="maxsize wincontroll">□</div>
        <div class="close wincontroll">×</div>
      </div>
      <div class="winmenu">{1}</div>
      <div class="winbody"></div>
    `,
  menu: `
      <div class="menuhead">{0}</div>
    `,
  menudemo: `
    {0}
  `,
  __MENU__: ["文件", "编辑", "关于"],
  create: function (type) {
    var len = arguments.length - 1;
    if (len < 0) {
      throw "不能没有参数！！！";
    }
    return type == "element"
      ? len >= 1
        ? __CREATE__.createElement(arguments[1])
        : __CREATE__.error("参数不够！！！")
      : type == "box"
      ? len >= 1
        ? __CREATE__.createBox(arguments[1])
        : __CREATE__.error("参数不够！！！")
      : type == "pair"
      ? len >= 2
        ? __CREATE__.createPair(arguments[1], arguments[2])
        : __CREATE__.error("参数不够！！！")
      : type == "window"
      ? len == 1
        ? __CREATE__.createWindow(arguments[1])
        : len == 2
        ? __CREATE__.createWindow(arguments[1], arguments[2])
        : __CREATE__.error("参数不够！！！")
      : type == "menu"
      ? len >= 1
        ? __CREATE__.createMenu(arguments[1])
        : __CREATE__.createMenu(__CREATE__.__MENU__)
      : type == "move"
      ? len >= 1
        ? __CREATE__.createMove(arguments[1])
        : __CREATE__.error("参数不够！！！")
      : type == "menudemo"
      ? len >= 1
        ? __CREATE__.createMenuDemo(arguments[1])
        : __CREATE__.error("参数不够")
      : type == "menubox"
      ? len >= 1
        ? __CREATE__.createMenuBox(arguments[1])
        : __CREATE__.error("参数不够！！！")
      : type == "select"
      ? len >= 1
        ? __CREATE__.createSelect(arguments[1])
        : __CREATE__.error("参数不够！！！")
      : type == "propertie"
      ? len >= 0
        ? __CREATE__.createProperties(arguments[1])
        : __CREATE__.error("参数不够")
      : len == 0
      ? __CREATE__.stringToelement(type)
      : null;
  },
  error: function (err) {
    if (err) {
      throw err;
    }
    return undefined;
  },
  createProperties: (node) => {
    var reskey = {
      attribute: node.attributes,
      style: node.style,
    };
    var resval = {};
    for (var i in reskey) {
      resval[i] = __CREATE__.createPropertieDemo(node, i, reskey[i]);
    }
    return { key: reskey, value: resval};
  },
  createPropertieDemo: (node, name, list) => {
    var demo = __CREATE__.createBox(name);
    $(demo).addClass("propertiebox").find(".boxname").addClass("propertieboxname").append("<div class='propertieAdd'>+</div>");
    var demovalue = $(demo).find(".boxvalue").addClass("propertieboxvalue")[0];
    for (var i = 0; i < list.length; i++) {
      var pair = __CREATE__.createPair(list[i].name, list[i].value);
      $(pair).addClass("propertiedemo");
      $($(pair).children()[0]).addClass("propertiedemoname");
      $($(pair).children()[1]).addClass("propertiedemofill");
      $($(pair).children()[2]).addClass("propertiedemovalue");
      $(demovalue).append(pair);
    }
    $(demo).data("tag",{type:name,node:node});
    return demo;
  },
  createSelect: (ele) => {
    if ($(ele).attr("id") == "INJECTION") {
      return null;
    }
    var res = __CREATE__.createSelectDemo(ele);
    $(res).data({
      target: ele,
      targetName: ele.nodeName.toLocaleLowerCase(),
      targetClassName: ele.className
        ? "." + ele.className.replace(" ", ".")
        : "",
      targetId: ele.id ? "#" + ele.id : "",
      selectname: $(res).find(".selectname")[0],
      selectvalue: $(res).find(".selectvalue")[0],
    });
    var name = $(res).data("selectname");
    $(name).html("");
    var value = $(res).data("selectvalue");
    $(value).hide();
    var font = $(
      "<font class='elementName'>" + $(res).data("targetName") + "</font>"
    )[0];
    $(name).append(font);
    font = $("<font class='idName'>" + $(res).data("targetId") + "</font>")[0];
    $(name).append(font);
    font = $(
      "<font class='className'>" + $(res).data("targetClassName") + "</font>"
    )[0];
    $(name).append(font);
    var childs = $(ele).children();
    for (var i = 0; i < childs.length; i++) {
      var demo = __CREATE__.createSelect(childs[i]);
      $(value).append(demo);
    }
    $(name).click(function () {
      $(this).next().toggle();
      // main.setProperties($(this).parent().data("target"));
    });
    return res;
  },
  createSelectDemo: (node) => {
    var demo = __CREATE__.createBox(node.nodeName.toLocaleLowerCase());
    $(demo).addClass("select");
    $(demo).find(".boxname").addClass("selectname");
    $(demo).find(".boxvalue").addClass("selectvalue");
    return demo;
  },
  createMenuBox: (mdemos) => {
    var ds = __CREATE__.stringToelement("", "menubox");
    for (var i in mdemos) {
      var demo = __CREATE__.createMenuDemo(i);
      $(demo).data("menuValue", mdemos[i]);
      demo.setAttribute("menuName", i);
      ds.append(demo);
    }
    return ds;
  },
  createMenuDemo: (menuname) => {
    var mdemo = __CREATE__.menudemo;
    mdemo = String.format(mdemo, menuname);
    mdemo = __CREATE__.stringToelement(mdemo, "menudemo");
    return mdemo;
  },
  stringToelement: (str, classname) => {
    var temp = document.createElement("div");
    temp.innerHTML = str;
    if (classname) {
      temp.classList.add(classname);
    }
    return temp;
  },
  createElement: (tagname) => {
    return document.createElement(tagname);
  },
  createBox: (boxname) => {
    var box = __CREATE__.box;
    box = String.format(box, boxname);
    box = __CREATE__.stringToelement(box, "box");
    return box;
  },
  createPair: (pairkey, pairvalue = "") => {
    var pair = __CREATE__.pair;
    pair = String.format(pair, pairkey, pairvalue);
    pair = __CREATE__.stringToelement(pair, "pair");
    return pair;
  },
  createWindow: (
    winname /*窗口名*/,
    menu = __CREATE__.create("menu").outerHTML
  ) => {
    var win = __CREATE__.win;
    win = String.format(win, winname, menu);
    win = __CREATE__.stringToelement(win, "win");
    if (win) {
      win.classList.add("win");
    }
    activeWindow(win);
    return win;
  },
  createMenu: (menu) => {
    var m = document.createElement("div");
    m.classList.add("menu");
    for (var i in menu) {
      var demo = __CREATE__.stringToelement(menu[i], "menuhead");
      $(m).append(demo);
      demo.setAttribute("menuName", menu[i]);
    }
    return m;
  },
};
var c = __CREATE__.create;
