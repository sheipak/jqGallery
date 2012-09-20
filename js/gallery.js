(function( $ ){

	$.fn.gallery = function(config) {
		
		/********************************************
		*
		* config: {
		*	minWidth	: int,
		*	maxWidth	: int,
		*	minQuantity	: int,
		*	spacing		: int,
		*	firstLine	: bool,
		*	Images: { src, width, height }
		* }
		*
		********************************************/		
		var cH = $(this[0]).height();
		var VcH = $(window).height() - $(this[0]).offset().top; // высота видимой части контейнера
		console.log($(this[0]));
		//console.log(VcH + ' | ' + cH);
		var cW = $(this[0]).width(); // ширина контейнера (должна передаваться в конструктор)
		cW--;
		this.config = $.extend({
			minW : 300,  // минимальная ширина изображения
			maxW : 400,  // максимальная ширина изображения
			minQ :   4,  // минимальное количество изображений в строке
			spc  :  10,  // размер полей между картинками
			fLine: false //
		}, config);
		config = this.config;
		var sImages = []; // массив размеров для сортировки
		for (var i = 0; i<config.Images.length; i++) {
			sImages.push({width: config.Images[i].width, height: config.Images[i].height});
		}
		
		sImages.sort(function (a, b) {
			if (Math.abs(a.width - a.height) < Math.abs(b.width - b.height)) return 1;
			if (Math.abs(a.width - a.height) > Math.abs(b.width - b.height)) return -1;
			return 0;
		});
		
		var minDim = config.maxW - Math.abs(sImages[0].width - sImages[0].height); // минимальный размер изображения по высоте/ширине
		var ratio = config.maxW/minDim; // соотношение сторон в самом маленьком кадре, в дальнейшем берется за базовое для div'ов
		
		var render = function() {
			
			console.log(1);
			var maxQ = Math.floor((cW-(Math.floor(cW/config.minW-1)*config.spc))/config.minW); // максимальное количество горизонтально ориентированных изображений влезающее в строку
			var rowN = 0;
			var top = 0;
			while (config.Images.length != 0) {
				
				rowN++;
				var prevRowQ = 0; // длина предыдущей строки
				var curRowQ = 0; // длина текущей строки
				while ((prevRowQ == curRowQ)) curRowQ = Math.floor(Math.random()*(maxQ-config.minQ)+config.minQ);
				prevRowQ = curRowQ; 
				
				var row;
				var last = false;
				if(rowN==1 && config.fLine) {
					row = (cW<maxQ) ? config.Images.splice(0,1) : config.Images.splice(0,2); // определяем одно или два изображения будут в первой строке
				}
				else if (config.Images.length > curRowQ) row = config.Images.splice(0, curRowQ);
				else {
					row = config.Images.splice(0,config.Images.length);
					last = true;
				}
				vQ = 0; // количество вертикально оринтироварованных изображений
				hQ = 0; // количество горизонтально оринтироварованных изображений
				for (var i = 0; i<row.length; i++) {
					if ((row[i].width-row[i].height)<0) vQ++;
					else hQ++;
				}
				var baseWidth = Math.floor((ratio*ratio*(cW-(vQ+hQ-1)*config.spc))/(vQ+hQ*ratio*ratio));
				if ((baseWidth > config.maxW) && last) {
					baseWidth = Math.floor(Math.random()*(config.maxW-config.minW)+config.minW);
				}
				
				var vertWidth = Math.floor(baseWidth/ratio/ratio);
				
				var height = 9999999;
				for (var i = 0; i<row.length; i++) {
					var r = row[i].width/row[i].height;
					var width = ((row[i].width-row[i].height)>0) ? baseWidth : vertWidth;
					row[i].height = Math.floor(width/r);
					row[i].width = width;
					height = (row[i].height<height) ? row[i].height : height;
				}
				
				var remainder = cW - (baseWidth*hQ+vertWidth*vQ+(hQ+vQ-1)*config.spc); // остаток пикселей для распределения между div'ами
								
				var allAdd = Math.floor(remainder/row.length); // остаток, распределяемый между всеми div'ами
				var addAdd = remainder%row.length; // остаток, распределяемый между первыми div'ами
				
				var left = 0;
				for (var i = 0; i<row.length; i++) {
					var width = row[i].width;
					
					if (!last) width += (addAdd > 0) ? allAdd+1 : allAdd;
					addAdd--;
					
					var folioItem = '<a href="" class="folioItem" style="height: ' + height + 'px; top: ' + top + 'px; left: ' + left + 'px;"><img src="' + row[i].src + '" style="width: ' + width + 'px;"></a>';
					
					$('#folio').append(folioItem);
					left += width+config.spc;
				}
				
				top += height+config.spc;
				$('#folio').css('height', top+'px'); 
			}
		}
		var с = $(this[0]);
		$(window).resize(function(){
			render();
		});
		render();
		return 1;
	};

})( jQuery );
