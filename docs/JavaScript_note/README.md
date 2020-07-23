## 你不知道的JavaScript --读书笔记

> ​	最近看《你不知道的JavaScript》发现很有收获，这本书由浅入深感觉讲的很好，这篇读书笔记一是为了巩固自己的看到的一些东西，二是想有一些输出。



### 一、作用域

> ​	JavaScript是一门编译语言，但是相比传统编译语言，JavaScript引擎还会在语法分析和代码生产阶段有特定的步骤对性能进行优化。
>
> ```javascript
> var a = 2;
> ```
>
> 上面简单的一行代码，运行的过程如下
>
> + 看到 ` var a` 编译器会先询问在作用域中是否已经存在了该变量，如果已经存在，则会忽略该声明；如果不存在，则会声明一个新的变量，命名为 `a`。
>
> + 第二步编译器会为引擎运行时生成所需的代码，用来处理 `a = 2`这个操作。引擎首先会询问作用域，在当前作用域集合中是否存在 `a` 的变量，如果存在，使用这个变量；若不存在，继续查找该变量。
>
> + 最后如果查找到了 `a` 变量，则会把 `2` 赋值给该变量，否则会抛出异常。
>
>   **总结下来其实就是两个操作： 首先编译器在当前作用域声明一个变量（之前该变量未被声明），在运行时按照特殊的规则查找该变量（具体规则后续会说），找到了就对他赋值，未找到就抛出异常。**



**其实作用域就是根据名称查找变量的一套规则**

> ​	实际上我们通常要同时顾及好几个作用域。
>
> ​	当一个块或者函数嵌套在另一个块或者函数时，就发生了作用域嵌套。	当在上面讲的第二阶段中查找当前作用域集合中是否存在某个变量时，如果不存在，则会在外层嵌套的作用域中继续查找，直到找到该变量，或者抵达最外层的作用域位置, 也就是全局作用域 `window`。
>
> ```javascript
> 	function foo(a){
>         console.log(a + b);
>     }
> 	var b = 2;
> 	foo(2);			//4
> ```
>
> 上面就是一个典型的作用域查找规则， 在`foo`函数内部未找到变量 `b`的时候，会继续向嵌套的上层作用域查找，也就是全局作用域，在全局作用域中找到了变量 `b`。

### 二、词法作用域

> ​	我们在上面把“作用域” 看成是一套管理引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称进行变量查找的规则。
>
> ​	作用域又分为 “词法作用域”  与 “动态作用域” 两种。
>
> ​	**词法作用域是后面学习闭包的重要知识，如果不能完全清楚词法作用域，闭包也不可能理解。**
>
> ​	简单来说，词法作用域就是定义在词法阶段的作用域，是由你写代码时将变量和块作用域写在哪里决定的。
>
> ```javascript
> 	function foo(a){
> 		var b = a * 2;
>         function bar(c){
> 			console.log(a, b, c);
> 		}
>         bar(b * 3);
> 	}
> 	foo(2);			// 2, 4, 12
> ```
>
> 作用域按从外到内的分法，分别为最外层的全局作用域， 包含一个标识符： `foo` ；
>
> `foo` 函数创建的作用域， 包含三个标识符： `a` 、 `bar` 、 `b` ；
>
> `bar` 所创建的作用域，包含一个标识符： `c` ;
>
> 当引擎执行代码时，会从最内部的作用域开始查找，无法在当前作用域找到对应的变量，则会到上一级嵌套的作用域中继续查找。**作用域会在找到第一个匹配的标识符时停止。**

### 三、函数作用域和块作用域

> ​	**函数作用域： 属于这个函数的全部变量都可以在整个函数的范围内使用以及复用（嵌套的作用域也可以）。**
>
> ```javascript
> 	function foo(a){
>         var b = 2;
>         function bar(){
>             ...
>         }
>         var c = 3;
>     }
> ```
>
> > ​	上面的代码里函数 `foo` 的作用域气泡中包含了 `b` 、 `bar` 、 `c` 三个标识符，这些标识符所代表的变量或函数都属于所处作用域的气泡。
> >
> > ​	全局的作用域气泡含有 `foo`这个标识符。
> >
> > ​	所以我们在全局中只可以访问 `foo`  无法访问 `foo` 内部的作用域气泡。

