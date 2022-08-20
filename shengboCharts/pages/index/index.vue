<template>
	<div class="svg" ref="svg">
		<div class="tab" @click="showChartsDialog">
			<div class="line"></div>
			<div class="line"></div>
			<div class="line"></div>
		</div>
		<div class="graphical" ref="graphical"></div>
		<div class="mask" v-show="isShowMask"></div>
		<div class="window" :class="animation" v-if="islook">
			<img class="dialogIco" width="50" height="50" src="../../static/img/ico.png" alt="" />
			<div class="dialogTop">
				<div style="margin-top:3px;border:solid 1px #EE7942;padding:2px;border-radius: 5px;">原创</div>
				<div><a href="javascript:;" class="claseDialogBtn" @click="closeChartsDialog">关闭</a></div>
			</div>
			<ul class="ul_charts">
				<li>
					<div class="w_column" @click="chart(1)">
						<div class="c1"></div>
						<div class="c2"></div>
						<div class="c3"></div>
					</div>
					<div class="title">柱状图</div>
				</li>
				<li>
					<div class="w_column"  @click="chart(2)">
						<div class="line1"></div>
						<div class="line2"></div>
						<div class="line3"></div>
					</div>
					<div class="title">折线图</div>
				</li>
				<li>
					<div class="w_column"  @click="chart(3)">
						<div class="pie"></div>
					</div>
					<div class="title">饼图</div>
				</li>
				<li>
					<div class="w_column daixu"  @click="chart(4)">
						待续...
					</div>
					<div class="title">区域图</div>
				</li>
				<li>
					<div class="w_column daixu"  @click="chart(5)">
						待续...
					</div>
					<div class="title">中国地图</div>
				</li>
				<li>
					<div class="w_column daixu"  @click="chart(6)">
						待续...
					</div>
					<div class="title">蒸汽机</div>
				</li>
				<li>
					<div class="w_column daixu"  @click="chart(7)">
						待续...
					</div>
					<div class="title">航线图</div>
				</li>
				<li>
					<div class="w_column daixu"  @click="chart(8)">
						待续...
					</div>
					<div class="title">上海地图</div>
				</li>
				<li>
					<div class="w_column daixu"  @click="chart(9)">
						待续...
					</div>
					<div class="title">雨+雪</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import util from '../../static/js/util.js'
	import SVG from '../../static/js/svg.js'
	import Column from '../../static/js/column.js'
	import PolyLine from '../../static/js/polyLine.js'
	import Pie from '../../static/js/pie.js'
	import {polyLine, column, pie} from '../../static/js/param.js'
	export default {
		data() {
			return {
				isShowMask: false,
				islook: false,
				animation: '',
				svg: null
			}
		},
		onLoad() {
			this.$nextTick(() => {
				this.run(1)
			});
			
		},
		methods: {
			showChartsDialog() {
				this.islook = true
				this.isShowMask = true
				this.animation = 'window animated bounceIn'
			},
			closeChartsDialog() {
				setTimeout(()=>this.isShowMask = false, 600)
				this.animation = 'window animated bounceIn bounceOutUp'
			},
			run(index) {
				$(this.$refs.graphical).remove()
				this.svg = new SVG({
					width: this.$refs.svg.offsetWidth,
					height: this.$refs.svg.offsetHeight,
					graphical: this.$refs.graphical
				}).init()
				switch(index){
					case 1 : new Column(this.svg, column); break;
					case 2 : new PolyLine(this.svg, polyLine); break;
					case 3 : new Pie(this.svg, pie); break;
				}
			},
			chart(index) {
				setTimeout(()=>{
					this.run(index)
				}, 500);
				this.animation = 'window animated bounceIn bounceOutUp'
				setTimeout(()=>this.isShowMask = false, 600)
			}
		}
	}
</script>

