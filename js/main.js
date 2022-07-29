+function ($) { "use strict"; 
	var WI = {
            doms: {
                $body : $('body'),
                $canvas : $('canvas'),
            },
            vars : {
                cvs : [],
                maxCanvas : 120,
                drawWidthProgress :0,
                drawHeightProgress:0,
                controllerScrollMagic : new ScrollMagic.Controller(),
            },
            init:function(){
                for (var i = 0; i < WI.doms.$canvas.length; i++) {
                    WI.vars.cvs[i] = {
                        ctx : WI.doms.$canvas[i].getContext("2d"),
                        img : new Image,
                        src : WI.doms.$canvas[i].getAttribute("data-src"),
                        step : 0,
                        isAnim : 0,
                        loaded : !1,
                        index:i,
                        scene :new ScrollMagic.Scene({triggerElement : '#canvas'+(i+1)}),
                        init : function(){
                            var _that = this;
                            _that.img.src = _that.src;
                            _that.scene.on("enter", function(){
                                if(!_that.isAnim){
                                    _that.anim();
                                    _that.img.onload = WI.onloadImage(_that.index); 
                                }
                            }).addTo(WI.vars.controllerScrollMagic);
                        },
                        anim : function(){
                            if (this.step <= WI.vars.maxCanvas) {
                                this.step = parseInt(this.step)+1;
                                WI.vars.drawWidthProgress = WI.easeOutExpo(this.step, 1, this.img.width, WI.vars.maxCanvas);
                                WI.vars.drawHeightProgress = this.img.height * WI.vars.drawWidthProgress / this.img.width;
                                this.ctx.clearRect(0, 0, this.img.width, this.img.height);    
                                this.ctx.globalCompositeOperation = "source-over";
                                this.ctx.translate(this.img.width / 2, this.img.height / 2);
                                this.ctx.drawImage(this.img, -WI.vars.drawWidthProgress / 2, -WI.vars.drawHeightProgress / 2, WI.vars.drawWidthProgress, WI.vars.drawHeightProgress);
                                this.ctx.translate(-this.img.width / 2, -this.img.height / 2);
                                this.ctx.globalCompositeOperation = "source-atop";
                                this.ctx.drawImage(this.img, 0, 0);
                                this.isAnim = true;
                                requestAnimationFrame(this.anim.bind(this));
                            }
                        }
                    }
                    WI.vars.cvs[i].init();
                }

            },
            onloadImage : function(i){
                WI.doms.$canvas[i].width = WI.vars.cvs[i].img.width;
                WI.doms.$canvas[i].height = WI.vars.cvs[i].img.height;   
            },
            easeOutExpo : function(current, startValue, toValue, duration){
                return toValue * (-Math.pow(2, -10 * current / duration) + 1) + startValue
            }
        };

	$(function () {
		WI.init();   
	});

}(jQuery);
