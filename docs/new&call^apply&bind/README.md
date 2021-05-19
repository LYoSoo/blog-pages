### new 的模拟实现

​		 <font color="#FAA">`new`</font> 运算符创建了一个用户定义的对象类型的实例或者具有构造函数的内置对象之一。

```javascript
	// new 的使用案例
	function People(name, age){
        this.name = name;
        this.age = age;
        this.firends = ["mike", "jun"];
    }
	People.prototype.sayHello = function(){
        console.log("hello");
    }
	let jack = new People("jack", 18);
	console.log(jack.name);		//"jack"
	console.log(jack.age);		//18
	console.log(jack.firends);	//["mike", "jun"]
	jack.sayHello();			//"hello"
```

​		我们实例化出来的  <font color="#FAA">`jack`</font> 可以访问构造函数里的属性， 也可以访问到 构造函数原型链上的属性/方法。

​		所以我们在实现的时候要返回一个新对象，之后使用`借用构造函数` 来继承构造函数的属性，之后把该对象的原型链 “链接”到构造函数的原型链上。

```javascript
	// 使用 var jack = newFactory(People, "jack", 18, ...)
	function newFactory(){
        //创建一个新的obj;
        const obj = new Object();
        //传入的第一个参数当作构造函数，
        const Constructor = [].shift.call(arguments);
        //将obj对象的原型指向 constructor的原型
        obj.__proto__ = Constructor.prototype;
        // 把constructor中的属性拷贝到 obj 中
        Constructor.apply(obj, arguments);
		// 返回 obj
        return obj;
    }
```

​		到这里 <font color="#FAA">`new`</font> 基本功能都以及实现了，但是 <font color="#FAA">`new`</font> 还有一个特性就是如果 构造函数内部手动使用了  <font color="#FAA">`return`</font> 。

+ 返回的如果是基本类型： 不受影响。

+ 返回的如果是对象： 则我们自己创建的 <font color="#FAA">`obj`</font> 不会被返回，返回的是构造函数自己 <font color="#FAA">`return`</font> 的对象。 

  所以我们在这里要进行一个判断。

```javascript
	// 使用 var jack = newFactory(People, "jack", 18, ...)
	function newFactory(){
        //创建一个新的obj;
        const obj = new Object();
        //传入的第一个参数当作构造函数，
        const Constructor = [].shift.call(arguments);
        //将obj对象的原型指向 constructor的原型
        obj.__proto__ = Constructor.prototype;
        // 把constructor中的属性拷贝到 obj 中
        const result = Constructor.apply(obj, arguments);
		// 返回 obj
        return typeof result === "object" ? result : obj ;
    }
```



### call / apply 

​		 <font color="#FAA">`call`</font> /  <font color="#FAA">`apply`</font> 主要作用是改变 <font color="#FAA">`this`</font> 的指向，在我们开发业务代码的时候其实并不是很常用，在写基础类、公共库方法的时候可能会用到的比较多一些，今天我们就简单的介绍一下。

#### call apply 共同点

​		<font color="#FAA">`call`</font> /  <font color="#FAA">`apply`</font>  共同点是 **改变函数执行的上下文**， 将一个对象的方法交给另一个对象来执行，并且立即执行。

> ​	为什么要改变执行上下文（交给另一个对象执行），其实就是因为 B 需要使用某种方法， 但B 没有，恰好A 有这种方法，这时候我们就借用一下A 的方法。
>
> ​	**调用 call / apply的必须是一个函数 Function**

#### call apply 的区别

​		<font color="#FAA">`call`</font> /  <font color="#FAA">`apply`</font> 的主要区别在于参数的写法。

##### call写法

```javascript
	Function.call(obj, arg1, arg2, arg3, ...);
```

需要注意一下几点：

+ 调用call 的对象，必须是函数 Function
+ call 的第一个参数，是一个对象。 Function 的调用者将会指向这个对象。 第一个参数默认值为 window。
+ 第二个参数开始，可以接受任意个参数，每个参数会映射到相应位置的Function 参数上。

```javascript
	function people(a,b,c){};
	people.call(obj, 1, 2, 3);
	// people接受到的参数是1 2 3
	people.call(obj, [1, 2, 3]);
	// people接受到的参数是 [1, 2, 3], undefined, undefined
```

##### apply的写法

```javascript
	Function.apply(obj, [arg1, arg2, arg3, ...]);
```

需要注意一下几点：

+ 调用apply 的对象 必须是函数 Function
+ 第二个参数，必须是数组或者类数组，他们被转换成数组，传入Function 中，并且映射到Function 的参数上。

```javascript
	function people(a,b,c){};
	people.apply(obj, [1, 2, 3]);
	//数组
	people.apply(obj, {
        0: 1,
        1: 2,
        2: 3,
        length: 3,
    })
	// 类数组
```

##### 什么是类数组

​		类数组是具备与数组特征类似的对象。

```javascript
	let likeArr = {
        0: 1,
        1: 2,
        2: 3,
        length: 3,
    }
    //可以进行角标调用likeArr[0]，具有length属性，可以使用for循环遍历。
    //常见的类数组，获取的DOM节点列表，使用arguments获取的所有参数。
    //类数组一般借用数组的方法： forEach splice push
```

#### call apply 的用途

1. 借用构造函数继承

   ```javascript
   	function people(){
           this.name = "jack",
           this.sayHello = function(){
               console.log("hello")
           }
       }
   	function jack(){
           people.call(this);
           this.sayHello();
       }
   	jack()		// "hello"
   	//使用call来继承了属性和方法
   ```

