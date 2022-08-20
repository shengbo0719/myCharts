class BaseData {
	constructor(svg, data) {
		this.brush = svg
	    this.shaftLineColor = '#C0D0E0'; //刻度线颜色
	    this.xyBottomLineTextColor = '#606060';//底部x轴线上的字颜色
	    this.longLineColor = '#e6e6e6'; //y轴长线颜色
	    this.titleNameColor = '#555'; //标题颜色	
		this.data = data
		this.baseDataInit(data)
	}
	
	baseDataInit(data) {
		if(data.shaft) {
			this.left = data.shaft.left
			this.right = this.brush.width - data.shaft.right
			this.top = data.shaft.top
			//从底部的x轴线起做为最低点
			this.bottom = this.brush.height - data.shaft.bottom;
			//x轴的总长度
			this.xLength = this.brush.width - data.shaft.right - data.shaft.left
			this.yAver = data.shaft.bisectrix
			//整个Y轴刻度线的区间高度
			this.yLength = this.brush.height - this.top - data.shaft.bottom
			//y轴每一段的长度
			this.yAverLength = this.yLength/this.yAver
			this.text = data.shaft.text
			this.textY = this.brush.height - data.shaft.bottom +  this.text.yOffset
		}
		if(data.xAxis) {
			this.xAxis = data.xAxis
			this.categories = this.xAxis.categories
			//x轴每一段的长度
			this.xAverLength = this.xLength/this.categories.length
			this.tempCategoriesArr = this.categories
			//y轴方向的最大区间值
			this.yAxisMax = data.yAxis.max
			//y轴方向的最小区间值
			this.yAxisMin = data.yAxis.min
			this.xAver = this.categories.length
			this.yAxis = data.yAxis
		}
		this.val = data.val
		this.tempVal = this.val
		this.color = data.color
		this.animation = data.animation
		this.legendMap = data.legend
		this.name = data.name
		this.title = data.title
		this.subtitle = data.subtitle
	}
	
	watermark(group) {
		let water = {
			value: 'shengbocharts.com', 
			fontSize: '12', 
			fill: '#999999',  
			x: this.brush.width - 120,  
			y: this.brush.height - 10, 
			textAnchor: 'start', 
			style: "cursor:hand", 
			data: 'watermark'
		}
		let text = this.brush.element(water, 'text')
		group.appendChild(text);
		text.onclick = function() {
			location.href = "";
		}
	}
}

export default BaseData