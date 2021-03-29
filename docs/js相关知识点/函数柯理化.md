#### 函数柯里化

​		定义： 柯里化是一种将**使用多个参数的一个函数转换成一系列使用一个参数的函数**的技术。

```javascript
	function add(a, b){
        return a + b;
    }
	add(1, 2);	//3
	//假设我们有一个柯里化的函数，并且我们已经对add进行了转换。
	var addCurry = curry(add);	
	addCurry(1)(2);			//3	
```

##### 简易版 Curry

```javascript
	const curry = function(fn){
        //这里借用数组的slice方法， Array.prototype.slice.call(arguments, 1);
        var args = [].slice.call(arguments, 1);
   		return function(){
            var newArgs = args.concat([].slice.call(arguments));
            return fn.call(this, newArgs);
        }
    }
    //当我们使用的时候
    function add(a, b){
        return a + b;
    }
	var addCurry = curry(add, 1, 2);
	addCurry();		//3
	var addCurry1 = curry(add, 1);
	addCurry(2);	//3;
	var addCurry2 = curry(add);
	addCurry(1, 2);	//3;
```

#### 完整版 Curry

```javascript
	function curry(fn, args){
        //获取fn函数的参数个数
        var length = fn.length;
        args = args || [];
        return function(){
            var _args = args.slice(0),
                arg,
                i;
            for(i= 0; i< arguments.length; i++){
                arg = arguments[i];
                _arg.push(arg);
            }
            if(_arg.length < length){
				return curry.call(this, fn, _args);
            }else{
                return fn.apply(this, _args);
            }
        }
    }
```

