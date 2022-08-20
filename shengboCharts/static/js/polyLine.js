import BaseData from './basedata.js'
import Legend from './legend.js'
import Tip from './tip.js'
import Shaft from './shaft.js'
import Slide from './slide.js'
class PolyLine extends BaseData {
	constructor(svg, data) {
	    super(svg, data)
		this.polyLineGroup = null
		this.businessData = []
		this.maxs = []
		this.rextIndex = -1
		this.isMoveRext = true
		this.lineIndex = 0
		this.shaft = new Shaft(this)
		this.initPolyLine()
		this.legend = new Legend(this)
		this.tip = new Tip(this.legend)
		this.slide = new Slide(this)
	}
	
	initPolyLine() {
		this.polyLineGroup = this.brush.element({}, 'g')
		this.brush.svg.appendChild(this.polyLineGroup)
		this.drawPolyLine()
	}
	
	repaintCharts(arr) {
		this.businessData.splice(0, this.businessData.length);
		this.maxs.splice(0, this.maxs.length);
		$(this.shaft.shaftGroup).remove()
		$(this.polyLineGroup).remove()
		$(this.legend.legendGroup).remove()
		$(this.tip.tipGroup).remove()
		
		this.shaft.initShaft()
		this.initPolyLine()
		this.legend.initLegend()
		this.tip.initTip()
		this.getMaxs()
	}
	
	drawPolyLine() {
		this.animation == true ? this.yesAnimation() : this.noAnimatin();
	}
	
	yesAnimation() {
		for(var i = 0; i < this.tempVal.length; i++) {
			this.run(this.tempVal[i], this.color[i], i);
		} 
	}
	
	run(data, color, index) {
		var step = this.xLength / data.length;
		var j = 1;
		var speed = 30;
		var lineObj = null;
		var $this = this;
		var tempArr = new Array();
		var vals = new Array(); 
		var datas = this.convertDataCoordinate(data);
		var oldxy = null;
		//第一个点  第二个点
		var x = this.left + step/2,   y = datas[0],   x2 = x + step,   y2 = datas[1];
	
		//画点
		var circle1 = this.brush.element({cx:x, cy:y, r:6, fill:color, opacity:0.3}, 'circle');
		var circle2 = this.brush.element({cx:x, cy:y, r:3, fill:color}, 'circle');
		$(this.polyLineGroup).append(circle1); 
		$(this.polyLineGroup).append(circle2); 
		vals.push({x : x, y : y, circle1 : circle1, circle2 : circle2, lines : [], id : index});
		(function drawFrame() {
			stop = window.requestAnimationFrame(drawFrame)
			let dx = x2 - x;
			let dy = y2 - y;
			let r = Math.atan2(dy, dx);
			let xx1 = x;
			let yy1 = y;
			let vx = Math.cos(r) * speed;
			let vy = Math.sin(r) * speed;
			x += vx;
			y += vy;  
			if(x <= x2) {
				lineObj = $this.brush.element({x1 : xx1, y1: yy1, x2 : x, y2 : y, stroke : color, opacity : 1}, 'line');
			}
			else {
				lineObj = $this.brush.element({x1 : xx1, y1 : yy1, x2 : x2, y2 : y2, stroke : color, opacity : 1}, 'line');
			}
			$( $this.polyLineGroup ).append(lineObj);
			tempArr.push( lineObj );

			if(x >= x2) {
				var circle1 = $this.brush.element({cx:x2, cy:y2, r:6, fill:color, opacity:0.3}, 'circle');
				var circle2 = $this.brush.element({cx:x2, cy:y2, r:3, fill:color}, 'circle');
				$($this.polyLineGroup).append(circle1); 
				$($this.polyLineGroup).append(circle2); 
				vals.push({x : x2, y : y2, circle1 : circle1, circle2 : circle2, lines : tempArr, id : index})
				j++;	
				if(j >= datas.length) {
					window.cancelAnimationFrame( stop );
					$this.businessData.push(vals);
					$this.lineIndex++;
					if($this.lineIndex == $this.name.length) {
						$this.formatData();  
						$this.getMaxs(); 
						$this.drawAreaRect();
						$this.lineIndex = 0;
					}
				}
				x = x2;
				y = y2
				x2 += step;	
				y2 = datas[j]; 
			}
		}())
	}
	
