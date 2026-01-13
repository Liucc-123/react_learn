// ## 拓展的方法
// # 1、子串的识别
// ES6之前判断字符串是否包含某个子串，通常使用 indexOf 方法，如果返回值不为-1，则表示包含该子串。
// ES6新增了子串的识别方法：
// - includes()：返回布尔值，表示是否找到了参数字符串。
// - startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
// - endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
let str1 = "apple,banana,grape"
console.log(str1.includes("apple"))
console.log(str1.startsWith("apple"))
console.log(str1.endsWith("app"))
// 以上方法还可以接收两个参数（需要搜索的字符串，起始搜索位置）
console.log(str1.startsWith("banana", 6)) // true

// # 2、重复字符串
// repeat(): 返回新的字符串，表示将原字符串重复n次。
let str2 = "abc,"
console.log(str2.repeat(2))

// # 3、字符串补全
// padStart(): 用于头部补全字符串。接收两个参数，表示目标字符串的长度和用于补全的字符串。
// padEnd(): 用于尾部补全字符串。接收两个参数，表示目标字符串的长度和用于补全的字符串。
let str3 = "12345"
console.log(str3.padStart(10, "*")) // *****12345
console.log(str3.padEnd(10, "-"))   // 12345-----

// # 4、模板字符串的扩展
// 模板字符串允许嵌入变量和表达式，使用反引号（`）包裹，变量和表达式使用${}包裹。
// 模板字符串还支持多行字符串，无需使用换行符或连接符。
let name = "Tom"
let age = 24
console.log(`我的名字是${name}，今年${age}岁，明年就是${age + 1}岁了。`)
// 多行字符串，不需要使用换行符或连接符
let str4 = `这是第一行
这是第二行
这是第三行`
console.log(str4)
// 在模板字符串中调用函数
function sayHello(name){
    return `${name}，祝你幸福！`
}
console.log(`大家好，${sayHello("小明")}`)

// 注意要点：模板字符串中的空格和换行都会保留的
let str5 = `  Hello World!  
`
console.log(str5.length) // 17

// # 5、标签模板
// 标签模板允许自定义模板字符串的处理方式。标签模板是一个函数，接收模板字符串的各个部分作为参数。
alert(`hello world`)