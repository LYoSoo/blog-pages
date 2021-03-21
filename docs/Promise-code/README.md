### *Promise* 源码实现步骤

这边会一步一步来实现 Promise源码， 每一部分的代码都是依次增加的，完整的代码在最后面。

```javascript 
	// 正常Promise调用方式  new Promise((resolve, reject) => {resolve()})
	// 用类的方式来实现  	
	class Proself {
    // 先定义三个状态 pending fulfilled rejected 
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";
    //可以看到创建实例时 传入一个参数这里叫做执行者 执行者内部两个函数，  一个resolve， reject;
    constructor(executor) {
        //设置默认值。
        this.status = Proself.PENDING;
        this.value = "";
        //这里需要绑定 this 
        executor(this.resolve.bind(this), this.reject.bind(this));
    }
    resolve(value) {
        this.status = Proself.FULFILLED;
        this.value = value;
    }
    reject(value) {
        this.status = Proself.REJECTED;
        this.value = value
    }
}

```

​		到上面为止，我们简单的声明了 Proself ，并且简单的定义了 resolve , reject  函数， 调用resolve reject 时状态也可以改变，但现在状态改变后仍然可变，所以接下来要进行状态的控制以及捕获错误的方法。

```javascript
	// 正常Promise调用方式  new Promise((resolve, reject) => {resolve()})
    // 用类的方式来实现  	
    class Proself {
        // 先定义三个状态 pending fulfilled rejected 
        static PENDING = "pending";
        static FULFILLED = "fulfilled";
        static REJECTED = "rejected";
        //可以看到创建实例时 传入一个参数这里叫做执行者 执行者内部两个函数，  一个resolve， reject;
        constructor(executor) {
            //设置默认值。
            this.status = Proself.PENDING;
            this.value = "";
            //这里需要绑定 this 
            // 在上一篇文章中说了 Promise内部有一个try catch 这样当我们内部报错的时候 直接reject 错误信息。
            try {
                executor(this.resolve.bind(this), this.reject.bind(this));
            } catch (error) {
                this.reject(error)
            }
        }
        resolve(value) {
            // Promise 当状态改变之后，不可以在继续改变， 所以只有当状态为 PENDING的时候才可以改变状态。
            if (this.status === Proself.PENDING) {
                this.status = Proself.FULFILLED;
                this.value = value;
            }
        }
        reject(value) {
            //  reject 也同理，只有当PENDING的时候可以改变。
            if (this.status === Proself.PENDING) {
                this.status = Proself.REJECTED;
                this.value = value
            }
        }
    }
	
```

上面我们完成了Promise 的状态管理，以及增加了 try catch 保证我们能在Proself 内部发生错误时能够reject 出去。

下面我们接着实现 Promise 的 then 方法。Promise.then 是异步的。

