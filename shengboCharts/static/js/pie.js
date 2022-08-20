import BaseData from './basedata.js'
import PieLegend from './pieLegend.js'
import PieTip from './pieTip.js'
class Pie extends BaseData {
	constructor(svg, data) {
		super(svg, data)
		this.pieArr = [];
		this.piePathArr = [];
		this.rx = 0;
		this.ry = 0;
		this.w = 0;
		this.h = 0;
		this.state = []; //实时记录每一个扇形图的状态信息,主要是用来判断扇形图是否被选中
	    this.initPie()
		this.legend = new PieLegend(this)
		this.tip = new PieTip(this);
	}
	
	initPie() {
		this.pieGroup = this.brush.element({}, 'g')
		this.brush.svg.appendChild(this.pieGroup)
		this.setCenter()
		for(var i = 0; i < this.val.length; i++){
			this.state.push({flag:true, color:this.color[i], val:this.val[i], obj:null, info:null});
		}
		
		this.runPie(); 
		this.watermark(this.pieGroup);
	}
	
	runPie() {
		var end = 0, endAngle = 0, startAngle = 0, d = '';
		var json = null;
		var path1 = null;
		//var path2 = null;
		var w = (document.documentElement.clientWidth - this.brush.width)/2;
		var h = (document.documentElement.clientHeight - this.brush.height)/2;
		var flag = 0;
		for(let i = 0; i < this.state.length; i++) { 
			if(!this.state[i]['flag']){
				continue;
			}
			endAngle = 360 * this.state[i]['val'] / 100;  
			end = startAngle + endAngle; 
			d = this.data.animation == false ? 
				this.brush.getPath(startAngle, end, this.rx, this.ry, this.data.radius) : ''
			flag = end-startAngle > 180 ? 1 : 0;
			json = {
				opacity: 1, 
				d: d, 
				id: '', 
				fill: this.state[i]['color'],  
				strokeWidth: "1", 
				stroke: "#fff", 
				transform:'translate(0, 0)', 
				data:'0,0', 
				flag:flag,
			}
			path1 = this.brush.element(json, 'path');
			$(this.pieGroup).append(path1);
			
			json = {
				opacity: 0, 
				d: this.brush.getPath(startAngle, end, this.rx, this.ry, this.data.radius, this.state[i]), 
				id: "circle"+i, 
				fill: '#fff',  
				strokeWidth: "1", 
				stroke: "#fff",
				transform:'translate(0, 0)',
				style:"cursor:hand"
			}
			this.state[i]['info']['id'] = "circle"+i;  
			let path2 = this.brush.element(json, 'path');
			$(this.pieGroup).append(path2);
			this.state[i]['obj'] = { startAngle:startAngle,endAngle:end,obj1:path1, obj2:path2 }; 
			startAngle = end;
			path2.onmouseover = ()=> {
				$(path2).attr("opacity", "0.5");
				$(this.tip.tipGroup).attr('opacity', '1');
				
				var index = $(path2).attr('id');
					index = parseInt(index.substring(index.length-1, index.length));
					this.tip.setText(index);
			}
			path2.onmousemove = e=> {
				var x = e.clientX;
					x = x - w;
				var y = e.clientY;
					y = y - 200 ;   
					$(this.tip.tipGroup).attr('transform','translate('+x+' '+y+')')
			}
			path2.onmouseout = ()=> {
				$(path2).attr("opacity", "0");
				$(this.tip.tipGroup).attr('opacity', '0');
			}
		
			path2.onclick = ()=> {
				var json = null; 
				var index = 0;
				for(var i = 0; i < this.state.length; i++){
					if(this.state[i]['info']!= null && this.state[i]['info']["id"] == path2.getAttribute("id")) {
						json = this.state[i]['info'];
						index = i;
						break;
					}
				}
		
				//求平分线 并且平移当前对象
				if(json["flag"]){  //没有移动
					//关闭所有饼图
					for(var i = 0; i < this.state.length; i++){
						if(this.state[i]['obj'] != null){
							$(this.state[i]['obj']['obj1']).attr("transform",'translate(0 0)');
							$(this.state[i]['obj']['obj2']).attr("transform",'translate(0 0)');
					
							this.state[i]['info']["flag"] = true;
						}
					}
					//打开当前饼图
					this.averLine(json, this.state[index]['obj']['obj1'], path2);
					json["flag"] = false;
				}
				//复原当前对象
				else {
					json["flag"] = true;
					$(path2).attr("transform",'translate(0 0)');
					$(this.state[i]['obj']['obj1']).attr("transform",'translate(0 0)');
				}
			}
		}
		
		this.run();
	}
	
