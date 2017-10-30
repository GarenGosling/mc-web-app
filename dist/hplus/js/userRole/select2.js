/**
 * 初始化下拉框
 * @type {string}
 */
function initSelect(){
    $("#search_org_id").select2({
        id: function(bond){return bond.orgId;},
        minimumInputLength : 1,
        ajax : {
            url : basePath + "org/likeOrg",
            dataType : 'jsonp',
            quietMillis : 250,
            data : function(term, page) {
                return {
                    name : term, // search term
                    start:0,
                    limit:10
                };
            },
            results : function(data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter the remote JSON data
                response_status_handler(data.status);
                var result = new Array();
                if(!isNull(data.data)){
                    for(var i=0;i<data.data.length;i++){
                        var emp = data.data[i];
                        var news = {
                            orgId	 	: emp.b0110_0,
                            orgName 	: emp.codeitemdesc,
                            dep 	        : emp.fullname
                        }
                        result.push(news);
                    }
                }

                return {
                    results : result
                };
            }
        },
        formatResult : repoFormatResult, // omitted for brevity, see the source of this page
        formatSelection : repoFormatSelection, // omitted for brevity, see the source of this page
        dropdownCssClass : "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup : function(m) {
            return m;
        }, // we do not want to escape markup since we are displaying html in results
        allowClear: true,
        placeholder : "请在此输入账号或姓名进行查询",
        onSelect:function (data, options) {
            console.log("select2");
        }
    }).on("change", function (evt) {
        if (!evt) {
        } else {
            if(!isNull(evt.added)) {
                //选中执行
                $("#search_org_id_hidden").val(evt.added.orgId);
            } else {
                //删除选项执行
                $("#search_org_id_hidden").val('');
            }
        }
    }).on("select", function (evt) {

        if (!evt) {
            var args = "{}";
        } else {
            if(!isNull(evt.added)) {

            }
        }
    }).on("select2:selecting", function(e) {

    });
}

/**
 * 生成下拉项
 * @param repo
 * @returns {string}
 */
function repoFormatResult(repo) {
    var markup = '<div class="row-fluid">' +
        '<div class="span2"></div>' +	//<img src="" />
        '<div class="span10">' +
        '<div class="row-fluid">' +
        '<div class="span6">' + repo.dep + '</div>' +
        //'<div class="span3"><i class="fa fa-code-fork"></i> ' + (isNull(repo.orgname) ?  "" : (repo.orgname +"-"))  +repo.unitname + '</div>' +
        '<div class="span3"><i class="fa fa-star"></i> ' + repo.orgName + '</div>' +
        '</div>';

    markup += '</div></div>';

    return markup;
}

/**
 * 选择回调
 * @param repo
 * @returns {*}
 */
function repoFormatSelection(repo) {
    if(isNull(repo) || isNull(repo.orgName)) return "请选择";
    return repo.orgName;
}




/*function initSelect(){

 $.ajax({
 type:"GET",
 url:basePath+"role/view?start=0&limit=9999",
 dataType:"jsonp",
 success:function(data){
 response_status_handler(data.status);
 $("#role").html("").val("");
 $("#role").append($("<option/>").val("").text(""));
 $(data.data).each(function(i,item){
 var arg1 = item.id;
 var arg2 = item.name;
 $("#role").append($("<option/>").val(item.id).text(item.name));
 });
 },
 error : function(data){
 alert(data.msg);
 }
 });


 }*/



/**
 * 初始化下拉框
 * @type {string}
 */
function initSelectRole(){
    $("#appModal").on("shown.bs.modal", function(){
        $("#role_id").select2({
            id: function(bond){return bond.roleId;},
            minimumInputLength : 1,
            ajax : {
                url : basePath + "role/view?start=0&limit=9999",
                dataType : 'jsonp',
                quietMillis : 250,
                data : function(term, page) {
                    return {
                        name : term, // search term
                        start:0,
                        limit:10
                    };
                },
                results : function(data, page) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter the remote JSON data
                    response_status_handler(data.status);
                    var result = new Array();
                    if(!isNull(data.data)){
                        for(var i=0;i<data.data.length;i++){
                            var role = data.data[i];
                            var news = {
                                roleId	 	: role.id,
                                roleName 	: role.name
                            }
                            result.push(news);
                        }
                    }

                    return {
                        results : result
                    };
                }
            },
            formatResult : roleFormatResult, // omitted for brevity, see the source of this page
            formatSelection : roleFormatSelection, // omitted for brevity, see the source of this page
            dropdownCssClass : "bigdrop", // apply css that makes the dropdown taller
            escapeMarkup : function(m) {
                return m;
            }, // we do not want to escape markup since we are displaying html in results
            allowClear: true,
            placeholder : "请在此输入账号或姓名进行查询",
            onSelect:function (data, options) {
                console.log("select2");
            }
        }).on("change", function (evt) {
            if (!evt) {
            } else {
                if(!isNull(evt.added)) {
                    //选中执行
                    $("#role_id_hidden").val(evt.added.roleId);
                } else {
                    //删除选项执行
                    $("#role_id_hidden").val('');
                }
            }
        })
    });
}

/**
 * 生成下拉项
 * @param repo
 * @returns {string}
 */
function roleFormatResult(role) {
    var markup = '<div class="row-fluid">' +
        '<div class="span2"></div>' +	//<img src="" />
        '<div class="span10">' +
        '<div class="row-fluid">' +
        '<div class="span6">' + role.roleName + '</div>' +
        //'<div class="span3"><i class="fa fa-code-fork"></i> ' + (isNull(repo.orgname) ?  "" : (repo.orgname +"-"))  +repo.unitname + '</div>' +
        '<div class="span3"><i class="fa fa-star"></i> ' + role.roleName + '</div>' +
        '</div>';

    markup += '</div></div>';

    return markup;
}

/**
 * 选择回调
 * @param role
 * @returns {*}
 */
function roleFormatSelection(role) {
    if(isNull(role) || isNull(role.roleName)) return "请选择";
    return role.roleName;
}
/**
 *  用户授权页面，不能输入角色内容（Firefox浏览器，小屏分辨率有问题）
 *  问题原因：是模态对话框（这里是：user_role.html/#appModal）强制使自己处于焦点状态，导致select2的搜索框无法获取焦点所致。
 */
$.fn.modal.Constructor.prototype.enforceFocus = function () {};