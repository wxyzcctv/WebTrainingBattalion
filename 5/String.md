
## String(字符串)
### 字符集
什么叫字符？
不同的系统字符的定义不同，各个相互独立的系统中会有不同的字符集，现在的字符集都有一个码点（code point）的概念，即每个字符都有一个编号，该编号就是计算机里面用来表示字符的编码。
1. ASCII
最早在计算机中出现的字符集，数量最少，只有127个。只包含了英文的大小写字母，数字0~9，以及一些特殊符号。现在基本上不会直接使用该字符集
2. Unicode
现在绝大多数计算机系统、软件系统都是用的是这一个字符集，兼容各国的字符，字符数量特别大，各国的达成的共识的一个字符集
3. UCS
相当于Unicode的2.0版本
4. GB（中国国家标准）
- - GB2312
- - GBK（GB13000）
- - GB18030
3个版本是递增的关系，GB18030基本包含了所有的中文文字，但是不包含其他国家的一些奇怪的文字
5. ISO-8859
ISO-8859并不是一个字符集，而是一堆字符集，基本上是欧洲诸国使用的一些字符，
6. BIG5
台湾的繁体中文标准
字符集只能使用一个，JavaScript使用的是Unicode字符集

## String-Encoding（编码）
### UTF
Unicode遵循的是UTF编码格式，通过合理安排计算机的存储空间来保存Unicode里面的数字，主要有两种编码格式UTF8和UTF16
- UTF-8
ASCII兼容
- UTF-16