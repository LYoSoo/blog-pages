### *Promise*

#### 手动返回

```javascript
	new Promise((reslove, reject) => {
        reslove("成功了");
    }).then(
    	res => {
            //这里面我们除了可以返回 new Promise 还可以返回一个对象内包含
            // then 方法， 这样也会被包成一个Promise
            //==================================
            return {
                then(result, reason){
                    reason("这是返回的then方法中的 rej")
                }
            }
            //==================================
            //或者
            return class{
                static then(result, reason){
                    reason("这是calss方式返回的reason")
                }
            }
            //==================================
        },
        rej => {
            console.log(rej);
        }
	//	这里继续.then接收结果。
    ).then(result => console.log(result),
           reason => console.log(reason)
          )

```

#### 错误处理

```javascript
	new Promise((reslove, reject) => {
        reject("失败了");
        //reject的时候， .then中的 rea 可以接收到。
        //throw new Error() 的时候，  .then中的rea 也可以接收到。
        //程序本身报错 	.then中的 rea 也可以接收到。
        //相当于函数内部自带了一个 try{}catch(e){}, 当捕捉到异常的时候，系统会reject出去错误。
        try{
            console.log(1111)
        } catch(error){
            reject(error);
        }
    }).then(
        res => {
        	console.log("成功了" + res)
   			},
    	rea => {
            console.log("失败了", + rea)
        }       
    ).catch(
    	err => console.log(err)
    )
	//或者在末尾增加一个 .catch() 方法。  接收所有的错误。 


	//在末尾， 执行完后一定会执行。	常用于清理loading动画 
	.finally()
```

#### Promise.all

```javascript
	// 第一种情况， Promise.all 的数组中的Promise 后面没有.catch()。
	let p1 = new Promise((reslove, reject) => {
        setTimeout(() => {
			reslove("第一个成功了")
        },1000)
    })
    let p2 = new Promise((reslove, reject) => {
        setTimeout(() => {
            reslove("第二个成功了")
        },1000)
    })
    Promise.all([p1, p2]).then(result => {
        cosnole.log(result);	
        // result   ["第一个成功了", "第二个成功了"]
    }).catch(
    	err => console.log(err);		// error info;
    )
	//如果Promise.all数组中的Promise没有.catch() 如果发生了报错，
	//需要在Promise.all 的末尾加 .catch() 捕获异常。
		
	//第二种情况，Promise.all 的数组中的Promise 后面每个都加了 catch()。
	// 现在如果有一个发生了错误，并不会影响Promise.all 的结果返回。

	let p1 = new Promise((reslove, reject) => {
        setTimeout(() => {
			reslove("第一个成功了")
        },1000)
    }).catch( err => err);
    let p2 = new Promise((reslove, reject) => {
        setTimeout(() => {
            reject("第二个成功了")		//这里报了一个reject
        },1000)
    }).catch( err => err);
    Promise.all([p1, p2]).then(result => {
        cosnole.log(result);	
        // result ["第一个成功了", undefined]
    }).catch(
    	err => console.log(err);		// error info;
    )
```

#### Promise 队列效果

```javascript
	let promise = Promise.resolve("jack");
	promise = promise.then(v => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 1000)
        })
    })
	promise.then( res => {
        //上面的 then 处理的是 return new promise的结果，
        // 所以必须要等待上面的resolve 之后才可以进行
        console.log(res);
    })
	

	//封装成队列效果   依次输出数字
	function queue(arr){
        let promise = Promise.resolve();
        arr.map(item => {
            console.log(1)
            promise = promise.then(_ => {
                return new Promise(resolve => {
                      setTimeout(() => {
                    	console.log(item);
                		reslove();
              		} ,1000 )
                })
            })
        })
    }	
	queue([1,2,3,4,5])

	// 用 reduce 封装
	function queue2(arr){
        arr.reduce((promise, n) => {
            return promise.then(resolve => {
                return new Promise(resolve => {
                setTimeout(() => {
    					console.log(n);
                    	resolve()
	                }, 1000)
                })
            }) 
        } ,Promise.resolve())
    }
```

#### async await 并行处理

```javascript
	let p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(111)
        }, 2000)
    })
    let p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(222)
        }, 2000)
    })
    
    async function all(){
        let res1 = p1();
        let res2 = p2();
        let result1 = await res1;
        let result2 = await res2;
    	//或者
        let res = await Promise.all([p1, p2]);
        console.log(res)
    }
```

