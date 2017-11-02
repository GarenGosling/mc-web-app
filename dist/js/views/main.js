$(".footer").load("common/foot.html");
if(isLogin()){
    $("#welcome").text(getLoginName());
    $("#loginBtn").hide();
    $("#logoutBtn").show();
}else{
    $("#loginBtn").show();
    $("#logoutBtn").hide();
}

if(UrlParm.parm("pageNameMain") && UrlParm.parm("menuCodeMain")){
    navbarClick(UrlParm.parm("pageNameMain"), UrlParm.parm("menuCodeMain"));
}

/**
 * 点击导航栏
 * @param pageName
 * @param menuCode
 */
function navbarClick(pageName, menuCode) {
    $("#row2").find(".active").removeClass("active");
    $("#"+pageName).addClass("active");
    changeMenu(pageName, menuCode);
}

/**
 * 改变左侧菜单
 * @param menuCode
 */
function changeMenu(pageName, menuCode){
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

                var defaultUrl = "";
                var defaultCode = "";
                if(response.data.length>=0){
                    defaultUrl = response.data[0].url;
                    defaultCode = response.data[0].code;
                    if(!defaultUrl && response.data[0].children && response.data[0].children.length>0){
                        defaultUrl = response.data[0].children[0].url;
                        defaultCode = response.data[0].children[0].code;
                        if(!defaultUrl && response.data[0].children[0].children && response.data[0].children[0].children.length>0){
                            defaultUrl = response.data[0].children[0].children[0].url;
                            defaultCode = response.data[0].children[0].children[0].code;
                        }
                    }
                }
                if(defaultUrl && defaultCode){
                    menuClick(defaultUrl, defaultCode);
                    // 个人中心
                    if(pageName == "personal-center-main"){
                        personal_center_login_vaild();
                    }
                }
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
    $("#left_menu").find(".active").removeClass("active");
    $("."+code).addClass("active");
    changeIframe(url, code);
}

/**
 * 改变右侧iframe引用页面
 * @param url
 */
function changeIframe(url, code){
    $(".right").html("");
    if(url && code){
        if(url.indexOf("?")>-1){
            var path = url+"&menuCode="+code;
        }else{
            var path = url+"?menuCode="+code;
        }

        //var myIframe = $("<iframe/>").attr("src",path).attr("width","100%").attr("scrolling","no").attr("frameborder","0").attr("height",document.documentElement.clientHeight);
        var myIframe = $("<iframe/>").attr("src",path).attr("width","100%").attr("scrolling","no").attr("frameborder","0").attr("height","3000");
        $(".right").append(myIframe);
    }

}