##### 隐藏内部

​		上面之前我们可以看到，我们是无法从外面的作用域访问到函数内部的作用域，在软件设计中，**我们要最小限度的暴漏内部的内容，将其他内容“隐藏”起来，比如模块或者内部API设计**。

​		我们可以讲代码中的片段，用一个函数声明对他进行包装，实际就是把他隐藏了起来。

```javascript
	function doSomething(a){
        b = a + doSomethingElse(a * 2);
        console.log(b * 3);
    }
	function doSomethingElse(a){
        return a - 1;
    }
	var b;
	doSomething(2);			//15
```

> ​	上面的代码片段， 变量 `b` 和函数 `doSomethingElse` 都应该是函数  `doSomething` 的内部“私有”内容，但现在暴露在了外面， 也就是可以访问 `doSomething`的作用域同时可以访问变量 `b` 和函数 `doSomethingElse`,  这样不仅没必要，而且还是“危险的”， 造成不必要的麻烦， 合理的设计是要帮他们隐藏在 `doSomething`的内部。
>
> ```javascript
> 	function doSomething(a){
>      function doSomethingElse(a){
> 			return a - 1;
>      }
>      var b; 
>      b = a + doSomethingElse(a * 2);
>      console.log(b * 3);
>  }
> 	doSomething(2);			//15
> ```
>
> 此时 `b` 和 `doSomethingElse` 都无法从外部被访问， 只能被 `doSomething` 所控制，将其私有化了。
>
> ​	“隐藏”作用域的变量和函数的另一个好处是可以避免同名标识符之间的冲突，当你无意间命名了两个相同的标识符，就会造成覆盖。
>
> ```javascript
> 	function foo(){
>         function bar(a){
>             i = 3;			//可以修改下面for循环中的 i 
>             console.log(a + i);
>         }
>         for(var i = 0; i < 10; i++ ){
>             bar(i * 2);		// i 被赋值为3， 一直小于10 造成死循环
>         }
>     }
> ```
>
> 如果第三方库没有隐藏好自己的内部变量，在我们同时引入多个三方库的时候，很容易的引发冲突
>
> 
>
> 所以第三方的库都会在全局作用域中声明一个足够特别的变量，用来做自己的命名空间，需要暴露给外部的功能都是其属性，避免讲自己的标识符暴露在顶级的词法作用域中。
>
> ```javascript
> 	var specialModuleName = {
>         name: "",
>         doSomething: function(){},
>         doSomethingElse: function(){},
>     }
> ```

#### 函数作用域

> ​	上面我们说了可以通过函数把想要隐藏的标识符包裹起来，这样外部的作用域无法访问内部的标识符。
>
> ```javascript
> 	var a = 2;
> 	function foo() {
>      var a = 3;
>      console.log(a);			// 3
>  }
> 	foo();
> 	console.log(a);				//2
> ```
>
> 这样虽然解决了一些问题，但是还是需要声明 `foo` 这个函数，并在之后对其进行调用，声明的 `foo` 函数同样污染了当前作用域。
>
> 在JavaScript中有这样一种解决方案
>
> ```javascript
> 	var a = 2;
> 	((function foo() {
>      var a = 3;
>      console.log(a);		//3
>  })();
>  console.log(a);			//2
> ```
>
> 函数被包裹在 () 内部， 变成了表达式，在末尾加上 () 用来执行这个表达式， 这种写法叫做“立即执行函数表达式” 平时叫  立即执行函数（IIFE）。
>
> 这样 `foo` 就被隐藏起来了，不会污染外部的作用域。
>
> ​		立即执行函数还一个用法就是把他们当作函数调用并传递参数进去。
>
> ```javascript
> 	var a = 2;
> 	(function IIFE(global){
>         var a = 3;
>         console.log(a);			//3
>         console.log(global.a);		//2
>     })(window);
> 	console.log(a);			//2
> ```
>
> 在IIFE中传入 `window` 对象，把参数命名为 `global`。
>
> **IIFE更重要的一种用法是倒置代码的运行顺序，将需要运行的函数放在第二位。**
>
> ```javascript
> 	var a = 2;
> 	(function IIFE(def){
> 		def(window);
> 	})(function def(global){
> 		var a = 3;
> 		console.log(a); 		//3
> 		console.log(global.a);		//2
> 	})
> ```
>
> > ​	上面代码函数`def`定义在第二部分， 作为 `IIFE`的参数传递进去， 然后在`IIFE`内部调用 函数 `def`，并将 `window` 传入当作自定义 `global` 的值。