2. 借用方法

   ```javascript
   	let nodes = Array.prototype.call(document.getElementsByClassname('...'));
   ```

   可以用这种方式来借用数组的方法。

#### apply 的妙用

```javascript
	//apply 接受参数是数组的特性
	let max = Math.max.apply(null, arr);
	let min = Math.min.apply(null, arr);
	//两个数组合并
	Array.prototype.push.apply(arr1, arr2);
	//arr1 当作第一个参数 arr2 一个一个的push进数组。
```

#### 总结

​		<font color="#FAA">`call`</font> /  <font color="#FAA">`apply`</font> 都是用来改变对象的执行上下文的，并且是立即执行，而 <font color="#FAA">`bind`</font> 并不是立即执行，而是返回一个函数，后续需要调用返回的函数才可以执行。



### bind实现

​		在<font color="#FAA">`MDN`</font> 中 <font color="#FAA">`bind`</font> 的介绍： <font color="#FAA">`bind()`</font> 方法创建一个新的函数，当这个函数被调用时， <font color="#FAA">`bind()`</font> 的第一个参数将作为它运行时的 <font color="#FAA">`this`</font> ， 之后的一序列参数将在传递的实参前传入作为他的参数。

​		<font color="#FAA">`bind`</font> 两个特点：

+ 返回一个函数
+ 可以传入参数



#### bind函数模拟实现

​		bind 基本使用

```javascript
	var info = {
        name: "jack"
    }
    function People(){
        console.log(this.name);
    }
	//这里返回了一个函数。
	var jackPeople = People.bind(info);
	jackPeople();		// jack;
```



​		我们知道<font color="#FAA">`bind`</font>改变 <font color="#FAA">`this`</font> 指向可以用 <font color="#FAA">`call`</font> 或者 <font color="#FAA">`apply`</font> 来实现。

```javascript
	Function.prototype.bindClone = function(context){
        const self = this;
        return function(){
            return self.call(context);
        }
    }
```

#### 模拟传参

​		<font color="#FAA">`bind`</font> 是可以在绑定时进行传参的。

```javascript
	var info = {
        name: "jack"
    }
    function People(age, grades){
        console.log(this.name);
        console.log(age);
        console.log(grades);
    }
	//这里返回了一个函数。
	var jackPeople = People.bind(info, 18);
	jackPeople(100);		
	// jack;
	// 18;	
	// 100;			
	//上面我们说了 bind 的参数会在实参传入前作为他的参数。
	//所以bind(info, 18) 里的18 作为 People的第一个参数age, 
	//jackPeople（100）的100作为第二个参数grades;
	// 当我们jackPeople（100,200）200无法实际传入的。
```

​		上面的可以变成

```javascript
	Fcuntion.prototype.bindClone = function(context){
        const self = this;
        // 第一个args 是 bind 传入的参数。 （形参）
        console.log(context);
        var args = Array.prototype.slice.call(arguments, 1);
        return function(){
            // 这里的arguments 指的是我们调用实际返回的函数的时候的参数。  （实参）
            var actualArgs = Array.prototype.slice.call(arguments);
            return self.apply(context, args.concat(actualArgs));
        }
    }
```

#### 构造函数效果的模拟实现

​		<font color="#FAA">`bind`</font> 还有一个特点： 一个绑定函数也能够通过 <font color="#FAA">`new`</font> 操作符构建对象，这种行为就是把原函数当作构造器。提供的 <font color="#FAA">`this`</font> 值被忽略，同时调用时的参数被提供给模拟函数。

```javascript
	var name = "jack";
	var info = {
        name: "mike",
    }
    function People(age, friends){
        this.grades = 100;
		console.log(this.name);
        console.log(age);
        console.log(friends);
    }
	People.prototype.father = "big Mike";
	var jackPeople = People.bind(info, 18);
	// new jackPeople的时候 bind的“this”无效。 相当于只传递了age 18;
	var newJack = new jackPeople('june');
	//	undefined;
	//	18
	//	june;
	console.log(newJack.grades)	 //100
	console.log(newJack.father)	 //"big Mike"
```

​		所以我们需要进行特殊判断

```javascript
	Fcuntion.prototype.bindClone = function(context){
        const self = this;
        // 第一个args 是 bind 传入的参数。 （形参）
        var args = Array.prototype.slice.call(arguments, 1);
        var fBound = function(){
            // 这里的arguments 指的是我们调用实际返回的函数的时候的参数。  （实参）
            var actualArgs = Array.prototype.slice.call(arguments);
            // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        	// 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
            return self.apply(this instanceof FBound ? this: context, args.concat(actualArgs));
        }
        //修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
        fBound.prototype = this.prototype;
        return fBound;
    }
```

#### 最终实现代码

​		fBound.prototype  = this.prototype;	这里会改变绑定函数的prototype ， 需要中转一下;

```javascript
	Fcuntion.prototype.bindClone = function(context){
        const self = this;
        // 第一个args 是 bind 传入的参数。 （形参）
        var args = Array.prototype.slice.call(arguments, 1);
        function middare(){};
        var fBound = function(){
            // 这里的arguments 指的是我们调用实际返回的函数的时候的参数。  （实参）
            var actualArgs = Array.prototype.slice.call(arguments);
            // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        	// 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
            return self.apply(this instanceof FBound ? this: context, args.concat(actualArgs));
        }
        //修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
        middare.prototype = this.prototype;
        fBound.prototype = new middare();
        return fBound;
    }	
```

