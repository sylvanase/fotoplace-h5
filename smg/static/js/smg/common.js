var uToken = parseUrl('uToken'), //页面token
    jsTicket = parseUrl('jsTicket'),
    nickName = decodeURI(parseUrl('nickname')),
    host = 'http://' + window.location.host,
    APPID = 'wxc695aff9cd412873',
    REDIRECT_URI = '/ws/wx/redirect',
    imgId = '', //上传图片返回的id值
    originSrc = host + '/static/img/smg/demo.jpg', //分享图的url
    subtitleNo = ''; //字幕的id
var aux = document.getElementsByTagName('audio')[0];

window.onload = function () {
    if (uToken == null) { //token为空，跳转微信授权页
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID + '&redirect_uri=' + host + REDIRECT_URI + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    }
    //禁止页面缩放和拖拽
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    })
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false)

    document.body.style.overflow = 'hidden';
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    });
    //获取签名，启用微信分享配置
    getWxConfig();
};

function autoPlayMusic() {
    // 自动播放音乐效果，解决微信自动播放问题
    function musicInWeixinHandler() {
        musicPlay(true);
        document.addEventListener("WeixinJSBridgeReady", function () {
            musicPlay(true);
        }, false);
        document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
    }

    document.addEventListener('DOMContentLoaded', musicInWeixinHandler);

    var u = navigator.userAgent;
    // 自动播放音乐效果，解决浏览器或者APP自动播放问题
    function musicInBrowserHandler() {
        musicPlay(true);
        document.body.removeEventListener('touchstart', musicInBrowserHandler);
    }

    document.body.addEventListener('touchstart', musicInBrowserHandler);

}

function musicPlay(isPlay) {
    if (isPlay && aux.paused) {
        aux.play();
    }
    if (!isPlay && !aux.paused) {
        aux.pause();
    }
}

//初始化swiper
var mySwiper = new Swiper('.swiper-container', {
    effect: 'fade',
    direction: 'vertical'
});

//暂停、播放音乐
$('.js-play-music').click(function (e) {
    e.preventDefault();
    var medias = $('.js-play-music').find('div');
    for (var i = 0; i < medias.length; i++) {
        medias.eq(i).toggleClass("rotate");
        if (medias.eq(i).hasClass("rotate")) {
            medias.eq(i).addClass('on').removeClass('off');
            aux.play();
        } else {
            medias.eq(i).addClass('off').removeClass('on');
            aux.pause();
        }
    }
});

//触发文件选择
$('.js-choose-img').click(function (e) {
    e.preventDefault();
    $('#imgFile').click();
});

function setImagePreview() { //预览选择的图片
    var typeStr = $('#imgFile')[0].value;
    typeStr = typeStr.substr(typeStr.lastIndexOf(".")).toLowerCase(); //获取图片类型
    if (!/\.(jpg|png)$/.test(typeStr)) {
        alert("请选择jpg或png格式的图片");
        return false;
    }
    var slide = mySwiper.activeIndex; //获取当前的slide索引
    if (slide == 0) { //索引为0时，跳转到下一页，并且请求字幕
        $('.js-choose-text').click();
        mySwiper.slideNext();
    }
    var file = $('#imgFile')[0].files[0],
        reader = new FileReader();
    if (!file) { //取消文件选择时，不进行后续操作
        return;
    }
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        $('#imgPreview img').attr('src', e.target.result); //重置预览图片
        $('#imgPreview').css("top", "0px"); //重置图片位移
    };
    uploadImg(file); //上传图片
}