```javascript
    // 正常Promise调用方式  new Promise((resolve, reject) => {resolve()})
    // 用类的方式来实现  	
    class Proself {
        // 先定义三个状态 pending fulfilled rejected 
        static PENDING = "pending";
        static FULFILLED = "fulfilled";
        static REJECTED = "rejected";
        //可以看到创建实例时 传入一个参数这里叫做执行者 执行者内部两个函数，  一个resolve， reject;
        constructor(executor) {
            //设置默认值。
            this.status = Proself.PENDING;
            this.value = "";
            this.callbacks = [];
            //这里需要绑定 this 
            // 在上一篇文章中说了 Promise内部有一个try catch 这样当我们内部报错的时候 直接reject 错误信息。
            try {
                executor(this.resolve.bind(this), this.reject.bind(this));
            } catch (error) {
                this.reject(error)
            }
        }
        resolve(value) {
            // Promise 当状态改变之后，不可以在继续改变， 所以只有当状态为 PENDING的时候才可以改变状态。
            if (this.status === Proself.PENDING) {
                this.status = Proself.FULFILLED;
                this.value = value;
                //处理延时的情况。
                setTimeout(() => {
                    this.callbacks.map(callback => {
                        callback.onFulfilled(value);
                    })
                });
            }
        }
        reject(reason) {
            //  reject 也同理，只有当PENDING的时候可以改变。
            if (this.status === Proself.PENDING) {
                this.status = Proself.REJECTED;
                this.value = reason
                setTimeout(() => {
                    this.callbacks.map(callback => {
                        callback.onRejected(reason);
                    })
                });
            }
        }
        //then 方法两个函数
        then(onFulfilled, onRejected) {
            //当我们使用then，不传入参数时，简单包装成 function
            if (typeof onFulfilled != "function") {
                onFulfilled = () => { };
            }
            if (typeof onRejected != "function") {
                onRejected = () => { };
            }

            //当我们在Promise内部延时调用resolve 或者 reject 也就是pending状态。 
            if (this.status === Proself.PENDING) {
                //用一个数组接收  onFulfilled, onRejected函数
                // 当定时器结束后，执行了 resolve 或者 reject 函数时，从里面取出来执行。
                this.callbacks.push({
                    onFulfilled: value => {
                        try {
                            onFulfilled(value)
                        } catch (error) {
                            onRejected(error);
                        }
                    },
                    onRejected: value => {
                        try {
                            onRejected(value);
                        } catch (error) {
                            onRejected(error);
                        }
                    },
                })
            }

            // 根据状态来判断返回 resolve 或者是 reject;
            if (this.status === Proself.FULFILLED) {
                // then方法返回的 两个函数也用 try catch包裹，并且OnRejected返回
                // 由于 Promise.then是异步的   所以我们把他放到宏任务队里，实现Promise.then的效果。
                setTimeout(() => {
                    try {
                        onFulfilled(this.value);
                    } catch (error) {
                        onRejected(error)
                    }
                });
            }
            if (this.status === Proself.REJECTED) {
                setTimeout(() => {
                    try {
                        onRejected(this.value);
                    } catch (error) {
                        onRejected(error)
                    }
                });
            }
        }
    }


    var promise = new Proself((resolve, reject) => {
        setTimeout(() => {
            resolve("12312");
            console.log("我在Promise.then之前执行")
        }, 1000);
    })
    console.log("111")
    promise.then(res => console.log(res), err => console.log(err + "err"))
```

​		上面已经完成了then的处理，并且让他也是异步的返回，上面的代码增加了一个 callbacks 数组，目的是当我们在使用的时候，如果resolve 在一秒钟后返回的，我们的then方法已经执行完了，并且没有处理 this.status 为 Pending 的状态，导致了 代码中的resolve 无法返回，这样我们在Pending状态时，将 then 方法里将要执行的 onFulfilled, onRejected 两个函数存在了 callbacks 里面， 并且在 原本的 resolve 和 reject 里面增加了调用callbacks 里面方法， 当一秒后 resolve / reject 的时候，我们调用 then 里面的方法，实现功能。



​		then 是链式调用的 

```javascript
	new Promise((resolve, reject) => {
        resolve("第一个Promise的 resolve")
    }).then(
    	res => {
            return res;
        },
        err => {
            return err;
        }
        //第二个 .then处理的是   上一个Promise的结果， 不管是resolve、reject 
        //都会处理在 第二个 then 的 “resolve” 里面。
    ).then(
    	result => {
            console.log(result);
        },
        error => {
            console.log(error);
        }
    )
	//then的链式调用其实就是返回的时候用 promise包裹
```

​		下面是实现链式调用代码。 并且 当我们穿一个空的  .then().then(res => console.log(res))	是  值会继续传到下一个。所以应该在我们包装空的 typeof onFulfilled !== 'function' 的时候 把值传出去

