var appRoleSelect2 = "";

function initSelect(){
    $("#appRoleModal").on("shown.bs.modal", function(){
        appRoleSelect2 = $("#appRoleSelect2").select2({
            id: function(bond){ return bond.employeeid; },
            minimumInputLength : 1,
            ajax : {
                url : basePath + "hr/likeEmp",
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
                            var olds = data.data[i];
                            var news = {
                                employeeid	 	: olds.e0127,
                                employeename 	: olds.A0101,
                                orgname 		: olds.codeitemdesc,
                                fullpath	 	: olds.fullpath,
                                username		: olds.a0111,
                                jobname 		: olds.fullname,
                                disabled        : false
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
            placeholder : "请在此输入人员进行查询",
            onSelect:function (data, options) {
                alert("select2");
            }
        }).on("change", function (evt) {
                if (!evt) {
                    var args = "{}";
                } else {
                    if(!isNull(evt.added)) {
                        var orgId = evt.val;
                        var orgIds = evt.added.fullpath;
                        NowExpand = orgIds+evt.added.employeeid;
                        refreshNowTree();
                    }
                }
        });
    });


}

function clearAll(){
    if(!isNull(appRoleSelect2)){
        appRoleSelect2.val(null).trigger("change");
    }
}


function repoFormatResult(repo) {
    var markup = '<div class="row-fluid">' +
        '<div class="span2"></div>' +	//<img src="" />
        '<div class="span10">' +
        '<div class="row-fluid">' +
        '<div class="span6">' + repo.employeename + '('+ repo.username +')</div>' +
        //'<div class="span3"><i class="fa fa-code-fork"></i> ' + (isNull(repo.orgname) ?  "" : (repo.orgname +"-"))  +repo.unitname + '</div>' +
        '<div class="span3"><i class="fa fa-star"></i> ' + (isNull(repo.jobname) ? "" : repo.jobname) + '</div>' +
        '</div>';

    if (repo.description) {
        markup += '<div>' + repo.description + '</div>';
    }

    markup += '</div></div>';

    return markup;
}


function repoFormatSelection(repo) {
    $('#employeeform').hide();
    if(isNull(repo) || isNull(repo.employeename)) return "请选择";
    return repo.employeename;
}