#### 块作用域

> ​	我们都知道 `ES6` 引入了新的关键字 `let`， 是一种新的变量声明方式。

**`let` 可以将变量绑定到所在的任意作用域中，通常是 { } 内部， 也就是 `let` 为其声明的变量隐式的劫持了所在的块作用域。**

```javascript
	var foo = true;
	if(foo){
        let bar = foo * 2;
        console.log(bar);
    }
	console.log(bar);		//ReferenceError
```

上面说的 `let` 的行为是隐式的，可能后续代码的维护中会将 `let` 声明移动位置造成错误，为此我们可以显示的创建一个块，将 `let`放在内部。

```javascript
	var foo = true;
	if(foo){
        {
            let bar = foo * 2;
            console.log(bar);
        }
    }
	console.log(bar);		//ReferenceError
```

**使用 `let` 进行的声明不会在块作用域中提升，声明的代码被运行之前，声明并不“存在”。**

```javascript
	{
        console.log(a);		//ReferenceError
        let a = 2;
    }
```

`let` 和 `var` 声明的 `for`循环区别

```javascript
	for(var i =0; i< 10; i++){
        console.log(i);
    }
	console.log(i);			//11

//上述代码实际上可以看作
	var i;
	for(i =0; i< 10; i++){
        console.log(i)
    };
	console.log(i);
//相当于污染了上层作用域
```

当用 `let` 进行声明时；

```javascript
	for(let i=0; i< 10; i++){
        console.log(i);
    };
	console.log(i);			//ReferenceError
```

`let` 不仅将 `i` 绑定在了  `for` 循环的块中，实际还将其重新绑定到了循环的每一个迭代中，确保使用上一个循环第二代结束时的值进行重新赋值。

```javascript
	{
        let j;
        for(j=0; j< 10; j++){
            let i = j;		//没个i都会进行重新的绑定，
            console.log(i)l
        }
    }
```

#### const

> ​	`const` 是 `ES6` 引入另一种声明方式，他也同样可以用来创建块级作用域，但是和 `let` 不同，使用 `const` 声明变量之后，值是固定的(当为常量的时候)，之后对常量的修改会引起错误。
>
> ```javascript
> 	const a = 2;
> 	a = 3;			//ReferenceError;
> ```
>
> 其实可以看成 变量的引用地址不可改变， 当用 `const` 声明对象的时候。
>
> ```javascript
> 	const a = { name: "张三" };
> 	a.name = "李四";
> 	console.log(a);		//李四。
> ```

### 四、变量提升

JavaScript的运行顺序并不是从下到下依次运行的。

引擎会在解释JavaScript代码之前对其进行编译， 变量和包括函数在内的 声明都会在任何代码被执行之前首先处理。

当JavaScript 看到 `var a = 2;`	时，会把他看成两个声明， 第一部分时 `var a = 2` 是在编译阶段进行的。

第二部分 `a = 2` 会留在原地 等待执行阶段。

```javascript
	var a = 2;
	//上面的代码会进行如下形式的处理。
	var a;
```

函数也会进行提升

```javascript
	foo();
	function foo(){
        console.log(a);
        var a = 2;
    }
```

但是函数表达式无法进行提升

```javascript
	foo();		//TypeError;
	var foo = function bar() {
    	//...
    }
    //上面代码进行提升后会变成下面的样子
    
    var foo;
	foo();
	foo = function bar() {
        // ...
    }
```

**上面说了，声明阶段会提升，而赋值的时候，变量会停在原地，等轮到他执行的时候。**

**函数声明和变量声明都会进行提升，但同时出现时，函数声明优先于变量声明。**

```javascript
	foo();		//1;
	var foo;
	function foo(){
        console.log(1);
    }
	foo = function (){
        console.log(2);
    }
// 	上述代码可以理解为下面的形式
	function foo(){
        console.log(1);
    }
	foo();
	foo = function () {
        console.log(2);
    }
```

