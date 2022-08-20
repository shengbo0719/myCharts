class PieTip {
	constructor(parent) {
		this.parent = parent
		this.tipGroup = null
	    this.initPieTip()
	}
	
	initPieTip() {
		this.tipGroup = this.parent.brush.element({ 
			id : "tipGroup", 
			filter : "", 
			transform : "translate(0,0) scale(1)" ,
		}, 'g' );
		this.parent.brush.svg.appendChild(this.tipGroup)
		this.pieFrameTip()
	}
	
	pieFrameTip() {
		var tipFrameJson = {
			x:0, 
			y:0, 
			height: 50, 
			width: 125, 
			strokeWidth:1, 
			stroke:'#7CB5EC', 
			fill:'#FCFCFC', 
			opacity:0.8,
		}
		this.tipFrame = this.parent.brush.element(tipFrameJson , 'rect');
		this.tipGroup.appendChild(this.tipFrame);
	
		this.tip2 = (()=> {
			var text1 = this.parent.brush.element({
				id:'',
				value:'春秋机票销售占比',
				fontSize:12, 
				fill:'black', 
				y:20, 
				x:8, 
				textAnchor:'start',
			}, 'text');
			this.tipGroup.appendChild(text1);
			var text2 = this.parent.brush.element({
				id:'',
				value:'石家庄:',
				fontSize:12, 
				fill:'black', 
				y:40, 
				x:8, 
				textAnchor:'start'
			}, 'text') 
			this.tipGroup.appendChild(text2);
			var text3 = this.parent.brush.element({
				id:'',
				value:'45.5%',
				fontSize:12, 
				fill:'black', 
				y:40, 
				x:50, 
				textAnchor:'start', 
				fontWeight:'bold'
			}, 'text')
			this.tipGroup.appendChild(text3);
			return {
				obj1: text1, 
				obj2: text2, 
				obj3: text3
			}
		})();
	
		this.tipGroup.setAttribute('opacity', 0); 
	}
	
	setText(index) {
		var text1 = this.tip2['obj1'];
		var text2 = this.tip2['obj2'];
		var text3 = this.tip2['obj3'];
			$(text1).html(this.parent.data.pietiptitle.text);
			$(text2).html(this.parent.data.name[index]);
		var textWidth = text2.getBoundingClientRect().width;
			$(text3).attr('x', textWidth+13);
			$(text3).html((this.parent.state[index]['val']).toFixed(2)+"%");
			$(this.tipFrame).attr('stroke', this.parent.color[index])
	}
}

export default PieTip