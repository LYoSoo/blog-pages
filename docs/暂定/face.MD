##### 数据类型（共7种）

+ 基本数据类型（6种）： string、number、boolean、null、undefined、 Symbol。
+ 对象类型： object 。

```javascript
	typeof "jack"			//  "string"
	typeof 123				//	"number"
	typeof true				//	"boolean"
	typeof null				//	"object"
	typeof undefined		//	"undefined"
	typeof Symbol("123")	//	"symbol"
	
	typeof {}				//	"object"
	typeof []				//	"object"
	typeof (() => {})		//	"function"
	// 以上返回值均为string 类型。
	
```

判断类型的方法：

+ typeof 
+ instanceof：**instanceof 局限性    [] instanceof  Object   [] instanceof Array 均为true**
+ Object.prototype.toString.call()： 借用Object原型上的toString 方法

```javascript
	Object.prototype.toString.call({})				// "[object Object]";
    Object.prototype.toString.call({})              // "[object Object]"
    Object.prototype.toString.call([])              // "[object Array]"
    Object.prototype.toString.call(() => {})        // "[object Function]"
    Object.prototype.toString.call("seymoe")        // "[object String]"
    Object.prototype.toString.call(1)               // "[object Number]"
    Object.prototype.toString.call(true)            // "[object Boolean]"
    Object.prototype.toString.call(Symbol())        // "[object Symbol]"
    Object.prototype.toString.call(null)            // "[object Null]"
    Object.prototype.toString.call(undefined)       // "[object Undefined]"

    Object.prototype.toString.call(new Date())      // "[object Date]"
    Object.prototype.toString.call(Math)            // "[object Math]"
    Object.prototype.toString.call(new Set())       // "[object Set]"
    Object.prototype.toString.call(new WeakSet())   // "[object WeakSet]"
    Object.prototype.toString.call(new Map())       // "[object Map]"
    Object.prototype.toString.call(new WeakMap())   // "[object WeakMap]"

```

##### 深拷贝

```javascript
	function deepClone( content ){
        !isObject( content ) && return content;
        let target = Array.isArray( content ) ? [] : {};
        for(let key in content){
            if(Object.prototype.hasOwnProperty.call( content, key ){
                if(isObject( content[key] )){
                	target[key] = deepClone( content[key] )
            	}else{
                    target[key] = content[key];
                }
            }
        }
    }
	function isObject(obj){
        return typeof obj === "object" && obj !== null;
    }
```

##### HTTP 各版本

```javascript
	// HTTP: 0.9	只有GET方法，返回html本身，服务端发送完毕直接关闭TCP，如果发生错误，返回特殊的包含问题描述的HTML文件
	GET /index.html				
	// HTTP：1.0	   
	// 1.只保持短暂的连接，每次请求与服务器建立一个TCP连接，处理完请求立即断开连接。
	// 2.连接无法复用：每次请求都会三次握手、四次挥手。
	增加了POST、DELETE、PUT、HEADER请求方式
    增加了请求头和响应头，在通信中指定了HTTP协议版本号，以及其他的元信息（状态码、权限、缓存、内容编码等）
    扩充了传输的格式，图片、音视频资源、二进制都可以进行传输(content-type)
	// HTTP：1.1
	
```







##### 箭头函数和普通函数的区别

> + 箭头函数没有function关键字，匿名函数。
> + 箭头函数不存在prototype，也无法new () => {}， （用完一次就扔掉）
> + 箭头函数没有arguments 属性
> + this指向问题
>   + 普通函数this一般是动态绑定的，只有在调用的时候才直到this的指向。
>   + 箭头函数this没有动态生产，是在定义的时候就确定了，绑定在最近一层的普通函数上。
> + 普通函数可以用call、apply、bind绑定，箭头函数不可以。

##### 实现call、 bind

