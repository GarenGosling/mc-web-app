/**
 * 初始化列表
 * @param fullname
 */
var table;
function initTable(){
    var params = {};
    params.email = $("#search_email").val().trim();
    params.employeeNo = $("#search_employee_no").val().trim();
    params.mobile = $("#search_mobile").val().trim();
    params.fullname = $("#search_fullname").val().trim();
    params.orgId = $("#search_org_id_hidden").val().trim();
    if(!$("#searchForm").valid()){
        return ;
    }
    if (table){
        table.destroy();
    }
    table = $('#user_role_table_id')
        .on('xhr.dt', function (e, settings, json, xhr) {
            response_status_handler(json.status);
        } )
        .DataTable( {
        "dom": '<"toolbar">frtip',
        "processing": true,
        "serverSide": true,
        "searching": false,
        "destroy": true,
        "ordering": false,
        "ajax": {
            url: basePath+"userRole/view",
            "dataSrc": "data",
            dataType: "jsonp",
            data:params
        },
        "fnRowCallback" : function(nRow, aData, iDisplayIndex){
            response_status_handler(aData.status);
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
                    var str = "";
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "targets": 3
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
                "targets": 4
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
                "targets": 5
            },
            {
                "render": function ( data, type, row ) {
                    return "<button class='btn btn-info '   type='button' onclick='addOpen(\"" + row.employee_no + "\", \"" + row.fullname + "\", \"" + row.email + "\",\"" + row.mobile + "\",\"" + row.role_name + "\",\"" + row.user_id + "\",\"" + row.role_id + "\")'><i class='fa fa-paste'></i>授权</button>";
                },
                "targets": 6
            }
        ],
        "columns": [
            { "data": "employee_no" },
            { "data": "fullname" },
            { "data": "codeitemdesc" },
            { "data": "email" },
            { "data": "mobile" },
            { "data": "role_name" }
        ]
    } );/*  $(".paginate_button").onclick(){

     }*/



}
jQuery.validator.addMethod("isMobile", function(value, element) {
    if(isNull(value)){
        return true;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(myreg.test(value)){
        return true;
    }else{
        return false;
    }
}, "请输入正确的手机号码 支持：130-139,150-159,170-179,180-189");

var searchValidate = $("#searchForm").validate({
    focusInvalid: false, // do not focus the last invalid input
    ignore: "",
    rules: {
        "search_employee_no": {
            required    : false,
            maxlength   : 32
        },
        "search_fullname": {
            required    : false,
            maxlength   : 32
        },
        "search_email"      : {
            required    : false,
            maxlength   : 128
        },
        "search_mobile"     : {
            required    : false,
            isMobile    :true
        }
    }
});