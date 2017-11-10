$(function() {
    window.setInterval("reinitIframe()", 1000);
})

function reinitIframe(){
    parent.document.getElementById("iframe").height=document.body.scrollHeight;
}