//获取移动元素
var picture = document.getElementById("imgPreview");
//添加触屏开始事件
picture.addEventListener("touchstart", function (e) {
    var p, f1, f2;
    //由于触屏的坐标是个数组，所以取出这个数组的第一个元素
    e = e.touches[0];
    //保存picture和开始触屏时的坐标差
    p = {
        x: picture.offsetLeft - e.clientX,
        y: picture.offsetTop - e.clientY
    };
    //添加触屏移动事件
    document.addEventListener("touchmove", f2 = function (e) {
        //获取保触屏坐标的对象
        var t = t = e.touches[0];
        //把picture移动到初始计算的位置加上当前触屏位置
        //picture.style.left=p.x+t.clientX+"px";
        //判断图片高度是否超过容器，以及超出的范围
        if ($('#imgPreview').outerHeight() <= $('.area').outerHeight()) {
            //图片高度小于或等于容器禁止移动
            picture.style.top = "0px";
        } else {
            var maxHeight = $('.area').outerHeight() - $('#imgPreview').outerHeight();
            var moveHeight = p.y + t.clientY;
            //picture.style.top=p.y+t.clientY+"px";
            if (maxHeight <= moveHeight && moveHeight <= 3) {
                picture.style.top = moveHeight + "px";
            }
        }
        //阻止默认事件
        //e.preventDefault();
    }, false);
    //添加触屏结束事件
    document.addEventListener("touchend", f1 = function (e) {
        //移除在document上添加的两个事件
        document.removeEventListener("touchend", f1);
        document.removeEventListener("touchmove", f2);
    }, false);
}, false);

//更换字幕及音乐
$('.js-choose-text').click(function (e) {
    e.preventDefault();
    var para = {
        uToken: uToken
    };
    $.ajax({
        url: '/ws/wx/smginfo_random',
        dataType: 'json',
        type: 'GET',
        async: true,
        data: para,
        success: function (rsp) {
            var obj = rsp.data;
            if (rsp.status == 0) {
                subtitleNo = obj.subtitleNo;
                //更换字幕
                $('.js-text').html(obj.cnSubtitle);
                //更换配音人员
                $('.js-dub').text(obj.author);
                //更换播放音乐
                aux.pause(); //暂停音乐
                aux.src = obj.url;
                aux.load(); //重新加载音乐
                var medias = $('.js-play-music').find('div');
                for (var i = 0; i < medias.length; i++) {
                    if (!medias.eq(i).hasClass("rotate")) {
                        medias.eq(i).toggleClass("rotate");
                        medias.eq(i).addClass('on').removeClass('off');
                    }
                }
                aux.play();
            }
        },
        error: function () {
            console.log('获取字幕音乐出错');
        }
    });
});

//秀照片
$('.js-show-img').click(function (e) {
    e.preventDefault();
    if (imgId == '') { //图片还未上传成功时进行提示
        alert('图片正在上传中请稍后再试');
        return;
    }
    //添加生成提示
    $('body').append(
        '<div class="loading">' +
        '<img src="/static/img/smg/loading.gif">' +
        '<div>生成中…</div>' +
        '</div>');

    var _height = Math.abs($('#imgPreview').position().top);
    var para = new FormData();
    para.append("id", imgId);
    para.append("uToken", uToken);
    para.append("subtitleNo", subtitleNo);
    para.append("width", $('#imgPreview').width());
    para.append("height", _height);
    para.append("username", nickName);

    $.ajax({
        url: '/ws/wx/smg_update',
        type: 'POST',
        data: para,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (rsp) {
            if (rsp.status == 0) {
                imgStatus(); //启动图片生成状态监控
            }
        },
        error: function () {
            $('.loading').remove();
            alert('网络不稳定，请重新生成');
            //console.log('生成图片出错');
        }
    });
});

//显示分享提醒
$('.js-show-tips').click(function (e) {
    e.preventDefault();
    $('.share-tips').show();
});

//上传图片
function uploadImg(file) {
    var para = new FormData();
    para.append("smgCover", file);
    para.append("uToken", uToken);
    $.ajax({
        url: '/ws/wx/smg_img_upload',
        type: 'POST',
        data: para,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (rsp) {
            if (rsp.status == 0) {
                imgId = rsp.data.id;
            }
        },
        error: function () {
            console.log('上传图片出错了');
        }
    });
}
//轮询图片生成状态
function imgStatus() {
    var para = {
        id: imgId,
        uToken: uToken
    };
    $.ajax({
        url: '/ws/wx/smg_query',
        dataType: 'json',
        type: 'GET',
        async: true,
        data: para,
        success: function (rsp) {
            if (rsp.data.status == 1) { //如果返回code为已完成，移除提示，跳转到第三页
                $('.loading').remove();
                $('.share-content img').attr('src', rsp.data.shareSrc);
                originSrc = rsp.data.postSrc;
                mySwiper.slideNext();
                shareWxConfig('update'); //更新微信分享配置
                return;
            }else if (rsp.data.status == 2) { //如果返回code为已完成，移除提示，跳转到第三页
                $('.loading').remove();
                alert('哎呀，出错了……重新选张图吧！');
                return;
            }
            setTimeout(imgStatus, 2000);
        },
        error: function () {
            console.log('轮询图片处理接口时发生异常');
        }
    });
}


function parseUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


//base64加密
function Base64() {
    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // public method for encoding  
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding  
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}


function getWxConfig() {
    var base = new Base64();
    var result = base.encode(imgId);
    var para = {
        uToken: uToken,
        shareUrl: window.location.href
    };
    $.ajax({
        url: '/ws/wx/smg_share',
        dataType: 'json',
        type: 'GET',
        async: true,
        data: para,
        success: function (rsp) {
            var obj = rsp.data;
            if (rsp.status == 0) {
                //配置微信
                window.wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: APPID, // 必填，公众号的唯一标识
                    timestamp: obj.timestamp, // 必填，生成签名的时间戳
                    nonceStr: obj.noncestr, // 必填，生成签名的随机串
                    signature: obj.signature, // 必填，签名，见附录1
                    jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone'
                    ]
                });
                //调用微信分享方法
                shareWxConfig();
            }
        },
        error: function () {
            console.log('微信配置出错');
        }
    });
}

function shareWxConfig(isUpdate) {
    var base = new Base64();
    var result = base.encode(imgId);
    var shareInfo = { //默认的分享配置
        title: '上海广播主持人邀你联名发布「有声图」，快来试试！',
        desc: '这么多主持人正在帮我的美图配音，你也来试试？',
        link: host + '/static/html/smg_make.html',
        imgUrl: originSrc
    };
    if (isUpdate) { //图片制作完成，分享配置更改
        shareInfo = {
            title: '我与上海广播主持人联名发布的「有声图」，你听听看？',
            desc: '这么多主持人都来帮我的美图配音了，你也来试试？',
            link: host + '/static/html/smg_share.html?uToken=' + uToken + '&share=' + result,
            imgUrl: originSrc
        };
    }

    wx.ready(function () {
        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage({
            title: shareInfo.title,
            desc: shareInfo.desc,
            link: shareInfo.link,
            imgUrl: shareInfo.imgUrl,
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                //alert('用户点击发送给朋友');
            },
            success: function (res) {
                shareTips('分享成功！');
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });

        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline({
            title: shareInfo.title,
            link: shareInfo.link,
            imgUrl: shareInfo.imgUrl,
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                //alert('用户点击分享到朋友圈');
            },
            success: function (res) {
                shareTips('分享成功！');
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });

        // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareQQ({
            title: shareInfo.title,
            desc: shareInfo.desc,
            link: shareInfo.link,
            imgUrl: shareInfo.imgUrl,
            trigger: function (res) {
                //alert('用户点击分享到QQ');
            },
            complete: function (res) {
                //alert(JSON.stringify(res));
            },
            success: function (res) {
                shareTips('分享成功！');
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });

        // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareWeibo({
            title: shareInfo.title,
            desc: shareInfo.desc,
            link: shareInfo.link,
            imgUrl: shareInfo.imgUrl,
            trigger: function (res) {
                //alert('用户点击分享到微博');
            },
            complete: function (res) {
                //alert(JSON.stringify(res));
            },
            success: function (res) {
                shareTips('分享成功！');
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });

        // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
        wx.onMenuShareQZone({
            title: shareInfo.title,
            desc: shareInfo.desc,
            link: shareInfo.link,
            imgUrl: shareInfo.imgUrl,
            trigger: function (res) {
                //alert('用户点击分享到QZone');
            },
            complete: function (res) {
                //alert(JSON.stringify(res));
            },
            success: function (res) {
                shareTips('分享成功！');
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });
    });
}

function shareTips(str) {
    $('body').append(
        '<div class="pop">' +
        '<span>' + str + '</span>' +
        '</div>');
    setTimeout(function () {
        $('.pop').remove()
    }, 2000);
}