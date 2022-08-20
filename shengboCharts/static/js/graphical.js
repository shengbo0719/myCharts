class Graphical {
	constructor() {
		this.NS = 'http://www.w3.org/2000/svg'
		this.eleAttributeNames = [
			'repeatCount', 'stdDeviation', 'specularExponent', 'surfaceScale','specularConstant', 
			'lightColor', 'pointsAtX', 'pointsAtY', 'pointsAtZ','limitingConeAngle', 'diffuseConstant'
		]
	}
	
	getNs(elementName) {
		return document.createElementNS(this.NS, elementName)
	}
	
	getDefs() {
		return this.getNs('defs');
	}
	
	element(opt, eleName) {
		let ele = this.getNs(eleName);
		for(let i in opt){
			if( i == 'value' ) {
				ele.appendChild(document.createTextNode(opt[i]));
			}
			else{
				ele.setAttribute(this.eleAttributeName.call(this, i), opt[i]);
			}
		}
		return ele;
	}
	
	eleAttributeName(name) {
		let index = 0;
		if(this.eleAttributeNames.includes(name)) {
			return name
		}
		for(let i = 0; i < name.length; i++) {
			if (/^[A-Z]+$/.test(name.charAt(i))) {
				index = i;
				break;
			} 
		}
		if(index > 0) {
			return name.substring(0, index) + "-" + name.charAt(index).toLowerCase() + name.substring((index+1), name.length);
		}
		else{
			return name;
		}
	}
	
	getPath(startAngle, endAngle, x, y, radius, state) {
		let radiusX = radius;
		let radiusY = radius;
		let centerX = x;
		let centerY = y;
		
		let sa = Math.PI + startAngle * Math.PI/180;
		let ea = Math.PI + endAngle * Math.PI/180;
		
		/*椭圆方程式*/
		let xa = radiusX * Math.cos(sa) + centerX;
		let ya = radiusY * Math.sin(sa) + centerY;
	
		let xb = radiusX * Math.cos(ea) + centerX;
		let yb = radiusX * Math.sin(ea) + centerY;
	
		let flag = 0;
		if(endAngle - startAngle > 180) {
			flag = 1;
		}
		if(arguments.length > 5) {
			state['info'] = {"id":0, "xa":xa, "ya":ya, "xb":xb, "yb":yb, "flag":true};
		}
		return "M"+xa+","+ya+"A"+radiusX+","+radiusY+",0,"+flag+",1,"+xb+","+yb + "L"+centerX+","+centerY + " L"+xa+","+ya;
	}
}

export default Graphical