```javascript
	// call、bind 改变this指向实际上是相当于一个隐式绑定
	var obj = {name: "jack"};
	function person(){
        console.log(this.name);
    }
	person.call(obj);
	//相当于 obj内部有个person,通过Obj 调用person
	//--------------------------------------------------
	Function.prototype.newCall = function () {
        let [obj, ...args] = arguments;
        obj.temp = this;
        obj.temp(...args);
        delete obj.temp;
        //使用完之后删除内部的temp 
    }
    person.newCall(obj);		//"jack"
	// --------------------------------------------------
	//apply和call基本一样，就是传参不一样
	Fcuntion.prototype.newApply = function(){
        let [obj, args] = arguments;
        obj.temp = this;
        obj.temp(...args);
        delete obj.temp;
    }
	person.newApply(obj);		//"jack"
```

##### 实现 bind, bind 不仅有改变this指向的作用，返回的函数还可以通过new 创建实例。

```javascript
	Function.prototype.newBind = function(context){
        const self = this;
        var args = Array.prototype.slice.call(arguments, 1);
        var fond = function(){
            var actualArgs = Array.prototype.slice.call(arguments);
            return self.apply(this instanceof fond ? this : context, args.concat(actualArgs))
        }
        fond.prototype = this.prototype;
        return fond;
    }
```

##### 用setTimeout 模拟 setInterval

```javascript
	function newInterval(func, time){
        funtions inside(){
            func();
            setTimeout(inside, time);
        }
        setTimeout(inside, time);
    }
	function(){
        console.log("hello newInterval")
    }
```

##### 函数柯理化

```javascript
function add() {
    let args = Array.prototype.slice.call(arguments);
    let inner = function () {
        args.push(...arguments);
        return inner;
    }
    //默认调用toString
    inner.toString = function () {
        return args.reduce((prev, cur) => {
            return prev + cur;
        })
    }
    return inner;
}
console.log(add(1)(2,3,4)(5))
```

##### 冒泡排序

```javascript
	function bubbleSort(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                }
            }
        }
        return arr
    }
```

##### defer与 async

> + async：适合第三方的脚本库，当遇到的时候不会阻塞HTML的加载，当script下载完后加载async
> + defer：适合dom相关的脚本，当遇到的时候不会阻塞HTML的加载，当HTML加载完后script才会进行执行。（适合与DOM有关联的）

##### Symbol

> ​	Symbol 接受一个可选参数，方便代码后期的调试
>
> ​	Object.getOwnPropertyNames()、 Object.keys() 、 for... in  无法显示 Symbol 的属性名
>
> ​	Object.getOwnPropertySymbols() 返回包含所有 Symbol 属性的数组。 
>
> ​	Symbol 不能使用 new ，因为是原始值。
>
> ​	Symbol.for() 创建共享 Symbol ， 如果已存在，返回共享的 Symbol

##### 防抖

```javascript
	function debounce(fn, delay){
        let timer = null;
        let first = true;
        return function(){
            let context = this;
            let args = arguments;
            if(first){
                first = false;
                fn.apply(context, args);
            }
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(context, args);
            }, delay);
        }
    }
	//采用闭包的思想，将定时器事件存在作用域链上，first 是控制立即执行一次。
```

##### 节流

```javascript
	function throttle(fn, delay) {
        let args = arguments;
        return function () {
            let timer = null;
        	let context = this;
            if (timer) {
                return;
            }
            timer = setTimeout(() => {
                fn.apply(context, args);
                timer = null;
            }, delay)
        }
    }
	//或者用时间差的方式来实现
    function throttle(fn, delay) {
        let pre = 0
        return function () {
            let context = this;
            let args = arguments;
            let now = new Date();
            if (now - pre > delay) {
                fn.apply(context, args);
                pre = now;
            }
        }
    }
```

##### HTTP 与 HTTPS 

> 下面是HTTP的一些特点：
>
> + 无状态：协议对客户端没有状态存储，对事物处理没有记忆功能，比如访问一个网站需要重复登陆。
> + 无连接：在HTTP/1.1以前，由于无状态，每次请求都需要TCP三次握手和四次挥手，和服务器重新建立连接。
> + 基于请求和响应：基本的特性，客户端发起请求，服务端进行相应。
> + 使用明文，请求和响应不会对通信方进行确认，无法保护数据的完整性。
> + HTTP/1.1 增加了持久连接，keep-alive

<hr>

