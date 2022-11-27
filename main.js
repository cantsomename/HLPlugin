function funcDownload(content, filename) {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement("a");
  eleLink.download = filename;
  eleLink.style.display = "none";
  // 字符内容转变成blob地址
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}
function dn() {
  var ss = document.querySelector("html").outerHTML;
  funcDownload(ss, "ceshi.html");
}

//DATA

class Main {
  constructor() {
    this.win = c("window", "hlPlugin");
    this.menu = $(this.win).find(".menu")[0];
    this.body = $(this.win).find(".winbody");
    this.init();
    this.__main__();
  }
  init() {
    this.initSelect();
    this.initProperties();
  }
  initSelect() {
    this.select = c("box", "选择器");
    this.body.append(this.select);
    $(this.select).addClass("tagSelect");
    $(this.select).find(".boxname").addClass("tagSelectName");
    $(this.select)
      .find(".boxvalue")
      .addClass("tagSelectValue")
      .append(c("select", $("html")[0]));
    $(this.select)
      .find(".selectname")
      .click(function () {
        // $(this).next().toggle();
        main.setProperties($(this).parent().data("target"));
      }).mouseenter(function(){
        var target = $(this).parent().data("target");
        main.show(target);
        console.log(target);
        $(this).mouseout(function(){
          main.hide();
          $(this).unbind("mouseout");
        })
      });
  }
  setSelect(node) {
    $(this.select).find(".tagSelectValue").html("").append(c("select",node));
    $(this.select).find(".selectname").click(function(){
      main.setProperties($(this).parent().data("target"));
    });
  }
  initProperties() {
    this.properties = c("box", "属性");
    this.body.append(this.properties);
    $(this.properties).addClass("tagProperties");
    $(this.properties).find(".boxname").addClass("tagPropertiesName");
    $(this.properties).find(".boxvalue").addClass("tagPropertiesValue");
  }
  static bf() {
    var pair = $(this).parent();
    var tag = $(pair).closest(".propertiebox").data("tag");
    var key = $(pair).find(".pairkey").text();
    var value = $(pair).find(".pairvalue").text();
    if (key && value) {
      if (tag.type == "attribute") {
        $(tag.node).attr(key, value);
      } else if (tag.type == "style") {
        $(tag.node).css(key, value);
      }
    }
  }
  setProperties(node) {
    var ps = c("propertie", node);
    var vb = $(this.properties).find(".boxvalue")[0];
    $(vb).html("");
    for (var i in ps.value) {
      $(vb).append(ps.value[i]);
    }
    $(vb).find(".propertiedemoname,.propertiedemovalue").blur(Main.bf);
    $(vb)
      .find(".propertieAdd")
      .click(function () {
        var pat = $(this).parent().next();
        var l = $(pat).children().last();
        if (
          $(l).find(".pairvalue").text() ||
          $(l).find(".pairvalue").text() ||
          $(pat).children().length <= 0
        ) {
          var pair = __CREATE__.createPair("", "");
          $($(pair).children()[0]).addClass("propertiedemoname").blur(Main.bf);
          $($(pair).children()[1]).addClass("propertiedemofill");
          $($(pair).children()[2]).addClass("propertiedemovalue").blur(Main.bf);
          $(pat).append(pair);
        }
      });
  }
  show(node){
    var ab = this.AreaBox;
    $(ab).show().css({
      left:$(node).offset().left,
      top:$(node).offset().top,
      width:$(node).width(),
      height:$(node).height()
    });
  }
  hide(){
    $(this.AreaBox).hide();
  }
  
  __main__() {
    this.AreaBox = $("<div class='areaBox' style='position:absolute;display:none;'></div>");
    $("#INJECTION").append(this.win).append(this.AreaBox);
  }
}



main = new Main();
