### 前端的两种路由模式： hash路由 与 history 路由

路由实现实现三个功能：

1. 浏览器地址变化的时候，切换界面。
2. 浏览器点击【前进】、【后退】按钮的时候网页内容发生变化。
3. 刷新浏览器，网页加载当前路由对应的内容。

我们有两种实现方式：

1. hash模式：监听浏览器的hash值变化，执行相应的 JS 切换网页。
2. history模式：利用 history API 实现 url 地址改变，网页内容改变。

最明显的区别就是 hash 模式 会在浏览器地址后面有个 # 号，history可以自定义地址。



#### hash 模式

​		使用<font color="#FAA">` window.location.hash `</font>属性以及窗口的 <font color="#FAA">` hashchange `</font> 事件，当我们监听到  <font color="#FAA">` hash `</font> 值的变化的时候，执行相应的 JS 代码来切换网页。

​		 <font color="#FAA">` hash `</font> 模式的几个要点：

+ hash 指的是URL地址中 # 以及 后面的字符，也称为散列值，http://localhost:8080/index.html#abc；	这里的 #abc 就是 hash
+ 散列值是不会发送到服务端的，因此改变hash 值不会重新加载页面
+ 监听window 和 hashchange 事件，当散列值改变的时候，可以通过window.hash 来获取和设置hash 值
+ location.hash 值的变化会直接显示在浏览器的 URL 上。

##### 触发hashchange的几种情况

+ 浏览器散列值的变化（浏览器的前进、后退）会触发  <font color="#FAA">` window.location.hash `</font> ，从而触发  <font color="#FAA">` hashchange `</font> 事件。
+ 浏览器的 URL 中带有 hash 值， 当我们访问的时候hash值前面的部分浏览器进行访问，请求完毕后设置散列值， 并触发 <font color="#FAA">` hashchange `</font> 事件
+ 只改变浏览器URL地址后面的hash 值，这时候URL没变，不会发送请求到 服务器地址，只是设置新的散列值， 并触发 <font color="#FAA">` hashchange `</font> 事件
+ html 中 a 标签中的属性href 的内容带有hash, 当点击这个 a 标签的时候，浏览器跳转到指定的地址，并自动设置  <font color="#FAA">` window.location.hash `</font> ，地址栏中的 hash 改变，触发 <font color="#FAA">` hashchange `</font> 事件。

#### history 模式

+ <font color="#FAA">` window.history `</font> 属性指向 history 对象，当发生改变的时候只会改变页面的路径，不会刷新界面。
+ `history` 对象保存了当前窗口访问过的所有网址的地址，通过  <font color="#FAA">` history.length `</font> 可以得到当前窗口一共访问了多少个地址，但是出于安全原因浏览器并未开放这些地址的读取权限，只能通过开发的 `API` 进行导航操作。
+ 浏览器的前进、后退 按钮其实就是对 `history` 对象进行操作。

##### 属性

​		History 主要有两个属性。

+ History.length： 访问过得网址数量
+ History.state:   History 栈堆最上层状态值

##### History.back()、 History.forward()、 History.go()

​		这三个方法可以让我们在历史记录中前进或者后退的操作。

+ History.back()：移动到前一个网址，相当于点击浏览器的后退按钮。第一个进入浏览器的网址无效。
+ History.forward():  移动到后一个网址，相当于点击浏览器的前进按钮。最后一个网址点击无效。
+ History.go():  接收整数参数，以当前网址为基准移动到参数的网址，超出范围无效。不指定参数相当于 0  即刷新当前页面，常用操作 History.go(-1)。 后退 相当于 History.back();

##### History.pushState()

​		在 history 对象中增加一条记录，并不会触发页面刷新，仅仅是 History对象发生变化，地址栏有变化。

```javascript
	window.history.pushState(Object, title, url);
	// object 传参用，可以传递参数到下一个界面
	// title 下一个界面的标题
	// 完整的url则浏览器的整体url会被替换，但是不能跨域，否则报错。
	// 非完整的url 只会改变url 的最后。
```

##### History.replaceState()

​		与 history.pushState() 用法一样，唯一的区别就是 History.replaceState() 是直接修改当前的 history 而不是新增一条，所以调用之前的 history 就已经没有了。

##### popState 事件

​		当 history 对象发生变化的时候，会触发 popState 事件

+ 当我们只调用 History.pushState() 或者 History.replaceState 造成 history对象发生变化时，并不会触发 popState 事件
+ 当我们点击浏览器的后退、前进按钮的时候或者使用JS 调用 `History.back()、 History.forward()、History.go()` 的时候会触发
+ 页面第一次加载的时候  不会触发 popState事件。

```javascript
	window.addEventListener('popState', (e) => {
        // e.state === history.state;
        // 回调参数中的 state 就是当前history中的 state；
    })
```



​		**现在常用的基本都是 history 模式的路由，这种方式看起来更加美观，没有 # 号，唯一需要注意的就是在使用history 路由模式的 时候，当我们在某个界面直接刷新的时候，是直接拿当前的地址去访问服务器的，是会报404错误的，这里需要后端去配置一下。**