> ​	尽管 `var foo` 声明在 `function foo(){...}` 之前， 但是由于函数优先， 到 `var foo` 时， 发现他是重复的声明，所以自动将其忽略。

**尽管重复的声明会被忽略，但是后面的同名函数还是会覆盖前面的函数的**

```javascript
	foo();			//3
	function foo(){
        console.log(1);
    }
	foo = function (){
        console.log(2);
    }
	function foo(){
        console.log(3);
    }
```



### 五、作用域和闭包

首先我们先来看下面的代码

```javascript
	function foo(){
        var a = 2;
        function bar(){
            console.log(a);
        }
        return bar;
    }
	var baz = foo();
	baz();		//2   这就是闭包
```

> ​		函数 `bar` 能够通过词法作用域来访问 `foo()` 的内部作用域，我们将 `bar` 当作值类型进行传递，我们把 `bar` 所引用的函数对象当作返回值。
>
> foo() 执行后 其返回值也就是 `bar` 函数，赋值给变量 `baz` 并调用 `baz()` ， **其实是通过不同的标识符引用调用函数 bar。**
>
> bar 可以正确的运行，但是在 自己定义的词法作用域之外的地方执行。
>
> ​		在 ` foo` 执行后，通常会期待 `foo()`整个内部作用域都会被销毁，我们的引擎有垃圾回收器来释放不在使用的内存空间，看起来 `foo()` 的内容不会被使用，所以很自然的想要对其进行回收。
>
> ​		但是闭包的 神奇之处在于可以组织这样的事情发生，实际上内部作用域仍然存在，导致他没有被回收，谁在使用这个内部作用域呢，是 `bar()` 本身在使用。因为`bar`  声明在了函数 `foo` 的内部，它拥有了函数 `foo` 内部作用域的闭包，使得该作用域一直存在，让 `bar` 在之后任何时间都可以引用。
>
> ​		**`bar` 保持着对该作用域的引用，这个引用就叫做闭包。**
>
> ​		`bar` 函数在定义时的词法作用域以外被调用， 闭包使函数在别处调用时可以继续访问定义时的词法作用域。



无论用何种方式对函数类型的值进行传递，当函数在别处调用时都可以观察到闭包。

```javascript
	function foo(){
        var a = 2;
        function bar(){
            console.log(a);
        }
        baz(bar);
    }
	function baz(fn){
        fn();		//这就是闭包
    }
```

> ​	 我们把内部函数 `bar` 传递给 `baz` , 当我们在`baz` 内部调用 `bar` 时（也就是`baz` 内的 `fn` 函数）， 因为闭包的缘故，他仍然可以访问 `foo`的内部变量 `a`.



也可以用间接的方式传递函数。

```javascript
	var fn;
	function foo(){
        var a = 2;
        function baz() {
            console.log(a);
        }
        fn = baz;
    }
	function bar(){
        fn();	//闭包；
    }
	foo();
	bar();
```

**无论用何种方式将内部函数传递到词法作用域以外的地方，他都会保持对原来定义的作用域的引用，无论在何处执行这个函数都会使用闭包。**

看下面一个例子

```javascript
	function wait(message) {
        setTimeout(function timer() {
            console.log(message);
        }, 1000)
    }
	wait("hello");
```

我们讲一个内部函数  `timer`  传递给了 `setTimeout()`   `timer`  具有涵盖 `wait()`  作用域的闭包， 因此保留了对 `message` 的引用。

wait 执行 1000 毫秒之后，他的内部作用域仍然不会消失， `timer` 函数仍然保有 wait(...) 作用域的闭包。

​		在引擎的内部，内置工具函数 `setTimeout` 保持着对一个参数的引用， 可能是匿名函数  在上面的代码中就是 `timer` 函数，引擎会调用这个函数，词法作用域在这个过程中保持完整。

**本质上无论何时何地，如果将（访问他们各自词法作用域）的函数当作第一级的值类型并到处传递，你就会看到闭包的应用。 在定时器、事件监听器、AJAX请求或者任何其他的异步请求和同步请求任务中，只要使用了回调函数，其实都在使用闭包。

#### 循环和闭包

​		for 循环是很常见的闭包