```javascript
    // 正常Promise调用方式  new Promise((resolve, reject) => {resolve()})
    // 用类的方式来实现  	
    class Proself {
        // 先定义三个状态 pending fulfilled rejected 
        static PENDING = "pending";
        static FULFILLED = "fulfilled";
        static REJECTED = "rejected";
        //可以看到创建实例时 传入一个参数这里叫做执行者 执行者内部两个函数，  一个resolve， reject;
        constructor(executor) {
            //设置默认值。
            this.status = Proself.PENDING;
            this.value = "";
            this.callbacks = [];
            //这里需要绑定 this 
            // 在上一篇文章中说了 Promise内部有一个try catch 这样当我们内部报错的时候 直接reject 错误信息。
            try {
                executor(this.resolve.bind(this), this.reject.bind(this));
            } catch (error) {
                this.reject(error)
            }
        }
        resolve(value) {
            // Promise 当状态改变之后，不可以在继续改变， 所以只有当状态为 PENDING的时候才可以改变状态。
            if (this.status === Proself.PENDING) {
                this.status = Proself.FULFILLED;
                this.value = value;
                //处理延时的情况。
                setTimeout(() => {
                    this.callbacks.map(callback => {
                        callback.onFulfilled(value);
                    })
                });
            }
        }
        reject(reason) {
            //  reject 也同理，只有当PENDING的时候可以改变。
            if (this.status === Proself.PENDING) {
                this.status = Proself.REJECTED;
                this.value = reason
                setTimeout(() => {
                    this.callbacks.map(callback => {
                        callback.onRejected(reason);
                    })
                });
            }
        }
        //then 方法两个函数
        then(onFulfilled, onRejected) {
            //当我们使用then，不传入参数时，简单包装成 function
            if (typeof onFulfilled != "function") {
                onFulfilled = () => this.value;
            }
            if (typeof onRejected != "function") {
                onRejected = () => this.value;
            }

            return new Proself((resolve, reject) => {
                //当我们在Promise内部延时调用resolve 或者 reject 也就是pending状态。 
                if (this.status === Proself.PENDING) {
                    //用一个数组接收  onFulfilled, onRejected函数
                    // 当定时器结束后，执行了 resolve 或者 reject 函数时，从里面取出来执行。
                    this.callbacks.push({
                        onFulfilled: value => {
                            try {
                                // 解决 then 的链式调用， 取到成功的值 resolve出去
                                let result = onFulfilled(value);
                                resolve(result);
                            } catch (error) {
                                reject(error);
                            }
                        },
                        onRejected: value => {
                            try {
                                let result = onRejected(value);
                                resolve(result);
                            } catch (error) {
                                reject(error);
                            }
                        },
                    })
                }

                // 根据状态来判断返回 resolve 或者是 reject;
                if (this.status === Proself.FULFILLED) {
                    // then方法返回的 两个函数也用 try catch包裹，并且OnRejected返回
                    // 由于 Promise.then是异步的   所以我们把他放到宏任务队里，实现Promise.then的效果。
                    setTimeout(() => {
                        try {
                            // 解决 then 的链式调用， 取到成功的值 resolve出去
                            let result = onFulfilled(this.value);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    });
                }
                if (this.status === Proself.REJECTED) {
                    setTimeout(() => {
                        try {
                            let result = onRejected(this.value);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    });
                }
            })
        }
    }


    var promise = new Proself((resolve, reject) => {
        setTimeout(() => {
            reject("12312");
        }, 1000);
    })
    promise.then(res => { return res }, err => { return err + "1111111" }).then(res => console.log(res))
```

​		当我们在第一个resolve 中 return 一个非Promise 对象的时候 可以正常接收，但当我们 return 的是一个Promise的时候，需要对return的值做进一步处理。并且将 try catch 部分重复代码进行了抽离

