class Tip {
	constructor(Legend) {
		this.Legend = Legend
		this.parent = Legend.parent
	    this.tipGroup = null
		this.th = 120; //悬浮框初始高度
		this.tw = 122; //悬浮框初始宽度
		this.tipTexts = [];
		this.tip = null;
		this.tipFrame = null;
		this.initTip()
	}
	
	initTip() {
		this.tipGroup = this.parent.brush.element({ 
			id : "tipGroup", 
			filter : "", 
			transform : "translate(0,0) scale(1)"
		}, 'g');
		this.parent.brush.svg.appendChild(this.tipGroup)
		this.create()
	}
	
	create() {
		this.resetFrame();
		this.frame();
		this.initFrameHeight(this.initFrameText());
		this.tipGroup.setAttribute('opacity', 0); 
		return this;
	}
	
	resetFrame() {
		$(this.tipGroup).remove();
		this.tipTexts.splice(0, this.tipTexts.length);
	}
	
	initFrameHeight(len) {
		switch(len){
			case 3 : this.tip.setAttribute('height', 100); break;
			case 2 : this.tip.setAttribute('height', 85); break;
			case 1 : this.tip.setAttribute('height', 60); break;
		}
	}
	
	initFrameText() {
		var y = 40, len = 0;
		this.tipText({ 
			id : '', 
			fontSize : 12, 
			fill : 'black', 
			y : 18, 
			x : 5, 
			textAnchor : 'start',
		})
		//如果图列是灰色的,就要过滤对应的内容(城市,价格)
		for(var i = 0; i < this.parent.name.length; i++){
			if(this.Legend.legendRects[i].getAttribute('fill') != '#c5c5c5'){ 
				len++;
				this.tipText({ 
					value : this.parent.name[i],  
					fontSize : 12,  
					fill : this.parent.color[i], 
					y : y, 
					x : 5, 
					textAnchor:'start' ,
				})
				this.tipText({ 
					id : i, 
					fontSize : 12, 
					fill : 'black', 
					y : y, 
					x : 50, 
					fontWeight : 'bold' ,
				})
				y += 20;
			}
		}
		return len;
	}
	
	tipText(json) {
		var text = this.parent.brush.element( json, 'text' );
		if( json.id != undefined ) {
			this.tipTexts.push({text:text, flag:true});
		}
		this.tipGroup.appendChild(text);	
	}
	//浮动
	frame() {
		var json = { 
			x : 0, 
			y : 0, 
			height : this.th, 
			width : this.tw, 
			strokeWidth : 1, 
			stroke : '#7CB5EC', 
			fill : '#FCFCFC', 
			opacity : 0.8 
		} 
		let tip = this.parent.brush.element(json, 'rect');
		this.tipGroup.appendChild(tip);
	}
	
	onTip() {
		this.tipGroup.setAttribute('opacity', 1);
	}
	
	offTip() {
		this.tipGroup.setAttribute('opacity', 0);
	}
	
	slideTip(coordinate1, coordinate2, flag) {
		var x1 = 0 ,y1 = 0, x2 = 0 ,y2 = 0, dx = 0, dy = 0, r = 0, speed = 0, vx = 0, vy = 0, x = 0, y = 0;
		var $this = this;
		x1 = coordinate1['x'];
		y1 = coordinate1['y'];
		x2 = coordinate2['x'];
		y2 = coordinate2['y'];
		speed = 6;
		dx = x2 - x1;
		dy = y2 - y1;
		r = Math.atan2(dy, dx); 
		vx = Math.cos(r) * speed;
		vy = Math.sin(r) * speed;
		(function drawFrame() {
			stop = window.requestAnimationFrame( drawFrame );
			if(flag) {
				x1 += vx; y1 += vy; x = x1; y = y1;
			}
			else{
				x2 -= vx; y2 -= vy; x = x2; y = y2;
			}
			$this.tipGroup.setAttribute('transform','translate('+x+','+y+')'); 
			if(x1 >= x2) {
				window.cancelAnimationFrame(stop);
			}
		}());
	}
}

export default Tip