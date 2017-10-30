/**
 * 初始化列表
 * @param name
 */
var table;
function initTable(name){
    if (table){
        table.destroy();
    }
    name = $.trim(name);
    table = $('#role_table_id')
        .on('xhr.dt', function (e, settings, json, xhr) {
            response_status_handler(json.status);
            if (json.status == 503) {
                return;
            }
            if (json.status == 401) {
                return;
            }
            //如果未超时且有权限，再加载功能权限，如果在ready方法中加载，
            //getResource()也会验证一次response_status_handler，如果超时或者无权限会弹出两次提示信息
            getResource();
        } )
        .DataTable( {
        "dom": '<"toolbar">frtip',
        "processing": true,
        "serverSide": true,
        "searching": false,
        "destroy": true,
        "ordering": false,
        "ajax": {
            url: basePath+"role/view?name=" + name,
            "dataSrc": "data",
            dataType: "jsonp"
        },
        "fnRowCallback" : function(nRow, aData, iDisplayIndex){
            // response_status_handler(aData.status);
        },
        "columnDefs": [
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "targets": 0
            },
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "targets": 1
            },
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "targets": 2
            },
            {
                "render": function ( data, type, row ) {
                    var orgName = isNull(row.codeitemdesc) ? "" : row.codeitemdesc;
                    var resIds = isNull(row.resourceIds) ? "" : row.resourceIds;
                    var str = "";
                    str += "<button class='btn btn-info '   type='button' " +
                        "onclick='updateView(\"" + data + "\", \"" + row.name + "\", \"" + row.orgId + "\", \"" + orgName + "\", \"" + resIds + "\")'><i class='fa fa-paste'></i> 修改</button>";
                    str += "&nbsp;&nbsp;<button class='btn btn-info '   type='button' onclick='deleteRole(\"" + data + "\")'><i class='fa fa-paste'></i> 删除</button>";
                    if (data == 1) {
                    } else if (data == 0) {
                    }
                    return str;
                },
                "targets": 3
            }
        ],
        "columns": [
            { "data": "id" },
            { "data": "name" },
            { "data": "codeitemdesc" },
            { "data": "id" },
        ]
    } );
}

/**
 * 打开新增页面
 */
function addView() {
    clearWindow();

    $("#roleModal").modal("show");
    $("#roleAddId").show();
    $("#roleUpdateId").hide();
    $("#roleId").val("");
    $("#roleName").val("");
    $("#roleOrgId").val("");
    $("#roleSelectOrgName").val("");
    $("#selectNameMenu").val("");
}

/**
 * 新增
 */
function add(){
    if ($("#roleEditFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "role/add?name="+ $("#roleName").val() +"&orgId=" + $("#roleOrgId").val()
                                + "&resourceIds=" + $("#resourceIds").val(),
            dataType : "jsonp",
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert(data.msg);
                    $("#roleModal").modal("hide");
                    initTable($("#role_select_name_id").val());
                }
                if(data.status == 400){
                    alert(data.msg);
                }

            },
            error : function(data){
                alert("error")
            }
        });
    }

}

/**
 * 查询功能名称
 */
function getResourceNameMenu(){
    $.ajax({
        type : "GET",
        url         : basePath + "resource/getResourceName?resourceIds=" + $("#resourceIds").val(),
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                $("#selectNameMenu").val(data.data);
            }
            if(data.status == 400){
                alert(data.msg);
            }
        },
        error : function(data){
            alert("error")
        }
    });
}

function clearWindow() {
    /*删掉错误信息文字*/
    $("#roleName-error").remove();
    $("#roleSelectOrgName-error").remove();
    $("#selectNameMenu-error").remove();
    /**删掉红框*/
    $("#roleName").removeClass("error");
    $("#roleSelectOrgName").removeClass("error");
    $("#selectNameMenu").removeClass("error");
}
/**
 * 打开修改页面
 */
