let polyLine = {
		chart: {
			type: 'polyLine'
		},
		animation : true,
		title: {
			text: '月平均销量',
			offsetY: 100
		},
		subtitle: {
			text: '数据来源: www.ch.com',
			offsetY: 80
		},
		shaft: {
			   left : 120,
			  right : 100,
			 bottom : 100,
				top : 150,
			bisectrix : 4,
			text:{
					yOffset : 25
				}
		},
		legend:{
			width : 20,
			height : 5,
			rectOffsetY: 50,
			textOffsetY: 56,
			x:0,
			y:0,
			margin:10
		},
		name : ["上海","北京","广州","石家庄"],
		xAxis : {
			categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		},
		yAxis: {
			min: 0,
			max : 250,
			title: {
				text: '销售量 (RMB)',
				offsetX: 70
			}
		},
		color : ["#7CB5EC","#434348","#90ED7D","#F7A35C"],
		val :[
			[49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
			[83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
			[48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
			[42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
		]
}



let column = {
		chart: {
			type: 'column'
		},
		animation : true,
		title: {
			text: '月平均销量',
			offsetY: 100
		},
		subtitle: {
			text: '数据来源: www.ch.com',
			offsetY: 80
		},
		shaft: {
			   left : 120,
			  right : 100,
			 bottom : 100,
				top : 150,
			bisectrix : 5,
				text:{
					yOffset : 25
				},
				color: '#C0D0E0'
		},
		rectWidth : 5,
		rectMargin : 2,
		legend:{
			width : 12,
			height : 12,
			rectOffsetY: 50,
			textOffsetY: 60,
			x:0,
			y:0,
			margin:10
		},
		name: ["上海","北京","广州","石家庄"],
		xAxis : {
			categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		},
		yAxis: {
			min: 0,
			max : 250,
			title: {
				text: '销售量 (RMB)',
				offsetX: 60
			}
		},
		color: ["#7CB5EC","#434348","#90ED7D","#F7A35C"],
		val: [
				[49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
				[83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
				[48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
				[42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
		]
}



let pie = {
		chart: {
			type: 'pie'
		},
		animation : true,
		title: {
			text: '月平均销量',
			offsetY: 40,
			size:20
		},
		subtitle: {
			text: '数据来源: www.ch.com',
			offsetY: 60,
			size:12
		},
		pietiptitle: {
			text: '春秋机票销售占比',
		},
		legend:{
			x:0,
			y:0,
			margin:0
		},
		pieX : 0,
		pieY : 10,
		radius : 150,
		name : ["Tokyo","New York","London","Berlin","ShangHai","XiangGang"],
		color:["#7CB5EC","#434348","#90ED7D","#F7A35C","#8085E9","#F15C80"],
		val:[45, 0.7, 26.8, 12.8, 8.5, 6.2]
}

export {
	polyLine,
	column,
	pie
}