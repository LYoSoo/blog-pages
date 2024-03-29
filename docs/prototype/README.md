#### 原型

##### 什么是原型

​		在JavaScript中，<b>原型也是一个对象，通过原型可以实现对象的属性继承。</b> 在JavaScript中对象都包含一个 **[[prorotype]]** 的内部属性，这个属性所对应的对象就是这个对象的原型。

​		但是 **[[prototype]]** 作为作为对象的内部属性，是不能直接进行访问的， 所以有了 **\_\_proto\_\_** 这个非标准的访问器。 也可以用**Object.getPrototype() **

```javascript
	let arr = [1,2,3];
	arr.concat(123);
	//上面代码是可以执行成功的， 但是arr中并没有concat这个方法，这里其实就是调用了 arr.__proto__中的方法。
```

##### 没有原型的对象

 ```javascript
	let info = Object.create(null, {name: {value: 12}});
	//Object.create方法第一个参数未他的原型，传入null, 那么这个info对象就没有原型。
 ```

##### 优先级问题

```javascript
	//当我们访问对象的属性或者方法的时候，会采取就近原则，也就是当对象本身有的时候会直接调用对象自身的方法或属性，
	//当对象没有的时候，才会顺着原型链接着查找，直到找到该方法或者为null
	let info = {
        name: 123,
        showInfo(){
            console.log(this.name, "item")
        }
    };
	info.__proto__.showInfo = function(){
        console.log(this.name, "__proto__");
    }
	//当我们调用 info.showInfo() 的时候  会直接调用info的方法，当info中没有的时候，会顺着原型链继续向上查找。
```

##### 函数拥有多个"长辈"

```javascript
	//函数同时拥有 prototype 与 __proto__
	//prototype 是作为构造函数
	//__proto__ 作为对象时
	function User(){};
	User.prototype.show = function(){console.log("prototype")}
	let jack = new User();
	jack.show();		// prototype
	jack.__proto__ == User.prototype   // true
```

![](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210316110153948.png)

当我们使用构造函数创建一个对象时   系统会默认给对象指定一个原型，也就是构造函数的 **prototype**，所以我们往User.prototype中增加属性/方法的时候，jack也可以访问到。 当我们把User普通对象使用时查找时会找他的\_\_ptoto\_\_;

##### 链路关系

```javascript
	//当我们创建一个对象的时候  
	let info = new Object();
	info.name = "jack";
	info.prototype.showName = function(){console.log("Object prototype")};	
```

他们之间的关系如下

![image-20210316111219876](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210316111219876.png)

我们发现 User.prototype.\__proto__	== Object.prototype ;

​				User.\__proto__. \__proto__  == Object.prototype;

也就是他们之间的关系是这样的

![](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210316111806710.png)

所以按照原型链的查找顺序，我们通过User构造出来的jack  也可以调用Object.prototype上的方法。

​												 当我们用把User当作对象来使用的时候，也可以通过 \__proto__ 找到Object.prototype上的方法进行使用。

##### 自定义对象原型

```javascript
	let mike = { name: "mike"};
	let parent = { name: "parent" };
	Object.setPrototypeOf(mike, parent);
	//我们可以通过API来改变对象的原型  这样 mike的原型就变成了 parent;
	//我们也可以通过 __proto__ 访问到 parent内部的方法
```

##### 原型中的 constructor

```javascript
	function User(){}
	//user.prototype中含有一个属性  constructor, 指向他的构造函数，
	//当我们使用User构建出的对象 
	var jack = new User();
	// 我们可以通过 jack.__proto__.constructor 找到构造函数 也就是 User'
	jack.__proto__.constructor == User  //true
	var mike = new jack.__proto__.constructor();	
	//也可以直接赋值给User.proto 一个对象，但是要记住改变prototype之后要加上constructor
	User.prototype = {
        constructor: User,	//添加 constructor
        show(){
            console.log(1)
        }
    }
```

##### 借用对象寻找构造函数

```javascript
	function User(name){
        this.name = name;
        this.say = function(){
            console.log(this.name);
        }
    }
	let jack = new User("jack");
	function createByObject(obj, ...args){
        const constructor = Object.getPrototypeOf(obj).constructor;		//根据原型链向上查找构造函数
        return new constructor(...args);
    }
	let mike = createByObject(jack, "mike");
	mike.say();			//同样可以 
```

##### 原型的检测 instanceof

​		instanceof 用于检测构造函数的 prototype 属性是否在某个对象的原型链上

```javascript
	function User(){}
	var jack = new User();
	jack instanceof User;	
```

##### 原型的检测 isPrototypeOf（）

​		isPrototypeOf ( ) 检测一个对象是否在另一个对象的原型链上

```javascript
	var a = {};
    var b = {};
	Object.setPrototypeOf(a,b);
	b.isPrototypeOf(a);			// b 在 a 对象的原型链上； 	true;
```

##### 属性的检测 in /  hasOwnProperty()