function updateView(id, name, orgId, roleSelectOrgName, resourceIds) {
    clearWindow();
    $("#roleModal").modal("show");
    $("#roleUpdateId").show();
    $("#roleAddId").hide();
    $("#roleId").val(id);
    $("#roleName").val(name);
    $("#roleOrgId").val(orgId);
    $("#roleSelectOrgName").val(roleSelectOrgName);
    $("#resourceIds").val(resourceIds);
    getResourceNameMenu();
    //勾选当前记录已选的功能权限
    initCheckMenu();
}

/**
 * 修改
 */
function update(){
    if ($("#roleEditFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "role/update?id=" + $("#roleId").val() + "&name="+ $("#roleName").val()
                            +"&orgId=" + $("#roleOrgId").val() + "&resourceIds=" + $("#resourceIds").val(),
            dataType : "jsonp",
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert(data.msg);
                    $("#roleModal").modal("hide");
                    initTable($("#role_select_name_id").val());
                }
                if(data.status == 400){
                    alert(data.msg);
                }
            },
            error : function(data){
                alert("error")
            }
        });
    }
}

/**
 * 删除
 */
function deleteRole(id){
    var msg = "确定要删除角色吗？";
    if (confirm(msg)==true){
        $.ajax({
            type : "GET",
            url         : basePath + "role/delete?id="+ id ,
            dataType : "jsonp",
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert(data.msg);
                }
                if(data.status == 400){
                    alert(data.msg);
                }
                initTable($("#role_select_name_id").val());
            },
            error : function(data){
                alert("error")
            }
        });
    }
}


/**
 * 按名称查询
 */
function roleListSelect() {
    initTable($("#role_select_name_id").val());
}

var orgTreeId = "orgSelectOrgTreeId";
var selectOrgName = "roleSelectOrgName";
var selectOrgTreeContent = "orgSelectOrgTreeContent";
var selectOrgId = "roleOrgId";

function initOrgTree() {
    var settingPost = {
        async: {
            enable: true,
            url: basePath + "org/orgTree?appKey="+appKey+"&appSecret="+appSecret,
            autoParam:["id=pid", "name=n", "level=lv", "appKey="+appKey, "appSecret="+appSecret],
            type:"get",
            dataType:'jsonp',
            dataFilter: filter
        },
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClickOrg,
            onAsyncSuccess: zTreeOnAsyncSuccess
        }
    };
    $.fn.zTree.init($("#" + orgTreeId), settingPost);
    showSelect();
}

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    response_status_handler(msg.status);
}

function showSelect() {
    var orgObj = $("#" + selectOrgName);
    var orgOffset = $("#" + selectOrgName).offset();
    $("#" + selectOrgTreeContent).css({left:orgOffset.left + "px", top:orgOffset.top + orgObj.outerHeight() + "px"});
    $("#" + orgTreeId).css({width:orgObj.outerWidth() + "px"});
    $("#" + selectOrgTreeContent).show();
    $("body").bind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (!(event.target.id == selectOrgName || event.target.id == selectOrgTreeContent || $(event.target).parents("#" + selectOrgTreeContent).length>0)) {
        hideMenu();
    }
}

function hideMenu() {
    $("#" + selectOrgTreeContent).hide();
    $("body").unbind("mousedown", onBodyDown);
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

function onClickOrg(e, treeId, treeNode) {
    $("#" + selectOrgName).val(treeNode.name);
    $("#" + selectOrgId).val(treeNode.id);
    $("#" + selectOrgTreeContent).hide();
}


var selectTreeIdMenu = "selectTreeIdMenu";
var selectNameMenu = "selectNameMenu";
var selectTreeContentMenu = "selectTreeContentMenu";

var nodesMenu;
function getResource() {
    var nd;
    $.ajax({
        type : "GET",
        url         : basePath + "resource/menuTree?appKey="+appKey+"&appSecret="+appSecret,
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                nodesMenu = data.data;
            }
            if(data.status == 400){
                alert(data.msg);
                return '';
            }
        },
        error : function(data){
            alert("error")
            return '';
        }
    });
}