```javascript
    // 正常Promise调用方式  new Promise((resolve, reject) => {resolve()})
    // 用类的方式来实现  	
    class Proself {
        // 先定义三个状态 pending fulfilled rejected 
        static PENDING = "pending";
        static FULFILLED = "fulfilled";
        static REJECTED = "rejected";
        //可以看到创建实例时 传入一个参数这里叫做执行者 执行者内部两个函数，  一个resolve， reject;
        constructor(executor) {
            //设置默认值。
            this.status = Proself.PENDING;
            this.value = "";
            this.callbacks = [];
            //这里需要绑定 this 
            // 在上一篇文章中说了 Promise内部有一个try catch 这样当我们内部报错的时候 直接reject 错误信息。
            try {
                executor(this.resolve.bind(this), this.reject.bind(this));
            } catch (error) {
                this.reject(error)
            }
        }
        resolve(value) {
            // Promise 当状态改变之后，不可以在继续改变， 所以只有当状态为 PENDING的时候才可以改变状态。
            if (this.status === Proself.PENDING) {
                this.status = Proself.FULFILLED;
                this.value = value;
                //处理延时的情况。
                setTimeout(() => {
                    this.callbacks.map(callback => {
                        callback.onFulfilled(value);
                    })
                });
            }
        }
        reject(reason) {
            //  reject 也同理，只有当PENDING的时候可以改变。
            if (this.status === Proself.PENDING) {
                this.status = Proself.REJECTED;
                this.value = reason
                setTimeout(() => {
                    this.callbacks.map(callback => {
                        callback.onRejected(reason);
                    })
                });
            }
        }
        //then 方法两个函数
        then(onFulfilled, onRejected) {
            //当我们使用then，不传入参数时，简单包装成 function
            if (typeof onFulfilled != "function") {
                onFulfilled = () => this.value;
            }
            if (typeof onRejected != "function") {
                onRejected = () => this.value;
            }

            let promise = new Proself((resolve, reject) => {
                //当我们在Promise内部延时调用resolve 或者 reject 也就是pending状态。 
                if (this.status === Proself.PENDING) {
                    //用一个数组接收  onFulfilled, onRejected函数
                    // 当定时器结束后，执行了 resolve 或者 reject 函数时，从里面取出来执行。
                    this.callbacks.push({
                        onFulfilled: value => {
                            this._parse(promise, onFulfilled(value), resolve, reject);
                            // try {
                            //     // 解决 then 的链式调用， 取到成功的值 resolve出去
                            //     let result = onFulfilled(value);
                            //     if (result instanceof Proself) {
                            //         result.then(resolve, reject);
                            //     } else {
                            //         resolve(result);
                            //     }
                            // } catch (error) {
                            //     reject(error);
                            // }
                        },
                        onRejected: value => {
                            this._parse(promise, onRejected(value), resolve, reject);
                            // try {
                            //     let result = onRejected(value);
                            //     if (result instanceof Proself) {
                            //         result.then(resolve, reject);
                            //     } else {
                            //         resolve(result);
                            //     }
                            // } catch (error) {
                            //     reject(error);
                            // }
                        },
                    })
                }

                // 根据状态来判断返回 resolve 或者是 reject;
                if (this.status === Proself.FULFILLED) {
                    // then方法返回的 两个函数也用 try catch包裹，并且OnRejected返回
                    // 由于 Promise.then是异步的   所以我们把他放到宏任务队里，实现Promise.then的效果。
                    setTimeout(() => {
                        this._parse(promise, onFulfilled(this.value), resolve, reject);
                        // try {
                        //     // 解决 then 的链式调用， 取到成功的值 resolve出去
                        //     let result = onFulfilled(this.value);
                        //     // 如果返回的是 Proself类型的， 则需要取出来他的then的值 来返回出去
                        //     if (result instanceof Proself) {
                        //         result.then(resolve, reject);
                        //     } else {
                        //         resolve(result);
                        //     }
                        // } catch (error) {
                        //     reject(error);
                        // }
                    });
                }
                if (this.status === Proself.REJECTED) {
                    setTimeout(() => {
                        this._parse(promise, onRejected(this.value), resolve, reject);
                        // try {
                        //     let result = onRejected(this.value);
                        //     if (result instanceof Proself) {
                        //         result.then(resolve, reject);
                        //     } else {
                        //         resolve(result);
                        //     }
                        // } catch (error) {
                        //     reject(error);
                        // }
                    });
                }
            })
            return promise;
        }
        _parse(promise, result, resolve, reject) {
            if(promise == result){
                throw new Error("自身等于自身，死循环")
            }
            try {
                if (result instanceof Proself) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        }
    }

    new Proself((resolve, reject) => {
        resolve("111")
    }).then(res => {
        return "abc"
        return new Proself((resolve, reject) => {
            resolve("111")
        })
    }).then(res => {
        console.log(res)
    })


```

下面开始增添静态方法  也就是 Proself 直接调用 resolve / reject / all / race 等方法。

