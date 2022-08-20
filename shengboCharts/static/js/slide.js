class Slide {
	constructor(parent) {
		this.parent = parent
		this.slideGroup = null
		this.groupLeftButton = null
		this.groupRightButton = null
		this.leftRect = null;
		this.rightRect = null;
		this.slideWidth = 0; //滑块宽度
		this.slideArea = [];//每个月份所占领的区域宽度
		this.slideIndex = { index1:0, index2:11 }; //当前从第几个月份开始, 第几个月份结束
	    this.initSlide()
	}
	
	initSlide() {
		this.slideGroup = this.parent.brush.element({}, 'g')
		this.parent.brush.svg.appendChild(this.slideGroup)
		
		this.groupLeftButton = this.parent.brush.element({
			id:'button1', 
			transform:'translate(0,0) scale(1)', 
			data:0, 
			style:"cursor:hand"
		}, 'g')
		this.parent.brush.svg.appendChild(this.groupLeftButton)
		
		this.groupRightButton = this.parent.brush.element({
			id:'button2', 
			transform:'translate(0,0) scale(1)', 
			data:0, 
			style:"cursor:hand",
		}, 'g')
		this.parent.brush.svg.appendChild(this.groupRightButton);
		
		this.createSlide()
	}
	
	createSlide() {
		this.button1X = this.parent.left;
		this.button2X = this.parent.right; 
		this.slideWidth = this.parent.right - this.parent.left;
		this.frameSlideRect();	
		this.frameSlideButton();
		this.convertSlideArea();
	}
	
	frameSlideRect() {
		var slideFrame = {
			x: this.parent.left, 
			y: this.parent.top-50, 
			height: 30, 
			width: this.slideWidth, 
			strokeWidth: 1, 
			stroke: '#C0D0E0', 
			fill: '#000', 
			opacity: 0.5,
		}
		var rect = this.parent.brush.element(slideFrame , 'rect');
		this.slideGroup.appendChild(rect);
		
		this.frameSlideText();
	
		slideFrame.width = 0;
		slideFrame.fill = '#CFCFCF';
		slideFrame.opacity = 0.6;
		slideFrame.stroke = 'none';
		this.leftRect  = this.parent.brush.element(slideFrame , 'rect');
		this.slideGroup.appendChild(this.leftRect);
	
		slideFrame.x = this.parent.right - slideFrame.width;
		this.rightRect = this.parent.brush.element(slideFrame , 'rect');
		this.slideGroup.appendChild(this.rightRect);
	}
	
	frameSlideText() {
		var xBottomLineText = { 
			x: 0,  
			y: this.parent.textY,  
			value: '',  
			fontSize: 12,  
			fill: this.parent.xyBottomLineTextColor ,
		}
		var qidian = this.parent.left;
		for(var i = 0; i < this.parent.xAver; i++){
			xBottomLineText.x = qidian + this.parent.xAverLength/3;
			xBottomLineText.value = this.parent.xAxis.categories[i];
			xBottomLineText.y = this.parent.top - 30;
			xBottomLineText.fill = '#fff';
			$(this.slideGroup).append(this.parent.brush.element(xBottomLineText, 'text'));
			qidian += this.parent.xAverLength;
		} 
	}
	
	frameSlideButton() {
		//按钮1
		var circle = this.parent.brush.element({
			cx: 0, 
			cy: this.parent.top-35, 
			r: "12", 
			fill: "#fff", 
			strokeWidth: 1, 
			stroke: '#eaeaea', 
			opacity: 1, 
			transform: "rotate(0) scale(1)",
		} , 'circle');
		this.groupLeftButton.appendChild(circle);
		
		var line1 = this.parent.brush.element({ 
			x1: -2,  
			y1: this.parent.top-40,  
			x2: -2,  
			y2: this.parent.top-30,  
			stroke: '#000' ,
		}, 'line');
		this.groupLeftButton.appendChild(line1);

		var line2 = this.parent.brush.element({ 
			x1: 3,  
			y1: this.parent.top-40,  
			x2: 3,  
			y2: this.parent.top-30,  
			stroke: '#000' ,
		}, 'line');
		this.groupLeftButton.appendChild(line2);

		//按钮2
		var circle = this.parent.brush.element({
			cx: 0, 
			cy: this.parent.top-35, 
			r: "12", 
			fill: "#fff", 
			strokeWidth: 1, 
			stroke: '#eaeaea', 
			opacity: 1, 
			transform:"rotate(0) scale(1)",
		} , 'circle');
		$(this.groupRightButton).append(circle);
			
		var line1 = this.parent.brush.element({ 
			x1: -2,  
			y1: this.parent.top-40,  
			x2: -2,  
			y2: this.parent.top-30,  
			stroke: '#000' ,
		}, 'line');
		$(this.groupRightButton).append(line1);
		
		var line2 = this.parent.brush.element({ 
			x1: 3,  
			y1: this.parent.top-40,  
			x2: 3,  
			y2: this.parent.top-30,  
			stroke: '#000' ,
		}, 'line');
		$(this.groupRightButton).append(line2);
		
		
		$(this.groupLeftButton).attr('transform','translate('+this.parent.left+',0)');
		$(this.groupRightButton).attr('transform','translate('+this.parent.right+',0)');
		$(this.groupLeftButton).attr('data', this.parent.left);
		$(this.groupRightButton).attr('data', this.parent.right);
	
		//注册按钮
		this.registerButton(this.groupLeftButton, this.moveLeftButton, this.upLeftButton);
		this.registerButton(this.groupRightButton, this.moveRightButton, this.upRightButton);
	}
	
	moveLeftButton(obj, x, objX, mEvent, $this) {
		var l = mEvent.clientX - x;
		if((l + objX) < 120 || (l + objX) > 900){ 
			return;
		}
		$(obj).attr('transform','translate('+(l + objX)+',0)'); 
		$(obj).attr('data', (l + objX));
		//控制进度条
		$($this.leftRect).attr('width', (l + objX) - $this.parent.left);
	}
	
	moveRightButton(obj, x, objX, mEvent, $this) {
		var l = mEvent.clientX - x;
		if((l + objX) < $this.parent.left || (l + objX) > $this.parent.right){
			return;
		}
		$(obj).attr('transform','translate('+(l + objX)+',0)');
		$(obj).attr('data', (l + objX));

		var w = $this.parent.right - (l + objX);
		$this.rightRect.setAttribute('x', $this.parent.right - w);
		$this.rightRect.setAttribute('width', w);
	}
	
	upLeftButton(obj, $this) {
		$this.repaintStart(obj, 'index1');
	}
	
	upRightButton(obj, $this) {
		$this.repaintStart(obj, 'index2');
	}
	
	registerButton(groupButton, callback1, callback2) {
		var flag = true;
		var $this = this;
		groupButton.addEventListener("mousedown", function(ev){
			var oEvent = ev||event;
			var x = oEvent.clientX;
			var y = oEvent.clientY;
				flag = true;
			var objX = parseFloat($(groupButton).attr("data")); 
			$(groupButton).attr("data")
			document.onmousemove = function (ev){
				if(flag){
					var mEvent = ev||event; 
					callback1(groupButton, x, objX, mEvent, $this);
				}
			}
			document.onmouseup = function (){ 
				flag = false;
				document.onmousemove = null;
				document.onmouseup = null;
				callback2(groupButton, $this)
			}
		});
	}
	
	repaintStart(button, index) {
		//滑块区域定位
		var x =  parseFloat(button.getAttribute("data")); 
		
		for(var i = 0; i < this.slideArea.length; i++){
			if(x > this.slideArea[i]['num1'] && x < this.slideArea[i]['num2']){
				this.slideIndex[index] = i;  
				break;
			}
		}

		if (this.slideIndex['index1'] >= this.slideIndex['index2'] ) {
			return false;
		}

		//获取相应的月份
		var tempCategoriesArr = [];
		for(var i = this.slideIndex['index1']; i < this.slideIndex['index2']+1; i++) {
			tempCategoriesArr.push(this.parent.categories[i])
		}
		

		//获取相应的数据
		var arr = []; 
		for(var k = 0; k <  this.parent.name.length; k++){
			var tempDataArr = new Array(); 
			for(var i = this.slideIndex['index1']; i < this.slideIndex['index2']+1; i++) {
				tempDataArr.push(this.parent.val[k][i]); 
			}
			arr.push(tempDataArr);
		}
		
		this.parent.tempCategoriesArr = tempCategoriesArr
		this.parent.tempVal = arr
		this.parent.xAver = tempCategoriesArr.length
		this.parent.xAverLength = this.parent.xLength/tempCategoriesArr.length

	
		//重画
		this.parent.repaintCharts(); 
	}
	
	convertSlideArea() {
		var arve = this.slideWidth / this.parent.tempCategoriesArr.length;
		var json = {num1:0 , num2:0, month:''}
		var num1 = this.parent.left;
		var num2 = num1 + arve;
		for(var i = 0; i < this.parent.tempCategoriesArr.length; i++){
			this.slideArea.push({num1: num1, num2: num2, month: this.parent.tempCategoriesArr[i]})
			num1 += arve;
			num2 = num1+arve; 
		}
	}
}

export default Slide