function openApp(type) {
    var _id = parseUrl('id');
    var APPCommon = {
        iphoneSchema: 'mocationapp://' + type + '/' + _id,
        iphoneDownUrl: 'http://mocation.cc/download?source=',
        androidSchema: 'mocationapp://' + type + '/' + _id,
        androidDownUrl: 'http://mocation.cc/download?source=',
        iphoneLink: 'https://apple.mocation.cc/m/apple/' + type + '/' + _id,
        openApp: function () {
            var this_ = this;
            //微信
            if (this_.isWeixin()) {
                window.location.href = this_.iphoneLink;
            } else {//非微信浏览器
                if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                    var loadDateTime = new Date();
                    window.setTimeout(function () {
                        var timeOutDateTime = new Date();
                        if (timeOutDateTime - loadDateTime < 2600) {
                            window.location = this_.iphoneDownUrl + this_.iphoneSchema;//ios下载地址
                        } else {
                            window.close();
                        }
                    }, 2000);
                    window.location = this.iphoneSchema;
                } else if (navigator.userAgent.match(/android/i)) {
                    try {
                        window.location = this_.androidSchema;
                        setTimeout(function () {
                            window.location = this_.androidDownUrl + this_.androidSchema; //android下载地址
                        }, 500);
                    } catch (e) {
                    }
                } else {
                    window.location = this_.iphoneDownUrl + this_.iphoneSchema;
                }
            }
        },
        isWeixin: function () { //判断是否是微信
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

Date.prototype.Format = function (fmt) { //时间戳转换
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

/*
 * 调用谷歌地图 生成图片
 * */
function getMap(arr) { //默认使用图标 map-mark.png，待修改
    /*
     地图标记有以下情况：
     1.普通标记：map-mark.png
     2.选中标记：map-pick.png
     3.中心标记：map-center.png
     4.A~Z的标记：A.png
     */
    /*https://maps.googleapis.com/maps/api/staticmap?size=328x206&scale=2
     &markers=icon:https://ks3-cn-beijing.ksyun.com/fp-testvideo/160726/3786505/mapTips.png%7Clabel:S%7C40.293498,116.670713
     &markers=icon:https://ks3-cn-beijing.ksyun.com/fp-testvideo/160726/3786505/mapTips.png%7Clabel:S%7C40.293498,116.670712*/

    //https://ditu.google.cn/maps/api/staticmap?size=328x183&scale=2
    //&markers=color:0xF01D00%7Clabel:A%7C40.767726,-73.971790
    //&markers=color:0xFF8200%7Clabel:B%7C40.771751,-73.974853

    var mapHost = 'https://ditu.google.cn/maps/api/staticmap?size=640x412&scale=2',
        makersUrl = '', //makers参数
        mapIcon = 'icon:https://ks3-cn-beijing.ksyun.com/fp-testvideo/160726/3786505/mapTips.png'; //指定使用图标
    var Regx = /^[A-Z]*$/;
    var rgb = ['F01D00', 'FF8200', '659400', '9528C9', '24A5E5', 'AE0057', 'FF7E7B', 'FFB617', '92C800', 'A662C9', '29ADE3', 'FF2B92', 'FFA9AC', '8CB199', 'B68BCD', '88B7FD', 'EA0245', 'C86B00', '416600', '6C5CD5', '007095', '642400', 'FF7EB9', '08B5B5', '6C1D8A', '050505'];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][2] !== undefined) { //传入了对标记图片的要求，替换icon
            if (Regx.test(arr[i][2])) { //颜色icon
                var _index = parseInt(arr[i][2], 16) - 10;
                mapIcon = 'color:0x' + rgb[_index] + '%7Clabel:' + arr[i][2];
            }
        }
        makersUrl += '&markers=' + mapIcon + '%7C' + arr[i][0] + ',' + arr[i][1];
    }
    //var imgMapSrc = mapHost + makersUrl;
    return mapHost + makersUrl;
}