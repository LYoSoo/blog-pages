<!--
 * @Date: 2020-08-10 16:56:43
 * @Author: LYoSoo
 * @LastEditors: LYoSoo
 * @LastEditTime: 2020-08-31 17:06:57
-->
## Typescript

### 一、基础类型

```typescript
	//布尔类型
	let isDone: boolean = true;
	//数字类型  还支持16进制
	let number1: number = 1;
	let number2: number = 0b1031;
	//字符串类型	和js一样 可以拼接
	let name: string = "jack";
	let nameString: string = `my name is ${jack}`;
	//数组类型， 有两种方式声明数组
		//第一种
		let list1: number[] = [1,2,3];
		//第二种		数组泛型， Array<元素类型>。
		let list2: Array<number> = [1,2,3];
		//两种方式声明的数组都需要遵循定义的元素类型。
	//元组 Tuple
	//元祖类型允许表示一个已知元素的数量和类型的数组， 数组内的类型可以不同.
	let x: [string, number];
	x = ["jack", 18];   //元祖内的类型必须相对应，不然会报错
	//  	x = [18, "jack"]   就会报错。
	
	// 枚举类型			声明
	enum Color{ Green, Red, Blue};
	//使用枚举类型
	let colorName: Color = Color.Red;
	let colorName2: string = Color[2];
	// 也可以手动对枚举类型进行赋值  之后直接访问对应的序号，也可以访问到到
	enum Color2 { Green = 1, Red = 3, Blue = 4};
	
	//any	不确定类型  可以给数组，数组内元素可以多种类型
	let list3: Array<any> = [1, "jack", true];
	let list4: any[] = [1, "jack", true];
	list3[1] = true;		//后续给数组赋值也可以赋之前不同类型的 
	
	// void	表示没有任何类型， 当一个函数没有返回值的时候，可以赋予 void类型
	function voidFn() : void {
		console.log(1);
	}
	// 为一个变量声明 void 类型没有实际意义，他只能被赋予 undefined 和 null
	let voidVar: void = undefined;
	let voidVar: void = null;

	// null 和 undefined
	// 默认情况下  null 和 undefined 是所有类型的子集，可以把null 和 undefined 赋给其他的类型
	// 当我们指定了  --strictNullChecks 的时候，null 与 undefined 只能赋值给 void 和 各自
	
	// object,    object表示的是非原始类型，除了 number string boolean symbol null undefined 之外的类型，
	declare function create(o: object || null): void;
	create({props: 0});			// true
	create(null);				// true
	// create(true)  create("str") create(2)    false;

	//类型断言		通过类型断言告诉编译器， 我知道自己在干什么 没有运行时的影响，只在编译时起作用
	//第一种方式   尖括号语法。
	let someValue: any = "is a string";
	let strLength: number = (<string>someValue).length;
	//第二种方式   as 语法
	let someValue2: any = "is a string";
	let strLength2: number = (someValue as string).length;
	// 在ts中 使用jsx 时，只有 as 语法是被允许的。
```

### 二、变量声明
>	涉及var、 let、 const 声明变量关键字,变量提升、作用域、 闭包、 解构赋值等等。不在记录

### 三、接口
> typescript的核心原则之一就是对值所具有的结构进行类型检查

