$(function(){function a(){var a=$("body").width(),b=half=a/2,c=window.pageXOffset;for(var g=0;g<3;++g){var h=c<b?-8:0;c<b+half&&(h=8*((c-b)/half-1)),d[g].css("bottom",h+"px"),b+=a}e[0].toggle(c>0),e[1].toggle(c>0),c>=3*a?(e[2].hide(),f[0].focus()):e[2].css("display")=="none"&&(e[2].show(),f[0].blur(),f[1].blur())}function b(a){var b=$('<div class="annotation"><div></div><div></div></div>').appendTo(a.$targetDiv).css("height",0),c=b.children().css("opacity",0),d=$(c[0]),e=$(c[1]),f=null,g=250;a.$annoElems.each(function(){$(this).data("anno",this.title).attr("title","")}).click(function(){d.animate({opacity:0},g);var a=0;if(f!=this){f=this;var c=d;d=e.html($(this).data("anno")).animate({opacity:1},g),e=c,a=d.innerHeight()}else f=null;return b.animate({height:a},g),!1})}function c(a){function b(a){return/[\w\d_\.\-]+@([\w\d_\-]+\.)+[\w\d]{2,4}/.test(a)}function c(a){a.stopPropagation()}a.$msgBox.bind("textchange",function(){a.$notification.html(""),a.hideComplete()}),a.$mailInput.bind("textchange",function(){b($(this).val())?a.$sendBtn.removeAttr("disabled"):a.$sendBtn.attr("disabled","disabled")}).keydown(function(b){var c=b.keyCode|b.which;if(c==13)return a.$sendBtn.click(),!1;if(c==9)return a.$msgBox.focus(),!1;b.stopPropagation()}).trigger("textchange"),a.$msgBox.add(a.$mailInput).keydown(c).keyup(c),a.$sendBtn.click(function(c){var d=a.$msgBox.val(),e=a.$mailInput.val(),f="";if(d==""||d==a.$msgBox.attr("placeholder"))f="你什么都还没写呢=，=";else if(!b(e))f="Email不正确吧~~";else if(a.lastContent==d)f="你刚才就发过了...";else{a.lastContent=d,a.showLoading(),f="正在努力地发送中...",$.ajax({url:a.submitURL,dataType:"jsonp",jsonp:"jsonp",data:{email:e,content:d},success:function(b){b.result=="success"?(a.$notification.html("发送成功，我会尽快回复你的。"),a.showComplete()):g()},error:g,complete:function(){a.hideLoading()}});function g(){a.hideComplete(),a.$notification.html("Oops，出错了。不如直接发邮件给我吧: liangmorr@gmail.com")}}return a.$notification.html(f),!1});var d="placeholder";d in document.createElement("input")||a.$msgBox.add(a.$mailInput).focus(function(){var a=$(this);a.attr(d)!=""&&a.val()==a.attr(d)&&a.val("")}).blur(function(){var a=$(this);a.attr(d)!=""&&a.val()==""&&a.val(a.attr(d))}).blur().end()}var d=[$("#barSkill"),$("#barWork"),$("#barContact")],e=[$("#btnSpace"),$("#btnLeft"),$("#btnRight")],f=[$("#content"),$("#mail")],g={pageLeft:function(){var a=$("body").width(),b=Math.floor(window.pageXOffset/a);window.pageXOffset%a==0&&b>0&&--b,g.scrollTo(b*a)},pageRight:function(){var a=$("body").width(),b=Math.ceil(window.pageXOffset/a);window.pageXOffset%a==0&&b<3&&++b,g.scrollTo(b*a,400,!0)},scrollTo:function(a,b,c){var d=(window.contentWindow||window).document||window.ownerDocument||window,e=$.browser.safari||doc.compatMode=="BackCompat"?d.body:d.documentElement,g=typeof a=="number"?a:$(a).offset().left;$(e).stop().animate({scrollLeft:g},b),c||(f[0].blur(),f[1].blur())}};e[0].click(function(){g.scrollTo(0)}),e[1].click(g.pageLeft),e[2].click(g.pageRight),$("#nav a").click(function(a){this.name!=""&&(g.scrollTo(this.name),a.preventDefault())}),$("body").keydown(function(a){var b=0,c=a.keyCode|a.which;if(c==37)b=1;else if(c==39)b=2;else if(c!=32)return!0;e[b].addClass("pressed"),a.preventDefault()}).keyup(function(a){var b=0,c=a.keyCode|a.which;if(c==37)b=1;else if(c==39)b=2;else if(c!=32)return!0;e[b].removeClass("pressed").click(),a.preventDefault()}),$(".container").each(function(a,b){var c=function(a){var b=0;a.wheelDelta&&(b=-a.wheelDelta/4),a.detail&&(b=a.detail*10),window.scrollBy(b),a.preventDefault()};this.addEventListener?(this.addEventListener("DOMMouseScroll",c,!1),this.addEventListener("mousewheel",c,!1)):this.onmousewheel=c}),$("#navButtons").mousedown(!1),$(window).scroll(a).resize(a),a(),b({$targetDiv:$("#introContent"),$annoElems:$("#introContent").children("a")});var h={$msgBox:f[0],$mailInput:f[1],$sendBtn:$("#sendme"),$notification:$("#notification"),submitURL:"http://lmmailserver.appspot.com",showLoading:function(){d[2].css({backgroundPosition:"0 0"}).animate({backgroundPosition:"-96px 0"},500,"linear",h.showLoading)},hideLoading:function(){d[2].stop()},showComplete:function(){$("#stampd").css({left:"2px",top:"87px",width:"147px",height:"91px",opacity:"1"}).animate({left:"7px",top:"92px",width:"137px",height:"81"},100)},hideComplete:function(){$("#stampd").css({opacity:"0"})}};c(h)})