```javascript
	var info = {name: "jack"};
	var obj = {age: 12};
	Object.setPrototypeOf(info, obj);	// 把obj设置为info的原型
	console.log("age" in info)		//true,	in  不光会检测当前对象，还会检测当前对象的原型链。
//	===========================================================================
	info.hasOwnProperty("age");			//false    hasOwnProperty() 只会检测当前对象。
```

##### 使用call apply 借用原型

```javascript
	var info: {
        data: [1,22,45,12,23]
    }
	Object.setPrototypeOf(info, {
        max(){
            return this.data.sort((a,b) => b - a)[0];	
        }
    })			//给info设置一个原型
	info.max();				//45 	info没有max方法，借用原型上的方法
	
	var grage = {
        socre: {
            js: 22, html: 33, node: 90
        }
    	get data(){
            return Object.values(this.socre);
        }
    }
    info.max.call(grage);		
//	============================
	//可以直接借用 Math.max()方法
	Math.max.apply(info.data);		
    //call(this, arg, arg1, arg2, ...)   apply(this, [arg, arg1, arg2, ...]) 
```

##### 合理使用构造函数方法声明

```javascript
	function User(name){
        this.name = name;
        this.say = function(){
            console.log(this.name);
        }
    }

	var jack = new User("jack");
	var mike = new User("mike");
	//================================== 多余的say方法可以直接放进原型链中
	function User(name){
        this.name = name;
    }
	User.prototype.say = function(){console.log(this.name)};
	//或者直接重写  User.prototype 对象
	User.prototype = {
        constructor: User,			//重写时加入constructor
        say(){
            console.log(this.name);
        },
        hello(){
            console.log(this.hello);
        }
    }
```

##### 原型链继承

```javascript
	function User(){
    }
	var jack = new User();
	function Admin(){
    }
	//将mike的原型的__proto__ 指向jack的 prototype
	mike.prototype.__proto__ = jack.prototype;			
	//或者调用Object.create() 创建一个原型是 User.prototype的对象
	let obj = Object.create(User.prototype);
	Admin.prototype = obj;
	//也就是 
	Admin.prototype = Obj.create(User.prototype);
	Object.defineProperty(Admin.prototype, "constructor",{
        value: Admin,
        enumerable: false,
    })
	var mike = new Admin();
	
```

![](C:\normal-times\blog-pages\docs\.vuepress\public\img\prototype\prototype.png)

![](/img/prototype/prototype.png)

##### 使用父类构造函数初始化属性

```javascript
	function User(name, age){
        this.name = name;
        this.age = age;
    }
	User.prototype.show = function(){
        console.log(this.name, this.age);
    }
	function Admin(arg){
        User.apply(this,arg);	//将通用的name,age放到原型链上，apply传入this以及参数
    }
	Admin.prototype = Object.create(User.prototype);
	function Member(arg){
        Member.apply(this,arg);
    }
	Member.prototype = Object.create(User.prototype);
	let jack = new Admin("jack",12);
	let mike = new Memebr("mike", 18);
	//原型工厂进行封装之后
	function extend(sub,sup){
        sub.prototype = Object.create(sup.prototype);
        Object.defineProperty(sub.prototype, "constructor", {
            value: sub,
            enumerable: false,
        })
    }
	//使用时
	extend(Admin, User);
```

##### 使用对象工厂派生对象并实现继承

```javascript
	function User(name,age){
        this.name = name;
        this.age = age;
    };
	User.prototype.show = function(){
        console.log(this.name,this.age);
    }
	//创建一个对象  并通过对象进行继承
	function admin(name,age){
        const instance = Object.create(User.prototype);
        instance.call(instance, name, age);
    	return instance;
    }
	var jack = admin("jack", 18);
```

##### mixin实现多继承

```javascript
	function extend(sub,sup){
        sub.prototype = Object.create(sup.prototype);
        Object.defineProperty(sub.prototype, "constructor", {
            value: sub,
            enumerable: false,
        })
    }	
	function User(name, age){
        this.name = name;
        this.age = age
    }
	User.prototype.say = function(){
        console.log(this.name, this.age);
    }
	function Admin(name, age){
        User.call(this, name, age);
    }
	extend(Admin, User);	//Admin 继承 User 完成
	//把其他的方法放入对象里
	const showInfo = {
        showInfo(){
            console.log("info");
        }
        //...
    }
    const showAdress = {
        showAdress(){
            console.log("adress");
        }
        //...
    }
	//将想要继承的对象拷贝到Admin.prototype上
    Admin.prototype = Object.assin(Admin.prototype, showInfo, showAdress);
	var jack = new Admin("jack", 18);
	jack.showAdress();
	jack.showInfo();
//==========================================
	//也可以使用super 实现对象内部继承
	const Adress = {
        showAdress(){
            return "adress";
        }
    }
    const Info  = {
        __proto__: Adress,
        showInfo(){
            console.log(super.showAdress() + "info")
        }
    }

```

