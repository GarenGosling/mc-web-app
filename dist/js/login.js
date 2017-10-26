/**
 * 注册
 * 跳转到注册页面
 */
function register() {
    window.location.href = "http://120.27.22.41:9090/register";
}

/**
 * 登录
 * 跳转到登录页面
 * */
function login() {
    window.location.href = "http://120.27.22.41:9090/login";
}

/**
 * 获取登录凭据
 */
function getTicket() {
    return localStorage.getItem("ticket");
}

/**
 * 保存登录信息
 * 从服务器获取登录信息，然后保存到客户端
 * @returns {boolean}
 */
function saveLoginVo(){
    debugger
    var ticket = getTicket();
    if(!ticket){
        alert("您还没有登录");
        return false;
    }
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://120.27.22.41:9090/loginVo",
        beforeSend: function(request) {
            request.setRequestHeader("ticket", ticket);
        },
        success: function(response){
            if(response && response.code == 200){
                var loginVo = response.data;
                localStorage.setItem("loginVo", loginVo);
            }else{
                alert(response.message);
            }
        }
    });
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
        url: "http://120.27.22.41:9090/logout",
        beforeSend: function(request) {
            request.setRequestHeader("ticket", ticket);
        },
        success: function(response){
            console.log(response);
            if(response && response.code == 200){
                localStorage.removeItem("ticket");
                localStorage.removeItem("loginVo");
                window.location.href = "http://120.27.22.41:8081";
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
        window.location.href="personal-center-public.html";
    }
    // 是否显示个人中心
    var ticketLocal = getTicket();
    if(ticketLocal){
        $("#personalCenter").show();
    }else{
        $("#personalCenter").hide();
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
        url: "http://120.27.22.41:9093/api/test",
        beforeSend: function(request) {
            request.setRequestHeader("ticket", getTicket());
        },
        success: function(response){
            if(response && response.code == 400){
                window.location.href = "http://120.27.22.41:9090/login";
            }else{
                alert("code:"+response.code+" -- message:" + response.message);
            }
        }
    });
}