```javascript
        // 正常Promise调用方式  new Promise((resolve, reject) => {resolve()})
        // 用类的方式来实现  	
        class Proself {
            // 先定义三个状态 pending fulfilled rejected 
            static PENDING = "pending";
            static FULFILLED = "fulfilled";
            static REJECTED = "rejected";
            //可以看到创建实例时 传入一个参数这里叫做执行者 执行者内部两个函数，  一个resolve， reject;
            constructor(executor) {
                //设置默认值。
                this.status = Proself.PENDING;
                this.value = "";
                this.callbacks = [];
                //这里需要绑定 this 
                // 在上一篇文章中说了 Promise内部有一个try catch 这样当我们内部报错的时候 直接reject 错误信息。
                try {
                    executor(this.resolve.bind(this), this.reject.bind(this));
                } catch (error) {
                    this.reject(error)
                }
            }
            resolve(value) {
                // Promise 当状态改变之后，不可以在继续改变， 所以只有当状态为 PENDING的时候才可以改变状态。
                if (this.status === Proself.PENDING) {
                    this.status = Proself.FULFILLED;
                    this.value = value;
                    //处理延时的情况。
                    setTimeout(() => {
                        this.callbacks.map(callback => {
                            callback.onFulfilled(value);
                        })
                    });
                }
            }
            reject(reason) {
                //  reject 也同理，只有当PENDING的时候可以改变。
                if (this.status === Proself.PENDING) {
                    this.status = Proself.REJECTED;
                    this.value = reason
                    setTimeout(() => {
                        this.callbacks.map(callback => {
                            callback.onRejected(reason);
                        })
                    });
                }
            }
            //then 方法两个函数
            then(onFulfilled, onRejected) {
                //当我们使用then，不传入参数时，简单包装成 function
                if (typeof onFulfilled != "function") {
                    onFulfilled = () => this.value;
                }
                if (typeof onRejected != "function") {
                    onRejected = () => this.value;
                }

                let promise = new Proself((resolve, reject) => {
                    //当我们在Promise内部延时调用resolve 或者 reject 也就是pending状态。 
                    if (this.status === Proself.PENDING) {
                        //用一个数组接收  onFulfilled, onRejected函数
                        // 当定时器结束后，执行了 resolve 或者 reject 函数时，从里面取出来执行。
                        this.callbacks.push({
                            onFulfilled: value => {
                                this._parse(promise, onFulfilled(value), resolve, reject);
                                // try {
                                //     // 解决 then 的链式调用， 取到成功的值 resolve出去
                                //     let result = onFulfilled(value);
                                //     if (result instanceof Proself) {
                                //         result.then(resolve, reject);
                                //     } else {
                                //         resolve(result);
                                //     }
                                // } catch (error) {
                                //     reject(error);
                                // }
                            },
                            onRejected: value => {
                                this._parse(promise, onRejected(value), resolve, reject);
                                // try {
                                //     let result = onRejected(value);
                                //     if (result instanceof Proself) {
                                //         result.then(resolve, reject);
                                //     } else {
                                //         resolve(result);
                                //     }
                                // } catch (error) {
                                //     reject(error);
                                // }
                            },
                        })
                    }

                    // 根据状态来判断返回 resolve 或者是 reject;
                    if (this.status === Proself.FULFILLED) {
                        // then方法返回的 两个函数也用 try catch包裹，并且OnRejected返回
                        // 由于 Promise.then是异步的   所以我们把他放到宏任务队里，实现Promise.then的效果。
                        setTimeout(() => {
                            this._parse(promise, onFulfilled(this.value), resolve, reject);
                            // try {
                            //     // 解决 then 的链式调用， 取到成功的值 resolve出去
                            //     let result = onFulfilled(this.value);
                            //     // 如果返回的是 Proself类型的， 则需要取出来他的then的值 来返回出去
                            //     if (result instanceof Proself) {
                            //         result.then(resolve, reject);
                            //     } else {
                            //         resolve(result);
                            //     }
                            // } catch (error) {
                            //     reject(error);
                            // }
                        });
                    }
                    if (this.status === Proself.REJECTED) {
                        setTimeout(() => {
                            this._parse(promise, onRejected(this.value), resolve, reject);
                            // try {
                            //     let result = onRejected(this.value);
                            //     if (result instanceof Proself) {
                            //         result.then(resolve, reject);
                            //     } else {
                            //         resolve(result);
                            //     }
                            // } catch (error) {
                            //     reject(error);
                            // }
                        });
                    }
                })
                return promise;
            }
            _parse(promise, result, resolve, reject) {
                if (promise == result) {
                    throw new Error("自身等于自身，死循环")
                }
                try {
                    if (result instanceof Proself) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            }

            static resolve(value) {
                return new Proself((resolve, reject) => {
                    if (value instanceof Proself) {
                        value.then(resolve, reject);
                    } else {
                        resolve(value)
                    }
                })
            }
            static reject(value) {
                return new Proself((resolve, reject) => {
                    if (value instanceof Proself) {
                        value.then(resolve, reject);
                    } else {
                        reject(value)
                    }
                })
            }
            static all(promises) {
                const results = [];
                return new Proself((resolve, reject) => {
                    promises.forEach(promise => {
                        promise.then(value => {
                            results.push(value);
                            if (results.length === promises.length) {
                                resolve(results);
                            }
                        },
                            reason => {
                                reject(reason);
                            }
                        )
                    })
                })
            }

            static race(promises) {
                return new Proself((resolve, reject) => {
                    promises.forEach(promise => {
                        promise.then(
                            res => {
                                resolve(res);
                            },
                            rea => {
                                reject(rea);
                            })
                    })
                })
            }
        }

        let p1 = new Proself((resolve, reject) => {
            setTimeout(() => {
                resolve(111);
            });
        })
        let p2 = new Proself((resolve, reject) => {
            reject(222);
        })
        Proself.race([p1, p2]).then(
            res => {
                console.log(res);
            },
            rea => {
                console.log(rea);
            }
        )

```

