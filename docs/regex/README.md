# 1.基本匹配

- 正则表达式是由一些字母和数字组成的一个搜索模版。  

  > ​	例如一个正则表达式 the,  表示匹配接连的三个字母 "the"。

```javascript
const reg = /the/g
const regResult = "The cat sat on the mat. the one".match(reg);
regResult // ["the", "the"];
```

> 正则表达式是区分大小写字母的，也就是字符串"The" 不会被匹配

# 2.元字符

- 正则表达式内置了一些特殊的模版，代表了相应的意思，也就是元字符。相当于给我们一些工具，我们借助 元字符 可以使我们的正则表达式更加简洁。

| 元字符  | 描述                                                         |
| :-----: | ------------------------------------------------------------ |
|    .    | 句号匹配任意单个字符 除了换行符。                            |
|   []    | 字符的种类，匹配方括号内的任意字符 例如： [0-9]              |
|   [^]   | 否定的字符种类，匹配除了方括号内部的任意字符  \[^0-9\]。除了0-9以外的字符 |
|    *    | 匹配 > = 0 个重复的在* 之前的字符  可以为0                   |
|    +    | 匹配 > = 1个重复在+ 之前的字符   不可以0  最少为1            |
|   ？    | 标记？之前的字符为可选                                       |
| ｛n,m｝ | 匹配num个大括号之前的字符或者字符集{ n < num < m};           |
|  {xyz}  | 匹配与xyz完全相等的字符串                                    |
|   \|    | “或" 运算符， 匹配符号前面或者后面的字符                     |
|    \    | 转义字符，用于匹配保留的字符 如： [ ] ( ) { } . *  + ? ^ $ \ \| |
|    ^    | 从开始行开始匹配                                             |
|    $    | 从末端开始匹配                                               |

## 2.1点运算符

- . 在运算符中是最简单的， 它匹配任意单个字符，但是不能匹配换行符。

  > ".ar" => The car parked in the garage, is 
  >
  > arrived.
  >
  > ```javascript
  > const reg = /.ar/g;
  > const regResult = "The car parked in the garage.".match(reg);
  > // regResult =>  ["car", "par", "gar"];
  > ```
  >
  > 

## 2.2 字符集

- 字符集就是用方括号来指定一个集合，在方括号中可以指定字符集的范围，字符集不关心里面的顺序

  > ​	"[Tt]he" 可以用来匹配 "the" "The";
  >
  > ```javascript
  > const reg = /[Tt]he/g;
  > const regResult = "The car parked in the garage.".match(reg);
  > // regResult => ["The", "the"];
  > ```
  >
  > ​	ar[.] 用来匹配 ar. 的字符串
  >
  > ```javascript
  > const reg = /ar[.]/g
  > const regResult = "park a car.".match(reg);
  > // regResult => ["ar."]
  > ```

### 2.21否定字符集

