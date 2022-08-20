import Graphical from './graphical.js'
class SVG extends Graphical {
	constructor(config) {
		super()
	    this.width = config.width
		this.height = config.height
		this.graphical = config.graphical
		this.svg = null
		this.defs = null
	}
	
	init() {
		this.svg = this.element({ height: this.height, width: this.width }, 'svg');
		this.defs = this.getDefs();
		this.svg.append(this.defs);
		this.graphical.appendChild(this.svg);
		return this
	}
}

export default SVG