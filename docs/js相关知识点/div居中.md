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

