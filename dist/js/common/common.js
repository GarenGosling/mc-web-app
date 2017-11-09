/***************** 缓存 *******************/
var menu_cache;

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
url.mc.api_author_page = server.mc + '/api/author/page';
url.mc.api_test = server.mc + '/api/test';
url.mc.menu_tree_parentCode = server.mc + '/menu/tree/parentCode';
url.mc.menu_parentCode=server.mc+'/menu/parentCode';
url.mc.api_articles = server.mc + '/api/articles';
url.mc.articles_query = server.mc + '/articles/query';
url.mc.articles_popAuthor = server.mc + '/articles/popAuthor';
url.mc.articles = server.mc + '/articles';
url.mc.moreAttention_all=server.mc+"/moreAttentions";
url.mc.lifeWizard_status=server.mc+"/lifeWizard/status";
url.mc.comment=server.mc+"/comments";
url.host.index = server.host;
url.host.articles_queryByAuthor = server.mc + "/api/articles/queryByAuthor";


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
    if(isLogin()){
        if(getLoginVo()){
            _personal_center_author_valid();
        }else{
            _getAndSaveLoginVo();
        }
    }else{
        login();
    }
}

/**
 * 验证作者
 * @private
 */
function _personal_center_author_valid(){
    if(getUserCode()){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url.mc.api_author_userCode + "?userCode="+getUserCode(),
            beforeSend: function(request) {
                request.setRequestHeader("ticket", getTicket());
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

/**
 * 作者用到的页面是否显示
 */
function authorShow(){
    if(!getAuthor()){
        // 发布文章
        $('.e08c1b1b-338d-4493-8eec-1087e31831df').remove();
        // 作者列表
        $('.351e03e6-5507-465d-bcb7-1dc54b84c82e').remove();
        // 文章列表
        $('.7f33c43a-061e-49c9-8780-edf4264984da').remove();
    }else{
        // 不是管理员
        if(getLoginVo().loginInfo.loginName != "admin"){
            // 作者列表
            $('.351e03e6-5507-465d-bcb7-1dc54b84c82e').remove();
            if(getAuthor().status != 1){
                // 发布文章
                $('.e08c1b1b-338d-4493-8eec-1087e31831df').remove();
                // 文章列表
                $('.7f33c43a-061e-49c9-8780-edf4264984da').remove();
            }
        };
    }

}


/**
 * 退出登录
 * 底层方法
 * @returns {boolean}
 */
function logout() {
    if(!getTicket()){
        alert("您还没有登录");
        return false;
    }
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url.cas.logout,
        beforeSend: function(request) {
            request.setRequestHeader("ticket", getTicket());
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
    if(UrlParm.parm("ticket")){
        localStorage.setItem("ticket",UrlParm.parm("ticket"));
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url.cas.loginVo,
            beforeSend: function(request) {
                request.setRequestHeader("ticket", UrlParm.parm("ticket"));
            },
            success: function(response){
                if(response && response.code == 200){
                    var loginVo = response.data;
                    var loginVoJson = JSON.stringify(loginVo);
                    localStorage.setItem("loginVoJson", loginVoJson);
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
    if(getTicket()){
        return true;
    }
    return false;
}

/**
 * 保存登录信息
 * 从服务器获取登录信息，然后保存到客户端
 */
function _getAndSaveLoginVo(){
    if(getTicket()){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url.cas.loginVo,
            beforeSend: function(request) {
                request.setRequestHeader("ticket", getTicket());
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
}