```typescript
	function printLabel(labelObj: {label: string}): void{
		console.log(labelObj.label);
	}
	let myObj = { name: "jack"; label: "i am a label" };
	printLabel(myObj);
	//类型检查器会检查 printLabel 的调用，printLabel有一个参数，并且要求该对象参数必须含有一个名为label类型为 string的属性
	// 默认typescript只会检查必须的属性是否存在，而且不会关心属性的顺序。
	// 用接口类型来描述

	interface myObj2 { name: "jack"; label: "i am a label"};
	function printLabel2(labelObj: myObj2): void{
		console.log(labelObj.label);
	}
	printLabel2(myObj2);
	// myObj2 就相当于一个名字，用来描述上面的例子里面的要求。
```
#### 可选属性
>	我们在设计接口的时候，可能有一些属性并不是必要的，有一些属性可能在某种情况下才存在，这时我们可以设置为可选属性。
```typescript	
	interface myConfig {
		name?: string;
		adress?: string;
	}
	function setConfig( config: myconfig ): {color: string; area: string} {
		let defaultConfig = { color: "red", area: "right" };
		if(!!config.name){
			defaultConfig.color = config.name;
		}
		if(!!config.area){
			defaultConfig.name = config.adress;
		}
		return defaultConfig;
	}
	let hadSetConfig = setConfig({ name: "nameStr" });
	```
```


#### 只读属性

​```typescript
interface Point {
		readonly x: number;
		readonly y: number;
	}
	let p1: Point = {x: 12, y: 24};
	p1.x = 24;		//error;
	
	//typescript 有 readonlyArray<T> 类型 与 Array<T> 类似，只不过不可以修改数组内元素
	let arr: number[] = [1,2,3,4];
	let readonlyArr: readonlyArray<number> = arr;
	// readonlyArr 的赋值操作，修改操作等等可以导致数组变化的操作都会报错
	readonlyArr[0] = 12; 	//error
	readonlyArr.length = 12 //error

	// 唯一可以改变的就是类型断言对其进行重写
	let c = readonlyArr as Array<number>;

	//当我们把其作为变量使用的时候 使用const  当我们想要把他当作属性的时候用 readonly
	//索引签名		这表示config里面可以拥有任意数量的属性，并且只要不是width 与 name 无需管他是什么类型。
	interface config {
		width: number;
		name: string;
		[propName: string]: any;
	}
```



#### 函数类型
>	为了表示接口的函数类型，我们需要给接口定义一个调用签名。   相当于一个只包含参数列表和返回值类型的函数定义，参数列表的每个参数都需要类型和名字
```typescript
	interface searchFn {
		(source: string, name: string): boolean;
	}
	let mySearch: searchFn;
	mySearch = function (source: string, name: string){
		return true;
	}
	//函数的参数名和定义的接口内的名字不需要相同   
```

#### 可索引的类型
>	用来描述那些可以通过索引来获取的类型  如  a[10] person["name"];
```typescript
	interface stringArray {
		[index: number]: string;
	}
	let myArray: stringArray;
	myArray = ["jack", "tom"];
	let myStr: string = myArray[0];

	//typescript 支持字符串和数字类型的索引签名。   但是数字索引返回值必须是字符串索引返回值类型的子类型，
```

#### 类类型
```typescript
	// implements 就是实现的意思  定义一个接口，之后 用implements去实现。
	interface person{
		name: string;
		age: number;
		setName(nameStr: string);
	}
	class lihua implements person{
		name: string;
		age: number;
		setName(nameStr: string){
			this.name = nameStr;
		}
		constructor(n: string, a: number){ };
	}

```



#### 继承接口

```typescript
	interface config {
        color: string;
    }
	interface info extends config {
        width: string;
    }
	let myInfo = <info>{};
	myInfo.color = "blue";
	myInfo.width = "20cm"
```

> ​	一个接口也可以继承多个接口，创建出多个接口的合成接口。

```typescript
	interface config {
        color: string;
    }
	interface config2{
        width: string;
    }
	interface info extends config, config2 {
        height: string;
    }
	let myInfo = <info>{};
	myInfo.color = "red";
	myInfo.width = "20cm";
	myInfo.height = "30cm";
```



#### 混合类型

指的是一个对象可以同时作为函数和对象使用，并带有额外的属性。

```typescript
	interface Config {
        (start: number): string;
		interval: number;
		reset(): void;
    }
    function getConfig(): Config{
        let config = <Config>function (start: number){};
        config.interval = 123;
        config.reset = function (){};
        return config;
    }
	let c = getConfig();
	c(10);
	c.reset();
	c.interval;