Promise 实现主要是前面方法的实现，后面的一些静态方法都是在前面的基础上，精简代码之后

```javascript
        // 正常Promise调用方式  new Promise((resolve, reject) => {resolve()})
        // 用类的方式来实现  	
        class Proself {
            // 先定义三个状态 pending fulfilled rejected 
            static PENDING = "pending";
            static FULFILLED = "fulfilled";
            static REJECTED = "rejected";
            //可以看到创建实例时 传入一个参数这里叫做执行者 执行者内部两个函数，  一个resolve， reject;
            constructor(executor) {
                //设置默认值。
                this.status = Proself.PENDING;
                this.value = "";
                this.callbacks = [];
                //这里需要绑定 this 
                // 在上一篇文章中说了 Promise内部有一个try catch 这样当我们内部报错的时候 直接reject 错误信息。
                try {
                    executor(this.resolve.bind(this), this.reject.bind(this));
                } catch (error) {
                    this.reject(error)
                }
            }
            resolve(value) {
                // Promise 当状态改变之后，不可以在继续改变， 所以只有当状态为 PENDING的时候才可以改变状态。
                if (this.status === Proself.PENDING) {
                    this.status = Proself.FULFILLED;
                    this.value = value;
                    //处理延时的情况。
                    setTimeout(() => {
                        this.callbacks.map(callback => {
                            callback.onFulfilled(value);
                        })
                    });
                }
            }
            reject(reason) {
                //  reject 也同理，只有当PENDING的时候可以改变。
                if (this.status === Proself.PENDING) {
                    this.status = Proself.REJECTED;
                    this.value = reason
                    setTimeout(() => {
                        this.callbacks.map(callback => {
                            callback.onRejected(reason);
                        })
                    });
                }
            }
            //then 方法两个函数
            then(onFulfilled, onRejected) {
                //当我们使用then，不传入参数时，简单包装成 function
                if (typeof onFulfilled != "function") {
                    onFulfilled = () => this.value;
                }
                if (typeof onRejected != "function") {
                    onRejected = () => this.value;
                }

                let promise = new Proself((resolve, reject) => {
                    //当我们在Promise内部延时调用resolve 或者 reject 也就是pending状态。 
                    if (this.status === Proself.PENDING) {
                        //用一个数组接收  onFulfilled, onRejected函数
                        // 当定时器结束后，执行了 resolve 或者 reject 函数时，从里面取出来执行。
                        this.callbacks.push({
                            onFulfilled: value => {
                                this._parse(promise, onFulfilled(value), resolve, reject);
                            },
                            onRejected: value => {
                                this._parse(promise, onRejected(value), resolve, reject);
                            },
                        })
                    }

                    // 根据状态来判断返回 resolve 或者是 reject;
                    if (this.status === Proself.FULFILLED) {
                        // then方法返回的 两个函数也用 try catch包裹，并且OnRejected返回
                        // 由于 Promise.then是异步的   所以我们把他放到宏任务队里，实现Promise.then的效果。
                        setTimeout(() => {
                            this._parse(promise, onFulfilled(this.value), resolve, reject);
                        });
                    }
                    if (this.status === Proself.REJECTED) {
                        setTimeout(() => {
                            this._parse(promise, onRejected(this.value), resolve, reject);
                        });
                    }
                })
                return promise;
            }
            _parse(promise, result, resolve, reject) {
                if (promise == result) {
                    throw new Error("自身等于自身，死循环")
                }
                try {
                    if (result instanceof Proself) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            }

            static resolve(value) {
                return new Proself((resolve, reject) => {
                    if (value instanceof Proself) {
                        value.then(resolve, reject);
                    } else {
                        resolve(value)
                    }
                })
            }
            static reject(value) {
                return new Proself((resolve, reject) => {
                    if (value instanceof Proself) {
                        value.then(resolve, reject);
                    } else {
                        reject(value)
                    }
                })
            }
            static all(promises) {
                const results = [];
                return new Proself((resolve, reject) => {
                    promises.forEach(promise => {
                        promise.then(value => {
                            results.push(value);
                            if (results.length === promises.length) {
                                resolve(results);
                            }
                        },
                            reason => {
                                reject(reason);
                            }
                        )
                    })
                })
            }

            static race(promises) {
                return new Proself((resolve, reject) => {
                    promises.forEach(promise => {
                        promise.then(
                            res => {
                                resolve(res);
                            },
                            rea => {
                                reject(rea);
                            })
                    })
                })
            }
        }

```

