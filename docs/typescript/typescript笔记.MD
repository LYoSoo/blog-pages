<!--
 * @Date: 2020-08-10 16:56:43
 * @Author: LYoSoo
 * @LastEditors: LYoSoo
 * @LastEditTime: 2020-08-12 17:10:45
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


#### 只读属性

```typescript
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
	let c = getCOnfig();
	c(10);
	c.reset();
	c.interval;
```

