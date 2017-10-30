

function addOpen(employeeNo,fullName,email,mobile,role_name,user_id,role_id){
    clearWinSelect2();
    $("#userIdHidden").val(user_id);
    $("#appModal").modal("show");
    $("#appModalTitleId").text("用户授权");
    if(isNull(role_name)){  //新增
        $("#add_user_role_btn").show();
        $("#update_user_role_btn").hide();
        //$("#role_id_hidden").val("");
        //$("#s2id_role_id").find(".select2-chosen").text("");
    }else{  //修改
        $("#add_user_role_btn").hide();
        $("#update_user_role_btn").show();
        $("#s2id_role_id").find(".select2-chosen").text(role_name);
    }
    //清空
    $("#employeeNo").val(isNull(employeeNo)?"":employeeNo);
    $("#fullName").val(isNull(fullName)?"":fullName);
    $("#email").val(isNull(email)?"":email);
    $("#mobile").val(isNull(mobile)?"":mobile);
}

/**
 * 弹出层select2刷新
 */
function clearWinSelect2(){
    var roleInput = $("<input/>").attr("type","text").attr("placeholder","请输入要查询的角色").addClass("select2-container select2-container-multi input-focblu").attr("id","role_id").attr("style","width: 220px;");
    var roleInputHidden = $("<input/>").attr("type","hidden").attr("id","role_id_hidden");
    $("#roleWinDiv").html("").append(roleInput).append(roleInputHidden);
}

function addClose(){
    $("#userIdHidden").val("");
    $("#appModal").modal("hide");
    refreshPage();
}

function refreshPage(){
    var start = $('#user_role_table_id').dataTable().fnSettings()._iDisplayStart;
    var length = $('#user_role_table_id').dataTable().fnSettings()._iDisplayLength;
    var pageNo = 0;
    if(start%length==0){
        pageNo = start/length;
    }else{
        pageNo = start/length+1;
    }
    //$('#user_role_table_id').dataTable().fnPageChange( 'previous', true );
    //$('#user_role_table_id').dataTable().fnPageChange( 'next', true );
    $('#user_role_table_id').dataTable().fnPageChange(pageNo);
    initSelect();
    initSelectRole();
}

function resetSearch() {
    $("#searchForm")[0].reset();
    initSelect();
}
function add_user_role(){
    var user_id = $("#userIdHidden").val();
    var role_id = $("#role_id_hidden").val();
    if(isNull(user_id)){
        alert("用户不能为空！");
        return ;
    }
    if(isNull(role_id)){
        alert("角色不能为空！");
        return ;
    }
    var params = {};
    params.userId = user_id;
    params.roleId = role_id;
    $.ajax({
        type:"GET",
        url:basePath+"userRole/add",
        dataType:"jsonp",
        data:params,
        success:function(data){
            response_status_handler(data.status);
            if(data.status==200){
                addClose();
            }else{
                alert(data.msg);
            }
        },
        error : function(data){
            alert(data.msg);
        }
    });
}

function update_user_role(){
    var user_id = $("#userIdHidden").val();
    var role_id = $("#role_id_hidden").val();
    var params = {};
    params.userId = user_id;
    params.roleId = role_id;
    if(isNull(params.roleId)){
        alert("请修改角色！");
        return ;
    }
    if(confirm("确认修改用户角色吗？")){
        $.ajax({
            type:"GET",
            url:basePath+"userRole/update",
            dataType:"jsonp",
            data:params,
            success:function(data){
                response_status_handler(data.status);
                if(data.status==200){
                    addClose();
                }else{
                    alert(data.msg);
                }
            },
            error : function(data){
                alert(data.msg);
            }
        });
    }
}

$(document).ready(function(){
    initTable();
    initSelect();
    clearWinSelect2();
    initSelectRole();
});