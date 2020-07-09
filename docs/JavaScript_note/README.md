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
