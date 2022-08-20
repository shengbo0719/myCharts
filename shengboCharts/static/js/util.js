( function( w, b ) {

//=================================================================   jquery重写  ====================================================================
	
	w.$ = function( selector, context, rootjQuery ) { 
		//实例化方法 jQuery() 实际上是调用了其拓展的原型方法 jQuery.fn.init
		 return new w.$.fn.init( selector, context, rootjQuery );
	}
	// jQuery.prototype 即是 jQuery 的原型，挂载在上面的方法，即可让所有生成的 jQuery 对象使用
	w.$.fn = w.$.prototype = {
		constructor: w.$,
		// 实例化化方法，这个方法可以称作 jQuery 对象构造器
		obj: null,
		node: document.documentElement,
		init: function ( selector, context, rootjQuery ) {
			this.inspectType( selector ); 
			return this;
		},
		attr: function ( name, value ) {
			if( arguments.length > 1 ){
				this.obj.setAttribute( name, value )
			}
			else{
				return this.obj.getAttribute( name );  
			}
		},
		css: function ( name, value ) {
			if ( arguments.length > 1 ) { 
				this.obj.style[name] = value;
			}
			else { 
				if ( this.obj.currentStyle ) {
					return this.obj.currentStyle[name];
				} else {
					return getComputedStyle(this.obj, false)[name];
				}
			}
		},
		addClass: function ( name ) {
			this.obj.className = name; 
			return this;
		},
		inspectType: function ( selector ) {
			if(typeof ( selector ) === 'string') {
				var str = selector.substring( 0, 1 );
				var selector = selector.substring( 1, selector.length ); 
					if ( str == '#' ){
						this.obj = document.getElementById( selector );
					}
					else if ( str === '.' ) { 
						var array = new Array();
						this.traverseNodes( this.node, selector, array );
						if ( array.length > 1 ) {
							this.obj = array;
						}
						else if ( array.length > 0 ){
							this.obj = array[0];
						}
					}
			}
			else if( typeof ( selector ) === 'object' ) {
				this.obj = selector;
			}
		},
		each: function ( fn ) {
			for( var i = 0; i < this.obj.length; i++ ){
				  if( fn.call( this.obj[i], i, this.obj[i] ) === false ) {
						break;
				  }
			 }  
		},
		html: function ( connent ) {
			if ( arguments.length > 0 ) {
				this.obj.innerHTML = connent;
			}
			else {
				return this.obj.innerHTML;
			}
		},
		click: function ( fn ) {
			if( this.obj.length ){
				for( var i = 0; i < this.obj.length; i++ ) {
					 this.addHandler( this.obj[i], 'click', fn );
				}  
			}
			else{
				 this.addHandler( this.obj, 'click', fn );
			}
		},
		addHandler: function ( element, type, handler ) {
			if ( element.addEventListener ) {
				element.addEventListener( type, handler, false );
			}
			else if ( element.attachEvent ) {  //标准模式
				element.attachEvent( "on"+type, handler, false )
			}
			else {
				element["on"+type] = handler;
			}
		},
		traverseNodes: function ( node, className, array ) {
			//判断是否是元素节点  
			if ( node.nodeType == 1 ){
				//判断是否有属性节点  
				for ( var i = 0; i < node.attributes.length; i++ ){  
					//得到属性节点  
					var attr = node.attributes.item(i);  
					//判断该节点是否存在  
					if ( attr.specified ){
						if ( attr.name == 'class' && attr.value.indexOf( className ) >= 0){ 
							array.push( node );
							break;
						}
					}  
				}  
				//判断该元素节点是否有子节点  
				if ( node.hasChildNodes ){  
					//得到所有的子节点  
					var sonnodes = node.childNodes;  
					//遍历所哟的子节点  
					for ( var i = 0; i < sonnodes.length; i++ ) {  
						//得到具体的某个子节点  
						var sonnode = sonnodes.item(i);  
						//递归遍历  
						this.traverseNodes( sonnode, className, array );  
					}  
				}  
			} else {  
			  // console.log('非节点');
			}  
		},
		append: function ( obj ) {
			return this.obj.appendChild( obj );
		},
		remove: function () {
			 var childs = this.obj.childNodes;
				 for(var i = childs.length - 1; i >= 0; i--) { 
					this.obj.removeChild( childs[i] ); 
				 }
		},
		hide: function () {
			this.css( 'display', 'none' );
		},
		show: function () {
			this.css( 'display', 'block' );
		},
		extend: function ( p ) {
			for ( var i in p ) {
				if ( typeof p[i] === 'object' ) {
					if ( p[i] != null ){
						this.obj[i] = ( p[i].constructor === Array ) ? [] : {};
						this.extend( p[i], this.obj[i] );
					}
				} else {
					this.obj[i] = p[i];
				}
			}
			return this.obj;
		},
		fadeOut: function ( num ) {
			if( arguments.length == 0 ){
				num = 0;
			}
			this.fade(true, num);
		},
		fadeIn: function ( num ) {
			if ( arguments.length == 0 ){
				num = 1;
			}
			this.fade( false, num );
		},	
		fade: function ( flag, num ) {
			var $this = this;
			var opacity = parseInt( $( this.obj ).attr('opacity') );  
			var IsNaN = true;

			if ( isNaN( opacity ) ) { 
				IsNaN = false;
				opacity = parseInt( $( this.obj ).css('opacity') );
			} 
			var va = 0.005;
			var vx = 0;
			( function drawFrame () {
				stop = window.requestAnimationFrame( drawFrame );
				vx += va;
				if ( flag ) {
					if ( opacity > num ) {
						opacity -= vx;
						if ( IsNaN ) {
							$( $this.obj ).attr( 'opacity', opacity );
						}
						else {
							$( $this.obj ).css( 'opacity', opacity );
						}
					}
					else{
						if ( IsNaN ) {
							$( $this.obj ).attr( 'opacity', num );
						}
						else {
							$( $this.obj ).css( 'opacity', num );
						}
						window.cancelAnimationFrame( stop );
					}
				}
				else{
					if ( opacity < 1 ) {
						opacity += vx;
						if ( IsNaN ) {
							$( $this.obj ).attr( 'opacity', opacity ); 
						}
						else {
							$( $this.obj ).css( 'opacity', opacity );
						}
					}
					else {
						if ( IsNaN ) {
							$( $this.obj ).attr( 'opacity', num ); 
						}
						else {
							$( $this.obj ).css( 'opacity', num );
						}
						window.cancelAnimationFrame( stop );
					}
				}
			}());
		}
	}
	w.$.fn.init.prototype = w.$.fn;

})(window);