```

#### 接口继承类
	当接口继承了类类型的时候，他会继承类的成员但不会对其实现。就像接口提供了所有类中存在的成员，但是没有提供实现
	接口同样会继承到类中的private和protected成员， 这意味着当你创建一个接口继承一个拥有私有或者被保护的成员的类时，这个接口类型只能被这个类或者子类实现（implement）
```typescript
	class Control {
		private name: string;
	}
	interface getControl extends Control {
		getName(): void;
	}
	class Button extends Control implements getControl {
		getName(){ }
	}
	class Input extends Control;
	class Image implements getControl{ 
		getName(){ } 
	 }		//报错， Image 缺少 name；
	//  getControl 包含了 control 的所有成员，包括私有的name 因为name 是私有成员，所以必须是control的子类才能实现getControl接口
	//  因为只有control的子类才能包含一个声明于control的私有成员  name
```

### 四、类

	之前我们已经接触过类了, 下面是一个类的例子
```typescript
	class Person {
		name: string;
		constructor( yourName: string ){
			this.name = yourName;
		}
		sayHello() {
			return "Hello," + this.name;
		}
	}
	let firstPerson = new Person("jack");	
	//使用new 构建了Person的新实例，他会调用之前的构造函数，创建一个Person类型的新对象，并执行构造函数对其进行初始化。
	firstPerson.sayHello();
```

#### 继承
	在ts中 我们最常用的是面向对象模式，基于类的程序设计最基本的模式时允许使用继承来扩展现有的类
```typescript
	class Animal {
		move(dist: number = 0){
			console.log(`i had moved ${dist} meters`);
		}
	}
	class Dog extends Animal{
		bark(){
			console.log("汪");
		}
	}
	const newDog = new Dog();
	newDog.bark();
	newDog.move(10);
	newDog.bark();
	// Dog 是派生类， 派生自 Animal基类		通常把Dog 这种派生类叫做子类，  Animal这种基类叫做 超类
```

更复杂的继承

```typescript
	class Animal{
        name: string;
        constructor(theName: string){
            this.name = theName;
        }
        move(dist: number = 0){
            console.log(`${this.name} moved ${dist} m`);
        }
    }
	class Snake extends Animal{
        constructor(name: string){
            super(name);
        }
        move(distMeter = 5){
            super.move(distMeter);
        }
    }
	class Horse extends Animal{
        constructor(name: string){
            super(name);
        }
        move(distMeter = 20){
            super.move(distMeter)
        }
    }
```



#### 公有、私有、受保护的修饰符



默认为 `public`， 在定义的时候未修饰，均为`public`， 我们也可以主动添加 `public`。

```typescript
	class Animal {
        public name: string;
        public constructor(theName: string){
            this.name = theName;
        }
        public sayHello(){
            console.log(`i am ${this.name}`);
        }
    }
```

##### private

当成员被标记为`private` 的时候，他就不能在他声明类的外部访问。

```typescript
	class Animal {
        private name: string;
        constructor(theName: string){
            this.name = theName;
        }
    }
	new Animal("jack").name 	//error  'name'是私有变量
```



当我们比较带有 `private` 和 `protected` 的成员类型的时候，如果其中一个类型包含 `private` 成员，那么只有另一个类型也存在这样一个 `private`成员，并且他俩来自同一处声明的时候，我们才认为他俩是兼容的， `protected` 也适用与这一规则。

```typescript
	class Animal {
        private name: string;
        constructor(theName: string){
            this.name = theName;
        }
    }
	class Horse extends Animal{
        constructor(){
            super("horse");
        }
    }
	class People {
        private name: string;
        constructor(theName: string){
            this.name = theName;
        }
    }
	
	let animal = new Animal("anim");
	let horse = new Horse();
	let people = new People("prople");
	animal = horse; 		// true;
	animal = new People("jack")		// error Animal与People 不兼容
