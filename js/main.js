autoscroll = false;

function isiPhone(){
	
    return (
        ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
    );
}	
	
$(window).load(function(){

	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
		$('#contentWrapper').append('<canvas width="'+$(window).width()+'" height="100%" id="contentCanvas"></canvas>');

    }else{
    	$('#contentWrapper').append('<canvas width="'+$(window).width()+'" height="'+$(window).innerHeight()+'" id="contentCanvas"></canvas>');
    }
	
	if(isiPhone()) {
		$('html').addClass('mobile');
	}

	superman = (function(dir){
	
		var sMan = $('#superman');
		var rotation = 0;
		
		return {
			fly : function(dir){
				
				sMan.removeClass('hovering').addClass('flying');
				$('#superfloat').fadeOut();
			    (dir<0) ? superman.up() : superman.down();
			},
			
			land : function(t){
				if(t=="special"){
					superman.specialland(t);
			    }else if (t=="tocontent" ){
			    	sMan.fadeIn();
			    	superman.specialland(t);
			    }else if (t=="homeland" ){
			    	superman.homeland();
			    }else if(t=="trailer") {
					TweenLite.to(sMan, 1, {top:-500, delay:2, ease:Power2.easeOut});
					$('#superfloat').fadeOut();
			    }else{
			    	superman.killtweens();
					sMan.removeClass('flying').addClass('hovering');
					$('#superfloat').fadeIn();
					superman.rotate(0);
					TweenLite.to(sMan, 4, {top:200,ease:Elastic.easeOut, onCompleteScope:$(this), onComplete:function(){									
						autoscroll = false;
						TweenMax.to(sMan, 2, {top:"180", ease:Power2.easeInOut, repeat:-1, yoyo:true});
	
				        }
				    });
			    }
			},
			
			specialland : function(t){				
				$('#scrollarrow').fadeOut();
		    	TweenLite.to(sMan, 1, {top:-500, delay:2, ease:Power2.easeOut, onCompleteScope:$(this), onComplete:function(){	
					$('#superfloat').fadeIn();
					sMan.removeClass('flying').addClass('hovering');
					if (t=="tocontent" ) sMan.fadeIn();
					sMan.fadeIn()
					superman.rotate(0);
					TweenLite.to(sMan, 4, {top:200, ease:Elastic.easeOut, onCompleteScope:$(this), onComplete:function(){									
						autoscroll = false;
						TweenMax.to(sMan, 2, {top:"180", ease:Power2.easeInOut, repeat:-1, yoyo:true});
						}
				        
				    });
				    }
			    });
				
			},
			
			homeland : function(){
				sMan.show();
				sMan.addClass('flying').removeClass('hovering');
				$('#superfloat').hide();				
		    	TweenLite.to(sMan, 1, {top:-500, ease:Power2.easeOut, onCompleteScope:$(this), onComplete:function(){	
					sMan.css('top','1200px');
					superman.rotate(0);
					$('#superfloat').show();
					sMan.removeClass('flying').addClass('hovering');
					sMan.fadeIn();
					
			
					TweenLite.to(sMan, 5, {top:200, delay:1, ease:Power2.easeOut, onCompleteScope:$(this), onComplete:function(){									
							autoscroll = false;
							TweenMax.to(sMan, 2, {top:"180", ease:Power2.easeInOut, repeat:-1, yoyo:true});
							}
					        
					    });
				    }

			    });
			},
			
			killtweens : function(){
				//TweenMax.killTweensOf(sMan);
			},
			
			up : function(){
				$('#superman').css("top", "200px");
				superman.rotate(0);
			},
			
			down : function(){
				$('#superman').css("top", "-40px");
				superman.rotate(180);
			},
			
			rotate : function(degrees) {
				sMan.css({	'-webkit-transform' : 'rotate('+ degrees +'deg)',
								'-moz-transform' : 'rotate('+ degrees +'deg)',
								'-ms-transform' : 'rotate('+ degrees +'deg)',
								'transform' : 'rotate('+ degrees +'deg)'});
			}
		}

	})();
	
	$('#share').click(function(){
			
		if($('#sharebox').width()==112){
			$('#sharebox').animate({width: '0'}, 500);
			$('.sharehome').animate({width: '54'}, 500);
		}else{		
			$('#sharebox').animate({width: '112'}, 500);
			$('.sharehome').animate({width: '166'}, 500);
		}
		
	});
	
	$('#facebook').click(function(){
		window.open("http://www.facebook.com/sharer/sharer.php?s=100&p[url]=http://greatestsuperheroever.com/&p[images][0]=http://greatestsuperheroever.com/img/share-thumb.jpg&p[title]=Celebrate%20the%2075th%20anniversary%20of%20Superman!&p[summary]=Take%20a%20journey%20throughout%20the%20history%20of%20the%20greatest%20superhero%20ever%20as%20we%20celebrate%20the%2075th%20anniversary%20of%20Superman!%20Own%20Man%20of%20Steel%20now:%20bit.ly/ordermanofsteel");
	});
	
	$('#dvd-hitarea').click(function(){
		window.open("http://bit.ly/OrderManofSteel");
	});
	
	$('#twitter').click(function(){
		window.open("http://twitter.com/home?status=Check%20Out%20the%20Greatest%20Super%20Hero%20Ever!%0Ahttp://greatestsuperheroever.com/");
	});
	
	$('#google').click(function(){
		window.open("https://plus.google.com/share?url=http://greatestsuperheroever.com/");
	});
	
	$('#mail').click(function(){
		var formattedBody = 'Take a journey throughout the history of the greatest superhero ever as we celebrate the 75th anniversary of Superman! Own Man of Steel now: http://bit.ly/OrderManofSteel';
		var mailToLink = "mailto:?subject=Celebrate the 75th anniversary of Superman!&body=" + encodeURIComponent(formattedBody);
		window.location.href = mailToLink;
	});	
	
	$('#scrollarrow').click(function(){
		superman.fly(-400);
		if (!SITE_SMALL) {
			navItem.doscroll(4340, "tocontent");
		}else{
		
			navItem.doscroll(-1500, "tocontent");
		}		
		$(this).fadeOut();
		$(this).css('background', 'url(../img/scrollarrow.png) no-repeat center -54px transparent');
	});	
	
	$('#scrollarrow').on('mouseenter', function(){
		$(this).css('background', 'url(../img/scrollarrow.png) no-repeat center -53px transparent');
	});	
	
	$('#scrollarrow').on('mouseleave', function(){
		$(this).css('background', 'url(../img/scrollarrow.png) no-repeat center 0px transparent');
	});	
});

var lastScrollTop = 0;
$(window).scroll(function(event){
	var st = $(this).scrollTop();
	var speed = 250;
	var time = 1;
	vertical_offset = 0;

	if(st<2500){
		$('#contentframe').fadeOut();
	}

	if (!SITE_SMALL) {
		pos = st*(-0.95);
	}else{
		pos = st*(-0.65);
	
	}
	
	var histween = TweenLite.to(historyHolder, 2, {y:pos, ease:Power2.easeOut});
	var mostween = TweenLite.to(mosHolder, 2, {y:pos, ease:Power2.easeOut});		    	

	lastScrollTop = st;
});


