var server = {};
server.ip_test = '120.27.22.41';
server.ip_local = 'localhost';
server.base = "http://";
server.cas = server.base + server.ip_local + ':9090';
server.oss = server.base + server.ip_test + ':9091';
server.mc = server.base + server.ip_local + ':9093';
server.host = server.base + server.ip_local + ':8081';

var url = {};
url.cas = {};
url.oss = {};
url.mc = {};
url.host = {};

url.cas.register = server.cas + '/register';
url.cas.login = server.cas + '/login';
url.cas.logout = server.cas + '/logout';
url.cas.loginVo = server.cas + '/loginVo';

url.oss.download = server.oss + '/download';

url.mc.partnerLink_all = server.mc + '/partnerLink/all';
url.mc.carousel_all = server.mc + '/carousel/all';
url.mc.api_author_userCode = server.mc + '/api/author/userCode';
url.mc.api_author = server.mc + '/api/author';
url.mc.api_test = server.mc + '/api/test';

url.host.index = server.host;

