class PieLegend {
	constructor(parent) {
		this.parent = parent
		this.legendGroup = null
	    this.initPieLegend()
	}
	
	initPieLegend() {
		this.legendGroup = this.parent.brush.element({
			id : "legendGroup", 
			filter : "", 
			transform : "translate(0,0) scale(1)"}, 'g')
		this.parent.brush.svg.appendChild(this.legendGroup)
		this.createLegend()
	}
	
	createLegend() {
		var tempY = 100;
		for(var i = 0; i < this.parent.name.length; i++) { 
				this.drawPieLegend((this.parent.brush.width - 200), tempY + 18, this.parent.color[i], i);
		
			var text = this.parent.brush.element({value:this.parent.name[i], fontSize:13, fill:'black', y:(tempY + 15), x:(this.parent.brush.width - 180 - this.parent.legendMap.margin)}, 'text');   
				this.legendGroup.appendChild(text);
			var len = text.getBoundingClientRect().width;
				tempY += 30;
		}
		
		$(this.legendGroup).attr('transform', 'translate('+this.parent.legendMap.x+', '+this.parent.legendMap.y+')');
	}
	
	drawPieLegend(x, y, color, i) {
		var d = this.parent.brush.getPath(45, 135, x, y, 15);
		let json = { 
				opacity: 1, 
				d: d, 
				id: i, 
				fill: color,  
				strokeWidth: "1", 
				stroke: "#fff", 
				transform:'translate(0, 0)', 
				style:"cursor:hand"
			}
		let path1 = this.parent.brush.element(json, 'path');
			$(this.legendGroup).append(path1);
			
		path1.onclick = ()=> {
			var index = parseInt($(path1).attr('id'));
			var fill = $(path1).attr('fill');
				if(fill == '#c5c5c5'){
					$(path1).attr('fill', this.parent.data.color[index]);
					this.parent.state[index]['flag'] = true;
				}
				else{
					$(path1).attr('fill', '#c5c5c5');
					this.parent.state[index]['flag'] = false;
				}
			
				$(this.parent.pieGroup).remove();
				this.parent.pieArr.splice(0, this.parent.pieArr.length);
				this.parent.piePathArr.splice(0, this.parent.piePathArr.length);
				
				var num = 0; x = 0;
				for(var i = 0; i < this.parent.state.length; i++){
					if(!this.parent.state[i]['flag']){
						num += this.parent.val[i];
						x++;
					}
				}
				num = num/(this.parent.state.length-x);
				for(var i = 0; i < this.parent.state.length; i++){
					if(this.parent.state[i]['flag']){
						this.parent.state[i]['val'] = this.parent.val[i] + num;
					}
				}
				this.parent.runPie();
		}
	}
}

export default PieLegend