<style>
	page {
	  background-color: #D4D4D4;
	}
	body,p,ul,li,h1,h2,h3,h4,h5,h6,section,fieldset,input,select {
		margin: 0;
		padding: 0;
		
	}
	body {
		user-select : none; 
		-moz-user-select : none; 
		margin: 0;
		padding: 0;
		background:#D4D4D4
	}
	html * {
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	html {
		-ms-touch-action: none;
		line-height: 1.5
	}
	html,body {
		min-height: 100%;
	}
	img, fieldset {
		border: 0;
	}
	a {
		text-decoration: none;
	}
	i,em,cite {
		font-style: normal;
	}
	ul,ol,li {
		list-style: none;
		margin: 0;
		padding: 0;
		margin-bottom: 40upx;
	}
	a {
		color: #666
	}
	a:hover {
		text-decoration: none
	}
	a:focus {
		outline: none
	}
	
	.svg {
		width: 1000px;
		height: 450px;
		margin: 0 auto;
		box-shadow: 3px 3px 1px #999;
		background: #fff;
		position: relative; 
		margin-top: 120px;
	}
	.svg .graphical {
		width: 100%;
		height: 100%; 
		float: left;
		position: absolute;
		top: 0;
		left: 0;
	}
	.mask {
		width: 100%;
		height: 100%;
		background: black;
		position: absolute;
		top: 0;
		z-index: 3;
		opacity: 0.7;
	}
	.window {
		width: 450px;
		height: 250px;
		background: #fff;
		border-radius: 3px;
		margin: 0 auto;
		position: absolute;
		top: 75px;
		z-index: 3;
		left: 250px;
		padding-bottom: 20px;
		opacity: 0;
	}
	.tab {
		width: 30px;
		position: absolute;
		top: 5px;
		right: 5px;
		padding: 8px 0 5px 0;
		cursor: pointer;
		z-index: 2;
		border-radius: 5px;
	}
	.tab:hover {
		background: #DCDCDC;
	}
	.tab .line {
		width: 60%;
		height: 3px;
		background: #666666;
		border-radius: 5px;
		margin: 0 auto;
		margin-bottom: 3px;
	}
	.w_column {
		width: 50px;
		height: 50px;
		border-radius: 5px;
		background: orange;
		cursor: pointer;
		position: relative;
	}
	.ul_charts {
		float: left;
		width: 100%;
		padding-top: 20px;
	}
	.ul_charts li {
		float: left;
		margin-left: 20px;
	}
	.title {
		width: auto;
		height: 15px;
		border-radius: 5px;
		margin: 0 auto;
		background: #EE7942;
		line-height: 15px;
		text-align: center;
		font-size: 12px;
		color: #fff;
		margin-top: 5px;
		cursor: pointer;
	}
	.dialogIco {
		width: 50px;
		height: 50px;
		position: absolute;
		top: -25px;
		left: 50%;
		margin-left: -25px;
		z-index: 6;
	}
	.dialogTop {
		display: flex;
		justify-content: space-between;
		width: 90%;
		margin: 0 auto;
		border-bottom: 1px dotted #ccc;
		letter-spacing: 1px;
		padding: 10px 0;
		color: #EE7942;
		font-size: 14px;
	}
	.claseDialogBtn {
		color:#666666;
		font-size: 16px;
	}
	.pie {
		width: 0;
		height: 0;
		border-radius: 14px;
		border: 14px solid #F15C80;
		border-top-color: #8085E9;
		position: absolute;
		left: 10px;
		top: 12px;
		transform: rotate(-145deg) scale(1)
	}
	.line1 {
		height: 1px;
		width: 15px;
		background: #008857;
		position: absolute;
		left: 8px;
		top: 30px; 
		transform: rotate(-50deg) scale(1)
	}
	.line2 {
		height: 1px;
		width: 15px;
		background: #008857;
		position: absolute;
		left: 19px;
		top: 28px; 
		transform: rotate(35deg) scale(1)
	}
	.line3 {
		height: 1px;
		width: 15px;
		background: #008857;
		position: absolute;
		left: 30px;
		top: 27px; 
		transform: rotate(-50deg) scale(1)
	}
	.c1 {
		height: 30px;
		width: 3px;
		background: #7CB5EC;
		float: left;
		margin-left: 17px;
		margin-top: 12px;
	}
	.c2 {
		height: 22px;
		width: 3px;
		background: #434348;
		float: left;
		margin-left: 2px;
		margin-top: 20px;
	}
	.c3 {
		height: 15px;
		width: 3px;
		background: #90ED7D;
		float: left;
		margin-left: 2px;
		margin-top: 27px;
	}
	.animated {
		-webkit-animation-duration: 1.4s; 
		animation-duration: 1.4s; 
		-webkit-animation-fill-mode: both; 
		animation-fill-mode: both
	}
	.daixu {
		text-align: center;
		font-size: 12px;
		line-height: 50px;
	}
	@-webkit-keyframes bounceIn {
		0%{ opacity:0;  -webkit-transform:scale(.3);  transform:scale(.3) }
		30%{ opacity:1;  -webkit-transform:scale(1);  transform:scale(1) }
		100%{ opacity:1;  -webkit-transform:scale(1);  transform:scale(1) }
	
	}
	@keyframes bounceIn{
		0%{ opacity:0;  -webkit-transform:scale(0);  transform:scale(0) }
		30%{ opacity:1;  -webkit-transform:scale(1);  transform:scale(1) }
		100%{ opacity:1;  -webkit-transform:scale(1);  transform:scale(1) }
	}
	.bounceIn { 
		-webkit-animation-name: bounceIn;  
		animation-name: bounceIn 
	}
	
	
	@-webkit-keyframes bounceOutUp {
	  0% {-webkit-transform: translateY(0);transform: translateY(0);opacity: 1;}
	  20% {opacity: 1;-webkit-transform: translateY(20px);transform: translateY(20px);}
	  100% {opacity: 0;-webkit-transform: translateY(-2000px);transform: translateY(-2000px);}
	}
	
	@keyframes bounceOutUp {
	  0% {-webkit-transform: translateY(0);transform: translateY(0);opacity: 1;}
	  20% {opacity: 1;-webkit-transform: translateY(20px);transform: translateY(20px);}
	  100% {opacity: 0;-webkit-transform: translateY(-2000px);transform: translateY(-2000px);}
	}
	.bounceOutUp { 
		-webkit-animation-name: bounceOutUp;  
		animation-name: bounceOutUp;
	}
</style>