```javascript
	for(var i = 0; i<= 5; i++){
        setTimeout(function timer(){
            console.log(i);
        },i * 1000);
    }
```

我们预期上述代码会依次输出 1 - 5 ，每秒一次， 每次一个

实际上，他会输出 5 个 6， 每秒一次。

> ​	循环的终止条件是 `i > 5` ， 首次成立的条件是 `i = 6`。 因此输出的值是循环的最终值 也就是 `6`。
>
> ​	其实，就算是`setTimeout` 的延迟是 0 ， 输出的结果也不会变， 因为回调函数的执行是在循环结束时才执行，尽管他们在每次的时候都获取了一个 `i` 的副本，但是他们获取到的是一个在全局作用域下的  `i`  实际上是同一个 `i` 。

​		我们尝试用立即执行函数来改写一下这个函数。

```javascript
	for(var i=0; i<= 5; i++){
        (function(){
            var j = i;
            setTimeout(function timer(){
                console.log(j);
            }, i * 1000)
        })()
    }

//	下面可以对其进行一些改进
	for(var i = 0; i<= 5; i++){
        (function (j){
            setTimeout(function timer(){
                console.log(j)
            }, j * 1000)
        })(i)
    }
//  使用块级作用域
	for(var i =0; i<=5; i++){
        let j = i;
        setTimeout(function timer(){
            console.log(j);
        }, i * 1000)
    }

// 最终方案
	for(let i =0; i<= 5; i++){
        setTimeout(function timer(){
            console.log(i);
        }. i * 1000)
    }
//这样变量不止被声明一次，每次迭代都会进行新的声明，然后用上一次迭代的结束值来初始化该变量。
```

### 模块

我们看如下代码

```javascript
	function coolModule(){
        var something = "something";
        var list = [1,2,3];
        function doSomething() {
            console.log(something);
        }
        function joinList() {
            console.log(list.join("*"));
        }
        return{
            doSomething: dosomething,
            joinList: joinList
        }
    }
	var foo = coolModule();
	foo.doSomething();			//something;
	foo.joinList();				// 1*2*3;
```

> ​	coolModule 是一个函数，必须要通过调用他来创建模块实例，如果外部没有调用该函数，则内部作用域和闭包都无法被创建。
>
> ​	并且 `coolModule` 返回的是一个对象字面量语法 `{key: value}` 来表示的对象，这个返回对象含有对内部函数而不是对内部数据变量的引用。我们保持内部变量是隐藏并且私有的状态，可以将这个对象类型的返回值当作是模块的公共API。
>
> ​	doSomething() 与  joinList() 函数具有涵盖模块内部作用域的闭包 (通过实例化 coolModule 来实现)。
>
> **模块模式具备两个必要的条件:**
>
> + **必须有外部的封闭函数，该函数至少要被调用一次。  （每次调用都会生成新的模块实例）**
> + **封闭函数内必须返回至少一个内部函数，这样内部函数在私有作用域中能够形成闭包，并且可以修改或者访问私有的状态。**

当我们只需要一个实例时，可以用立即执行函数直接生成。

```javascript
	var foo = (function coolModule(){
        var something = "something";
        var list = [1,2,3];
        function doSomething() {
            console.log(something);
        }
        function joinList() {
            console.log(list.join("*"));
        }
        return{
            doSomething: dosomething,
            joinList: joinList
        }
    })();
	foo.doSomething();		// something;
	foo.joinList();			// 1*2*3;
```

模块也是普通的函数，当我们需要传入参数时，可以直接传入参数。

```javascript
	function coolModule(id){
        function identify(){
            console.log(id);
        }
        return {
            identify: identify;
        }
    }
	var foo1 = coolModule("123");
	var foo2 = coolModule("456");
	foo1.identify();		//123
	foo2.identify();		//456
```

我们也可以通过模块实例对内部保留对公共API的引用，对模块实例进行修改，添加或删除他们的属性。

```javascript
	var foo = (function indentify(id){
        function change(){
            publicApi.identify = identify2;
        }
        function identify1(){
            console.log(id);
        }
        function identify2(){
            console.log(id.toUpperCase);
        }
        var publicApi = {
            identify: identify1,
        }
        return publicApi;
    })("cool Module");
	foo.identify();			// cool Module
	foo.change();
	foo.identify();			// COOL MODULE
```



