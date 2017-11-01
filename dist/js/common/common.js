/***************** 页面跳转 *******************/
function changePage(pageName, tag) {

    if(tag == "head"){
        $(".active").removeClass("active");
        $("#"+pageName).addClass("active");
        if(pageName == "main"){
            $(".left").html("");
            $(".right").html("");
            $(".mainDiv").load("main.html");
        }else if(pageName == "personal-center"){
            var ticket = getTicket();
            if(ticket){
                $(".mainDiv").html("");
                $(".left").load("common/left2.html");
                $(".right").load(pageName+"-main.html");
            }else {
                login();
                // $(".mainDiv").html("");
                // $(".left").load("common/left2.html");
                // $(".right").load(pageName+"-main.html");
            }

        }else{
            $(".mainDiv").html("");
            $(".left").load("common/left.html");
            $(".right").load(pageName+".html");
        }
    }

    if(tag == "left"){
        $("#left_menu").find(".active").removeClass("active");
        $("#"+pageName).addClass("active");
        $(".right").load(pageName+".html");
    }

}

/***************** url *******************/
var server = {};
server.ip_test = '120.27.22.41';
server.ip_local = 'localhost';
server.base = "http://";
server.cas = server.base + server.ip_test + ':9090';
server.oss = server.base + server.ip_test + ':9091';
server.mc = server.base + server.ip_test + ':9093';
server.host = server.base + server.ip_test + ':8081';

var url = {};
url.cas = {};
url.oss = {};
url.mc = {};
url.host = {};

url.cas.register = server.cas + '/register';
url.cas.login = server.cas + '/login';
url.cas.logout = server.cas + '/logout';
url.cas.loginVo = server.cas + '/loginVo';

url.oss.download = server.oss + '/download/';

url.mc.partnerLink_all = server.mc + '/partnerLink/all';
url.mc.carousel_all = server.mc + '/carousel/all';
url.mc.api_author_userCode = server.mc + '/api/author/userCode';
url.mc.api_author = server.mc + '/api/author';
url.mc.api_test = server.mc + '/api/test';
url.mc.menu_tree_parentCode = server.mc + '/menu/tree/parentCode';
url.mc.api_articles = server.mc + '/api/articles';
url.mc.articles_query = server.mc + '/articles/query';
url.mc.articles_popAuthor = server.mc + '/articles/popAuthor';
url.mc.articles = server.mc + '/articles';

url.host.index = server.host;


/***************** 登录相关 *******************/
/**
 * 注册
 * 跳转到注册页面
 */
function register() {
    window.location.href = url.cas.register;
}

/**
 * 登录
 * 跳转到登录页面
 * */
function login() {
    window.location.href = url.cas.login;
}

/**
 * 获取登录凭据
 */
function getTicket() {
    return localStorage.getItem("ticket");
}

/**
 * 获取登录信息
 * @returns {null}
 */
function getLoginVo() {
    var loginVoJson = localStorage.getItem("loginVoJson");
    if(!loginVoJson){
        return null;
    }
    return JSON.parse(loginVoJson);
}

/**
 * 获取作者信息
 * @returns {*}
 */
function getAuthor() {
    var loginVo = getLoginVo();
    if(loginVo){
        var author = loginVo.author;
        if(author){
            return author;
        }
    }
    return null;
}

/**
 * 获取用户编码
 * @returns {*}
 */
function getUserCode() {
    var loginVo = getLoginVo();
    if(loginVo){
        var loginInfo = loginVo.loginInfo;
        if(loginInfo){
            return loginInfo.userCode;
        }else{
            return null;
        }
    }
    return null;
}

/**
 * 获取登录名
 * @returns {*}
 */
function getLoginName() {
    var loginVo = getLoginVo();
    if(loginVo){
        var loginInfo = loginVo.loginInfo;
        if(loginInfo){
            return loginInfo.loginName;
        }else{
            return null;
        }
    }
    return null;
}

/**
 * 个人中心登录验证
 * 没有登录认证，则跳转到登录页面；
 * 有登录认证，如果没有登录信息，则去服务器查询并保存登录信息
 * 有登录认证，并且有登录信息，则前往作者认证方法
 */
