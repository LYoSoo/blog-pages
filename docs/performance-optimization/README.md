### 前端性能优化

​		前端性能优化很复杂，我们主要分六个方面来探索

#### 一、缓存

1. 本地数据存储：`localStorage`、`sessionStorage`、`indexedDB`。
2. 内存缓存：这个在HTTP缓存的时候说了，浏览器会在内存中缓存，具有快速读取、时效性两个特点，关闭当前标签就没了，读取优先于磁盘缓存。
3. HTTP缓存： 分为强缓存、协商缓存。

#### 二、发送请求

1. 避免多余重定向： 301永久重定向、302临时重定向。过多重定向消耗时间。

2. DNS预解析：当你输入一个网址的时候。 先检查浏览器缓存 => 本地hosts文件中是否含有映射=> 查询本地DNS服务器 => 查找根服务器，根服务器根据域名类型判断对应的顶级域名服务器（.com），返回给本地DNS，然后重复该过程。

   设置 rel = "dns-perfetch" 浏览器会在合适的状态提前帮你解析后面的域名。

3. 预先建立连接： 使用 `preconnect` 可以让浏览器预先帮你建立连接。

4. 使用 CDN：DNS解析会将CDN自愿的域名解析到CDN服务的负载均衡器上，负载均衡奇可以通过请求的信息获取用户对应的地理区域，然后选择一个地理位置近的，负载低的机器提供服务。

#### 三、页面解析与处理

1. 资源放在页面中的位置：JavaScript 会阻塞DOM 构建、CSSOM 的构建阻塞 JavaScript 执行。

   推荐把 CSS样式表放在<head> 中， 把 JavaScript 放在 <body> 的最后。

2. 使用 `defer` 和 `async`：defer 在HTML 解析完成后按照脚本出现的顺序执行， async 是下载完成立即执行，同时阻塞页面解析，不保证脚本间的执行顺序。

   与主业务无关的JavaScript 脚本添加 async 。 可以避免非核心功能的加载影响界面解析速度。

3. 开启 GZIP 压缩。

#### 四、页面静态资源

1. 减少不必要的请求：