	run() {
		var arr = [];
		var _this = this
		for(var i = 0; i < this.state.length; i++){
			if(this.state[i]['flag']){
				arr.push(this.state[i]);
			}
		}
		
		if(this.data.animation){
			var ax = 10;
			var vx = 0;
			var stop = null;
			var j = 0;
			var obj = arr[0]['obj']['obj1']; 
			var startAngle =  arr[0]['obj']["startAngle"];
			var endAngle =  arr[0]['obj']["endAngle"];
			var start = startAngle;
			var index = 0;
			
			
			(function drawFrame(){
				stop = window.requestAnimationFrame(drawFrame);
				vx += ax;
				start += vx;
				obj.setAttribute("d", _this.brush.getPath(startAngle, start, _this.rx, _this.ry, _this.data.radius)); 
				if(start >= endAngle){
					j++;
					if(j == arr.length){
						window.cancelAnimationFrame(stop);
						obj.setAttribute("d", _this.brush.getPath(startAngle, 359.99, _this.rx, _this.ry, _this.data.radius));
					}
					else{
						obj.setAttribute("d",  _this.brush.getPath(startAngle, endAngle, _this.rx, _this.ry, _this.data.radius));
						obj = arr[j]['obj']["obj1"];
						startAngle = arr[j]['obj']["startAngle"];
						endAngle = arr[j]['obj']["endAngle"];
					}
				}
			}());
			var scale = 0;
			var ax = 0.03;
			$(this.pieGroup).attr('transform','scale('+scale+')');
			(function drawFrame() { 
				stop = window.requestAnimationFrame(drawFrame);
				scale += 0.001;
				scale += ax;
				if(scale >= 1 ) {
					window.cancelAnimationFrame(stop);
				}
				else{
					$(_this.pieGroup).attr('transform','translate('+(-_this.rx * ( scale - 1 ))+','+(-_this.ry * ( scale - 1 ))+'), scale('+scale+')');
				}
			}());
		}
	}
	
	averLine(json, obj1, obj2) {
		var qishiX = json["xa"];
		var qishiY = json["ya"];
		var zhongdianX = json["xb"];
		var zhongdianY = json["yb"];
		var yuanxinX = this.rx;
		var yuanxinY = this.ry;
		//第三边的中心点
		var centerX = (zhongdianX - qishiX) / 2 + qishiX;
		var centerY = (zhongdianY - qishiY) / 2 + qishiY;
		
		var x = 0;
		var y = 0;
		var dx = centerX - yuanxinX;
		var dy = centerY - yuanxinY; 
		if($(obj1).attr('flag') == 1){
			 dx = yuanxinX - centerX;
			 dy = yuanxinY - centerY; 
		}
		else{
			 dx = centerX - yuanxinX;
			 dy = centerY - yuanxinY; 
		}
		var r = Math.atan2(dy, dx);
		var speed = 2;
		var num = 0; 
		(function drawFrame(){
					stop = window.requestAnimationFrame(drawFrame);
					var vx = Math.cos(r) * speed;
					var vy = Math.sin(r) * speed;
					x += vx;
					y += vy;
					$(obj1).attr("transform", 'translate('+x+','+y+')'); 
					$(obj2).attr("transform", 'translate('+x+','+y+')'); 
					num++;
					if(num >= 10){
							$(obj1).attr("data", x+","+y); 
							window.cancelAnimationFrame(stop);
					}
		}());
	}
	
	drawTitle(name, size, top) {
		var text = this.shaft.element({value:name, fontSize:size, x:0, y:top}, 'text');
			$(this.group).append(text);
		var textWidth = text.getBoundingClientRect().width;
			$(text).attr("x", this.rx - textWidth/2);
	}
	
	setCenter() {
		this.rx = this.brush.width/2
		this.ry = this.brush.height/2
		this.rx += this.data.pieX
		this.ry += this.data.pieY
	}
}

export default Pie