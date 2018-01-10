var aux = document.getElementsByTagName('audio')[0];

$(function () {
    $(".music-btn").on('click', function () {
        $(this).toggleClass("rotate");
        if ($(this).hasClass("rotate")) {
            aux.play();
        } else {
            aux.pause();
        }
    });

});

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

function parseUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function pop(str) {
    $('.container').append(
        '<div class="pop">' +
        '<span>' + str + '</span>' +
        '</div>');

    setTimeout(function () {
        $('.pop').remove()
    }, 2000);
}

function getResult(uname) {
    var hash = 0, i, chr, len;
    if (uname.length === 0)
        return hash;
    for (i = 0, len = uname.length; i < len; i++) {
        chr = uname.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash % 30);
}