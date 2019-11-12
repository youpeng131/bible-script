var gloabUrl = 'https://www.portuguesbiblia.com/';
//var gloabUrl = 'http://18.231.168.120/';
// var gloabUrl = 'http://localhost:8082/';

//设置cookie
function setCookie(cname, cvalue, exdays) {
  var exp = new Date();
  exp.setTime(exp.getTime() + exdays * 24 * 60 * 60 * 1000);
  document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";expires=" + exp.toGMTString()+";path=/";
  return true;
}
//获取cookie
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}
//清除cookie
function clearCookie(name) {
  setCookie(name, 0, -1);
}


function checkCookie() {
  let count = 1;
  var ret = getCookie("readCount");
  if (ret) {
    count = parseInt(ret, 10);
    count++;
    if (count >=5) {
      $('#download_recommend_modal').show();
      $('#download_recommend').show();
    } else {
      setCookie("readCount", count, 365);
    }
  } else {
    setCookie("readCount", 1, 365);
  }
  return count;
}
