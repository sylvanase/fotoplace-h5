function openApp(type) { //
    var _id = parseUrl('id');
    var APPCommon = {
        iphoneSchema: 'mocationapp://' + type + '/' + _id,
        iphoneDownUrl: 'http://mocation.cc/download?source=',
        androidSchema: 'mocationapp://' + type + '/' + _id,
        androidDownUrl: 'http://mocation.cc/download?source=',
        iphoneLink: 'https://apple.mocation.cc/m/apple/' + type + '/' + _id,
        openApp: function() {
            var this_ = this;
            //微信
            if (this_.isWeixin()) {
                window.location.href = this_.iphoneLink;
            } else { //非微信浏览器
                if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                    var loadDateTime = new Date();
                    window.setTimeout(function() {
                        var timeOutDateTime = new Date();
                        if (timeOutDateTime - loadDateTime < 2600) {
                            window.location = this_.iphoneDownUrl + this_.iphoneSchema; //ios下载地址
                        } else {
                            window.close();
                        }
                    }, 2000);
                    window.location = this.iphoneSchema;
                } else if (navigator.userAgent.match(/android/i)) {
                    try {
                        window.location = this_.androidSchema;
                        setTimeout(function() {
                            window.location = this_.androidDownUrl + this_.androidSchema; //android下载地址
                        }, 500);
                    } catch (e) {}
                } else {
                    window.location = this_.iphoneDownUrl + this_.iphoneSchema;
                }
            }
        },
        isWeixin: function() { //判断是否是微信
            var ua = navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == "micromessenger";
        }
    };
    APPCommon.openApp();
    /*var targeturl = "http://a.app.qq.com/o/simple.jsp?pkgname=cc.fotoplace.app";
     window.open(targeturl);*/
}


//获取链接后的参数
function parseUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

Date.prototype.Format = function(fmt) { //时间戳转换
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}; //new Date(parseInt(item.createTime)).Format("yyyy-MM-dd hh:mm");