	//取业务数据每组的最大值
	getMaxs() {
		for(var i = 0; i < this.businessData.length; i++){
			var min = 10000000000000;
			var x = 0;
			for( var j = 0; j < this.businessData[i].length; j++ ){
				if(this.businessData[i][j]['y'] < min){  
					min = this.businessData[i][j]['y']; 
					x = this.businessData[i][j]['x'];
				}
			}
			this.maxs.push( { x : x , y : ( min - this.tip.th) } );  
		}
	}
	
	//业务值转换成坐标值
	convertDataCoordinate(data) {
		  var datas = [];
		  for(var i = 0; i < data.length; i++) {   
				datas.push((this.yAxis.max - data[i] ) / ( this.yAxis.max - this.yAxis.min) * this.yLength + this.top);	
		  }		
		  return datas;
	}
	
	//数据格式转换
	formatData() {
		var tempArr = [];
		for( var i = 0; i < this.businessData[0].length; i++ ) { //12
			var arr = new Array(); 
			for( var j = 0; j < this.businessData.length; j++ ) { //4
				arr.push( this.businessData[j][i] ); 
				if( j == this.businessData.length-1 ) { 
					break;
				}
			}
			tempArr.push( arr ); 
		}
		this.businessData.splice(0, this.businessData.length);
		this.businessData = tempArr;  
	}
	
	//鼠标移上区域触发事件
	drawAreaRect() {
		var obj = null;
		var json = {
			id : 0, x : this.left, y : this.top,  width : this.xAverLength, 
				height : this.bottom - this.top,  stroke:"none", fill:"#E0EEEE", opacity : 0 
		}

		for(var i = 0; i < this.xAver; i++) {
			json.id = i;
			obj = this.brush.element(json, 'rect');
			this.polyLineGroup.appendChild(obj);
			this.onAreaRect(obj);
			json.x += this.xAverLength;
		}
	}
	
	onAreaRect(obj) {
		var $this = this;
		obj.addEventListener( "mouseover", e=> {
			var index = parseInt(obj.getAttribute('id'));
			var opacity = this.tip.tipGroup.getAttribute('opacity');	
				this.isMoveRext = true; 

				if(opacity == 1) {
					var coordinate1 = 0, coordinate2 = 0, flag = true;
					if( this.maxs[this.rextIndex]['x'] < this.maxs[index]['x'] ) {	
						coordinate1 = this.maxs[this.rextIndex];
						coordinate2 = this.maxs[index];
						flag = true;
					}
					else {
						coordinate2 = this.maxs[this.rextIndex];
						coordinate1 = this.maxs[index];
						flag = false;
					} 
					this.tip.slideTip(coordinate1, coordinate2, flag);
				}
				else {
					this.tip.tipGroup.setAttribute('transform','translate('+this.maxs[index]['x']+','+this.maxs[index]['y']+')'); 
				}

				this.tip.onTip(); 
				this.rextIndex = index;
				
				
				for(var i = 0; i < this.tempVal.length; i++) { 
					if(this.tip.Legend.legendRects[i].getAttribute('fill') != '#c5c5c5') { 
						this.tip.tipTexts[i+1]['text'].innerHTML = this.tempVal[i][index] + " RMB"
					}
					else {
						this.tip.tipTexts[i+1]['text'].innerHTML = "0 RMB";
					}
				}
				this.tip.tipTexts[0]['text'].innerHTML = this.tempCategoriesArr[index]
					
		});
		obj.addEventListener("mouseout", function(e) {
			this.setAttribute( 'opacity', '0' );
			$this.isMoveRext = false;
			setTimeout( function() {
				if(!$this.isMoveRext) {
					$this.tip.offTip();
				}
			}, 100);
		});
	}
	
	noAnimatin() {
		
	}
}

export default PolyLine