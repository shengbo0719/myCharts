import BaseData from './basedata.js'
import Legend from './legend.js'
import Tip from './tip.js'
import Shaft from './shaft.js'
import Slide from './slide.js'
class Column extends BaseData {
	constructor(svg, data) {
	    super(svg, data)
		this.columnGroup = null
		//4柱状图宽度和4柱状图之间间隙的宽度的总和
		this.allRectWidth = data.rectWidth * data.val.length + data.rectMargin * (data.val.length - 1)
		this.rectWidth = data.rectWidth
		this.rectMargin = data.rectMargin
		this.businessData = []
		this.maxs = []
		this.isMoveRext = false
		this.rextIndex = -1
		this.shaft = new Shaft(this)
		this.initColumn()
		this.legend = new Legend(this)
		this.tip = new Tip(this.legend)
		this.slide = new Slide(this)
		this.getMaxs();	
	}
	
	initColumn() {
		this.columnGroup = this.brush.element({}, 'g')
		this.brush.svg.appendChild(this.columnGroup)
		this.columnStart()
		this.drawAreaRect();
	}
	
	repaintCharts(arr) {
		this.businessData.splice(0, this.businessData.length);
		this.maxs.splice(0, this.maxs.length);
		$(this.shaft.shaftGroup).remove()
		$(this.columnGroup).remove()
		$(this.legend.legendGroup).remove()
		$(this.tip.tipGroup).remove()
		
		this.shaft.initShaft()
		this.initColumn()
		this.legend.initLegend()
		this.tip.initTip()
		this.getMaxs()
	}
	
	columnStart() {
		let step = this.left;
		let json = {  
			x: 0,  
			y: 0,  
			width: this.rectWidth,  
			height: 0,  
			fill: "",  
			strokeWidth: 0,  
			opacity: 1,  
			data: 0 
		}
		//算出每一个刻度线之间的宽度,两边空出的距离,作为柱状图起始点开始
		let start = (this.xAverLength - this.allRectWidth) / 2

		for(let i = 0; i < this.tempVal[0].length; i++) {
			let vals = new Array();
			let k = 0;
			for(let j = 0; j < this.tempVal.length; j++) {
				//公式
				var temp  = (this.yAxisMax - this.tempVal[j][i]) / (this.yAxisMax - this.yAxisMin) * this.yLength + this.top
				if(k == 0) {
					//小循环里第一次循环
					step += start
					k++
				}
				else{
					step += this.rectWidth + this.rectMargin
				}
				json.x = step
				json.fill = this.color[j]		
				if(this.animation) {
					json.y = this.bottom
				}
				else{
					json.height = this.bottom - temp
					json.y =  this.bottom - json.height
				}
				json.data = this.bottom - temp
				//计算完x,y,height 创建矩形
				let rect = this.brush.element(json, 'rect')
				this.columnGroup.appendChild(rect); 
				//动画
				if(this.animation) {
					this.columnChange1(rect)
				}
				if(j == (this.tempVal.length - 1)){
					//小循环里最后一次循环
					step += this.rectWidth + start;
					k = 0;
				}
				vals.push({ x:step, y:temp, obj:rect });
			}
			this.businessData.push(vals);
		}
	}
	
	columnChange1(rect) { 
		let srcy = parseFloat($(rect).attr("y"));
		let y = parseFloat($(rect).attr("y"));
		let distance = parseFloat($(rect).attr("data"));
		let easing = 0.03;
		let v = 0;
		let va = 1;
		
		(function drawFrame () {
			stop = window.requestAnimationFrame(drawFrame); 
			if (v < distance) {
				let vx = distance * easing;
				vx += va;
				srcy -= vx;
				if (srcy > 0) {
					$(rect).attr("height",  v += vx)
					$(rect).attr("y", srcy)
				}	
			}
			else {
				window.cancelAnimationFrame(stop);
				$(rect).attr("height", distance)
				$(rect).attr("y", y -= distance)
			}
		}())
	}
	
	
	columnChange2(rect) {
		 let srcy = parseFloat($(rect).attr("y"));
		 let y = parseFloat($(rect).attr("y"));
		 let distance = parseFloat($(rect).attr("data"));
		 let easing = 0.06;
		 let v = distance;
		 let va = 2;
		(function drawFrame() {
			stop = window.requestAnimationFrame(drawFrame); 
			if (v > 1) {
				let vx = distance * easing;
				vx += va;
				v -= vx;
				if (v > 0) {
					$(rect).attr("height", v);
					$(rect).attr("y", srcy += vx);
				}
			}
			else {
				window.cancelAnimationFrame(stop)
				$(rect).attr("height", 0);
				$(rect).attr("y", y += distance)
			}
		}())
	}
	
	getMaxs() {
		this.businessData.forEach((item, i)=> {
			let min = 10000000000000
			let x = 0
			this.businessData[i].forEach((item, j)=> {
				if(this.businessData[i][j]['y'] < min) {
					min = this.businessData[i][j]['y']
					x = this.businessData[i][j]['x']
				}
			})
			this.maxs.push({ x : x,  y : (min - this.tip.th) }); 
		})
	}
	
	drawAreaRect() {
		let param = {
			id: 0,
			x : this.left,
			y : this.top,
			width : this.xAverLength,
			height : this.bottom - this.top,
			fill : "#E0EEEE",
			stroke : "none",
			opacity : 0
		}
	
		for(let i = 0; i < this.tempCategoriesArr.length; i++) {
			param.id = i;
			let rect = this.brush.element(param, 'rect');
			this.columnGroup.appendChild(rect);
			this.onAreaRect(rect);
			param.x += this.xAverLength;
		}
	}
	
	onAreaRect(rect) {
		rect.addEventListener("mouseover", e=> {
			let index = parseInt($(rect).attr('id'));
			let opacity = $(this.tip.tipGroup).attr('opacity');	
			this.isMoveRext = true; 

			if(opacity == 1) {
				let coordinate1 = 0, coordinate2 = 0, flag = true;
				if(this.maxs[this.rextIndex]['x'] < this.maxs[index]['x']){	
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
				$(this.tip.tipGroup).attr('transform','translate('+this.maxs[index]['x']+','+this.maxs[index]['y']+')'); 
			}
			this.tip.onTip(); 
			this.rextIndex = index;
			
			this.tip.tipTexts[0]['text'].innerHTML = this.tempCategoriesArr[index]
			for(var i = 0; i < this.val.length; i++) { 
				let rmb = 0
				if( $(this.legend.legendRects[i]).attr('fill') != '#c5c5c5' ){  
					rmb = this.val[i][index]
				}
				this.tip.tipTexts[i+1]['text'].innerHTML = rmb + " RMB"
			}		
		})
		rect.addEventListener("mouseout", e=> {
			$(rect).attr('opacity', '0');
			this.isMoveRext = false;
			setTimeout(()=> {
				if(!this.isMoveRext) {
					this.tip.offTip();
				}
			}, 100)
		});
	}
}

export default Column