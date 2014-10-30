view="start";

$(window).load(function(){

	SITE_WIDTH = $("#superframe").width();
	SITE_HEIGHT = $("#superframe").height();
	CURRENT_CONTENT_NODE = null;
	SITE_SMALL = (SITE_WIDTH<640) ? true : false;
	
	pauseAnim = false;
	
	var offsets = document.getElementById("superframe").getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;	
	
	var view = "start";
	var capeNum = 0;
	
	var debug = false;
    var offsetX = 10;
    var offsetY = 140;
    
    MOS_HEIGHT = 0;
    HISTORY_HEIGHT = 0;
    
    autoscroll = true;
    
    mosHolderHeight = 0;
    historyHolderHeight = 0;

    var maincanvas = document.getElementById("contentCanvas"),
	mainstage = new createjs.Stage(maincanvas);
   	mainstage.enableMouseOver(30);
   	
   	allContent = new createjs.Container();
   	mainstage.addChild(allContent);
   	
   	// MOS CONTENT NODES
   	mosHolder = new createjs.Container();
   	mosHolder.y = 0;
   	mainstage.addChild(mosHolder);
   	
   	var logo = new createjs.Bitmap("img/tinylogo.png");
   	logo.x = -59; 
   	logo.y = offsetY;
   	mainstage.addChild(logo);
   	
   	logo.addEventListener("click", function(e) {
   		if(view!="dvd"){
   			if (view!="trailer") superman.fly(-400);
   			navItem.doSpecial("dvd");
   			view="dvd";
   		}
	});
   	
   	mosHolder.alpha = 0;	
   	var mosContentLines = new createjs.Container();
   	mosHolder.addChild(mosContentLines);
   	
   	   	
   	var mosContent = new createjs.Container();
   	mosContent.x = 100;
   	mosContent.y = 0;
   	mosContentLines.x = mosContent.x;
   	mosContentLines.y = mosContent.y;
   	mosHolder.addChild(mosContent);
   	
   	// HISTORY CONTENT NODES
   	historyHolder = new createjs.Container();
   	historyHolder.y = 0;
   	mainstage.addChild(historyHolder);
   	if (SITE_SMALL) historyHolder.x = 150;
   	historyHolder.alpha = 0;	
   	var historyContentLines = new createjs.Container();
   	historyHolder.addChild(historyContentLines);
   	   	
   	var historyContent = new createjs.Container();
   	historyContent.x = 100;
   	historyContent.y = 0;
   	historyContentLines.x = historyContent.x;
   	historyContentLines.y = historyContent.y;
    historyContent.x = $(window).width()-300;   	
   	historyHolder.addChild(historyContent);
   
   	var menu = new createjs.Container();
   	menu.x = offsetX;
   	menu.y = offsetY;
   	mainstage.addChild(menu); 
   	
   	var menulength = null;

   	var lines = new createjs.Container();
   	lines.x = menu.x;
   	lines.y = menu.y;
   	mainstage.addChild(lines);  

   	var mosnav = null;
   	
   	var currentMOSnav = null;
   	 
	var min_alpha = 0.2;
	var active =0;
	var mos_nav_arr = new Array();
	var moslength = 0;
	var navitems = [];
	var contentItems = [];
	var historyItems = [];
	
	function init(){
        $.ajax({
            dataType: 'text',
            success: function(string) {
                data = $.parseJSON(string);
                navigation.build(data.mos);
                history.build(data.history);
                mosHolder.alpha = 1;
                historyHolder.alpha = 1;
                ticker.start();
                autoscroll = false;
                $("#superframe").fadeIn(function(){
                	goHome();
                });  
                
            },
            url: 'site.json'
        });
        
              
        
        
    }

    var navigation = (function(){ 
        return {
	        build: function(d) {
	        	menulength = d.length;
		        for (var i = 0, len = menulength; i < len; i++) {
		        	
		        	var result = new navItem.buildnav(d[i]);
		        	navitems.push(result);
		        	
		        	var contentresults = new navItem.buildmos(d[i]);
		        	contentItems.push(contentresults);
		        	
		        }
	        }
        }
    })();	
    
    var history = (function(){ 
        return {
	        build: function(d) {
	        	
		        for (var i = 0; i < d.length; i++) {
		        	var historyresults = new navItem.buildhistory(d[i]);
		        	historyItems.push(historyresults);		        	
		        }
		        
		        $(".nav.historical li a").click(function(e) {

		        	autoscroll = true;
		        	$('#scrollarrow').fadeOut();
					e.preventDefault();
					var val = $(this).attr('ref');
					navItem.openHistoryContent(val);
					view = "history"+val;	    
							    
				});
				
	        }	
        }
    })();	
	
	navItem = (function(r){
		var currentMOScontent = 0;
		var currentHISTORYcontent = 0;
		var id = 0;
		var contentid = 0;
		var historyid = 0;
		var CIRCLE_SIZE = 4;
		var CONTENT_CIRCLE_SIZE = 50;
		return {
		    buildnav: function(r) {				

				this.name = id;
			    this.x = r.x;
			    this.y = r.y*1.2;
			    this.content = r.content;
			    this.line = new createjs.Shape();
				mainstage.addChild(this.line);
				var dot = new createjs.Shape( new createjs.Graphics().beginFill("#ffffff").drawCircle(CIRCLE_SIZE, CIRCLE_SIZE, CIRCLE_SIZE));		
				var hit = new createjs.Shape();
                hit.graphics.beginFill("rgba(255,0,0,0.2)").drawCircle(CIRCLE_SIZE, CIRCLE_SIZE, CIRCLE_SIZE*3);
                dot.hitArea = hit;               
				
				dot.name = id;
				dot.regX = dot.regY = CIRCLE_SIZE;
				dot.x = r.x;
				dot.y = r.y;
				
				var obj = menu.addChild(dot);
				
				obj.addEventListener("click", function(e) {
					var item = e.target;
					view = "mos"+item.name;
					navItem.openMOScontent(item.name);
				});
				 
								
				id++;
				return this;

		    },
		    
		    buildmos: function(r) {				
				
				var nscale = 20;
				this.name = contentid;
				if (SITE_SMALL){
					this.x = ((r.x*nscale)-600)/4;
			    }else{
			    	this.x = ((r.x*nscale)-500)/3;
			    }
			    
			    this.y = (r.y*nscale)+2000;
			    this.content = r.content;
			    this.title = r.name;
			    
			    this.line = new createjs.Shape();
				mosContentLines.addChild(this.line);				
				
				var dot = new createjs.Container();			
				this.bitmap = new createjs.Bitmap(r.content[0].thumb);
				this.bitmap.name = contentid;
				dot.name = contentid;
				dot.regX = dot.regY = CONTENT_CIRCLE_SIZE;
				dot.x = this.x;
				dot.y = this.y;
				MOS_HEIGHT = this.y;
				
				this.fuzzy = new createjs.Shape().set({x:50,y:30});
				this.fuzzy.graphics.beginFill("#ffffff").drawCircle(0,0,50);
				var blurFilter = new createjs.BlurFilter(30, 30, 1);
				this.fuzzy.filters = [blurFilter];
				var bounds = blurFilter.getBounds();
				this.fuzzy.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
				this.fuzzy.regX = this.fuzzy.regY = 0;
				dot.addChild(this.fuzzy);
				
				var hit = new createjs.Shape();
                hit.graphics.beginFill("rgba(255,0,0,0.2)").drawCircle(CONTENT_CIRCLE_SIZE, CONTENT_CIRCLE_SIZE, CONTENT_CIRCLE_SIZE*3);
                dot.hitArea = hit;
				
				var box = new createjs.Shape();
				box.graphics.drawRect(-263/3, -263/3, 263, 263);
				this.bitmap.mask = box;
				
				this.bitmap.regX = 263/3;
				this.bitmap.regY = 263/3;
				mosHolderHeight = this.y;
				
				this.numberHolder = new createjs.Container();
				dot.addChild(this.numberHolder);
				this.numbg = new createjs.Shape( new createjs.Graphics().beginFill("#ffffff").drawCircle(110, -8, 20));	
				this.numbg.alpha = .4;	
				this.numberHolder.addChild(this.numbg);
				var text = new createjs.Text(this.name+1, "20px Helvetica", "#fff"); 
				text.textBaseline = "alphabetic";
				text.y = 0;
				text.x = 110;
				text.textAlign = "center";
				text.cache(-25, -25, 50, 50);
				this.numberHolder.addChild(text);
				
				var str = this.title;
				var res = str.replace("<br />"," "); 

				this.titleroll = new createjs.Text(res, "20px Helvetica", "#fff"); 
				this.titleroll.textBaseline = "alphabetic";
				this.titleroll.y = 100;
				this.titleroll.x = 100;
				this.titleroll.cache(-50, -50, 300, 300);
				this.titleroll.alpha = 0;
				
				dot.addChild(this.titleroll);

				var r = 20;
				var numcircle = new createjs.Shape( new createjs.Graphics().beginFill("rgba(255,255,255,0)").beginStroke("rgba(255,255,255,1)").setStrokeStyle(2, 1, "round").drawCircle(r/2, r/2, r));
		
				numcircle.x = 100;
				numcircle.y = -17;
				this.numberHolder.addChild(numcircle);
				
				
				this.timepiece = new createjs.Shape( new createjs.Graphics().beginFill("#ffffff").drawCircle(100, 100, 5));
				dot.addChild(this.timepiece);
				
				
				this.timepiece.graphics.beginFill("rgba(255,255,255,0)").beginStroke("rgba(255,255,255,1)").setStrokeStyle(1, 1, "round").drawCircle(100, 100, 10);
				this.timepiece.x = this.timepiece.y = CONTENT_CIRCLE_SIZE;
				this.timepiece.rotation = Math.random()*360;
				ticker.drawlines(dot, this.timepiece, 0 ,0, 93, 93);
								
				dot.addChild(this.bitmap);
				
				if (contentid>0) ticker.drawlines(mosContentLines, this.line, dot.x ,dot.y, contentItems[contentid-1].x, contentItems[contentid-1].y);

				var obj = mosContent.addChild(dot);
				
				
				obj.addEventListener("click", function(e) {
					var item = e.target.name;
					view = "mos_"+item.name;
					navItem.openMOScontent(item);
				});
				
				contentid++;
				return this;

		    },
		    
		    openMOScontent: function(id){
		    	var data = contentItems[id];
		    	navItem.resetrolls(id, data, "mos");
	    		$('#scrollarrow').fadeOut();
	    		navItem.contentFadeIn(data.content[0].img, data.content[0].summary,"mos");
				
				$('.historytitles').fadeOut(function(){
					$(".mostitles .title").html(data.title);
					$('.description').html(data.content[0].summary);
					$('.mostitles').fadeIn();
				});
			
				mosnav.scaleX = mosnav.scaleY = 0;
				mosnav.x = menu.children[id].x;
				mosnav.y = menu.children[id].y;
				currentMOSnav = menu.children[id];
				
				CURRENT_CONTENT_NODE = mosContent.children[id];
				TweenLite.to(mosnav, 2, {scaleX:1, scaleY:1, ease:Elastic.easeOut});
		    	navItem.doscroll(data.y);
		    },
		    
		    buildhistory: function(r) {		
		    
		    	$('#history').append('<li><a href="#" ref="'+historyid+'">'+r.date+'</a></li>');		
				
				var nscale = 20;
				this.name = historyid;				
				this.x = Math.random()*200;
			    this.y = ((historyid*20)*nscale)+4500;
			    this.content = r.content;
			    this.date = r.date;
			    this.title = r.title			    
			    
			    this.line = new createjs.Shape();
				historyContentLines.addChild(this.line);				
				
				var dot = new createjs.Container();			
				this.bitmap = new createjs.Bitmap(r.content[0].thumb);
				this.bitmap.name = historyid;
				dot.name = historyid;
				dot.regX = dot.regY = CONTENT_CIRCLE_SIZE;
				dot.x = this.x;
				dot.y = this.y;
				HISTORY_HEIGHT = this.y;
				historyHolderHeight = this.y;
				
				
				this.fuzzy = new createjs.Shape().set({x:50,y:30});
				this.fuzzy.graphics.beginFill("#ffffff").drawCircle(0,0,50);
				var blurFilter = new createjs.BlurFilter(30, 30, 1);
				this.fuzzy.filters = [blurFilter];
				var bounds = blurFilter.getBounds();
				this.fuzzy.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
				this.fuzzy.regX = this.fuzzy.regY = 0;
				dot.addChild(this.fuzzy);
								
				var hit = new createjs.Shape();
                hit.graphics.beginFill("rgba(255,0,0,0.2)").drawCircle(CONTENT_CIRCLE_SIZE, CONTENT_CIRCLE_SIZE, CONTENT_CIRCLE_SIZE*3);
                dot.hitArea = hit;
				
				var box = new createjs.Shape();
				box.graphics.drawRect(-263/3, -263/3, 263, 263);
				this.bitmap.mask = box;
				
				this.bitmap.regX = 263/3;
				this.bitmap.regY = 263/3;
				
				this.numberHolder = new createjs.Container();
				dot.addChild(this.numberHolder);

				var text = new createjs.Text(this.date, "20px Helvetica", "#fff"); text.x = 100; text.textBaseline = "middle";
				text.y = -5;
				text.x = 97;
				text.cache(-25, -25, 200, 150);
				
				this.numberHolder.addChild(text);
				
				var r = 20;
				
				this.timepiece = new createjs.Shape( new createjs.Graphics().beginFill("#ffffff").drawCircle(100, 100, 5));
				dot.addChild(this.timepiece);
				this.timepiece.graphics.beginFill("rgba(255,255,255,0)").beginStroke("rgba(255,255,255,1)").setStrokeStyle(1, 1, "round").drawCircle(100, 100, 10);
				this.timepiece.x = this.timepiece.y = CONTENT_CIRCLE_SIZE;
				this.timepiece.rotation = Math.random()*360;
				ticker.drawlines(dot, this.timepiece, 0 ,0, 93, 93);
				
				dot.addChild(this.bitmap);
				
				if (historyid>0) ticker.drawlines(historyContentLines, this.line, dot.x ,dot.y, historyItems[historyid-1].x, historyItems[historyid-1].y);

				var obj = historyContent.addChild(dot);
				
				obj.addEventListener("click", function(e) {
					var item = e.target;
					view = "history_"+item.name;
					navItem.openHistoryContent(item.name);
				});
				
				historyid++;
				
				return this;

		    },
		    
		    resetrolls: function(id, data, t){
		    	contentItems[currentMOScontent].bitmap.x=0;
				historyItems[currentHISTORYcontent].bitmap.x=0;				
				data.bitmap.x=-281;
				if(t=="history") currentHISTORYcontent = id;	
				if(t=="mos") currentMOScontent = id;	
		    },
		    
		    openHistoryContent: function (id) {
	    		var data = historyItems[id];
				navItem.resetrolls(id, data, "history");
				
				$(".nav.historical li a").removeClass('active');
		       	$("ul#history").find("[ref='" + id + "']").addClass('active');

				
				$('.mostitles').fadeOut(function(){
					$(".date").html(data.date);
					$(".title").html(data.title);
					$('.description').html(data.content[0].summary);
					$('.historytitles').fadeIn();
				});

				CURRENT_CONTENT_NODE = data;
				navItem.contentFadeIn(data.content[0].img,data.content[0].summary,"history");
		    	navItem.doscroll(data.y);
		    
		    },
		    
		    doscroll: function(n, t) {	
		    	killTrailer('hide');
		    	
		    	if(t==undefined) t="normal";
		    	var PAGE_SCROLL = n;
		    	autoscroll = true;
		    	superman.killtweens();
				superman.land(t);
				TweenMax.to($('html, body'), 5, {scrollTop:PAGE_SCROLL, ease:Power2.easeOut });
		    
		    },
		    
		    doSpecial: function(t) {

				$('#scrollarrow').fadeOut();
			    var st = $(this).scrollTop();
				if(st<1000) superman.fly(-400);
				
				 if(!SITE_SMALL){
					navItem.doscroll(1000, "special"); 
				}else{
					navItem.doscroll(800, "special"); 
				
				}
				
				TweenLite.to($('#superman'), 3, {left:offsets.left+($("#superframe").width()-300), ease:Power2.easeOut});
				navItem.contentFadeOut();
		    },
		    
		    contentFadeIn: function(img,summary,type) {	
				var distance = 480;
		    	$('#contentframe').css('background-image','url('+img+')').fadeIn();
				$('#superman').fadeOut();
		    	
		    },
		    
		    contentFadeOut: function() {
		    	$('#contentframe').fadeOut();		    	
		    	$('#superman').fadeIn();
		    }
		}	
		
	})();
	
	
	var ticker = (function(){
		var counter = 0;
		var increase = Math.PI * 2 / 1000;
		var capespeed = 0;
		if (SITE_SMALL) historyHolder.scaleX = historyHolder.scaleY = mosHolder.scaleX = mosHolder.scaleY = .7;
		
		return {
			start: function() {
				createjs.Ticker.setFPS(30);
				createjs.Ticker.addEventListener("tick", tick); 
				
				function tick(event) {
					if(debug) stats.begin();
					
					if(!pauseAnim){
						ticker.animate();
						mainstage.update();
					}
					
					if(debug) stats.end();
					
				} 		
			},			

			animate: function() {
				var curY = (CURRENT_CONTENT_NODE!=null) ? CURRENT_CONTENT_NODE.y : 0;
				historyItems[2].timepiece.rotation-=.5;
				
				if(!isiPhone()) {
					if (capespeed==2){
						if (capeNum<30){
							var c = $('#cape').attr('class');
							$('#cape').removeClass(c).addClass('cape_'+capeNum);
							capeNum++;
						}
						capespeed = 0;
					}
					
					capespeed++;
					if (capeNum==30) capeNum = 0;
				}
				
				for (var i=0;i<menulength;i++) {	
					var section = navitems[i];
										
					var currentLine = menu.children[i];
					var previousLine = menu.children[i-1];
					counter += increase;

					//move mos nav dots		
					currentLine.x = Math.sin( counter+i )+(section.x-6);
					currentLine.y = Math.cos( counter+i )+(section.y-6);
					mosContent.children[i].x = Math.sin( (counter+i)*2 )+(contentItems[i].x);
					mosContent.children[i].y = Math.cos( (counter+i)*2 )+(contentItems[i].y);
					contentItems[i].timepiece.rotation+=.5;
					contentItems[i].fuzzy.rotation+=10;
					
					//move history stuff	
					if (i<historyItems.length) {
						historyItems[i].fuzzy.rotation-=10;

						historyItems[i].timepiece.rotation-=.5;
						historyContent.children[i].x = Math.sin( (counter+i)*2 )+(historyItems[i].x);
						historyContent.children[i].y = Math.cos( (counter+i)*2 )+(historyItems[i].y);
						historyItems[i].line.graphics.clear();
						if (i>0) ticker.drawlines(historyContentLines, historyItems[i].line, historyItems[i].x ,historyItems[i].y, historyContent.children[i-1].x, historyContent.children[i-1].y);

					}
					
					//draw lines
					section.line.graphics.clear();
					contentItems[i].line.graphics.clear();

					if (i>0) ticker.drawlines(lines, section.line, currentLine.x ,currentLine.y, previousLine.x, previousLine.y);
					if (i>0) ticker.drawlines(mosContentLines, contentItems[i].line, mosContent.children[i].x ,mosContent.children[i].y, mosContent.children[i-1].x, mosContent.children[i-1].y);

				}
				
				if (currentMOSnav){
					mosnav.x = currentMOSnav.x+offsetX;
					mosnav.y = currentMOSnav.y+offsetY;
				}
			},
			
			drawlines: function(container,obj,cx,cy,px,py) {
				obj.graphics.beginStroke("rgba(255,255,255,1)").setStrokeStyle(1, 1, "round").moveTo(cx, cy).lineTo(px, py);
		
				container.addChild(obj);	
			
			}
			
		}
	
	})();	
		
	buildRolloverCircle();
	
	function buildRolloverCircle(){
		var r = 8;
		var circle = new createjs.Shape( new createjs.Graphics().beginFill("rgba(255,255,255,0)").beginStroke("rgba(255,255,255,1)").setStrokeStyle(1, 1, "round").drawCircle(r/2, r/2, r));

		circle.x = -100;
		circle.y = 0;
		circle.name = "mosRoll";
		circle.regX = circle.regY = 4;
		mosnav = circle;
		mainstage.addChild(circle);

		return;
	}	

	goHome = function() {
		view="home";
		$('#scrollarrow').fadeIn();	
		TweenLite.to($('#superman'), 2, {left:offsets.left+($("#superframe").width()/2), ease:Power2.easeOut});
		$("#contentframe").fadeOut();	
		$('#superman').fadeIn();
		navItem.doscroll($("#superframe").height()-1000,"homeland");
	}
	
	
	$("#home").click(function() {
		
		if(view!="home") goHome();		
		
	});
	
	
	$("#logo, #mos-logo, .dvdbox-sm").click(function() {
		if(view!="dvd"){
   			if (view!="trailer") superman.fly(-400);
   			navItem.doSpecial("dvd");
   			view="dvd";
   		}
	});
	
	$("#closebutton, #contentframe").click(function() {
		navItem.contentFadeOut();
		TweenLite.to($('#superman'), 3, {left:offsets.left+($("#superframe").width()/2), ease:Power2.easeOut});

	});
	
	$(".trailer-sm").click(function() {
		if(view!="trailer"){
			$('#scrollarrow').fadeOut();
		    if (view!="dvd") superman.fly(-400);
			navItem.doscroll(0, "trailer"); 
			TweenLite.to($('#superman'), 3, {left:offsets.left+($("#superframe").width()-300), ease:Power2.easeOut});
			navItem.contentFadeOut();
			view = "trailer";
		}
	});
	
	$(".modal").click(function() {
		pauseAnim = false;
		$(this).fadeOut();
		toggleVideo('hide');
	});
	
	function toggleVideo(state) {
	    // if state == 'hide', hide. Else: show video
	    var div = document.getElementById("popup");
	    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
	    div.style.display = state == 'hide' ? 'none' : '';
	    func = state == 'hide' ? 'pauseVideo' : 'playVideo';
	    iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
	}
	
	function killTrailer(state) {
	    var iframe = document.getElementById("trailervid").contentWindow;
	    iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
	}
	
	
	$(".logo img").click(function() {
		pauseAnim = true;
		$(".modal").fadeIn();
	});

	function onResize(){
		SITE_WIDTH = $("#superframe").width();
		SITE_HEIGHT = $("#superframe").height();
		keepAspectRatio = false;
		// browser viewport size
		var w = window.innerWidth;
		var h = window.innerHeight;
		
		// mainstage dimensions
		var ow = w; // your mainstage width
		var oh = h; // your mainstage height
		
		if (keepAspectRatio)
		{
		    // keep aspect ratio
		    var scale = Math.min(w / ow, h / oh);
		    mainstage.scaleX = scale;
		    mainstage.scaleY = scale;
		
		   // adjust canvas size
			mainstage.canvas.width = ow * scale;
			mainstage.canvas.height = oh * scale;
		}
		else
		{
		    // scale to exact fit
		    mainstage.scaleX = w / ow;
		    mainstage.scaleY = h / oh;
		
		    // adjust canvas size
		    mainstage.canvas.width = ow * mainstage.scaleX;
		    mainstage.canvas.height = oh * mainstage.scaleY;
		}
		
		
		//alert($(".nav ul").css("margin-top"));
		
		
		if ($(".nav ul").css("margin-top")=='150px'){
			offsetY = 10;
		}else{
			offsetY = 140;
		}
		menu.y = lines.y = logo.y = offsetY;

		// update the mainstage
	
	    historyContent.x = $(window).width()-300;
		historyContentLines.x = historyContent.x;
	    TweenLite.to($('#superman'), 2, {left:$("#superframe").width()/2, ease:Power2.easeOut});
		mainstage.update()
	}
		
	window.onresize = function(){
	     onResize();

	}
	
	init();
	onResize();
	
	

});
