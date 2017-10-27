$(function() {
   alert(url.oss.download);
   alert(url.mc.partnerLink_all);
    alert(url.mc.carousel_all);
});

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
 * 个人中心登录验证
 * 没有登录认证，则跳转到登录页面；
 * 有登录认证，如果没有登录信息，则去服务器查询并保存登录信息
 * 有登录认证，并且有登录信息，则前往作者认证方法
 */
function personal_center_login_vaild() {
    debugger
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
                        localStorage.setItem("loginVo", loginVo);
                    }
                }else{
                    alert(response.message);
                }
            }
        });
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
                localStorage.removeItem("loginVo");
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
/*************/
function applyAuthor(){
    var ticket = getTicket();
    if(!ticket){
        login();
    }else{
        var params = {};
        params.userCode = getUserCode();
        params.phone = $("#phone").val();
        params.idNum = $("#idNum").val();
        params.realName = $("#realName").val();
        params.penName = $("#penName").val();
        params.status = 0;
        var paramsJson = JSON.stringify(params);
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: paramsJson,
            url: url.mc.api_author,
            beforeSend: function(request) {
                request.setRequestHeader("ticket", ticket);
            },
            success: function(response){
                if(response && response.code == 200){
                    var author = response.data;
                    if(author){
                        var loginVo = getLoginVo();
                        loginVo.author = author;
                        localStorage.setItem("loginVo", loginVo);
                    }
                }else{
                    alert(response.message);
                }
            }
        });
    }


}