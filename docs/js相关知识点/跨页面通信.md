### 跨页面通信

​		跨页面通信就是浏览器不同`tab`页面之间的信息传输、共享。

​		主要分同源、非同源两大类。

#### 同源页面间的跨页面通信

##### 一、BroadCast Channel

​		[BroadCast Channel](https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel/BroadcastChannel) 使用起来非常简单，创建一个频道，所有页面监听同一频道的消息时，其中某一个页面通过他发送的消息就会被其他页面收到

```javascript
	//创建一个频道
	const bc = new BroadcaseChannel('LYoSoo');
	//使用 onmessage进行监听
	bc.onmessage = (e) => {
        const {data} = e;
        console.log(data);
    }
    //调用实例上的poseMessage进行消息分发
    bc.PoseMessage("hello world!");
	//这样其他处于同一频道并且对数据进行监听的界面就会收到分发的消息。
```

##### 二、Service-worker

​		[Service-worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API) 是运行在 `worker` 上下文，不能访问 `DOM` ，运行在其他线程，所以不会造成阻塞，设计为完全异步，因此同步 API 入`XHR` 和 `localstorage` 不能在 `service-worker` 中使用。

```javascript
	//先注册 serviceWorker
	navigator.serviceWorker.register(../util/serviceWorker.js).then(() => {
        console.log("service worker注册成功")
    })
	//本身不具备广播功能，我们添加分发功能代码
	//  serviceWorker.js 代码
	self.addEventListener('message', function (e) {
        //监听message事件
        e.waitUntil(
            	//获取注册了该serviceWorker的所有事件
                self.clients.matchAll().then(function (clients) {
                    if (!clients || clients.length === 0) {
                        return;
                    }
                    //遍历每一个事件，调用poseMessage方法。
                    clients.forEach(function (client) {
                        client.postMessage(e.data);
                    });
                })
            );
    });
	// 在需要同步消息的界面监听
	navigator.serviceWorker.addEventListener('message', () => {
        const {data} = e;
        console.log(data);
    })
```

##### 三、localStorage

​		`localStorage` 因为是本地存储，所以自然各个`tab` 标签都可以进行访问，并且给我们提供了 `storage` 监听 `localStorage` 的变化，我们利用这个就可以实现数据的同步。

```javascript
	//监听 storage 事件
	window.addEventListener("storage", (e) => {
        const {key} = e;
        if(key === "post-msg"){
            const data = JSON.parse(e.data);
            console.log(data)
        }
    })
	//加入时间戳防止写入相同的值的时候无法触发 storage 事件
	postData.date = +(new Date())
	//写入 localStorage
	window.localStorage.setItem("post-msg", postData);
```

​		上面的三种方式都是“广播模式” ， 一个页面将消息送到管播站，之后广播站在把消息送给其他所有的界面。

##### 四、Shared Worker

​		[SharedWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/SharedWorker) 也是 `worker` 中的一员，普通的 `worker`是独立运行，数据不相通， 但多个 `tab` 注册的 `SharedWorker` 可以实现数据的共享。这里和上面的三种方式不同，我们无法主动通知数据变化，而是需要一直轮询获取。

```javascript
	//创建一个实例
	const sharedWorker = new ShareWorker('../util/sharedWorker.js');
	// sharedWorked.js
	let data = null;
	self.addEventListener('connect', function (e) {
    const port = e.ports[0];
    port.addEventListener('message', function (event) {
            // get 指令则返回存储的消息数据
            if (event.data.get) {
                data && port.postMessage(data);
            }
            // 非 get 指令则存储该消息数据
            else {
                data = event.data;
            }
        });
        port.start();
    });
	//之后在我们需要共享的页面一直发送get请求数据
	setInterval(function () {
        sharedWorker.port.postMessage({get: true});
    }, 1000);
	//监听message
    sharedWorker.port.addEventListener('message', (e) => {
        const {data} = e;
        console.log(data);
    }, false);
    sharedWorker.port.start();
	//当我们需要发送数据的时候
	sharedWorker.post.postMessage('hello world!');
```

##### 五、IndexdDB	

​		和 shared worker 基本类似，也是需要进行轮询获取数据。

##### 六、window.open 与 window.opener

​		当我们使用`window.open`打开页面时，方法会返回一个被打开页面`window`的引用。而在未显示指定`noopener`时，被打开的页面可以通过`window.opener`获取到打开它的页面的引用 —— 通过这种方式我们就将这些页面建立起了联系（一种树形结构）。

##### 七、websocket

​		websocket全双工通信，不仅可以推送消息，服务端也可以主动发送消息。



####  非同源页面之间的通信

##### 八、iframe当桥梁

​		在所有需要共享的界面加入同一个不可见的 iframe ，之后给 iframe 发送消息，在由 iframe 采用上面的同源时候的解决方案进行数据共享。





​		