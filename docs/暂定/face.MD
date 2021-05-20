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

##### cookie、sessionStorage、localStorage

```javascript
	
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

##### 

##### 线程、进程

##### CORS

##### setState

> **先说结论：**
>
> + setTimeout 和原生事件中，可以立即拿到更新的结果，也就是同步。
> + 在合成事件和生命周期中，不能立即拿到更新的结果，也就是异步。
> + 在合成事件和生命周期中，如果对同一个值进行多次 setState， setState 的批量更新策略会对其进行覆盖，只进行最后一次更新。
> + 如果第一个参数为对象的时候，每次修改更新前会先合并，设置为函数就不会进行合并。
>
> **对生命周期或者执行队列包裹了一层 try finally，最后在 finally中进行 state 的更新，所谓的异步不是真的异步，而是将更新放到了队列里，再一次性的处理这些更新。**

```javascript
	//react 内部有个变量 executionContext  默认为 NoContext， 在生命周期的时候会被赋值为  LegacyUnbatchedContext
	//如果执行环境不为 NoContext,  仅仅是将更新放入 flushSyncCallbackQueue队里中，并不会立即调用，所以变为异步。
```



##### useCallback、 useMemo

​		useCallback和useMemo都可缓存函数的引用或值，但是从更细的使用角度来说useCallback缓存函数的引用，useMemo缓存计算数据的值。

```javascript
	const memoizedCallback = useCallback(() => {
            dosomething(a,b)
        },[a,b])
    // 当我们a, b 的值不变的时候，memoizedCallback的引用不会发生改变，则第一个函数参数就会被隐藏起来，从而达到性能优化的问题。
    const memoizedValue = useMemo(() => {
        dosomething(a,b)
    },[a,b])
    // 当我们在a,b 的值不变的时候，memoizedValue的值不变， 第一个函数参数不会被执行，从而达到节省计算量的目的。
    
```

+ useCallback 是根据依赖缓存第一个入参的函数。（函数）
+ useMemo 是根据依赖缓存第一个入参的函数的值。（计算性大的值）



##### 合成事件

​		React有自己的一套事件注册、存储、分发、重用的逻辑，减少了内存消耗，简化了事件的逻辑，最大化的解决了IE不兼容的问题。

+ React 组件的声明事件最终绑定在了document 这个节点上，而不是React组件对应的DOM 节点。所以只有document上绑定了DOM的原生事件，其他节点上没有，简化了DOM原生事件，减少了内存的开销。
+ React 以队列的形式，从触发事件向父组建回溯，调用他们在父组建声明的callback。也就是React 组件自身的冒泡机制，使用 event.preventDefault()，阻止冒泡。
+ React有自己的合成事件 SyntheticEvent，不同类型的事件会构造不同的SyntheticEvent。
+ React 使用对象池来管理合成事件对象的创建和销毁，减少了垃圾的生成和新对象内存的分配。

##### JS中的事件委托

​		简单来说：就是当事件触发的时候，把要做的事委托给父元素处理。（根据冒泡机制）

​		作用1： 节约内存

​		作用2： 能为之后新增加的DOM元素添加事件

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
	If-Modified-Since,Expires缓存控制
	// HTTP：1.1
	
	缓存处理增加了 tag、If-None-Match
	1.0中客户端想请求对象的一部分，但是服务端把所有的都返回来了，浪费带宽、1.1版本中引入range请求头，允许只请求资源的某一部分，返回码206
    错误通知处理：增加了24状态码，410：服务器资源被永久删除，409：请求资源与当前的资源发生冲突
    HOST头处理：指向真实访问的服务器的IP 
    长连接：1.1版本支持长连接和请求的流水线处理，在一个TCP连接上可以发送多个HTTP请求，减少了关闭和连接的消耗和延迟。
```



##### 箭头函数和普通函数的区别

> + 箭头函数没有function关键字，匿名函数。
> + 箭头函数不存在prototype，也无法new () => {}， （用完一次就扔掉）
> + 箭头函数没有arguments 属性
> + this指向问题
>   + 普通函数this一般是动态绑定的，只有在调用的时候才直到this的指向。
>   + 箭头函数this没有动态生产，是在定义的时候就确定了，绑定在最近一层的普通函数上。
> + 普通函数可以用call、apply、bind绑定，箭头函数不可以。

##### new操作做了什么

+ 创建一个新对象
+ 将对象的\_\_proto__指向构造函数的prototype对象
+ 将构造函数的作用域赋值给新对象（就是this指向新对象）
+ 执行构造函数中的代码（为这个新对象增加属性）
+ 返回新对象

```javascript
	function newFactory(){
        const obj = {};
        const Constructor = [].shift.call(arguments);
        obj.__proto__ = Constructor.prototype;
        const result = Constructor.apply(obj, arguments);
        return typeof result === "object" ? result : obj;
    }
```



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

