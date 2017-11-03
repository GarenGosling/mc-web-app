/**
 *
 * @param length
 * @param total
 */
function initPagingShow(length, total){
    $(".paging-begin").text(get_paging_begin(length));
    $(".paging-end").text(get_paging_end(length, total));
    $(".paging-total").text(total);
    showPageNos(get_paging_no_now(), length);
}

/**
 * 显示页码按钮
 * @param pageNo
 * @param length
 */
function showPageNos(pageNo, length){
    debugger
    var paging_no_max = get_paging_no_max(length);
    var n = parseInt(pageNo / 5) * 5 + 1;
    var m = parseInt(pageNo / 5 + 1) * 5;
    if(m > get_paging_no_max(length)){
        m = paging_no_max;
    }
    $(".paging-no").hide();
    for(var i=n;i<=m;i++){
        $("#paging-no-" + i).text(i).show();
    }
}

/**
 * 切换上一组页码按钮
 * @param length
 */
function show_paging_lt(length){
    var pageNo = $("#paging-no-1").text();
    if(pageNo >5){
        pageNo = pageNo - 5;
    }
    showPageNos(pageNo, length);
}

/**
 * 切换下一组页码按钮
 * @param length
 */
function show_paging_gt(length){
    var pageNo = $("#paging-no-1").text();
    var paging_no_max = get_paging_no_max(PAGE_LENGTH);
    if(pageNo + 5 <= paging_no_max){
        pageNo = pageNo + 5;
    }
    showPageNos(pageNo, length);
}

/**
 * 本页的页码
 * @returns {*|jQuery}
 */
function get_paging_no_now(){
    var paging_no_now = $(".paging-no-now").val();
    if(!paging_no_now){
        paging_no_now = 1;
    }
    return paging_no_now;
}

/**
 * 设置本页的页码
 * @param paging_no_now
 */
function set_paging_no_now(paging_no_now){
    $(".paging-no-now").val(paging_no_now);
    $(".pagging-ctrl").find(".active").removeClass("active");
    var no = paging_no_now;
    if(no >5){
        no = no - parseInt(no / 5) * 5;
    }
    $("#paging-no-"+no).addClass("active");
}

/**
 * 上一页的页码
 * @returns {number}
 */
function get_paging_no_plt(){
    var paging_no_now = get_paging_no_now();
    if(paging_no_now == 1){
        return 1;
    }else{
        return paging_no_now - 1;
    }
}

/**
 * 下一页的页码
 * @param length
 * @returns {*}
 */
function get_paging_no_prt(length){
    var paging_no_now = get_paging_no_now();
    var paging_no_max = get_paging_no_max(length);
    if(paging_no_now == paging_no_max){
        return paging_no_now;
    }else{
        return parseInt(paging_no_now) + 1;
    }
}


/**
 * 获取最大页数
 * @param length
 * @returns {number}
 */
function get_paging_no_max(length){
    debugger
    var total = parseInt(get_paging_total());
    length = parseInt(length);
    if(total % length == 0){
        return parseInt(total / length);
    }else{
        return parseInt(total / length + 1);
    }
}

/**
 * 获取本页总数
 * @returns {jQuery}
 */
function get_paging_total(){
    debugger
    var paging_total = $(".paging-total").text();
    if(!paging_total){
        paging_total = 0;
    }
    return paging_total;
}
/**
 * 本页开始条数（显示）
 * @returns {number}
 */
function get_paging_begin(length){
    return (get_paging_no_now() - 1) * length + 1;
}

/**
 * 本页结束条数
 * @param total
 * @returns {number}
 */
function get_paging_end(length, total){
    if(total == 0){
        return 0;
    }
    var paging_end = get_paging_begin(length) * length;
    if(paging_end > total){
        paging_end = total;
    }
    return paging_end;
}

/**
 * 本页开始条数（查询）
 * @param length
 * @returns {number}
 */
function get_paging_start(length){
    return get_paging_begin(length) - 1;
}