### 模块化

####  1. 什么是模块化

+ 将一个复杂的程序根据一定的规则封装成几个块，并进行组合在一起。
+ 块的内部的数据与实现是私有的，只是对外部暴漏一些接口与其他模块通信。

#### 2. 模块化的进化过程

+ 全局function模式：将不同的功能封装成不同的全局函数
  + 实现：将不同的功能封装成不同的函数
  + 缺点：污染全局空间命名，容易引发冲突、数据不安全、模块成员之间看不出关联

```javascript
	function add(){
        
    }
	function clear(){
        
    }
```

+ namespace模式： 简单对象封装
  + 优点：减少全局变量，解决命名冲突
  + 缺点：数据不安全（可以直接改变内部数据）

```javascript
	var toolsModule = {
        name: "jack",
        sayHello(){
            console.log("hello " + this.name);
        }
    }
    toolsModule.name = "mike";
	toolsModule.sayHello();			//hello mike
```

+ IIFE模式：匿名函数自调用（闭包）
  + 作用：数据私有，外部只能通过暴漏的方法操作。
  + 实现：将数据和行为封装到一个函数的内部，通过window添加属性和外部暴露接口。
  + 问题：当前模块依赖外部模块时怎么处理。

```javascript
//index.html
	<script src="./module.js">
    </script>
	<script>
        const {sayHello, sayName} = nameModule;
		sayHello()	//	hello jack;
		sayName()	// 	jack
		nameModule.name = "mike";
		sayName()	//  mike;
    </script>
	
//	module.js
	(function (window){
        let name = "jack";
        function sayHello(){
            console.log("hello " + name);
        }
        function sayName(){
            console.log(name);
        }
        window.nameModule = {
            sayHello,
            sayName,
        }
    })(window);
	// 改进
	// 当前模块需要依赖的时候，在其引入script上方引入依赖文件，并通过立即执行函数传入。
	(function(window, jquery, tools){
        jquery(".name") ....
        tools ....
    })(widnow, jquery, tools);	
	//一定在此之前确保依赖引入完毕。
```

#### 3.模块化的好处

+ 避免命名冲突（减少命名空间污染）
+ 更好的分离，按需加载
+ 低耦合、高内聚
+ 提高复用性、易维护。

但我们引入多个`script` 标签导致我们要发送多个请求。



### 模块化规范

#### 一、 CommonJS

##### 1.概述

​		Node由模块组成，采用CommonJs 规范，每一个文件是一个模块，有自己的作用域，在一个文件内部定义的变量、函数、类都是私有的。

​		**在服务端模块的加载时运行时同步加载的， 在浏览器端，模块需要提前打包编译处理。**

##### 2. 特点

+ 所有代码都运行在模块内，不污染全局作用域。
+ 模块可以多次加载，但只会在第一次加载的时候运行一次，然后运行结果就被缓存了， 之后再加载的时候，直接从缓存中进行读取，想要获取最新的结果，必须要重新运行。
+ 模块加载的顺序，按照其在代码中出现的顺序。

##### 3. 基本语法

```javascript
	module.exports = info;
	exports.info = info;
	require("...");
```

> ​	其实就是导出了module 对象，当我们使用的时候直接使用导出的module内部的对象、方法

```javascript
	var age =18;
	function changeAge(year){
        return age + year;
    }
	module.exports = {
        age,
        changeAge,
    }
	//或者逐个导出
	module.exports.age = age;
	module.exports.changeAge = changeAge;

	//下面是另一个文件，我们使用的时候;
	const ageModule = require("./ageModule");
	console.log(ageModule.age);						//18;
	console.log(ageModule.changeAge(1));			// 19
```

#### 4. CommonJS 的加载机制

​		**CommonJS 模块的加载机制，输出的是被输入的值的拷贝，一旦输出了，那模块内部的值就无法影响到这个值**

```javascript 
	var count = 100;
	function add(){
        count++ ;
    }
	module.exports = {
        count,
        add,
    }
	//  引入模块；
	const { count, add } = require("./age");
	console.log(count);		//100;
	add();
	console.log(count);		//100;
	// count 是一个常量，已经被缓存了，除非改为函数，才能获取改动后的值。
```

