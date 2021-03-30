### CSS盒模型

​		盒模型包含了 内容（content）、内边距（padding）、边框（border）、外边距（margin）这几个元素，在不同的盒模型中，盒子宽、高的计算方式不同。

#### 标准盒模型

​		标准盒模型就是我们现在默认的盒模型，  `宽度 = content的宽度` ，高度计算方式一样。

![标准盒模型](F:\360MoveData\Users\Administrator\Desktop\标准盒模型.jpg)

#### IE盒模型

​		IE盒模型就是 `宽度 = content的宽度 + padding * 2 + border * 2` ， 高度计算方式一样。

![IE盒模型](F:\360MoveData\Users\Administrator\Desktop\IE盒模型.jpg)

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
+ 浮动元素： float 除 none 以外的任何值
+ 绝对定位元素： position (absolute 、fixed)
+ display 为 inline-block、 table-cells、flex
+ overflow 除了visible 以外的值 （hidden 、auto）

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

    ![image-20210330222812721](C:\Users\吕宏涛Y\Desktop\BFC1.png)

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

    

![image-20210330223749609](C:\Users\吕宏涛Y\AppData\Roaming\Typora\typora-user-images\image-20210330223749609.png)