> 下面是HTTPS的特点：
>
> + 内容加密：采用混合加密的方式，中间者无法直接查看明文的内容。
> + 验证身份：通过证书认证客户端访问的是自己的服务器。
> + 保护数据的完整性：防止传输的内容被中间人冒充或者篡改。
>
> ```txt
> 	混合加密（结合对称加密和非对称加密）：客户端使用对称加密生成密钥对数据传输进行加密，然后使用非对称加密的公钥再次对密钥加密，所以网络上传输的数据是被密钥加密的密文和用公钥加密的私钥，因此及时被黑客截获，由于没有私钥，无法获得加密报文的私钥，便无法获得报文的内容。
> 	数字摘要：通过单向hash函数对原文进行哈希，
> ```

五层模型： 应用层（HTTP报文） => 传输层（TCP首部） =>  网络层（IP） => 链路层（IP数据包） => 物理层。

报文从应用层到传输层，需要通过TCP的三次握手来和服务器建立连接、四次挥手来释放连接。

##### 三次握手 （确保客户端和服务端的发送能力和接收能力都没问题）

+ 客户端发送SYN报文，发送序号为 X    =》 SYN = 1 ， Seq = X
+ 服务端发送 SYN + ACK 报文，发送序号为 Y ，确认序号为 X + 1    =》   SYN = 1， ACK = X + 1， Seq = Y
+ 客户端发送 ACK 报文，发送序号为 Z ， 并确认序号为 Y + 1       =》      ACK = Y + 1， Seq = Z 

##### 四次挥手

> ​	TCP 全双工模式，当 client发送 FIN 报文，只是表示 client 没有数据要发送了，client 告诉Server 没有数据发送了， Server 回复 client 知道了。   =》  然后 Server 发送 FIN 告诉 Client，没有数据要发送了， Clinet 发送知道了，结束了这次连接。

+ 主动方：发送 FIN + ACK 报文，并置发送序号为 X              =》      FIN = 1， ACK = Z ， Seq = X
+ 被动方：发送 ACK 报文，并置发送序号为 Z ， 确认序号为 X + 1    =》      ACK  = X + 1，  Seq = Z 
+ 被动方：发送 FIN + ACK 报文， 并置发送序号为 Y ， 确认序号为 X     =》  FIN = 1， ACK = X， Seq = X
+ 主动方：发送 ACK 报文，并置为发送序号为 X ，确认序号为 Y           =》     ACK  = Y， Seq = X 

##### 输入URL后到页面显示出来，中间发生了什么

+ DNS域名解析：递归查找的过程  **浏览器缓存=> 本地hosts 文件 => 本地DNS解释器缓存查找 => 本地DNS 查找**
+ TCP 连接  三次握手
+ 发送HTTP请求，获取所需资源
+ TCP 四次挥手
+ 浏览器渲染：主要分为构建DOM树，样式计算，布局阶段，分层，显示
  + 将HTML内容解析成能够读懂的DOM树结构。
  + 渲染引擎CSS样式表转换为浏览器可以理解的stylesheets，计算DOM节点的样式。
  + 合并DOM树和CSS规则，生成render 树。
  + 布局render 树，负责各元素尺寸、位置的计算。
  + 绘制render 树，绘制页面像素信息。
  + 浏览器将各层的信息发送给GPU，GPU将各层进行合成，显示在屏幕上。

##### TS 中 interface 与 type 的区别

+ 都可以描述对象或者函数的类型，但是语法不同;

```typescript
	interface Info{
        name: string,
        age: number,
    }
    type Info = {
        name: string,
        age: number,
    }

```

+ 类型别名还可以用于其他类型，基本类型、联合类型、元组等。

```typescript
	type name = string;
	type info = { name: string};
	type info2 = { age: number };
	type message = info | info2;
```

+ Extend（扩展）: 二者都可以进行扩展。

```typescript
	interface info {
        age: number,
    }
    interface jack extends info { name: string }
```

+ class Implements ： 类和接口被认为是静态的，因此不能实现/扩展命名联合类型的类型别名。

**interface与type很像，很多场景两者都能适用，但也有细微的差别：**

> **类型：对象、函数两者都适用，但type可以用于基础类型、联合类型、元祖**
>
> **同名合并：interface支持，type不支持**
>
> **计算属性： type 支持 ， interface不支持**

