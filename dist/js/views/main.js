$(".footer").load("common/foot.html");

/**
 * 点击导航栏
 * @param pageName
 * @param menuCode
 */
function navbarClick(pageName, menuCode) {
    debugger
    $(".active").removeClass("active");
    $("#"+pageName).addClass("active");
    changeMenu(menuCode);
}

/**
 * 改变左侧菜单
 * @param menuCode
 */
function changeMenu(menuCode){
    debugger
    var params_menu = {};
    params_menu.parentCode = menuCode;
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: params_menu,
        url: url.mc.menu_tree_parentCode,
        success: function(response){
            if(response && response.code == 200){
                var html = '<h1 class="sidebar_tit">'+$("#row2 .active").text()+'</h1>';
                html += '<ul class="sidebar_nav">';
                html += $("#tmp5").render(response.data);
                html += '</ul>';
                $("#left_menu").html(html);
                $(".right").html("");
            }else{
                alert(response.message);
            }
        }
    });
}

/**
 * 点击左侧菜单
 * @param url
 * @param code
 */
function menuClick(url, code){
    $("#menus").find(".active").removeClass("active");
    $("."+code).addClass("active");
    changeIframe(url, code);
}

/**
 * 改变右侧iframe引用页面
 * @param url
 */
function changeIframe(url, code){
    debugger
    $(".right").html("");
    if(url && code){
        var path = url+"?menuCode="+code;
        //var myIframe = $("<iframe/>").attr("src",path).attr("width","100%").attr("scrolling","no").attr("frameborder","0").attr("height",document.documentElement.clientHeight);
        var myIframe = $("<iframe/>").attr("src",path).attr("width","100%").attr("scrolling","no").attr("frameborder","0").attr("height","3000");
        $(".right").append(myIframe);
    }

}