function initMenuTree() {
    var settingMenu = {
        view: {
            dblClickExpand: true
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: 0
            }
        },
        check: {
            enable: true
        },
        callback: {
            onCheck: onCheckMenu,
            onAsyncSuccess: zTreeOnAsyncSuccess
        }
    };

    $.fn.zTree.init($("#" + selectTreeIdMenu), settingMenu, nodesMenu);
}

function onCheckMenu(event, treeId, treeNode) {
    selectMenu();
};

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    response_status_handler(msg.status);
}

function showSelectMenu() {
    var orgObj = $("#" + selectNameMenu);
    var orgOffset = $("#" + selectNameMenu).offset();
    $("#" + selectTreeContentMenu).css({left:orgOffset.left + "px", top:orgOffset.top + orgObj.outerHeight() + "px"});
    $("#" + selectTreeIdMenu).css({width:orgObj.outerWidth() + "px"});
    $("#" + selectTreeContentMenu).show();
    $("body").bind("mousedown", onBodyDownMenu);
}

function initCheckMenu() {
    var resourceIds = $("#resourceIds").val();
    if (isNull(resourceIds)){
        return;
    }
    var treeObj = $.fn.zTree.getZTreeObj(selectTreeIdMenu);
    if (isNull(treeObj)){
        return;
    }
    //获取全部节点
    var allMenu = treeObj.transformToArray(treeObj.getNodes());
    var resourceIdArr;
    resourceIdArr = resourceIds.split(",");
    for (var i=0, l=allMenu.length; i<l; i++) {
        allMenu[i].name = allMenu[i].name.replace(/\.n/g, '.');
        //设置上次选中的节点
        if (!isNull(resourceIdArr)){
            for (var n=0, m=resourceIdArr.length; n<m; n++) {
                if (allMenu[i].id == resourceIdArr[n]){
                    if (allMenu[i].isParent && !isNull(allMenu[i].children) && allMenu[i].children.length > 0) {
                        continue;
                    }
                    treeObj.checkNode(allMenu[i], true, true);
                    break;
                }
            }
        }
    }
}

function onBodyDownMenu(event) {
    if (!(event.target.id == selectNameMenu || event.target.id == selectTreeContentMenu
        || $(event.target).parents("#" + selectTreeContentMenu).length>0 )) {
        hideMenuMenu();
    }
}

function hideMenuMenu() {
    $("#" + selectTreeContentMenu).hide();
    $("body").unbind("mousedown", onBodyDownMenu);
}

function selectMenu() {
    var treeObj = $.fn.zTree.getZTreeObj(selectTreeIdMenu);
    if (isNull(treeObj)){
        return;
    }
    var nodes = treeObj.getCheckedNodes(true);
    var resourceIds = "";
    var names = "";
    if (!isNull(nodes)){
        for (var i=0; i<nodes.length; i++) {
            if (nodes[i].id == 1) {
                //排除根节点
                continue;
            }
            resourceIds += nodes[i].id;
            names += nodes[i].name;
            if (i != (nodes.length - 1)){
                resourceIds += ",";
                names += ",";
            }
        }
    }
    $("#resourceIds").val(resourceIds);
    $("#" + selectNameMenu).val(names);
}


$(document).ready(function(){
    initTable('');
    // getResource();
    $('#roleModal').on('show.bs.modal', function () {
        //打开模态框时初始化树
        initMenuTree();
    })
    $('#roleModal').on('hide.bs.modal', function () {
        //关闭模态框时销毁树
        $.fn.zTree.destroy("orgSelectOrgTreeId");
        $.fn.zTree.destroy("selectTreeIdMenu");
        $("#resourceIds").val("");
    })
});


