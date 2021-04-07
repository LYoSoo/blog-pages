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