```



#### protected

`protected` 与 `private` 类似， 但是 `protected` 在派生类中依然可以访问。

```typescript
	class People {
        protected name: string;
        constructor(theName: string){
            this.name = theName;
        }
    }
	class Jack extends People{
        private age: number;
        constructor(theName: string,theAge: string){
            super(name);
            this.age = theAge;
        }
        public sayHello(){
            console.log(`i am ${this.name} and ${this.age}`);
        }
    }
	let jack2 = new Jack("jack", 18);
	jack2.sayHello();
	jack2.name;			//error;
```

##### readonly修饰符

```typescript
	class Animal{
        readonly name: string;
        readonly age: number = 18;
        constructor(theName: string){
            this.name = theName;
        }
    }
	let horse = new Animal("i am a horse");
	hores.name = "jack";		//error  name是只读的；
```
##### 静态属性

静态属性是指那些存在类的本身而不是类的实例上，当每个实例想要访问类的静态属性时，需要在前面加上类的名字
```typescript
	class Animal{
		static names = "jack";
		getName() {
			console.log(Animal.names);
		}
	}
	let horse = new Animal();
	horse.getName();

```

#### 抽象类 abstract
>	抽象类作为其他派生类的基类使用，一般不会直接被实例化，抽象类可以包含成员的实现细节。
```typescript
	abstract class Animal {
		abstract sayHello(): void;
		move(): void {
			console.log("moved");
		}
	}
```
抽象类的方法不包含具体的实现，而且必须在派生类中实现。
```typescript
	abstract class Animal{
		constructor(name: string){

		}
		abstract sayHello(): void;
		consoleName(): void{
			console.log(this.name);
		}
	}
	class Horse extends Animal {
		constructor(){
			super("horesName");
		}
		sayHello(): void{
			console.log("hello");
		}
		sayGoodbye(): void{
			console.log("goodBye");
		} 
	}

	let animal: Animal;		//允许创建一个对抽象类型的引用。
	animal = new Animal();		// 错误，不能创建一个抽象类的实例。
	animal = new Hores();		//可以对抽象子类进行实例化和赋值。
	animal.consoleName();
	animal.sayHello();
	animal.sayGoodbye();		//错误，方法声明在抽象类中不存在。

```

### 五、函数
>	和JavaScript一样，在typescript中你可以创建有名字的函数和匿名函数.
```JavaScript
	function add(x,y){
		return x + y;
	}
	let myAdd = function(x, y){
		return x + y;
	}
	// 上面这两种方式是在js中很常见的函数。
```
在 ts 中的函数
```typescript
	function add(x: number, y: number): number{
		return x + y;
	}
	let myAdd = function (x: number, y: number): number {
		return x + y;
	}
	//为 myAdd 书写完整的函数类型
	let myAdd: (x: number, y: number) => number = function (x: number, y: number): number{
		return x + y;
	}

```
在ts中 每个函数的参数都是必须的，并且相对应.
```typescript
	function consoleName(firstName: string, lastName: string){
		console.log(firstName + lastName);
	}
	consoleName("lv");	//error
	consoleName("lv", "hong", "tao") //error;
	consoleName("lv", "hongtao")	// 正确;
	
	//可选参数  参数类型前面 ?: 表示该参数为可选参数，就是可传可不传。不传递的时候，默认为undefined
	function getName(firstName: string, lastName?: string){
		console.log(firstName + lastName)
	}
	getName("lv");
	getName("lv", "hongtao");
	getName("lv", "hong", "tao");	//errror;	不可超出参数个数。
	
	//同时我们也可以为可选参数设置默认值。 当可选参数未传递进来值时，该参数为默认值，传递进来时为传递的值。
	function getName2(firstName: string, lastName = "hongtao"){
		console.log(firstName + lastName);
	}