### 第二部分 this 和 对象原型



#### 第一章 关于this

#### 1.1 为什么要使用this

```javascript
	function identify(){
        return this.name.toUpperCase();
    }
	function speak(){
        var greet = "hello, i am " + identify.call(this);
        console.log(greet);
    }
	var me = {
        name: "jake"
    }
    var you = {
        name: "mike"
    }
    identify.call(me);			// JAKE;
	identify.call(you);			// MIKE;
	speak.call(me);				// hello, i am JAKE;
	speak.call(you);			// hello, i am MIKE;
```

如果不想使用`this` 就要给 函数 `identify()`  和  `speak()`  显示的传入一个上下文对象；

```javascript
	function identify(context){
        return context.name.toUpperCase();
    }
	function speak(context){
        var greet = "hello, i am " + identify(context);
        console.log(greet);
    }
	var me = {
        name: "jake"
    }
	identify(me);		// JAKE
	speak(me);			// hello, i am JAKE
```

可以看到， `this` 使用了一种更优雅的方式来隐式的“传递” 一个对象引用，使得API设计的更加简洁和容易复用。

#### 1.2 this

看下面的代码 

```javascript
	function foo(num){
        console.log("foo" + num);
        this.num ++;
    }
	foo.count = 0;
	var i;
	for(i = 0; i < 10; i++){
        if(i > 5){
            foo(i);
        }
    }
	//我们想通过 foo.count 计数 来打印出foo调用的次数
	console.log(foo.count);			//  0;
```

> ​		当我们执行到 foo.count = 0 时，的确向函数对象`foo` 增加了一个属性 `count ` ， 但函数内部代码的 `this` 指向并不相同。

**`this` 在任何情况下，都不指向函数的词法作用域**

```javascript
	function foo() {
        var a = 2;
        this.bar();
    }
	function bar(){
        console.log(this.a);
    }
	foo();			// ReferenceError: a is not defined;
//		实际上this.bar() 正常是调用不成功的 
```

#### this 到底是什么

+ this 是运行时绑定的，并不是在编写时绑定的，他的上下文取决于函数调用时的各种条件。this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。
+ 当函数被调用时，会创建一个活动记录（简称： 上下文），这个记录会包含函数在哪里调用，调用的方式，函数的参数等等，this 就是这个记录的属性，在函数执行的时候会被用到。
+ 可以理解为，this 的指向完全取决于函数在哪里调用。



### 第二章   this 全面解析

在理解this 之前，首先要理解

+ 调用位置： 调用位置就是函数在代码中被调用的位置（而不是声明的位置）。
+ 调用栈：为了达到当前调用位置所调用的所有函数。 

调用位置其实就是当前执行的函数前一个调用。

```javascript
	function baz(){
        //调用栈是   baz   
        //当前调用位置是全局作用域
        console.log("baz");
        bar();	//bar 调用位置
    }
	function bar(){
        // 调用栈 baz => bar
        console.log("bar");
		//  当前调用位置在 baz 中
        foo();	// foo 调用位置
    }
	function foo(){
        // 调用栈  baz => bar => foo
        // 当前调用位置在 bar 中；
        console.log("foo");
    }
	baz();		// baz的调用位置
```

#### 绑定规则

##### 2.1 默认绑定

```javascript
	function foo(){
        console.log(this.a);
    }
	var a = 2;
	foo();		//2
```

> ​	上面代码 `var a = 2 ` 是全局变量，在调用函数 foo ()  时，应用了`this`  的默认绑定，因此 `this` 指向全局对象。 

##### 2.2 隐式绑定

```javascript
	function foo(){
        console.log(this.a);
    }
	var obj = {
        a: 2,
        foo: foo,
    }
    obj.foo();	//	2
```

> ​	首先要注意foo 的声明方式，以及后续被当作引用属性添加到 `obj ` 当中，这个函数严格来说并不属于 `obj` 这个对象。
>
> ​	调用位置会根据上下文来引用函数，也可以说函数被调用时， obj 对象 拥有或者包含他。
>
> ​	当函数被调用时，前面确实加上了对obj 的引用，当函数引用有上下文对象时，隐式绑定规则会把 `this` 绑定到这个上下文对象，因此调用 `foo()` 时，`this` 被绑定到 `obj`， 因此， `this.a`  与 `obj.a` 是一样的。

