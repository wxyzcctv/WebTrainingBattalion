## 产生式的写法
- BNF: 巴科斯-诺尔范式
   - <中文>::=<句子>|<中文><句子>
   - <句子>::=<主语><谓语><宾语>|<主语><谓语>
   - <主语>::=<代词>|<名词>|<名词性短语>
   - <代词>::="你"|"我"|"他"

- EBNF: 扩展巴科斯-诺尔范式
   -  中文::={句子}
   -   **{}表示可以重复多个**
   -   句子::=主语 谓语 [宾语]
   -   **[] 表示可以为0-1个**
   -   主语::=代词|名词|名词性短语
   -   代词::="你"|"我"|"他"
## 产生式的练习
- ### 1 外星语言
   -   某外星人采用二进制交流
   -   它们的语言只有“叽咕”和“咕叽”两种词
   -   外星人没说完一句，会说一个“啪”

   -  <外星语>::={<外星句>}
   -  <外星句>::={“叽咕”|“咕叽”}啪

- ### 2 数据语言四则运算，只允许10以内整数的加减乘除
- **乘除的优先级比加减的优先级高**
- **乘除是可以进行连乘除的**

   -  <四则运算表达书>::=<加法算式>
   -  <加法算式>::=(<加法算式>("+"|"-")<乘法算式>)|<乘法算式>
   -  <乘法算式>::=(<乘法算式>("*"|"/")<数字>)|<数字>
   -  <数字>::={"0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}

- ### 3 四则运算，允许整数
   -  10以内的整数包括整数开头的数，0开头的就只有0

   -  <四则运算表达书>::=<加法算式>
   -  <加法算式>::=(<加法算式>("+"|"-")<乘法算式>)|<乘法算式>
   -  <乘法算式>::=(<乘法算式>("*"|"/")<数字>)|<数字>

   -  <数字>::={"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}|{"0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}

- ### 4 四则运算，允许小数
   -  10以内的小数包括0开头的小数

   -  <四则运算表达书>::=<加法算式>
   -  <加法算式>::=(<加法算式>("+"|"-")<乘法算式>)|<乘法算式>
   -  <乘法算式>::=(<乘法算式>("*"|"/")<数字>)|<数字>

   -  <数字>::={"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}|{"0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}("."){"0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}

- ### 5 四则运算，允许括号
   -  10以内的整数包括整数开头的数，0开头的就只有0

   -  <四则运算表达书>::=<加法算式>
   -  <加法算式>::=(("(")<加法算式>(")")("+"|"-")<乘法算式>)|<乘法算式>
   -  <乘法算式>::=(("(")<乘法算式>(")")("*"|"/")<数字>)|<数字>

   -  <数字>::={"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}|{"0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}

## 乔姆斯基谱系
0型1型属于2型属于3型，计算机语言大多是属于2型和3型
- 3型 正则文法(Regular)
   - \<A>::=\<A>?
   - ~~\<A>::=?\<A>~~
- 2型 上下文无关文法
   - \<A>::=?
- 1型 上下文相关文法
   - ?\<A>\*::=?\<B>\*
- 0型 无限制文法
   - ?::=?

## 词法和语法
- 词法: 正则文法（3型）
   - 空白
   - 换行
   - 注释（给人看的内容）
   - Token（编程语言中的有效部分：包括具体的数据类型（1、1.2）、关键词（if、else、while）、符号（大括号、中括号、小括号、+、-、*、/ ...））
- 语法: 上下文无关文法（2型）
   - 语法树

- lex(词法)--lexer(词法分析器)，syntax(语法)，词法和语法统称grammar。
在拿到所有的token之后，将其作为一个输入的流，再做语法解析，此时就会将其作为2型语言进行处理，所以语言会有两份产生式：词法产生式、语法产生式，现在的大部分语言都是这样处理的。然后会得到一颗语法树，一颗单根的树，由产生式一步步聚合而成，去除一些无效信息就是一颗AST抽象语法树，可用于代码的结构处理，为代码做一些翻译工作，也可以做自动的review，前端的babel主要就是做的这个事儿


## 词法输入
- 最顶层的输入叫InputElement
```
InputElement ::= WhiteSpace | LineTerninator | Comment | Token
```
- 空白符
```
WhiteSpace ::= " " | "　"
```
- 换行符
```
LineTerninator ::= "\n" | "\r"
```
- 注释
```
Comment ::= SingleLineComment | MultilineComment
// 单行注释双斜杠开头，后接任意多个任意字符
SingleLineComment ::= "/" "/" <any>*
// 多行注释以 /*开头*/结尾
MultilineComment ::="/" "*" ([^*] | "*" [^/])* "*" "/"
```
- 有效部分
```
Token ::= Literal | Keywords | Identifier | Punctuator

// 直接量 1 1.5 "asb" 'asda' true false
Literal ::= NumberLiteral | BooleanLiteral | StringLiteral | NullLiteral
// undefined 指的是没有值，null表示有值，这个值为空
// 关键字
Keywords ::= "if" | "else" | "for" | "function" | ...
// 符号
Punctuator ::= "+" | "-" | "*" | "/" | "{" | "}" | ...

```
## 语法输入
- 程序最顶层的名字一般都是Program
```
Program ::= Statement+ 
```
- Statement表示语句，Program是由多条Statement组成的
- - Statement中包含有：表达式、if判断、for循环、while循环、变量声明、函数声明、类声明、循环中的break、continue、return、throw、try、块
```
Statement ::= ExpressionStatement | IfStatement | ForStatement | WhileStatement | VariableDeclaration | FuntionDeclaration | ClassDeclaration | BreakStatement | ContinueStatement | ReturnStatement | ThrowStatement | TryStatement | Block
```
- IfStatement
```
IfStatement ::= "if" "(" Expression ")" Statement
```
- Block
```
Block ::= "{" Statement "}"
```
- TryStatement
```
TryStatement ::= "try" "{" Statement+ "}" "catch" "(" Expression ")" "{" Statement+ "}"
```
- ExpressionStatement
```
ExpressionStatement ::= Expression ";"

Expression ::= AdditiveExpression
// 四则运算
AdditiveExpression ::= MultiplicativeExpression | AdditiveExpression ("+" | "-") MultiplicativeExpression
// 乘法运算
MultiplicativeExpression ::= UnaryExpression | MultiplicativeExpression ("*" | "/") UnaryExpression
// 一元运算
UnaryExpression ::= PrimaryExpression | ("+" | "-" | "typeof") PrimaryExpression
// 优先运算
PrimaryExpression ::= "(" Expression ")" | Literal | Identifier

```