```

##### 剩余参数
> 	当你不确定要有多少参数传进来，可以用剩余参数来表示
```typescript
	function person (firstName: string, ...restName: string[]){
		return firstName + " " + restName.join(" ");
	}
	let jack = person("first", "second", "third");
```


### 六、泛型
```typescript
	//当我们不使用泛型的时候，函数是这样的
	function consoleInfo(name: string): string{
		return name;
	}
	//或者我们给变量赋予any类型
	function consoleInfo2(name: any): any {
		return name;
	}
```
	这样就存在一个问题，当我们使用any类型的时候，上述函数可以接受任意类型的参数，这样丢失了一些信息，传入参数与返回参数应该是相等的
	因此，我们需要一种方法使传入参数和返回的参数相同，也就是类型变量
```typescript
	function consoleName<T>(name: T): T {
		return name;
	}
	//这个函数就叫做泛型，可以适用多种变量类型。
	let jack = consoleName<string>("myName");
	let tom = consoleName("name");
	//上面两种方法都是可以的，第一种我们明确了 T 就是string类型
	//第二种方法我们利用了类型推论，也就是编译器会根据传入的参数自动确定参数 T 的类型。
	function arrayT<T> (arr: T[]): T[]{
		return arr;
	}
	//或者下面这种方法
	function arrayT2 <T> (arr: Array<T>): Array<T>{
		return arr;
	}
```

##### 泛型类型
>	泛型函数类型与非泛型函数类型没什么区别, 只不过在前面多一个类型声明
```typescript
	function person<T>(name: T): T {
		return name;
	}
	let jack: <T>(name: T) => T = person;
	//我们可以使用不同的泛型参数名， 只要能够对应上即可
	let tom: <Y>(name: Y) => Y = person;
```
##### 泛型接口
```typescript
	interface PersonInter{
		<T>(name: T): T;
	}
	function person<T>(name: T): T{
		return name;
	}
	let name: PersonInter = person;

	//我们也可以把泛型参数当作整个接口的参数，这样我们在使用时可以很清楚的知道他们的类型
	interface AnimalInter<T>{
		(name: T): T;
	}
	function animal<T>(name: T): T {
		return name;
	}
	let horse: AnimalInter<string> = animal;
```

##### 泛型类
```typescript
	class Animal<T> {
		age: T;
		add(x: T, y: T) => T;
	}
	let horse = new Animal<number>();
	horse.age = 18;
	horse.add = function(x, y){return x + y};
```

##### 泛型约束
```typescript
	function lengFn<T>(len: T): T {
		console.log(len.length);		//error T dont have .length
		return len;
	}
	//可以看出 T 并不是每种类型都有 .length 属性
	// 但我们可以人为设定一个约束
	interface LengthWise{
		length: number;
	}
	function lengFn2<T extends LengthWise>(name: T): T{
		console.log(name.length);
		return name;
	}
	//这样我们就完成了对泛型的约束，但是同样的，他也变得不在适用于所有的类型
	lengFn2(3);		//error
	lengFn2({length: 12});
	lengFn2([]);
	lengFn2("");
```

### 七、枚举
之前已经用到过枚举,我们来看一个简单的数字枚举
```typescript
	enum Type{
		Up,
		Down,
		Left,
		Right
	}
	// 或者我们可以给枚举值赋值
	enum Type1{
		Up = 1,
		Down,	//2
		Left,	//3
		Right, //4
	}
	//应用枚举
	function move(dist: number, dirc: Type1){

	}
	move(12, Type1.Down);	
```
字符串枚举
```typescript
	enum Type{
		Up = "up",
		Down = "down",
		Left = "left",
		Right = "Right
        
	}
	//在字符串枚举中，每一个变量都必须进行初始化
```

反向映射

```typescript
	enum Type{
        A
    }
	let a = Type.A;
	let name = Type[a];		// name = A;
```