*对象属性引用链只有上一层或者最后一层在调用的位置中起作用。*

```javascript
	function foo(){
        console.log(this.a);
    }
	var obj2 = {
        a = 2,
        foo: foo,
    }
	var obj1 = {
        a = 1,
        obj2: obj2,
    }
	foo();		//2
```

**隐式丢失**

一个常见的this 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是会应用默认绑定，把this 绑定在 全局  或者 "undefined"上。

```javascript
	function foo(){
        console.log(this.a);
    }
	var obj = {
        a: 2,
        foo: foo
    }
    var bar = obj.foo;
	var a = "global a";
	bar();			// "global a";
```

> ​	虽然 bar 是对 obj.foo 的一个引用，实际上引用的是 foo 函数本身，此时  bar() 是一个不带任何修饰符的函数调用，因此应用了默认绑定。

另一个更常见的出现在传入回调的时候

```javascript
	function foo(){
        console.log(a);
    }
	function doFoo(fn){
        fn();
    }
	var obj = {
        a: 1,
        foo: foo
    }
    var a = "global a";
	doFoo(obj.foo);			//"global a"
```

> ​	参数传递其实就是隐性赋值，我们传入函数时也会被隐性赋值。

##### 2.3 显示绑定

我们可以通过 `call()` 和 `apply()`  来进行显示绑定

```javascript
	function foo(){
        console.log(this.a)
    }
	var obj = {
        a: 2,
    }
    foo.call(obj);			//2
```

> ​		通过foo.call(obj)  可以在调用foo 时 把他的 `this` 强制绑定在 `obj` 上。
>
> ​		如果你传入的是一个原始值（字符串类型、布尔类型 、数字类型）当作 `this` 的绑定对象，这个原始值会被转换成他的对象形式 ( 也就是 new String(...), new Boolean(...), new Number(...)) 这也叫做装箱。
>
> **1 硬绑定**
>
> ```javascript
> 	function foo(){
>         console.log(this.a);
>     }
> 	var obj = {
>         a: 2,
>     }
>     var bar = function(){
>         foo.call(obj);
>     }
>     bar();		//2
> 	setTimeout( bar(), 1000 );		//2
> 	bar.call(window);		//2		硬绑定之后无法在修改他的this
> ```
>
> > ​	在上面的代码里，我们创建了bar 函数, 并在他的内部手动调用了 foo.call(obj) ， 因此强制的把 foo 的 this 绑定到了 obj。 无论之后如何调用函数 bar, 他总会手动在obj 上调用 foo ， 这种绑定是一种显示的绑定，我们也叫他硬绑定。

硬绑定的典型应用场景就是创建一个包裹函数，负责接受参数并返回值。

```javascript
	function foo(something) {
        console.log(this.a, something);
        return this.a + something;
    }
	var obj = {
        a: 2
    }
    var bar = function () {
        foo.call(obj, arguments);
    }
    var b = bar(3);		// 2  3
	console.log(b)  	// 5
```

另一个使用方法是创建可重复使用的辅助函数

```javascript
	function foo(something){
        console.log(this.a, something);
        return this.a + something;
    }
	var obj = {
        a: 2
    }
    function bind(fn, obj){
        return function () {
            return fn.call(obj, arguments)
        }
    }
	var bar = bind(foo, obj);
	var b = bar(3);		//2 3
	console.log(b);		//5
```

由于硬绑定是一种常用的模式， 所以 ES5 提供了一种内置方法  `Function.prototype.bind` 。

```javascript
	function foo(something) {
        console.log(this.a, something);
        return this.a + something;
    }
	var obj = {
        a: 2
    }
	var bar = foo.bind(3);		// 2 3
	console.log(bar);			// 5
```

bind()	会返回一个硬编码的新函数，它会把你指定的参数设置为 `this` 的上下文并调用原始参数。

##### 2.4 new 绑定

使用new 来调用函数，会自动执行下面的操作

+ 创建一个全新的对象。
+ 这个新对象会执行[[prototype]] 的连接。
+ 这个新对象会绑定到函数调用的 this。 
+ 如果函数没有返回对象，那么 new 表达式中的函数调用会自动返回这个新对象。