#### 二、AMD

​		CommonJS 是同步的，AMD规范是非同步的。 Node.js 主要是用于服务端编程，模块一般都在本地，加载比较快，不需要考虑非同步的方式，所以CommonJS 比较适合。

​		**浏览器环境，要从服务端加载模块，必须采用非同步的方式，因此，浏览器一般采用AMD规范**

```javascript
	//未使用AMD 规范
	//location.js
	(function (window){
        let url = "www.baidu";
        function getUrl(){
            return url + ".com"
        };
        window.location = {getUrl};
    })(window);
	//console.js;
	(function (window, location){
        let name = "jack";
        function consoleUrl(){
            console.log(location.getUrl + name);
        }
        window.cons = {consoleUrl};
    })(window, location)
	// main.js
	(function(cons){
        cons.consoleUrl();
    })(cons);
	//index.html;
	<script src="./location.js"></script>
	<script src="./console.js"></script>
	<script src="./main.js"></script>	
	//引入顺序不能变，否则会报错。
```

​		**require.js 工具库遵守AMD规范， 他通过 define() 把代码定义为模块，通过require 实现模块的加载。**

```javascript
	//location.js	
	define(function(){
        let url = "www.baidu";
        function getUrl(){
            return url + ".com";
        }
        return {location};	//将模块暴露出去。
    })
	//console.js
	define(["location"], function(location){
        let name = "jack";
        function consoleUrl(){
            console.log(location.getUrl + name);
        }
        return {consoleUrl};
    })
	//main.js;
	(function(){
        require.config({
            baseurl: "js/",
            paths: {
                location: "./module/location",
                console: "./module/console",
            }
        })
        require(["console"], function(console){
            console.consoleUrl();
        })
    })
	//index.html  引入require.js 并设置main的入口
	<script data-main="js/main" src="js/require.js"></script>
```

> ​		AMD 的优势在于定义清晰，不会污染全局变量，能够清晰的显示依赖关系。允许非同步加载。

#### 三、CMD规范

​		CMD专门用于浏览器端，模块加载时异步的，只有使用的时候会加载。

```javascript
	define(function(require, exports, module){
        exports.info = info;
        module.exports = value
    })
    define(function(require, exports, module){
      var module2 = require('./module2')
        require.async('./module3', function (m3) {
        })
      exports.xxx = value
    })

	define(function (require) {
      var m1 = require('./module1')
      var m4 = require('./module4')
      m1.show()
      m4.show()
    })
```

#### 4、ES6规范

​		ES6 的思想是尽量静态化，能够在编译的时候就能够确定引用的关系。

```javascript
	// count.js
	let count = 0;
	let add = function(a, b){
        return a + b;
    }
    export { count, add };
	// main.js
	import {count, add} from "./count";
	// 这里相当于从导出的对象中结构出来。
	console.log(count);
	console.log(add(1,2));
	

	// 也可以下面这种方法进行导出；
	export default function(){
        do	...
    };
	//=======================
	import doSomething from "./doSomething";
    doSomething();
```

​		**ES6 与CommonJS 有两个比较大的差异 **

+ CommonJS 模块输出的是一个值的引用， ES6 输出的是值的引用。
+ CommonJS 模块是运行时加载， ES6 是模块编译时输出接口。（CommonJS 加载的是一个对象，该对象只有在脚本完成时才会生成，ES6 模块不是对象，他对外接口是一种静态定义，在代码解析的时候就会生成。）
+ ES6 动态引用，不会缓存值，模块里的变量绑定其所在的模块。

### 总结

+ CommonJS 主要用于服务端编程，加载模块是同步的，不适合浏览器环境，浏览器资源是异步加载的，因此有了AMD、CMD解决方案。
+ AMD 规范在浏览器环境中异步加载模块，并且可以并行加载多个模块，AMD开发成本高、阅读性低。
+ CMD 规范和 AMD 规范类似，用于浏览器编程，但依赖逻辑笨重。
+ ES6 在语言的标准上，实现了模块的功能，取代了AMD、CMD，成为浏览器和服务器通用的模块解决方案。