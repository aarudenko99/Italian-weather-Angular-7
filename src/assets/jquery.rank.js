(function ( $ ) {
	$.fn.radialprogress = function() {
		var thisElement = this;
		
		var rProgress = {	 
			value:  parseFloat($(thisElement).find('.value').html()),
			thisElementId : '#'+$(thisElement).attr('id'),
			init:function(){
				//this.events();
				this.makeRotation();
				this.changeColor();
				console.log(this.value);
				console.log(this.thisElementId)
			},
			/* events:function(){
				var _this = this;	   
				$(document).on('change',thisElementId,function(){
					porcentaje = parseFloat($(thisElement).find('.value').html());          
					$(thisElementId).attr('value',porcentaje);
					_this.detectChange(porcentaje);
				});		
			},
			detectChange:function(value){
				var _this = this;
				nuevoval =  value;
				_this.changeColor(value);
				if(nuevoval !=  _this.viejoval){
					_this.makeRotation();
					_this.viejoval = nuevoval;
				}else{ 
					_this.viejoval = progress;         
				}
			}, */
			makeRotation:function(){
				var progress = this.value;
				var anchotexto = $('.numbers span:first-child', this.thisElementId).width();
				var fontsize=   $('.numbers span:first-child', this.thisElementId).css('line-height').replace(/\D/g,'');
				var margintop= fontsize; 
				var rotation = progress/100 *360;
				var rotation2 = 180/100 * progress * 2;
				var rotation3 = 180/100 * progress;
				var numberswith = 0;
				$(this.thisElementId).find('.numbers').width(numberswith);
				$(this.thisElementId).find('.circulo').rotateAndTranslate(rotation);
				$(this.thisElementId).find('.fill.fix').rotate(rotation2);
				$(this.thisElementId).find('.mask.full').rotate(rotation3);
				$(this.thisElementId).find('.fill').rotate(rotation3);           
				$(this.thisElementId).find('.numbers').css('margin-top',-margintop+'px');
				numberswith = progress * anchotexto + anchotexto;	
				$(this.thisElementId).find('.numbers').width(numberswith);
			},
			changeColor:function(){
				var progress = this.value;
				if(progress <= 50){
					$(this.thisElementId).removeClass('bad');
					$(this.thisElementId).removeClass('excellent');
					$(this.thisElementId).addClass('good');
				}
				if(progress <= 20){
					$(this.thisElementId).removeClass('good');
					$(this.thisElementId).removeClass('excellent');
					$(this.thisElementId).addClass('bad');
				}
				if(progress > 50){
					$(this.thisElementId).removeClass('bad');
					$(this.thisElementId).removeClass('good');
					$(this.thisElementId).addClass('excellent');
				}
			}
		};
		jQuery.fn.rotateAndTranslate = function(degrees) {
			var translateval =  64;
			$(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg) translateY(-'+translateval+'px)',
							'-moz-transform' : 'rotate('+ degrees +'deg) translateY(-'+translateval+'px)',
							'-ms-transform' : 'rotate('+ degrees +'deg) translateY(-'+translateval+'px)',
							'transform' : 'rotate('+ degrees +'deg) translateY(-'+translateval+'px)'
			});
			return $(this);
		};
		jQuery.fn.rotate = function(degrees) {
			$(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
						'-moz-transform' : 'rotate('+ degrees +'deg)',
						'-ms-transform' : 'rotate('+ degrees +'deg)',
						'transform' : 'rotate('+ degrees +'deg)'
			});
			return $(this);
		};
		rProgress.init();
	};
}( jQuery ));