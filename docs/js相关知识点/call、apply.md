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