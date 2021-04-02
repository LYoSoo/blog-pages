### CSS盒模型

​		盒模型包含了 内容（content）、内边距（padding）、边框（border）、外边距（margin）这几个元素，在不同的盒模型中，盒子宽、高的计算方式不同。

#### 标准盒模型

​		标准盒模型就是我们现在默认的盒模型，  `宽度 = content的宽度` ，高度计算方式一样。

![标准盒模型](http://175.24.187.2:12345/box-sizing/%E6%A0%87%E5%87%86%E7%9B%92%E6%A8%A1%E5%9E%8B.jpg)

#### IE盒模型

​		IE盒模型就是 `宽度 = content的宽度 + padding * 2 + border * 2` ， 高度计算方式一样。

![IE盒模型](http://175.24.187.2:12345/box-sizing/IE%E7%9B%92%E6%A8%A1%E5%9E%8B.jpg)

#### box-sizing

​		我们可以通过  <font color="#FAA">`box-sizing: border-box`</font> 来设置IE 盒模型，通过  <font color="#FAA">`box-sizing: content-box`</font> 来设置默认盒模型。

#### 获取盒子宽度的方式

```javascript
	const domID = document.getElementById("root");
	domID.style.width/height;					//只能获取到行内样式的宽高，style内的或者link的css无法获取到
	domID.currentStyle.width/height;			//获取到的是最终渲染后的宽高，只有IE支持
	window.getComputedStyle(domID).width/height;//和上一个相同，多个浏览器支持
	domID.getBoundingClientRect();				//返回当前元素的位置信息、包含宽高距离等。
```



### CSS选择器

选择器可以分成以下类别：

+ 简单选择器：通过元素类型、class 或者 id 匹配一个或者多个元素。
+ 属性选择器：通过属性 / 属性值匹配一个或者多个元素。
+ 伪类：匹配处于确定状态的一个或者多个元素，比如被鼠标悬停的元素，或当前被选中或未选中的复选框，或元素是DOM 树中一父节点的第一个节点。
+ 伪元素：匹配处于相关的确定位置的一个或多个元素，例如每个段落的第一个字，或者某个元素之前生成的内容。
+ 组合器：这不是选择器本身，还有以有效的方式组合两个或更多的选择器用于特定的选择方法。
+ 多用选择器：这些也不是单独的选择器；将以逗号分隔的多个选择器放在一个CSS规则下面。

#### 简单选择器

1. 类型选择器：和指定的HTML元素名的不区分大小写的匹配。  （div   p   span）
2. 类选择器：自己命名的 class 。	（ . xxx ）
3. ID选择器：ID选择器是命名的 id，使用id 设置唯一的ID名称。（ #root ）
4. 通用选择器：选择页面内的所有元素，通常用在初始化的时候     （ * ）

#### 属性选择器

属性选择器是特殊类型的选择器，是根据属性和属性值来匹配元素，通用语法是 `[]` ,其中包含属性名称，后跟可选条件以及匹配属性的值，主要分为两种： **存在和值属性选择器**  和 **子串值属性选择器**。

​	**1.  存在和值属性选择器**

​		这些属性选择器尝试匹配精准的属性值。

​		[attr] : 该选择器选择包含 `attr` 属性的所有元素，无论 `attr`的值为何。

​		[attr = val] : 该选择器仅选择 `attr` 属性被赋值为 `val` 的所有元素。

​		[attr ~= val]：该选择器仅选择 `attr` 属性的值中包含 `val` 值的所有元素。

​	**2. 子串值属性选择器**

​		这种情况的属性选择器也称为伪正则选择器。

​		[attr |=val]：选择`attr` 属性的值以 `val` 开头，或 `val-`开头的元素。

​		[attr ^=val]： 选择`attr` 属性以 `val` 开头的元素。

​		[attr $=val]： 选择`attr` 属性以`val` 结尾的元素。

​		[attr *=val]： 选择`attr` 属性的值包含字符串`val` 的元素。

#### 伪类

CSS的伪类是以 `: ` 作为前缀的关键字，当你希望样式在特定的情况下才呈现到指定的元素时。

```css
	:active			
	:any
	:checked
    :default
    :dir()
    :disabled
    :empty
    :enabled
    :first
    :first-child	
    :first-of-type		
    :fullscreen
    :focus
    :hover
    :indeterminate
    :in-range
    :invalid
    :lang()
    :last-child
    :last-of-type
    :left
    :link
    :not()
    :nth-child()
    :nth-last-child()
    :nth-last-of-type()
    :nth-of-type()
    :only-child
    :only-of-type
    :optional
    :out-of-range
    :read-only
    :read-write
    :required
    :right
    :root
    :scope
    :target
    :valid
    :visited
```

#### 伪元素

伪元素和伪类在概念上很像，伪元素可以不需要新的标签来实现一些效果。

```css
	::before
	::after
	::first-letter
	::first-line
	::selection
	::backdrop
```

#### 组合器

在CSS中，组合器允许我们将多个选择器组合在一起，可以在其他元素中选择元素，或者与其他元素相邻。

| A，B   | 说明                                                         |
| ------ | ------------------------------------------------------------ |
| A ,  B | 匹配满足A B 的任意元素                                       |
| A    B | 后代选择器（B 是 A 的后代节点，或者 A的后代节点的后代节点）  |
| A > B  | 子选择器  （ B 是 A 的直接子节点）                           |
| A + B  | 相邻兄弟选择器 （B 是 A 的下一个兄弟节点， A B 在同一个父节点下面， A后面就是 B） |
| A ~ B  | 通用兄弟选择器 （B 是 A 的兄弟节点中的任意一个，只要是在同一个父节点下面） |

 ### CSS 优先级

​		优先级也可以叫做权重，当我们写的CSS代码被浏览器解析并生效的时候，是根据权重来决定那一个样式生效，两个选择器同时作用在一个元素上的时候，权重高的会生效，下面来看一张理解并记忆权重的图。

![IE盒模型](http://175.24.187.2:12345/box-sizing/box-css.png)

当我们组合使用的时候，采取权重相加的方式

```html
	#id .container		// 100 + 10;
	#id div				// 100 + 1;
```

> ​	两个样式都使用了 ! important 的时候， 权重值高的显示。
>
> ​	#root{
>
> ​			color: red  !important;		
>
> ​	}
>
> ​	.container{
>
> ​			color: green !important;	
>
> ​	}
>
> ​	root 中的样式生效。

+ CSS同一个组合写了两次， 后面的样式会覆盖前面的样式。
+ 样式指向同一个元素的时候，权重大的样式生效。
+ 内部样式和外部样式发生冲突，采取就近原则，那个样式在下面则采取哪个样式。

### CSS写法优缺点

​		行内样式缺点：

1. 样式无法复用

2. 样式权重高，不好覆盖

3. 表现层与结构层未分离

4. 不能缓存，影响加载效率

    导入样式缺点：

   1. 导入样式只能放在style 标签中的第一行，否则无效

   2. @important 声明的样式表不能充分的利用浏览器并发请求资源的行为，加载行为会被延后触发或者被其他资源挂起。

   3. 由于 @important 样式的延后加载，可能会导致界面样式闪烁。

   4. 在 link 中 @important 其他 CSS， 页面会等到资源加载完成后才解析link 中 @important 的 CSS。

      

### CSS In JS

​		CSS In JS，就是用 JS 写 CSS，不需要单独的 CSS 文件，所有的 CSS 都在组件内部，实现 CSS的模块化。

​		常见的解决方案 styled-components

使用方式：

```jsx
	import styled from "styled-components";
	//定义按钮  props 传值
	const DefineButton = styled.button`
		background: ${props => (props.primary ? "#1676FE" : "#FAA")};
		font-size: 14px;
		padding: 6px;
		border-radius: 4px;
	`
    // 复用 defineButton 的样式。
    const SpecialButton = styled(defineButton)`
		color: red;
		font-size: 16px;
	`
    <DefineButton primary>按钮</DefineButton>
    <SpecialButton primary>特殊按钮</SpecialButton>

```

CSS In JS 的特点：

+ 写法：全部变成行内样式，在JS 内部写 CSS
+ 目的：使用JS 变量，简单高效
+ 缺点：违背 JS CSS 分离原则，不能使用预处理器

### CSS优化方法

```javascript
	1.合并CSS文件，利用浏览器并行下载提升效率。
    2.减少CSS嵌套，尤其是ID选择器之前的嵌套，因为ID选择器权重以及很高而且是唯一的，多层嵌套无意义，而且处理完嵌套的选择器都会加在当前选择器的前面。
    3.抽取公共样式，定义常用类。
    4.使用精灵图，iconfont，减少HTTP请求次数。
    5.对CSS进行压缩处理。
    6.属性书写顺序：
      (1).布局定位属性：display、position、float、clear、visible、overflow
	  (2).自身属性：width、height、margin、padding、border、background
	  (3).文本属性：color、font、text-decoration、text-align、vertical-align、white- space、break-word
	  (4).其他C3属性：content、cursor、border-radius、box-shadow、text-shadow
```

##### 性能优化

```javascript
	1.避免使用@import，外部文件使用@important会使页面在加载时获得额外的延迟。
		=> 使用@import会影响浏览器的并行下载，只有@import的那个文件被下载的时候，浏览器才知道还需要下载@import的文件，这是才会去下载并解析，降低了效率。
		=> 使用@import会导致下载顺序混乱，后面的文件可能会优先下载。
	2.避免过度的重排： 一个界面进入时最少有一个重排
    	=> 重排：重新计算界面元素的位置和结构的过程
			=> 常见重排操作：大小相关的： width、height、padding、margin、border-width、border
						  布局相关的： display、top、position、float、left、right
                          字体相关的： font-size、text-align、font-weight、font-family、line-height
						  隐藏相关的： overflow、overflow-x、 overflow-y
				=> 避免重排建议：不要一条条修改dom样式，直接更改class
						  	  dom操作放到一个虚拟节点内，完成后统一挂载
        => 重绘：元素本身发生改变，但是不会影响元素在界面中的位置
			=> 常见重绘操作：颜色相关的： color、background
            			  边框相关的： border-style、outline、border-radius、box-shadow
						  背景相关的： background-image、background-repeat、background	
```



### BFC

##### 一、常见定位方案

+ 普通流

  在普通流中，元素按照其在HTML中的位置至上而下进行布局，在这个过程中，行内元素水平排列，直到行被占满之后换行。 块级元素重新起一行，在HTML中， 默认使用的布局方式就是普通流定位，普通流中元素的位置由该元素在HTML文档中的位置决定。

+ 浮动

  浮动布局也是常见的布局方式，元素首先按照普通流的位置出现，然后根据浮动的方向尽可能的向左边或者右边偏移，漂浮在上面，默认情况下不会影响下面的布局方式。

+ 绝对定位

  在绝对定位中，元素会脱离普通流，因此不会对其兄弟元素造成影响，元素的具体位置由绝对定位的坐标决定。

##### 二、什么是BFC？

> ​	BFC 是 Block Formatting Contexts(块级格式化上下文)， 它属于普通流定位。

​		**具有 BFC 特定的元素可以看作隔离了的独立容器，容器内的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器没有的一些特性。 **

##### 三、怎么触发 BFC

​		只要元素满足下面任一条件即可触发BFC 特性：

+ 处在body 根元素
+ 浮动元素： float： left / right
+ 绝对定位元素： position (absolute 、fixed)
+ display 为 inline-block、 table-cells、flex
+ overflow :  hidden 、auto、overlay、scroll

##### 四、BFC特性及应用

 1. BFC下边距会发生折叠

    ```html
    <head>
    	<style>
            div{
                width: 100px;
                height: 100px;
                background: #FAA;
                margin: 100px;
            }
        </style>        
    </head>
    <body>
        <div></div>
        <div></div>
    </body>
    ```

    ![image-20210330222812721](http://175.24.187.2:12345/BFC/BFC1.png)

    ​	这里虽然每一个div的 上下margin 都是100px 但是因为处在body 下，所以他们之前的margin进行了重叠，只有100px

    ​	如果想要避免重叠， 那么就把他们放在不同的BFC容器内。

    ```html
    <head>
    	<style>
            .container{
                overflow: hidden	//触发BFC
            }
            p{
                width: 100px;
                height: 100px;
                background: #FAA;
                margin: 100px auto;
            }
        </style>        
    </head>
    <body>
        <div class="container">
        	<p></p>
        </div>
        <div class="container">
        	<p></p>
        </div>
    </body>
    ```

    

![image-20210330223749609](http://175.24.187.2:12345/BFC/BFC2.png)

 2. BFC可以包含浮动的元素（清除浮动）

    ```html
    <div style="border: 10px solid #1676FE">
    	<div style="width: 200px; height: 200px; background: #FAA; float: left"></div>        
    </div>
    ```

    ![BFC3](http://175.24.187.2:12345/BFC/BFC3.png)

    因为现在内部div 浮动，所以脱离了外层div的包裹，我们需要触发外层div 的 BFC 这样就可以完成了包裹。

    ```html
     <!--浮动元素： float left、 right
     绝对定位元素： position (absolute 、fixed)
     display 为 inline-block、 table-cells、flex
     overflow  （hidden 、auto、overlay、scroll）
    	上面这几种方式都可以触发BFC特性。
    -->
    <div style="border: 10px solid #1676FE; overflow: hidden">
    	<div style="width: 200px; height: 200px; background: #FAA; float: left"></div>        
    </div>
    ```

    ![BFC4](http://175.24.187.2:12345/BFC/BFC4.png)

3. BFC可以阻止元素被浮动元素覆盖

   ```html
   <div style="width: 200px; height: 200px; background: #1676FE; float: left">
       style="width: 100px; height: 100px; background: #1676FE; float: left"
   </div>
   <div style="width: 300px; height: 300px; background: #FAA; ">
       这是未触发BFC效果之前的样子width: 300px; height: 300px; background: #FAA;
   </div>
   ```

   ![BFC5](http://175.24.187.2:12345/BFC/BFC5.png)

**触发BFC之后**

```html
 <div style="width: 200px; height: 200px; background: #1676FE; float: left">
    style="width: 100px; height: 100px; background: #1676FE; float: left"
</div>
<div style="width: 300px; height: 300px; background: #FAA; overflow: auto;">
    这是触发BFC效果之后的样子 width: 300px; height: 300px; background: #FAA; overflow: auto;
</div>
```

![BFC6](http://175.24.187.2:12345/BFC/BFC6.png)