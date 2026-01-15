// # 数组的创建
// 1. Array.of()：将参数中所有值作为元素形成数组。
console.log(Array.of(1, 2, 3, 4)); // [1, 2, 3, 4]

// 参数值可为不同类型
console.log(Array.of(1, '2', true)); // [1, '2', true]

// 参数为空时返回空数组
console.log(Array.of()); // []

// 2. Array.from(arrayLike, mapfn, thisArg)：将类数组对象或可遍历对象转换成数组。
// 参数为数组,返回与原数组一样的数组
console.log(Array.from([1, 2])); // [1, 2]

// 参数含空位
console.log(Array.from([1, , 3])); // [1, undefined, 3]

// mapfn参数（可选），是一个函数，可以将数组元素映射成新的元素
console.log(Array.from([1, 2, 3], x => x * x))

// thisArg参数（可选），指定mapfn函数的this对象
let map = {
    func: function (n) {
        return n * 2
    }
}
let arrLike = [1, 2, 3]
console.log("使用thisArg参数", Array.from(arrLike, function (x) { return this.func(x); }, map))

// ## 类数组对象
// 一个类数组对象必须含有length属性，且元素属性名必须是数值或可以转换为数值的字符。
let arrayLike = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
}
console.log(Array.from(arrayLike)); // ['a', 'b', 'c']

// 没有length属性，则返回空数组
console.log(Array.from({ 0: 'a', 1: 'b' })); // []

// 元素属性名不是数值或者不能转换为数值，则返回长度为length、元素为undefined的数组
console.log(Array.from({ "name": "Alice", "age": 25, length: 2 })) // [ undefined, undefined ]

// ## 转换可迭代对象
// 1. map转Array
let map1 = new Map()
map1.set("key1", "value1")
map1.set("key2", "value2")
console.log(Array.from(map1))

// 2. set转Array
let set = new Set()
set.add("a")
set.add("b")
console.log(Array.from(set))

// 3. 字符串转Array
console.log(Array.from("hello")) // ['h', 'e', 'l', 'l', 'o']

// # 扩展的方法
console.log("=== 扩展的方法 ===")
// 1. 查找
// find():查找数组中符合条件的元素，如果有多个符合条件的元素，则返回第一个元素
var arr = [1, 2, 3, 4, 5]
findVal = arr.find((val, index) => val > 3)
console.log("find()", findVal) // 4

// findIndex():查找数组中符合条件的元素的索引，如果有多个符合条件的元素，则返回第一个元素的索引
findIdx = arr.findIndex((val, index) => val > 3)
console.log("findIndex()", findIdx) // 3

// 2. 填充
// fill():用指定的值填充数组中从起始索引到终止索引内的全部元素
var arr2 = Array.of(1, 2, 3, 4, 5)
console.log(arr2.fill("*", 1, 4)) // [1, "*", "*", "*", 5]

// copyWithin():将数组中指定位置的元素复制到数组的另一个位置中
var arr3 = Array.of(1, 2, 3, 4, 5)
console.log(arr3.copyWithin(0, 3, 5)) // [4, 5, 3, 4, 5]

// 3. 遍历
// entries():返回一个数组迭代器对象，该对象包含数组中每个索引的键值对
var arr4 = Array.of(1, 2, 3, 4, 5)
for (let [key, value] of arr4.entries()) {
    console.log(`${key} -> ${value}`)
}

// keys():返回一个包含数组中每个索引的迭代器对象
// for(let key of arr4.keys()){
//     console.log(key)
// }   
iterator = arr4.keys()
result = iterator.next()
// console.log(iterator.next()) // { value: 0, done: false }
while (!result.done) {
    console.log("key:", result.value)
    result = iterator.next()
}
// values():返回一个包含数组中每个元素的迭代器对象
for (let value of arr4.values()) {
    console.log("value:", value)
}

// 4. 包含
// includes():判断数组中是否包含某个元素
console.log(arr4.includes(3))

// 5. 嵌套数组转一维数组
// flat():将嵌套数组转换为一维数组
var arr5 = [1, 2, [3, 4, [5, 6]]]
console.log(arr5.flat(2))

// flatMap(): 先对数组中的元素进行处理，在进行扁平化
arr5 = [1, 2, 3]
console.log(arr5.flatMap(x => [x * 2]))

// # 数组缓冲区
// 数组缓冲区是内存中的一段地址。定型数组的基础，实际字节数在创建时确定，之后只可以更改其中的数据，不可以修改大小。
// 1. 创建数组缓冲区
let buffer = new ArrayBuffer(16)
console.log("ArrayBuffer字节长度:", buffer.byteLength)
// 分割数组缓冲区
slicedBuffer = buffer.slice(1,9)
console.log("slice后ArrayBuffer字节长度:", slicedBuffer.byteLength)

// 2. 视图
// 视图可以操作数组缓冲区中的数据
// 1. 创建视图
let view = new DataView(buffer)
console.log(view.getInt8(0)) // 0
view.setInt8(0, 10)
console.log(view.getInt8(0)) // 10

// 3. 定型数组
// 数组缓冲区的特定类型的视图。可以强制使用特定的数据类型，而不是使用通用的 DataView 对象来操作数组缓冲区。
