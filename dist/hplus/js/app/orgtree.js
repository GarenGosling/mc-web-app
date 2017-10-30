function initAppRoleTree() {
    var settingMenu = {
        async: {
            enable: true,
            url: basePath + "org/orgTree?isSealed=2&display=employee&appKey="+appKey+"&appSecret="+appSecret,
            autoParam:["id=pid", "name=n", "level=lv", "appKey="+appKey, "appSecret="+appSecret, "display=employee"],
            type:"get",
            dataType:'jsonp',
            dataFilter: filter
        },
        view: {
            dblClickExpand: true,
            fontCss: getFont //获取当前节点字体
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
            enable: true,
            chkDisabledInherit: true
        },
        callback: {
            onAsyncSuccess: zTreeOnAsyncSuccess,
            onCheck: onCheckRole
        }
    };

    $.fn.zTree.init($("#appRoleTree"), settingMenu);
}

function onCheckRole(event, treeId, treeNode) {
    //勾选或者取消勾选时，同步右侧数据
    syncRight(treeNode);
    //设置复选框有效或者无效
    setChkDisabled(treeId, treeNode);
    //当前节点所有子节点全选时，所有子节点置为无效，并勾选当前节点
    setChkDisabledForParent(treeId, treeNode);
    //检查是否显示默认提示
    reviewInfo();
}

//勾选或者取消勾选时，同步右侧数据
function syncRight(treeNode) {
    if (treeNode.checked) {
        addArrayByNode(treeNode);
    } else {
        delArrayByNodeId(treeNode);
    }
}

function addArrayByNode(treeNode) {
    if (treeNode.isParent) {
        //添加组织
        addArray('org', treeNode);
    } else {
        //添加人员
        addArray('emp', treeNode);
    }
}

function delArrayByNodeId(treeNode) {
    if (treeNode.isParent) {
        //删除组织
        delArrayById('org', treeNode);
    } else {
        //删除人员
        delArrayById('emp', treeNode);
    }
}

//实际添加操作，判断不存在，则添加
function addArray(flag, treeNode) {
    if (isNull(flag)){
        return;
    }
    if (flag != 'org' && flag != 'emp'){
        return;
    }
    var items;
    if (flag == 'org'){
        items = orgListObj.orgList;
    } else if (flag == 'emp'){
        items = empListObj.empList;
    }
    var b = true;
    for (var i=0;i<items.length;i++) {
        if (items[i].id == treeNode.id) {
            b = false;
            break;
        }
    }
    if (b) {
        if (flag == 'org'){
            orgListObj.orgList.push({id: treeNode.id, name: treeNode.name, fullpath: treeNode.org.fullpath});
        } else if (flag == 'emp'){
            empListObj.empList.push({id: treeNode.id, name: treeNode.name, fullpath: treeNode.employee.fullpath});
        }
    }
}

function delArrayById(flag, treeNode) {
    delArrayByFlagAndId(flag, treeNode.id);
}

//根据id删除，判断右侧存在，则删除
function delArrayByFlagAndId(flag, nodeId) {
    if (isNull(flag)){
        return;
    }
    if (flag != 'org' && flag != 'emp'){
        return;
    }
    var items;
    if (flag == 'org'){
        items = orgListObj.orgList;
    } else if (flag == 'emp'){
        items = empListObj.empList;
    }
    if (isNull(items) || items.length == 0){
        return;
    }
    for (var i=0;i<items.length;i++) {
        if (items[i].id == nodeId) {
            if (flag == 'org'){
                orgListObj.orgList.splice(i, 1);
            } else if (flag == 'emp'){
                empListObj.empList.splice(i, 1);
            }
            break;
        }
    }
}

function delArrayByNodeFullpath(treeNode) {
    delArrayByFullpath(treeNode);
}

//根据id删除，判断右侧存在，则删除
function delArrayByFullpath(treeNode) {
    var itemsOrg = orgListObj.orgList;
    var itemsEmp = empListObj.empList;
    if (!isNull(itemsOrg) && itemsOrg.length > 0){
        //删除组织
        for (var i=0;i<itemsOrg.length;i++) {
            //非等于排除自己，剩余包含自己fullpath的均为子节点，需要删除
            if (itemsOrg[i].fullpath != treeNode.org.fullpath && itemsOrg[i].fullpath.indexOf(treeNode.org.fullpath) != -1) {
                orgListObj.orgList.splice(i--, 1);
            }
        }
    }
    if (!isNull(itemsEmp) && itemsEmp.length > 0){
        //删除人员
        for (var i=0;i<itemsEmp.length;i++) {
            //非等于排除自己，剩余包含自己fullpath的均为子节点，需要删除
            if ((itemsEmp[i].fullpath + itemsEmp[i].id) != treeNode.org.fullpath && itemsEmp[i].fullpath.indexOf(treeNode.org.fullpath) != -1) {
                empListObj.empList.splice(i--, 1);
            }
        }
    }
}