function personal_center_login_vaild() {
    var ticket = getTicket();
    if(!ticket){
        login();
    }else{
        var loginVo = getLoginVo();
        if(!loginVo){
            _getAndSaveLoginVo(ticket);
        }else{
            var userCode = loginVo.loginInfo.userCode;
            _personal_center_author_valid(ticket, userCode);
        }
    }
}

/**
 * 验证作者
 * @param ticket
 * @param userCode
 * @private
 */
function _personal_center_author_valid(ticket, userCode){
    if(!getAuthor()){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url.mc.api_author_userCode + "?userCode="+userCode,
            beforeSend: function(request) {
                request.setRequestHeader("ticket", ticket);
            },
            success: function(response){
                if(response && response.code == 200){
                    var author = response.data;
                    if(author){
                        var loginVo = getLoginVo();
                        loginVo.author = author;
                        var loginVoJson = JSON.stringify(loginVo);
                        localStorage.setItem("loginVoJson", loginVoJson);
                    }
                    authorShow();
                }else{
                    alert(response.message);
                }
            }
        });
    }
}

function authorShow(){
    var author = getAuthor();
    if(author){
        $("#personal-center-articles").show();
        $("#personal-center-public").show();
        $("#personal-center-edit").show();
    }else {
        $("#personal-center-articles").hide();
        $("#personal-center-public").hide();
        $("#personal-center-edit").hide();
    }
}

/**
 * 获取登录信息
 * 包括：登录信息、用户基本信息、授权应用信息
 */
function getLoginVoFromClient() {
    return localStorage.getItem("loginVo");
}

/**
 * 退出登录
 * 底层方法
 * @returns {boolean}
 */
function logout() {
    var ticket = getTicket();
    if(!ticket){
        alert("您还没有登录");
        return false;
    }
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url.cas.logout,
        beforeSend: function(request) {
            request.setRequestHeader("ticket", ticket);
        },
        success: function(response){
            console.log(response);
            if(response && response.code == 200){
                localStorage.removeItem("ticket");
                localStorage.removeItem("loginVoJson");
                window.location.href = url.host.index;
            }else{
                alert(response.message);
            }
        }
    });
}

/**
 * 登录成功回调方法
 */
function loginSuccessCallback(){
    var ticket = UrlParm.parm("ticket");
    if(ticket){
        localStorage.setItem("ticket",ticket);
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url.cas.loginVo,
            beforeSend: function(request) {
                request.setRequestHeader("ticket", ticket);
            },
            success: function(response){
                if(response && response.code == 200){
                    var loginVo = response.data;
                    var loginVoJson = JSON.stringify(loginVo);
                    localStorage.setItem("loginVoJson", loginVoJson);
                    $("#welcome").text(getLoginName());
                    //changePage('personal-center', 'head');
                    window.location.href = 'main.html?pageNameMain=personal-center-main&menuCodeMain=5518c3a5-21ce-43b2-88d2-17e34ee1ba53';
                }else{
                    alert(response.message);
                }
            }
        });

    }

}

/**
 * 是否已登录
 * @returns {boolean}
 */
function isLogin() {
    var ticket = getTicket();
    if(ticket){
        return true;
    }
    return false;
}

function testLoginApi(){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url.mc.api_test,
        beforeSend: function(request) {
            request.setRequestHeader("ticket", getTicket());
        },
        success: function(response){
            if(response && response.code == 400){
                window.location.href = url.cas.login;
            }else{
                alert("code:"+response.code+" -- message:" + response.message);
            }
        }
    });
}


/**
 * 保存登录信息
 * 从服务器获取登录信息，然后保存到客户端
 */
function _getAndSaveLoginVo(ticket){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url.cas.loginVo,
        beforeSend: function(request) {
            request.setRequestHeader("ticket", ticket);
        },
        success: function(response){
            if(response && response.code == 200){
                var loginVo = response.data;
                var loginVoJson = JSON.stringify(loginVo);
                localStorage.setItem("loginVoJson", loginVoJson);
            }else{
                alert(response.message);
            }
        }
    });
}

/**
 * 查询树形菜单
 * @param parentCode
 * @param callback
 */
function menuTreeFull(parentCode, callback) {
    var params = {};
    params.parentCode = parentCode;
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: params,
        url: url.mc.menu_tree_parentCode,
        success: function(response){
            if(response && response.code == 200){
                callback(response.data);
            }else{
                alert(response.message);
            }
        }
    });


}