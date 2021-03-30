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