//设置复选框有效或者无效
function setChkDisabled(treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    if (isNull(treeObj)){
        return;
    }
    var nodes = treeNode.children;
    if (isNull(nodes) || nodes.length == 0){
        return;
    }
    //如果当前为父节点，且不是勾选状态，则所有子节点置为有效
    if (treeNode.isParent && !treeNode.checked) {
        for (var i=0;i<nodes.length;i++) {
            treeObj.setChkDisabled(nodes[i], false, false, true);
            treeObj.checkNode(nodes[i], false, true);
        }
        //删除右侧数组中当前节点的所有子节点
        delArrayByNodeFullpath(treeNode);
        return;
    }
    //如果当前为父节点，且是勾选状态，则所有子节点置为无效
    if (treeNode.isParent && treeNode.checked) {
        for (var i=0;i<nodes.length;i++) {
            treeObj.setChkDisabled(nodes[i], true, false, true);
        }
        //删除右侧数组中当前节点的所有子节点
        delArrayByNodeFullpath(treeNode);
        return;
    }
}

//当前节点所有子节点全选时，所有子节点置为无效，并勾选当前节点
function setChkDisabledForParent(treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    if (isNull(treeObj)){
        return;
    }
    //判断当前节点的同级节点是否都选中，若都选中则勾选父节点，并把同级所有节点置为无效
    var parentNode = treeNode.getParentNode();
    if (isNull(parentNode)){
        return;
    }
    var pNodes = parentNode.children;
    if (isNull(pNodes) || pNodes.length == 0){
        return;
    }
    var pn = true;
    for (var i=0;i<pNodes.length;i++) {
        if (pNodes[i].checked && !pNodes[i].getCheckStatus().half || pNodes[i].chkDisabled){
            continue;
        }
        pn = false;
    }
    if (pn){
        //如果都选中，则同级置为无效并勾选父级
        for (var i=0;i<pNodes.length;i++) {
            treeObj.setChkDisabled(pNodes[i], true, false, true);
        }
        treeObj.checkNode(parentNode, true, true, true);
        //删除右侧parentNode的所有子节点
        delArrayByNodeFullpath(parentNode);
    }
}

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    initSelectTreeNode(treeId, treeNode);
}

function initSelectTreeNode(treeId, treeNode) {
    if (isNull(treeNode)) {
        return;
    }
    if (isNull(treeNode.children) || treeNode.children.length == 0) {
        return;
    }
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    if (isNull(treeObj)){
        return;
    }
    var nodes = treeNode.children;
    //如果当前为父节点，且是勾选状态，则所有子节点置为无效
    if (treeNode.isParent && treeNode.checked || treeNode.chkDisabled) {
        for (var i=0;i<nodes.length;i++) {
            treeObj.setChkDisabled(nodes[i], true, false, true);
        }
        return;
    }

    var orgArr = orgListObj.orgList;
    var empArr = empListObj.empList;
    for (var i=0;i<nodes.length;i++) {
        var b = true;
        for (var n=0;n<orgArr.length;n++) {
            if (nodes[i].isParent) {
                //循环比对并勾选组织
                if (nodes[i].id == orgArr[n].id) {
                    b = false;
                    treeObj.checkNode(nodes[i], true, true);
                    break;
                }
            }
        }
        if (b) {
            //循环比较并勾选人员
            for (var m=0;m<empArr.length;m++) {
                if (nodes[i].id == empArr[m].id) {
                    treeObj.checkNode(nodes[i], true, true);
                    break;
                }
            }
        }
    }
}



function getFont(treeId, node) {
    if(node.isParent) {
        if (node.org.is_delete == 2) {
            return {color: grep};
        } else {
            return {};
        }
    }else{
        if (node.employee.is_delete == 2) {
            return {color: grep};
        } else {
            return {};
        }
    }
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

/**
 * 删除右侧数据，同步取消左侧树节点的勾选状态
 */
function syncLeft(flag, objId) {
    //1.删除右侧点击的当前项
    delArrayByFlagAndId(flag, objId);
    //2.取消左侧树中节点的勾选状态
    cancelChk(objId);
    //3.设置默认提示
    reviewInfo();
}

function cancelChk(objId) {
    var treeObj = $.fn.zTree.getZTreeObj("appRoleTree");
    var nodes = treeObj.getNodesByParam("id", objId);
    if (isNull(nodes) || nodes.length == 0) {
        //如果没找到，直接返回
        return;
    }
    treeObj.checkNode(nodes[0], false, true, true);
}

function reviewInfo() {
    if (orgListObj.orgList.length == 0){
        $("#orgInfoId").show();
    } else {
        $("#orgInfoId").hide();
    }
    if (empListObj.empList.length == 0){
        $("#empInfoId").show();
    } else {
        $("#empInfoId").hide();
    }
}
