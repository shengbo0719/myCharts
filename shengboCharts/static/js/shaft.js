class Shaft  {
	constructor(parent) {
		this.parent = parent
	    this.shaftGroup = null
		this.initShaft()
	}
	
	initShaft() {
		this.shaftGroup = this.parent.brush.element({}, 'g')
		this.parent.brush.svg.appendChild(this.shaftGroup)
		this.drawShaft()
		
		this.yText()
		this.xText()
		this.yTitle()
		this.xTitle()
		this.watermark()
	}
	
	drawShaft() {
		//x轴线
		this.shaftGroup.appendChild(this.parent.brush.element({ 
			x1: this.parent.left,  
			y1: this.parent.bottom,  
			x2: this.parent.left,  
			y2: this.parent.top,  
			stroke: '#C0D0E0'
		}, 'line'));
		
		//y轴线
		this.shaftGroup.appendChild(this.parent.brush.element({
			x1: this.parent.left,  
			y1: this.parent.bottom,  
			x2: this.parent.right,  
			y2: this.parent.bottom,  
			stroke: '#C0D0E0'
		}, 'line'))
		
		let interval = 0
		//底部沿着y轴的短刻度线
		interval = this.parent.left
		this.process({ 
			x1: 0,  
			y1: this.parent.bottom,  
			x2: 0,  
			y2: this.parent.bottom + 10,  
			stroke: '#C0D0E0'
		}, this.parent.xAver, interval, this.parent.xAverLength, 'y')

		//左边x轴方向的短刻度线
		interval = this.parent.bottom
		this.process({ 
			x1: this.parent.left,  
			y1: 0,  
			x2: this.parent.left-10,  
			y2: 0,  
			stroke: '#C0D0E0'
		}, this.parent.yAver, interval, this.parent.yAverLength, 'x')
		
		//y轴方向的长线
		interval = this.parent.bottom 
		this.process({ 
			x1: this.parent.left,  
			y1: 0,  
			x2: this.parent.right,  
			y2: 0,  
			stroke: '#e6e6e6', 
			width: 1 ,
		}, this.parent.yAver, interval, this.parent.yAverLength, 'x')
	}
	
	/**
	 * @param {Object} json 数据
	 * @param {Object} num 用等分数作为循环次数
	 * @param {Object} interval 每一个刻度线的间隔距离
	 * @param {Object} averLength 轴的平均距离
	 * @param {Object} direction 轴向
	 * 根据源数据，算出不同轴向刻度的数量和间距，以及长度
	 */
	process(json, num, interval, averLength, direction) {
		//判断不同的方向取不同的json属性
		let arr = direction === 'x' ? ['y1','y2'] : ['x1','x2']
		//循环起点0或1
		let index = direction === 'x' ? 1 : 0
		for(index; index < num + 1; index++) {
			//在y轴方向的每一个刻度求间隔距离
			direction === 'x' ? interval -= averLength : ''
			//间隔距离赋值给数据
			json[arr[0]] = json[arr[1]] = interval
			//在x轴方向的每一个刻度求间隔距离
			direction === 'y' ? interval += averLength : ''
			//创建刻度元素
			this.shaftGroup.appendChild(this.parent.brush.element(json, 'line'))
		}
	}
	
	yText() {
		let json = { 
				x: this.parent.left - 20, 
				y: 0,  
				value: '',  
				fontSize: 12,  
				fill: '#606060', 
				textAnchor: 'end'
			}
		let start = this.parent.bottom; 
		let tempMin = this.parent.yAxis.min;
		let arr = []; 
		let step = (this.parent.yAxis.max - this.parent.yAxis.min) / this.parent.yAver;
			for(let i = 0; i < this.parent.yAver + 1; i++){
				json.y = start + 5;
				json.value = tempMin;
				this.shaftGroup.appendChild(this.parent.brush.element(json, 'text'));
				tempMin += step; 
				start -= this.parent.yAverLength;
			}
	}
	
	xText() {
		let json = { 
			x: 0,  
			y: this.parent.textY,  
			value: '',  
			fontSize: 12,  
			fill: '#606060', 
			data:'xText' ,
		}
		let start = this.parent.left;
		let arr = [];  
		for(let i = 0; i < this.parent.xAver; i++) {
			json.x = start + this.parent.xAverLength/2
			json.value = this.parent.tempCategoriesArr[i]
			this.shaftGroup.appendChild(this.parent.brush.element(json, 'text'))
			start += this.parent.xAverLength
		}
	}
	
	xTitle() {
		var json = {
			value: this.parent.title.text, 
			fontSize: 16, 
			fill: '#555',
			x:0,  
			y: this.parent.top, 
			textAnchor: 'start', 
			data:'xTitle',
		}
		var len = this.parent.xLength/2; 
		var arr = [];  
			json.y = this.parent.top - this.parent.title.offsetY;
			let text = this.parent.brush.element(json, 'text')
			this.shaftGroup.appendChild(text);
			this.textAligh(text)
			json.value = this.parent.subtitle.text; 
			json.y = this.parent.top - this.parent.subtitle.offsetY;
			json.fontSize = 12
			let text2 = this.parent.brush.element(json, 'text')
			this.shaftGroup.appendChild(text2);
			this.textAligh(text2)
	}
	
	yTitle() {
		var json = {
			value: this.parent.yAxis.title.text, 
			fontSize: 12, 
			fill: '#555',  
			x:0,  
			y: 0, 
			textAnchor: 'start', 
			data:'yTitle'
		}
		var top = this.parent.yLength/2 + this.parent.top;
			json.y = top;
			let text = this.parent.brush.element(json, 'text')
			this.shaftGroup.appendChild(text);
			this.textAligh(text)
	}
	
	textAligh(text) {
		var textWidth = text.getBoundingClientRect().width;
		switch($(text).attr('data')) {
			case 'xText': 
					$(text).attr('x', ($(text).attr('x') - textWidth/2))
					break;
			case 'xTitle': 
					$(text).attr("x", (this.parent.xLength/2 + this.parent.left) - textWidth/2)
					break;
			case 'yTitle': 
					var left = this.parent.left - this.parent.yAxis.title.offsetX;
					var top = this.parent.yLength/2 + this.parent.top;
						$(text).attr("x", left - textWidth/2);
						$(text).attr("transform", 'rotate(-90 '+left+' '+top+') scale(1)');
					break;
			case 'watermark':
					text.onclick = ()=>location.href = ""
					break;
		}
	}
	
	watermark() {
		let water = {
			value: 'shengbocharts.com', 
			fontSize: '12', 
			fill: '#999999',  
			x: this.parent.brush.width - 120,  
			y: this.parent.brush.height - 10, 
			textAnchor: 'start', 
			style: "cursor:hand", 
			data: 'watermark'
		}
		let text = this.parent.brush.element(water, 'text')
		this.shaftGroup.appendChild(text);
		text.onclick = function() {
			location.href = "";
		}
	}
}

export default Shaft