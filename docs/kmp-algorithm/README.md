### KMP 算法

##### 什么是KMP算法：

> ​	该算法由三位学者发明的，他们的名字开头首字母组成了KMP。

##### KMP算法解决了什么问题

​	主要用于匹配字符串，当一部分字符串 匹配失败时，通过`next`数组回溯到某个位置来规避一些不必要的匹配，避免从头进行匹配，时间复杂度更低为O(M*N)。

##### next数组是什么

​	next数组是最大相等前缀表，我们通过这个前缀表来知道当我们 `模板串`和`文本串` 不匹配的时候，我们回溯到哪里来进行重新匹配。

```javascript
	//假如 文本串为  aabaabaaf;	模版串为	aabaaf;
	想要寻找 文本串中是否含有模版串，如果有，返回他的位置，如果没有，返回-1；  indexOf() 功能
```

###### 前缀

​	包含第一个字母，不包含最后一个字母的字符串

###### 后缀

​	包含最后一个字母，不包含第一个字母的字符串

```javascript
	"aabaaf" 的前缀分别为  
    		"a"、"aa"、"aab"、"aaba"、"aabaa"。		("aabaaf"不是，不能包含尾字母)
	"aabaaf" 的后缀分别为
    		"f"、"af"、"aaf"、"baaf"、"abaaf"		("aabaaf"不是)		
```

###### 最长相等前后缀的长度

```javascript
	"aabaaf" 的子串分别为
    			"a"、"aa"、"aab"、"aaba"、"aabaa"、"aabaaf"。
最长相等前后缀长度  0	1     0       1       2       0
			
```

#### 前缀表求法 (next数组)

```javascript
	function nextArr(str){
        let j = 0;
        let next = [0];
        for(let i=1; i<str.length; i++){
            //先判断不相等的时候
            while(j > 0 && str[i] !== str[j]){
                j = next[j - 1];
            }
            //相等的时候
            if(str[i] === str[j]){
               	j++;
            }
            next[i] = [j];
        }
        return next;
    }
	nextArr("aabaaf")	=>  [0, 1, 0, 1, 2, 0];
```

#### 简单实现indexOf（）功能

```javascript
	function strIndex (str, model) {
    if (model.length === 0) return 0;
    let next = getNext(needle);		//[0, 1, 0, 1, 2, 0];
    let j = 0;
    for (let i = 0; i < str.length; i++) {
        //不匹配的情况下
        while (j > 0 && str[i] !== model[j]) {
            j = next[j - 1];
        }
        //匹配的情况下
        if (str[i] === model[j]) {
            j++;
        }
        //跳出条件
        if (j === model.length) {
            return i - j + 1;
        }
    }
    return -1;
};
```



