$(function() {
    window.setInterval("reinitIframe()", 200);
})

function reinitIframe(){
    parent.document.getElementById("iframe").height=document.body.scrollHeight;
}