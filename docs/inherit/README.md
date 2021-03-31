#### 1. 原型链继承

​		改变子类的原型指向。

```javascript
	function Parent(){
        this.name = "jack";
    }
	Parent.prototype.getName = function(){
        console.log(this.name);
    }
	function Child(){};
	Child.prototype = new Parent();
	var mike = new Child();
	mike.getName();			//jack

```

`问题`

​		1. 引用类型的属性会被所有实例共享

```javascript
	function Parent(){
        this.grades = [23,55,12];
    }
	function Child(){};
	Child.prototype = new Parent();
	var mike = new Child();
	var jack = new Child();
	mike.grades.push(444);
	console.log(mike.grades)  //[23,55,12,444];
	console.log(jack.grades)  //[23,55,12,444];			所有实例的访问的都是同一个属性。
```

![继承](http://175.24.187.2:12345/inherit/inherit1.png)

​		2. 创建Child实例时，不能向 Parent 传参。

#### 2. 借用构造函数继承（经典继承）

​		在子类的构造函数中，通过 **call( this, arg, arg1, ... ) / apply(this, [arg, arg1, arg2 , ...])** 调用父类构造函数，实现继承。

```javascript
	function Admin(name, age){
        this.name = name;
        this.age = age;
    }
	//首先简单介绍一下 new Admin() 时  会发生什么。
	function Admin(name, age){
        let this = {}		//隐式创建一个this的空对象。
        this.name = name;
        this.age = age;		//相当于对this对象进行赋值
        return this;		//默认返回 this 对象。
        //在最后我们可以选择手动return  但是return 的必须是对象格式，否则无效。
    }
	///分界线===========================================
	function Parent(){
        this.grages = [22, 55, 12];
    }
	function Child(){
        Parent.call(this);
    }
	var jack = new Child();
	var mike = new Child();
	jack.grades.push(444);
	console.log(jack.grades)		//[22, 55, 12, 444];
	console.log(mike.grades) 		//[22, 55, 12];

```

​		**特点**

   				1.  解决了原型链继承的共享属性的问题。
            				2.  可以传递参数。

​      **缺点**

1.  方法都在构造函数中，每次创建实例都会创建一遍方法。 资源浪费。



#### 3 组合继承（原型链继承 + 经典继承）

```javascript
	function Parent(name){
        this.name = name;
        this.grades = [22, 55, 12];
    }
	Parent.prototype.getName = function(){
        console.log(this.name);
    }
	
	function Child(name, age){
        Parent.call(this, name);
        this.age = age;
    }
	Child.prototype = new Parent();
	Obejct.defineProperty(Child.prototype, "constructor", {
        value: Child,
        enumerable: false,
    })	
//  设置Child.prototype.constructor 的指向为  Child   并且不可枚举
	var jack = new Child("jack", 19);
	var mike = new Child("mike", 22);
	jack.getName()			//	jack
	jack.grades.push(444);
	jack.grades				//	[22,55,12,444];
	
	mike.grades 			//  [22,55,12]		未被改变。
	mike.getName();			//  mike

```

​        **优点**

1.  融合原型链继承和经典继承的优点， 是JavaScript 常用的继承方式。



#### 4 原型式继承

​		适用范围很小，适合不需要单独创建构造函数，但仍需要在对象间共享信息的场合。

​		**注意： 这种方式和原型链继承很像，都是会共享信息的** 

```javascript
	let parent = {
        name: "joun",
        colors: ["red", "green"],
    }
	//相当于把  parent 对象当作child的原型
    var child = Object.create(parent);
	child.name    // joun;
	child.colors  // ["red", "green"];
    

```

#### 5 寄生式继承

​		创建一个实现继承的函数，以某种方式增加这个函数（增加方法...）， 然后返回这个对象。

```javascript
	function extend(obj){
        let objClone = Object.create(obj);
        objClone.sayHello = function(){
            console.log("sayhello");
        }
        return objClone;
    }
	let info = {
        name: "jack",
        age: 20,
    }
    let jack = extend(info);
	jack.sayHello();
```

​         **缺点**

​		1.	和借用构造函数一样，每次都会创建一遍方法。

#### 6  寄生式组合继承

​		组合继承最大的效率问题是父类的构造函数始终会被调用两次。

```javascript
	//组合继承代码
	function Parent(name){
        this.name = name;
        this.grades = [22,33,11];
    }
	Parent.prototype.sayName = function(){
        console.log(this.name);
    }
	function Child(name,age){
        Parent.call(this, name);		//第二次调用Parent
        this.age = age;
    }
	Child.prototype = new Parent();		//第一次调用Parent
	Object.defineProperty(Child.prototype, "constructor", {
        value: Child,
        enumerable: false,
    });
	var jack = new Child("jack", 18);
```

![image-20210317212446208](http://175.24.187.2:12345/inherit/inherit2.png)

由于两次 调用 Parent 函数导致产生了2组 "name" , "color";

​		**Child.prototype = new Parent()  这里， 把Child的原型变成Parent的实例这一步也可以换种方式完成**

​		**Child.prototype = Object.create(Parent.ptototype)**

```javascript
	function Parent(name){
        this.name = name;
        this.grades = [22,33,11];
    }
	Parent.prototype.sayName = function(){
        console.log(this.name);
    }
	function Child(name,age){
        Parent.call(this, name);		//调用一次Parent
        this.age = age;
    }
	Child.prototype = Object.create(Parent.prototype);	
	Object.defineProperty(Child.prototype, "constructor", {
        value: Child,
        enumerable: false,
    });
	var jack = new Child("jack", 18);
```

#### mixin 实现多继承

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

