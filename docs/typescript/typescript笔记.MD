<!--
 * @Date: 2020-08-10 16:56:43
 * @Author: LYoSoo
 * @LastEditors: LYoSoo
 * @LastEditTime: 2020-08-11 18:17:38
-->
## Typescript

### 基础类型

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
	
```