- ”^“ 一般时用来表示一个字符串的开头，但是当他用在方括号内的时候，表示这个字符集是否定的，例如 \[^c]ar 表示了匹配 后面跟着ar 的除了 c 的任意字符

  > ```javascript
  >   	>const reg = /[^c]ar/g;
  >   	>const regResult = "car bar garge.".match(reg);
  >   	>// regResult => ["bar", "gar"];
  >   	>```
  > ```

## 2.3 重复次数

> ​	上面表格提到了不同 * + ？ 三个元字符分别代表的含义。

### 2.3.1 * 号

> ​	*号匹配的是在 * 之前的字符串出现 大于或者等于 0 次。
>
> ​	a * 表示匹配 0 个或者多个以a 开头的字符
>
> ​	[a-z]* 表示匹配所有以小写字母开头的字符串
>
> ​    可以和表示匹配空格的 \s 连在一起使用
>
> ​    比如： \s\*cat\s\*   匹配的就是  cat 前面和后面均有一个或者多个空格
>
> ```javascript
> const reg = /\s*cat\s*/g;
> const regResult = "   cat   iscatff a".match(reg);
> // regResult => ["   cat  ", "cat"];
> ```
>
> 

### 2.3.2 +号

> - 号用来匹配 + 号之前的字符出现 > = 1次  
>
> c.+t      =>   "cafft cft"    ["cafft cft"]
>
> c[a]+t   =>  "caaaat cfat cat" => ["caaaat", "cat"]
>
> ```javascript
> const reg = /c[a]+t/g;
> const regResult = "caaat ct caft cat".match(reg);
> // regResult => ["caaat", "cat"]	此时无法匹配 ct
> ```
>
> 

### 2.3.3 ？号

> ​	正则表达式中 元字符 ？ 表示在符号前面的字符为可选，即可以出现 0 - 1 次
>
> ​	例如 [T]?he 可以匹配 字符 he 和 The
>
> ```javascript
> const reg = /[T]he?/g;
> const regResult = "The car is parked in the garage.";
> // regResult => ["The", "the"];
> ```
>
> 

## 2.4 ｛｝号

> ​	正则表达式中｛｝是一个量词，用来限定一个或者一组字符串可以重复出现的次数。
>
> ​	[0-9]{3,5} 表示匹配最少3位 最多5位的 0-9的数字。
>
> ```javascript
> const reg = /[0-9]{3,5}/g;
> const regResult = "12.1234 12.2 124.244 1234123".match(reg);
> // regResult => ["1234", "124", "244", "12341"];
> 
> ```
>
> ｛3｝则表示重复3次    {3, } 表示最少3次

## 2.5 （...） 特征标群

> ​	特征标群是一组写在 `(...)` 中的子模式。`(...)` 中包含的内容将会被看成一个整体，和数学中    小括号（ ）的作用相同。例如, 表达式 `(ab)*` 匹配连续出现 0 或更多个 `ab`。如果没有使用 `(...)` ，那么表达式 `ab*` 将匹配连续出现 0 或更多个 `b` 。再比如之前说的 `{}` 是用来表示前面一个字符出现指定次数。但如果在 `{}` 前加上特征标群 `(...)` 则表示整个标群内的字符重复 N 次。

- 我们可以在 ( ) 中用字符 | 表示 或

  ```javascript
  const reg = /(a|b|c)ar/g;
  const regResult = "aar bar car dar ccar".match(reg);
  // regResult => ["aar", "bar", "car", "car"]
  
  ```

## 2.6 | 运算符

> ​	表示或 用来判断条件
>
> ​	(T|t)he | car    用来匹配的是 ( T | t)he 或者  car 
>
> ```javascript
> const reg = /(T|t)he|car/g;
> const regResult = "The car is the one".match(reg);
> // regResult =>  ["The", "car", "the"];
> 
> ```
>
> 

## 2.7转码特殊字符

> ​	反斜线 \ 在表达式中用于转码紧跟其后的字符， 用于指定 `{ } [ ] / \ + * . $ ^ | ?` 这些特殊字符。如果想要匹配这些特殊字符则要在其前面加上反斜线 `\`。 
>
> ​	例如 `.`是用来匹配除换行符外所有字符的，如果想要匹配句子中的 `.` 则要写成 `\.` 以下这个例子 `\.?`是选择性匹配`.`
>
> ```javascript
> const reg = /(f|c|m)at\.?/g;
> const regResult = "The fat cat sat on the mat.".match(reg);
> // regResult => ["fat", "cat", "mat."]
> 
> ```
>
> 

## 2.8锚点

> ​	正则表达式中，如果想要匹配指定开头或者结尾的字符串要使用到锚点  `^`开头 `$`结尾。
>
> + 如 在字符串 `abc`中 ， 使用 `^a`匹配  会得到`a`， 如果使用 `b`则匹配不到任何结果，因为不是以`b`开头。
>
> > ​	^(T|t)he 匹配以 The 或者 the 开头的字符串
> >
> > ```javascript
> > const reg = /^(T|t)he/g;
> > const regResult ="The cat sat on the mat".match(reg);
> > // regResult => ["The"]
> > ```

> + `$`与`^`号一样，用来匹配字符串是否为最后一个。
>
>   > ​	`(at\.)$` 是用来匹配 以 `at.`结尾的字符串
>   >
>   > ```javascript
>   > const reg = /(at\.)$/g;
>   > const regResult = "The cat sat on the mat.".match(reg);
>   > // regResult =>["mat."];
>   > ```

## 3简写字符集

> ​	正则表达式提供了一些简写的字符集合

| 简写 | 描述                                               |
| ---- | -------------------------------------------------- |
| .    | 除换行符以外的所有字符                             |
| \w   | 匹配所有的字母、数字。 等同于`[a-zA-Z0-9_]`        |
| \W   | 匹配所有的非字母、数字，即为符号，等同于 `[^\w]`   |
| \d   | 匹配所有的数字，等同于 `[0-9]`                     |
| \D   | 匹配所有的非数字 等同于 `[^d]`                     |
| \s   | 匹配所有的空格字符， 等同于 `[\t\n\f\r\p{z}]`      |
| \S   | 匹配所有的非空格字符， 等同于 `[^\s]`              |
| \f   | 匹配换页符                                         |
| \n   | 匹配换行符                                         |
| \r   | 匹配回车符                                         |
| \t   | 匹配制表符                                         |
| \v   | 匹配垂直制表符                                     |
| \p   | 匹配 CR/LF（等同于 `\r\n`），用来匹配 DOS 行终止符 |

## 4.零宽度断言（前后预查）

> ​	先行断言和后发断言都属于**非捕获簇**（不捕获文本，也不针对组合进行计数）。

| 符号  | 描述            |
| :---: | --------------- |
|  ?=   | 正先行断言-存在 |
|  ? !  | 负先行断言-排除 |
| ? < = | 正后发断言-存在 |
| ? < ! | 负后发断言-排除 |

### 4.1？= ...正先行断言

`?=...`正先行断言，表示第一部分表达式必须跟着 `?...`定义的表达式。

返回结果只包含满足匹配条件的第一部分的表达式。定义一个先行断言要使用`()`。在括号内部使用一个问号和一个等号： `(?= ...)`。

> 正先行断言的内容卸载括号中的等号后面。例如，表达式 `(T|t)he(?=\sfat)` 匹配The 与 the， 在括号中我们又定义了正先行断言 `(?=\sfat)`。 即 `The` 与 `the`后面需要紧跟着 `（空格）fat`。
>
> ```javascript
> const reg = /(T|t)he(?=\sfat)/g；
> const regResult = "The fat cat sat on the mat.".mathc(reg);
> //regResult => ["The"]
> ```

### 4.2 ?! ... 负先行断言

负先行断言 `?!`用于筛选所有的匹配结果，筛选条件为 其后不跟随着断言中定义的格式， `正先行断言`定义与`负先行断言`一样。  区别就是 `? = ` 变成了 `? !`;

> ​	表达式 `(T|t)he(?!\sfat)`匹配的是 `The`与`the`且之后不跟着 `(空格)fat`。
>
> ```javascript
> const reg = /(T|t)he(?!\sfat)/;
> const regResult = "The fat cat sat on the mat.".match(reg);
> // regResult => ["the"];
> ```

### 4.3 ?<= ... 正后发断言

正后发断言记作 `(?<= ...)` 用于筛选所有匹配结果， 筛选的条件为其前跟随着断言中定义的格式。例如，表达式`(?<=(T|t)he\s)(fat|mat)` 。 前面的表达式用来匹配 `fat`与 `mat`，且其前面跟着`The`或者`the`。

> ```javascript
> const reg = /(?<=(T|t)he\s)(fat|mat)/g;
> const regResult = "The fat cat sat on the mat.".match(reg);
> // regResult => ["fat","mat"];
> ```

### 4.4 ?<!... 负后发断言

负后发断言记作 `(?<! ...)`用于筛选所有匹配结果， 筛选的条件为 其前不跟随着断言中定义的格式。例如，表达式  `(?<!(T|t)he\s)(cat)`， 匹配`cat` 且其前面不跟着 `The`或者`the`。

> ```javascript
> const reg = /(?<!(T|t)he\s)(cat);
> const regResult = "The cat sat on cat.".match(reg);
> // regResult => [cat];
> ```

## 5 标志

标志也叫模式修正符， 因为他可以用来修改表达式的搜索结果。这些标志可以任意的组合使用，它也是整个正则表达式的一部分。

| 标志 | 描述                                                 |
| :--: | ---------------------------------------------------- |
|  i   | 忽略大小写                                           |
|  g   | 全局搜索                                             |
|  m   | 多行修饰符：锚点元字符 `^` `$`工作范围在每行的起始。 |

### 5.1忽略大小写

修饰语 `i`用来忽略大小写。 例如表达式 `/The/gi`表示全局搜索 `The`， 在后面的 `i`将其条件修改为忽略大小写，则变成了搜索 `the`和 `The`,  `g`表示全局搜索.

```javascript
const reg = /The/gi;
const regResult = "The fat cat sat on the mat.".match(reg);
\\ regResult => ["The", "the"];
```

### 5.2全局搜索

修饰符 **`g` **用来表示执行全局的匹配，不仅仅返回第一个匹配的结果，而是返回全部的结果。 例如表达式 `/.(at)/g` 表示搜索除换行符意外的任意字符 和 `at`，并返回全部结果.

> ```javascript
> const reg = /.(at)/g;
> const regResult = "The fat cat sat on the mat.".mach(reg);
> // regResult => ["fat","cat","sat","mat"];
> ```

### 5.3多行修饰符

多行修饰符 `m`用于执行一个多行匹配；

像之前介绍的 `(^,$)` 用于检查格式是否是在待检测字符串的开头或结尾。但我们如果想要它在每行的开头和结尾生效，我们需要用到多行修饰符 `m`。

例如，表达式 `/at(.)?$/gm` 表示小写字符 `a` 后跟小写字符 `t` ，末尾可选除换行符外任意字符。根据 `m` 修饰符，现在表达式匹配每行的结尾。

```javascript
const reg  = /.at(.)?$/gm;
const regResult = "The fat
				cat sat 
				on the mat.".match(reg);
// regResult => ["fat","sat", "mat."]
```

## 6.贪婪匹配原则与惰性匹配原则

正则表达式默认采用贪婪匹配模式，该模式下默认匹配尽可能长的字符串，可以用 `?` 将贪婪模式变成惰性模式。

​	当为贪婪模式时

> ```javascript
> const reg = /(.*at)/g;
> const regResult = "The fat cat sat on the mat.".match(reg);
> // regResult => ["The fat cat sat on the mat"];
> ```
>
> 当为惰性模式时
>
> ```javascript
> const reg = /(.*?at)/g;
> const regResult = "The fat cat sat on the mat.".match(reg);
> // regResult => ["The fat"];
> ```
>
> 