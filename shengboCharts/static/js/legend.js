class Legend {
	constructor(parent) {
		this.parent = parent
		this.brush = parent.brush
		this.legendGroup = null
		this.rectOffsetY = 0
		this.textOffsetY = 0
		this.textArr = []
		this.legendRects = []
	    this.initLegend()
	}
	
	initLegend() {
		this.legendGroup = this.brush.element({
			id : "legendGroup", 
			filter : "", 
			transform : "translate(0,0) scale(1)"}, 'g')
		this.brush.svg.appendChild(this.legendGroup)
		this.createLegend()
	}
	
	createLegend() {
		let start = 0
		let x = 0
		this.rectOffsetY = this.parent.bottom + this.parent.legendMap.rectOffsetY
		this.textOffsetY = this.parent.bottom + this.parent.legendMap.textOffsetY
		for(let i = 0; i < this.parent.name.length; i++) {
			//矩形
			var rect = this.parent.brush.element({  
				id : i, 
				x : start - this.parent.legendMap.margin, 
				y : this.rectOffsetY,  
				height : this.parent.legendMap.height,  
				width : this.parent.legendMap.width,
				strokeWidth : 0,  
				fill : this.parent.color[i], 
				opacity: 1, 
				style : "cursor:hand" ,
			}, 'rect')
			this.legendRects.push(rect)
			this.register(rect)
			this.legendGroup.appendChild(rect)
			
			//文字
			start += this.parent.legendMap.width;
			var text = this.parent.brush.element({
					value : this.parent.name[i],  fontSize: 12,  fill: 'black', 
						y : this.textOffsetY,  x: start,  anchor:'start'  },
				'text');
				
			$(this.legendGroup).append(text);
			start += text.getBoundingClientRect().width + 50; 
			this.textArr.push(text);
		}

		$(this.legendGroup).attr('transform','translate('+((this.parent.brush.width - start)/2 +30 + this.parent.legendMap.x)+','+ this.parent.legendMap.y +')');
	}
	
	register(rect) {
		rect.addEventListener("click", (e)=> {
			var array = this.parent.businessData
			var obj = e.target;  
			var len = $(obj).attr("id"); 
			var color = this.parent.color[len];
			//显示
			if( $(obj).attr("fill") == "#c5c5c5" ) {
				$(obj).attr("fill", this.parent.color[len]);
				for(let i = 0; i < array.length; i++) { 
					if(array[i][len]['polyLine']) { //折线图没有动画时候的处理
						if(i == 0) $(array[i][len]['polyLine']).fadeIn();
						$(array[i][len]['circle1']).attr('opacity', 0.3); 
						$(array[i][len]['circle2']).fadeIn();
					}
					else if(array[i][len]['obj']) {
						this.parent.columnChange1(array[i][len]['obj']); 
					}
					else{ //折线图有动画时候的处理
						for(let j = 0; j < array[i].length; j++) {
							if( array[i][j]['id'] == len ){ 
								let lines  = array[i][j]['lines'];
								for(let k = 0; k < lines.length; k++) {
									$(lines[k]).fadeIn();
								}
								$(array[i][j]['circle1']).attr('opacity', 0.3);
								$(array[i][j]['circle2']).fadeIn();
								break;
							}
						}
					}
				}
			}
			//隐藏
			else{
				$(obj).attr( "fill", "#c5c5c5" );
				for (var i = 0; i < array.length; i++) { 
					if (array[i][len]['polyLine']) {//折线图没有动画时候的处理
						if(i == 0) $(array[i][len]['polyLine']).fadeOut();
						$(array[i][len]['circle1']).fadeOut();
						$(array[i][len]['circle2']).fadeOut();
					}
					else if (array[i][len]['obj']) {
						this.parent.columnChange2(array[i][len]['obj']);
					}
					else{ //折线图有动画时候的处理
						for (var j = 0; j < array[i].length; j++) {
							if ( array[i][j]['id'] == len ) {
								var lines  = array[i][j]['lines'];
								for(var k = 0; k < lines.length; k++) {
									$(lines[k]).fadeOut();
								}
								$(array[i][j]['circle1']).fadeOut();
								$(array[i][j]['circle2']).fadeOut();
								break;
							}
						}
					}
				}
			}
		}, false);
	}
}

export default Legend