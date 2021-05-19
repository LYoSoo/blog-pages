### 圣杯布局

​		圣杯布局是很常见的一种布局方式，顶部header, 底部 footer ，**中间content部分分为三列布局，左侧右侧固定，中间部分自适应。**

#### 经典实现方式（浮动）

> ​	主要实现过程：
>
> （1）设置顶部高度、底部高度，由于中间部分需要用浮动来进行实现，所以提前给底部设置好清除浮动。
>
> （2）给content内部的左、中、右分别设置宽高，左侧200px、中间 100% 、右侧100px。高度统一设置为200px；
>
> ![初步布局](http://175.24.187.2:12345/layout/layout1.png)
>
> （3）给左设置 `margin-left: -100%`， 使他能够跟 center 在同一行并且在 content 头部。
>
> ![初步布局](http://175.24.187.2:12345/layout/layout2.png)
>
> （4）给右设置 `margin-left: -100px`,  使他能够跟center 在同一行并且在 content 尾部。
>
> ![初步布局](http://175.24.187.2:12345/layout/layout3.png)
>
> （5）这时虽然大致实现了，但是center部分被左右两边盖住了，所以给content 加入 `padding: 0 100px 0 200px`;
>
> ![初步布局](http://175.24.187.2:12345/layout/layout4.png)
>
> （6）这时content 两侧空白，我们把`左、右`通过定位设置完即可。 `position: relation; left: -200px / right: -100px`;
>
> ![初步布局](http://175.24.187.2:12345/layout/layout5.png)

**到这时候圣杯布局就已经完成了，下面是圣杯布局的代码**

```html
<style>
    * {
        margin: 0;
        padding: 0;
    }
    #header,
    #footer {
        background-color: antiquewhite;
        min-height: 200px;
    }
    #container {
        padding: 0 100px 0 200px;
    }
    #container::after{
        content: "";
        clear: left;
        display: block;
    }
    .column {
        height: 200px;
        float: left;
        width: 200px;
        position: relative;
    }
    #center {
        width: 100%;
        background-color: #FAA;
    }
    #left {
        width: 200px;
        background-color: aqua;
        margin-left: -100%;
        left: -200px;
    }
    #right {
        width: 100px;
        background-color: brown;
        margin-left: -100px;
        right: -100px;
    }
</style>

<body>
    <div id="header">#header</div>
    <div id="container">
        <div id="center" class="column">#center</div>
        <div id="left" class="column">#left</div>
        <div id="right" class="column">#right</div>
    </div>
    <div id="footer">#footer</div>
</body>
```



### 双飞翼布局

​		双飞翼布局和圣杯布局基本一样，是圣杯布局的优化版本，由淘宝UED提出。只不过是在上面运行到第四步的时候处理`content` 被left 、 right 盖住的方式不同，我们直接从第四步接着进行。

> ​		当 `content` 被左、右盖住的时候，我们并不是用`padding`挤出来，之后在用定位固定左右，而是在`center` 内部加一个`inner`， 用`margin` 挤过来。
>
> （5）给`inner` 设置一个 `margin: 0 100px 0 200px`， 加入border是为了易于区分。
>
> ![初步布局](http://175.24.187.2:12345/layout/layout5.png)

**双飞翼布局的代码如下**

```html
<style>
    * {
        margin: 0;
        padding: 0;
    }
    #header,
    #footer {
        background-color: antiquewhite;
        min-height: 200px;
    }
    .column {
        height: 200px;
        float: left;
        width: 200px;
    }
    #container::after{
        content: "";
        clear: left;
        display: block;
    }
    #center {
        width: 100%;
        background-color: #FAA;
    }
    #left {
        width: 200px;
        background-color: aqua;
        margin-left: -100%;
    }
    #right {
        width: 100px;
        background-color: brown;
        margin-left: -100px;
    }
    #inner{
        margin: 0 100px 0 200px;
        height: 100%;
        box-sizing: border-box;
        border: 3px solid red;
    }
</style>

<body>
    <div id="header">#header</div>
    <div id="container">
        <div id="center" class="column">
            <div id="inner">#center</div>
        </div>
        <div id="left" class="column">#left</div>
        <div id="right" class="column">#right</div>
    </div>
    <div id="footer">#footer</div>
</body>
```

### flex 布局

​		content 内部上中下分别为 `left、 center、right` 之后设置宽 100px 100% 200px。 之后设置 `display: flex` 。













——————————————————————————————————————————————

### DIV水平垂直居中

##### 一、flex布局来实现

![flex来实现](http://175.24.187.2:12345/div-center/div-center-1.png)

```html
<style>
    .parent{
        width: 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #EEE;
    }
    .inner{
        width: 100px;
        height: 100px;
        background-color: #FAA
    }
</style>
<div class="parent">
    <div class="inner"></div>
</div>
```

##### 二、Position定位实现（已知宽高）

```html
<!--通过定位值减去本身宽度的一般来实现居中-->
<style>
    .parent {
        position: relative;
        width: 200px;
        height: 200px;
        background-color: #EEE;
    }
    .inner {
        position: absolute;
        left: calc(50% - 50px);
        top: calc(50% - 50px);
        width: 100px;
        height: 100px;
        background-color: #FAA;
    }
</style>
<div class="parent">
    <div class="inner">inner div</div>
</div>
```

##### 三、Position transform （元素宽度未知）

![flex来实现](http://175.24.187.2:12345/div-center/div-center-2.png)

```html
<!--通过transform来实现居中-->
<style>
    .parent {
        position: relative;
        width: 200px;
        height: 200px;
        background-color: #EEE;
    }
    .inner {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #FAA;
    }
</style>
<div class="parent">
    <div class="inner">inner div</div>
</div>
```

##### 四、position(已知宽高)

```html
<!--通过设置left、right、top、bottom为0， margin auto来实现居中 -->
<style>
    .parent {
        position: relative;
        width: 200px;
        height: 200px;
        background-color: #EEE;
    }
    .inner {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        width: 100px;
        height: 100px;
        background-color: #FAA;
    }
</style>
<div class="parent">
    <div class="inner">inner div</div>
</div>
```

##### 五、table-cell

```html
<!--设置父元素 table-cell,垂直居中，之后子元素margin-left: 50px-->
<style>
    .parent {
        display: table-cell;
        vertical-align: middle;
        width: 200px;
        height: 200px;
        background-color: #EEE;
    }
    .inner {
        margin-left: 50px;
        width: 100px;
        height: 100px;
        background-color: #FAA;
    }
</style>
<div class="parent">
    <div class="inner">inner div</div>
</div>
```

### 使文字水平垂直居中

##### 一、简单的逐个设置

```html
<style>
    .parent {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        width: 200px;
        height: 200px;
        background-color: #EEE;
    }

</style>
<div class="parent">
    实现文字垂直水平居中
</div>
```

##### 二、父元素设置display: table, 子元素 display: table-cell

```html
<style>
    .parent {
        display: table;
        width: 200px;
        height: 200px;
        background-color: #EEE;
    }
    .inner{
        display: table-cell;
        vertical-align: middle;
        text-align: center;
    }
</style>
<div class="parent">
    <div class="inner">
        实现文字垂直水平居中
    </div>
</div>
```

##### 三、图片居中

```html
<style>        
    .parent{        
        display: table-cell;            
        text-align: center;            
        vertical-align: middle;  
        width: 200px;            
        height: 200px;            
        background-color: #EEE;            
    }        
    img{            
        width: 100px;            
        height: 100px;        
    }    
</style>

HTML：
<div class="parent">    
    <img src="http://175.24.187.2:12345/div-center/div-center-2.png" alt="">
</div>

```

