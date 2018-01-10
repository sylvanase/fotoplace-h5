
var aux = document.getElementsByTagName('audio')[0];

$(function() {
	
	$(".audio_btn").on('click',function() {
		$(this).toggleClass("rotate");
		if ($(this).hasClass("rotate")) {
			aux.play();
		} else {
			aux.pause();
		}
	});
	
});


function setView(dom){
	var h = $(window).height() || $(document).height();
	var w = $(window).width() || $(document).width();
	if ((h / w) < (603 / 375)) {
		$(dom).css({
			'width': '90%',
			'margin-left': '5%'
		});
	}
}

function autoPlayMusic() {

	// 自动播放音乐效果，解决微信自动播放问题
	function musicInWeixinHandler() {
		musicPlay(true);
		document.addEventListener("WeixinJSBridgeReady", function() {
			musicPlay(true);
		}, false);
		document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
	}
	document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
	
	var u = navigator.userAgent;
	//alert(u);
	
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

function pup(dom,str){
	$(dom).append(
		'<div class="pop">'+
			'<span>'+ str +'</span>' +
		'</div>');

	setTimeout(function() {
		$('.pop').remove()
	}, 1200);
}