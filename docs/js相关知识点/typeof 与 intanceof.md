###  JS 相关记录



#### 一、typeof

​		typeof 可以用来判断要给对象的类型  包括了  “number”、 "string " 、 "object" 、 "boolean" 、 "function" 、"undefined" 、 "symbol" 这七个类型。

```javascript
	const bool = new Boolean(true);
	typeof bool;	//	"object"	
	//	只能知道是object类型，无法更加细化,想要知道具体信息，要使用 instanceof
```

​		js  存储变量的时候，会根据存储的不同类型在变量的机器码的低位1-3位存储类型信息

```javascript
	000:  对象
    010:  浮点数
    100:  字符串
    110:  布尔
    1  :  整数
    undefined:  -2^30
	null: 所有机器码都为0;
	//由于null的所以机器码都为0， 所以导致了 typeof null 结果为 "object";
```

​		 用 <font color="#FAA">`instanceof` </font>  来测试 <font color="#FAA">`null` </font> 的时候， 会提示错误

> ​	null  instanceof  null
>
> ​	 Uncaught TypeError: Right-hand side of 'instanceof' is not an object	
>
> ​	instanceof 中  null 并不是对象。

​		当我们想要精准判断类型的时候，可以使用 <font color="#FAA">`Object.prototype.toString()`</font>

```javascript
	Object.prototypeof.toString.call(123);				//"[object Number]"
	Object.prototypeof.toString.call("jack");			//"[object String]"
	Object.prototypeof.toString.call({name: jack});		//"[object Object]"
	Object.prototypeof.toString.call(["mike", "jack"]);	//"[object Array]"
	Object.prototypeof.toString.call(true);				//"[object Boolean]"	
	Object.prototypeof.toString.call(() => {});			//"[object Function]"		
	Object.prototypeof.toString.call(null);				//"[object Null]"	
	Object.prototypeof.toString.call(undefined);		//"[object Undefined]"
	Object.prototypeof.toString.call();					//"[object Undefined]"
	Object.prototypeof.toString.call(Symbol(1));		//"[object Symbol]"	
```

...\<font color="#FAA">`xxx`</font>

#### 二、 instanceof

​		<font color="#FAA">`MDN`</font> 上 <font color="#FAA">`instanceof`</font> 的定义是： <font color="#FAA">`instanceof 运算符`</font>用于检测构造函数的<font color="#FAA">`prototype`</font> 属性是否出现在某个实例的原型链上。

```javascript
	function People(){}
	var jack = new People();
	jack instanceof People		//true;
	// 或者更复杂一些
	function Info(){};
	function Admin(){};
	Admin.prototype = new Info();
	var mike = new Admin();
	mike instanceof Admin		//true;
	mike instanceof	Info		//true;
```

​		既然<font color="#FAA">`instanceof`</font> 是通过原型链查看 后面参数的 <font color="#FAA">`ptototype`</font> 存不存在在该原型链上，那我们可以对他进行简单的进行实现。

```javascript
	function instanceofRough(left, right){
        if(typeof right !== "function") return false;
        let rightPrototype = right.prototype;		//取第二个参数(构造函数)的原型
        let leftProto = left.__proto__;				//取第一个参数（实例）的原型。
        while(true){
            if(leftProto === null){
                return false;
            }
            if(leftProto === rightPrototype){
                return true;
            }
            leftProto = leftProto.__proto__;
        }
    }
```

​		下面有两张非常经典的原型链的图片，展示了常见场景的原型原型链之间的关系。

![原型图片1](C:\Users\吕宏涛Y\Desktop\js相关知识点\原型图片1.png)



![原型图2](C:\Users\吕宏涛Y\Desktop\js相关知识点\原型图2.png)

```javascript
	// 关于几个 instanceof 的例子
	function People(){};
	Object instanceof Object;
	//true  Object.__proto__  === Function.prototype;
	//		Function.prototype.__proto__ === Object.prototype;
	Function instanceof Function;
	//true	Function.__proto__ === Function.prototype;
	Function instanceof Object;
	//true	Function.__proto__ === Function.prototype;
	//		Function.__proto__.__proto__ === Object.prototype;
	People instanceof People;
	//fasle	People.__proto__ === Function.prototype;	
	People instanceof Object;
	//true	People.__proto__ === Function.prototype;
	//		People.__proto__.__proto__ === Object.prototype;
	People instanceof Function;
	//true	People.__proto__ === Function.prototype;
```

