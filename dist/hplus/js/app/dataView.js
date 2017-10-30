var orgListObj = {'orgList':[]};
var empListObj = {'empList':[]};
var appRoleOrgListVM;
var appRoleEmpListVM;
function initVue() {
    appRoleOrgListVM = new Vue({
        el: '#appRoleOrgList',
        data: orgListObj,
        methods:{
            deleteOrgEmp: function (objId) {
                syncLeft('org', objId);
            }
        }
    })

    appRoleEmpListVM = new Vue({
        el: '#appRoleEmpList',
        data: empListObj,
        methods:{
            deleteOrgEmp: function (objId) {
                syncLeft('emp', objId);
            }
        }
    })
}