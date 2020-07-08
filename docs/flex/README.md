# Flex布局

> ​	flex布局其实是较为基础、语法简单的布局方式，但是在工作过程中偶尔会记不清属性名称等其他情况，所以打算写一点记录加深印象。
>
> ​	**写在前面：当你想知道你对flex掌握到什么程度，或者练习一下flex布局，推荐一个练习flex布局的小游戏。**
>
> ​	**[小游戏链接](http://flexboxfroggy.com)**

## 一、Flex布局是什么？

> ​	Flex布局就是 `Flexible Box`的缩写，意为“弹性布局”，用来给盒状模型提供最大的灵活性。
>
> ​	使用flex布局很简单，只需要在父容器（块状元素）上指定 `display: flex`属性即可。
>
> ​	对应的行内元素如果想要使用flex布局， 设置属性`display: inline-flex`即可。

## 二、基本概念

> ​	在flex布局中，我们基本可以按照`父 子`来区分，父元素就是外层的容器`container`， 子元素对应一个个使用flex布局的元素 `item`。
>
> 下面引用一张图来说明
>
> ![主轴、交叉轴](/img/1.png)
>
> flex布局最基本也是最重要的就是 `横 纵` 这两条轴线，也就是上图的 `（主轴）main axis` 和 `（交叉轴）cross axis` ； 默认情况下主轴的排列是从左到右， 交叉轴的排列从上到下。

## 三、容器的属性

> ​	在外层的容器上 有6个属性，在使用以下6个属性时首先要给父元素设置 `display: flex`；

```css
	flex-direction:
	flex-wrap:
	flex-flow:
	justify-content: 
	align-items:
	align-content:
```

### 3.1 flex-direction

> ​	`flex-direction`是用来控制主轴的，默认是从左到右
>
> ```css
> .container{
>     flex-direction: row(默认) | row-reverse | column | columns;
> }
> ```
>
> <font color= #faa>暂时差flex-direction各个属性的插图</font>
>
> | flex-direction:  属性 | 显示效果                     |
> | :-------------------: | ---------------------------- |
> |       row(默认)       | 主轴为水平方向，排列从左到右 |
> |      row-reverse      | 主轴为水平方向，排列从右到左 |
> |        column         | 主轴为垂直方向，排里从上到下 |
> |    column-reverse     | 主轴为垂直方向，排里从下到上 |

### 3.2 flex-wrap属性

> ​	上面的`flex-direction`控制的是主轴的走向以及排列方式的， `flex-wrap`是用来控制当子元素在主轴上排列不下时，是否换行以及如何换行的。
>
> ```css
> .container{
>     flex-wrap: nowrap（默认） | wrap | wrap-reverse;
> }
> ```
>
> 三个值分别对应三种情况
>
> + nowrap(默认)： 不换行 —— 子元素排列不下时，他们会默认等比缩小，挤在一行内。
> + wrap: 换行 —— 第一行在上方。
> + wrap-reverse:  换行 —— 第一行在下方

### 3.3 flex-flow属性

> ​	`flex-flow`就是 `flex-direction` 与 `flex-wrap`的简写， 默认值为 `row`  与 `nowrap`；
>
> ```css
> .container{
>     flex-flow: [flex-direction] [flex-wrap];
> }
> ```

### 3.4 justify-content 属性

> ​	`justify-content`定义了 `item`在主轴上的对齐方式。
>
> ```css
> .container{
>     justify-content: flex-start(默认) |flex-end| center| space-between| space-around;
> }
> ```
>
> | justify-content属性 | 显示效果                                                     |
> | :-----------------: | ------------------------------------------------------------ |
> | flex-start(默认值)  | 左对齐                                                       |
> |      flex-end       | 右对齐                                                       |
> |       center        | 居中                                                         |
> |    space-between    | 两端对齐，项目之间的间隔相等                                 |
> |    space-around     | 项目两侧的距离相等，所以项目与项目之间的距离比项目与边框的距离大一倍。 |

### 3.5 align-items 属性

> ​	`align-items`属性定义项目在交叉轴上如何进行对齐
>
> ```css
> .container{
>     align-items:stretch(默认) | flex-start | flex-end | center | baseline;
> }
> ```
>
> | align-items属性 | 显示效果                                                 |
> | :-------------: | -------------------------------------------------------- |
> | stretch(默认值) | 若`item`未设置高度或者高度为`auto`，将占满整个容器的高度 |
> |   flex-start    | 交叉轴的起点对齐                                         |
> |    flex-end     | 交叉轴的终点对齐                                         |
> |     center      | 交叉轴的中点对齐                                         |
> |    baseline     | 项目的第一行文字的基线对齐                               |

### 3.6 align-content

> ​	`align-content` 属性定义的是多跟轴线的对其方式，如果只有一根轴线，该属性无效。
>
> ​	`align-items`  设置的是多个子元素的对齐方式，
>
> ​	`align-content`  相当于把一根轴线当成一个 `item` 用来进行排列。

## 四、项目的属性

> 上面一章主要设置的是外层容器也就是 `container` 的属性。
>
>  这一章设置的是`container`内部的子元素 `item` 的属性。
>
> 下面6个属性是设置在子元素`item`上的，当父元素设置了`display: flex`后，子元素可设置如下属性。
>
> ```css
> 	order:
> 	flex-grow:
> 	flex-shrink:
> 	flex-basis:
> 	flex:
> 	align-self：
> ```

### 4.1 order属性

> ​	`order`定义的是项目的排列顺序，数值越小，排列越靠前， 默认为0；
>
> ```css
> .item{
>     order: 1;
> }
> ```

### 4.2 flex-grow属性

> ​	`flex-grow`其实就是设置多个 `item` 占用空间大小的， 默认所有项都为 1；
>
> ```css
> .item{
>     flex-grow: 1
> }
> ```
>
> ​	当都为 `1`（不设置或者均相等） 的时候，相当于所有的子项目都是一样大的。
>
> ​	当不相等的时候类似于栅格，栅格一般定义为24格， 这里所有子项目的 `flex-grow` 相加就是栅格总的个数，之后在按照各个子项目占据的比例进行分配。

### 4.3 flex-shrink属性

> ​	`flex-shrink`定义了项目缩小比例，默认为1 ，当空间不足的时候，改项目就会缩小。
>
> ```css
> .item{
>     flex-shrink: 1;
> }
> ```
>
> 所有`item` 都为1 的时候，空间不足的时候，所有子项目等比例缩小
>
> 当一个`item`的 `flex-shrink` 设置为 `0` 的时候，其他项目等比例缩小， 为`0`的`item`  大小不变；
>
> 当 `flex-shrink` 为 负值 的时候，该属性失效。

### 4.4 flex-basis属性

> `flex-basis`属性定义了在分配多余的空间之前，项目占据主轴的空间，默认值为`auto`， 即不改变大小。
>
> ```css
> .item{
>     flex-basis: auto;
> }
> ```

### 4.5 flex属性 

> 在实际的使用中，最常用的就是这个`flex`属性。
>
>  其实`flex` 属性是 `flex-grow`  、`flex-shrink` 、 `flex-basis`  这三个属性的简写，后两个属性为可选属性。 默认值为 `0 0 auto`；
>
>  快捷值 `auto` 为 `1 1 auto`;
>
>  快捷值`none` 为 `0 0 auto`;
>
> 设置时最好优先使用  `flex`组合属性，减去浏览器自己推算的时间。

### 4.6 align-self属性

> ​	`align-self`属性允许单个项目有与其他项目不一样的对其方式， 用来覆盖 `align-items`属性，默认值为`auto`, 表示继承父元素 `align-items`的属性，没有父元素  则等同于 `stretch`;
>
> ```css
> .item{
>     align-self: auto| flex-start| flex-end| center| baseline| stretch;
> }
> ```
>
> 属性与 `align-items` 一致。

