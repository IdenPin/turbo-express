exports.setCookie = setNewCookie;
exports.getCookieValue = getNewCookie;
exports.deleteCookie = deleteNewCookie;
var host = window.location.host;
var y = host.substring(0, host.length - 13);
var local = y.indexOf('local');
var dev = y.indexOf('dev');
var test = y.indexOf('test');
var pre = y.indexOf('pre');
var pro = y.indexOf('pro');
var devzntb = y.indexOf('devzntb'); //智能填报测试使用

var domainStr = '';
if (local > -1) {
    domainStr = 'local.zhigaokao.cn';
} else if (devzntb > -1) {
    domainStr = 'devzntb.zhigaokao.cn'; //智能填报测试使用
}else if (dev > -1) {
    domainStr = 'dev.zhigaokao.cn';
} else if (test > -1) {
  domainStr = 'test.zhigaokao.cn';
} else if (pre > -1) {
  domainStr = 'pre.zhigaokao.cn';
} else {
  domainStr = 'zhigaokao.cn';
}


//cubic add
var localCookieName = 'SC';

function getLocalCookie() {
  var allcookies = getCookieValue(localCookieName);
  allcookies = utf8to16(base64decode( allcookies));
  var cookiePattern = /[^\s^\|]*\=[^=^|]*/g;
  var loaclCookieStringArray = allcookies.match(cookiePattern);
  loaclCookieStringArray = loaclCookieStringArray && loaclCookieStringArray.length ?
      loaclCookieStringArray : [];
  var localCookieArray = [];
  for (var i = 0; i < loaclCookieStringArray.length; i++) {
    var tpmArr = loaclCookieStringArray[i].split('=');
    localCookieArray[tpmArr[0]] = tpmArr[1];
  }
  return localCookieArray;
}

function setNewCookie(name, value, hours, path) {
  var localCookieArray = getLocalCookie();
  if (name == 'token') {
    setCookie(name, value, hours, path);
  }
  localCookieArray[name] = escape(value);
  var localCookieStringArray = [];
  for (var i in localCookieArray) {
    var tpmString = i + '=' + localCookieArray[i];
    localCookieStringArray.push(tpmString.toString());
  }
  var allcookies = localCookieStringArray.join('|');
  allcookies += '|';
  allcookies = base64encode(utf16to8(allcookies));
  setCookie(localCookieName, allcookies, hours, path);
  return true;
}

function getNewCookie(name) {
  var localCookieArray = getLocalCookie();
  var returnValue = localCookieArray[name] ? localCookieArray[name] : '';
  returnValue = unescape(returnValue);
  return returnValue;
}

function deleteNewCookie(name) {
  var localCookieArray = getLocalCookie();
  var localCookieStringArray = [];
  for (var i in localCookieArray) {
    var tpmString = i + '=' + localCookieArray[i];
    if (i != name) {
      localCookieStringArray.push(tpmString);
    }
  }
  var allcookies = localCookieStringArray.join('|');
  allcookies += '|';
  console.log(name);
  console.log(allcookies);
  allcookies = base64encode(utf16to8(allcookies));
  setCookie(localCookieName, allcookies, 4, '');
  allcookies = getCookieValue(localCookieName);
  allcookies = utf8to16(base64decode( allcookies));
  console.log(allcookies);
  return true;
}

var base64EncodeChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -
        1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -
        1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52,
    53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3,
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
    37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -
        1);

function base64encode(str) {
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
  }
  return out;
}

function base64decode(str) {
  var c1, c2, c3, c4;
  var i, len, out;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    /* c1 */
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    }
    while (i < len && c1 == -1);
    if (c1 == -1)
      break;
    /* c2 */
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    }
    while (i < len && c2 == -1);
    if (c2 == -1)
      break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    /* c3 */
    do {
      c3 = str.charCodeAt(i++) & 0xff;
      if (c3 == 61)
        return out;
      c3 = base64DecodeChars[c3];
    }
    while (i < len && c3 == -1);
    if (c3 == -1)
      break;
    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
    /* c4 */
    do {
      c4 = str.charCodeAt(i++) & 0xff;
      if (c4 == 61)
        return out;
      c4 = base64DecodeChars[c4];
    }
    while (i < len && c4 == -1);
    if (c4 == -1)
      break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
}

function utf16to8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else
    if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

function utf8to16(str) {
  var out, i, len, c;
  var char2, char3;
  out = "";
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx10xx xxxx10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
        break;
    }
  }
  return out;
}

// hours为空字符串时,cookie的生存期至浏览器会话结束。
// hours为数字0时,建立的是一个失效的cookie,这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。
// 设置cookie
function setCookie(name,value,hours,path){
  var name = escape(name);
  var value = escape(value);
  var expires = new Date();
  //expires.setTime(expires.getTime() + days*24*60*60*1000);
  expires.setTime(expires.getTime() + hours*60*60*1000);
  path = path == "" ? "": ";path=" + path;
  var domain = ";domain="+domainStr;
  expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
  document.cookie = name + "=" + value + expires + path + domain;
}
// 获取cookie
function getCookieValue(name){
  var name = escape(name);
  //读cookie属性，这将返回文档的所有cookie
  var allcookies = document.cookie;
  //查找名为name的cookie的开始位置
  name += "=";
  var pos = allcookies.indexOf(name);
  //如果找到了具有该名字的cookie，那么提取并使用它的值
  if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败
    var start = pos + name.length;                  //cookie值开始的位置
    var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
    if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie
    var value = allcookies.substring(start,end);  //提取cookie的值
    return unescape(value);                           //对它解码
  }
  else return "";                                             //搜索失败，返回空字符串
}

// 删除cookie
function deleteCookie(name,path){
  var name = escape(name);
  var expires = new Date(0);
  path = path == "" ? "" : ";path=" + path;
  var domain = ";domain="+domainStr;
  document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path + domain;
}