```javascript
	function foo(a){
        this.a = a;
    }
	var bar = new foo(2);
	console.log(bar.a); 	//2	
```

使用new 来调用 foo(...) 时，我们会构造一个新的对象，并把它绑定在 foo (...) 调用中的 this 上。



#### 绑定优先级

默认绑定优先级最低

+ 隐式绑定和显示绑定：

  ```javascript
  	function foo() {
          console.log(this.a);
      }
  	var obj1 = {
          a: 1,
          foo: foo
      }
      var obj2 = {
          a: 2,
          foo: foo
      }
      obj1.foo();		//	1
  	obj2.foo();		//  2
  	obj1.foo.call(obj2);		//2
  	obj2.foo.call(obj1);		//1
  ```

  所以显示绑定优先级比隐式绑定更高

  > 现在优先级关系    显示绑定 > 隐式绑定 > 默认绑定-+



+  下面看new 和 隐式绑定的优先级关系

  ```javascript
  	function foo(something){
          this.a = something;
      }
  
  	var obj1 = {
          foo: foo
      }
      
      var obj2 = {}
      obj1.foo(2);
  	console.log(obj1.a);		//2
  
  	obj1.foo.call(obj2, 3);		
  	console.log(obj2.a);		//3
  
  	var bar = new obj1.foo(4);
  	console.log(obj1.a);		//2
  	console.log(bar.a);			//4
  ```

  可以看出 new 绑定比隐式绑定优先级高。

  

我们可以根据优先级来判断函数在某个调用位置应用的哪条规则。

+ 函数是否在 new 中调用，如果是的话 this 绑定的是新调用的对象。

  ```javascript
  	var bar = new foo();
  ```

+ 函数是否通过 call 、 apply (显示绑定) 或者 硬绑定调用，如果是的话， this 绑定的是指定的对象

  ```javascript
  	var bar = foo.call(obj);		
  ```

+ 函数是否在某个上下文环境中调用（隐式绑定），如果是的话， this 绑定的就是那个上下文对象。

  ```javascript
  	var bar = obj.foo();
  ```

+ 如果都不是的话，就是默认绑定，在严格模式下，就绑定到undefined，否则是全局对象。

  ```javascript
  	var bar = foo();
  ```

  

##### 2.5 this 词法

箭头函数不是通过function 关键字进行定义的，是使用 ` => ` 定义的，箭头函数不使用上述4条规则，而是根据外层的作用域来决定 `this` 。

```javascript
	function foo(){
        return (a) => {
            console.log(this.a);
        }
    }
	var obj1 = {
        a: 1
    }
    var obj2 = {
        a: 2
    }
    var bar = foo.call(obj1);
	bar.call(obj2);			//1
```

foo 内部创建的箭头函数会捕获调用时 foo() 的 this， 由于 foo 的 this  绑定到了 obj1,  bar(引用箭头函数）的this 也会绑定的 obj1，箭头函数的绑定无法修改。

```javascript
	function foo() {
        setTimeout(() => {
            console.log(this.a);
        }, 1000)
    }
	var obj = {
        a: 1
    }
    foo.call(obj);		// 1
```

> ​	箭头函数可以像 this 一样确保函数的 `this` 被绑定到指定的对象

在 ES6 之前还可以用另一种方式取代箭头函数

```javascript
	function foo(){
        var that = this;
        setTimeout(() => {
            console.log(that.a);
        }, 1000)
    }
	var obj = {
        a: 1
    }
    foo.call(obj);
```

+ 只用词法作用域，并且抛弃错误 this 风格的代码
+ 完全采用 this 的风格， 必要时使用 bind() ， 尽量避免使用 that = this 以及箭头函数。





### 第三章、 对象



####	3.1 语法

​		对象可以通过两种形式来定义： 声明（文字）形式和构造形式。

​		对象的文字语法：

```javascript
	var myObj = {
        key: value
    }
```

​		构造形式：

```javascript
	var myObj = new Object();
	myObj.key = value;
```

> ​	上面两种方式声明的对象是一样的，只不过通过文字形式可以直接声明多个键值对，而构造形式需要逐个添加属性。



