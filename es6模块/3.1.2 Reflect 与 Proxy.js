// # 概述
// Proxy 与 Reflect 是 ES6 为了操作对象引入的 API 。
// Proxy 可以对目标对象的读取、函数调用等操作进行拦截，然后进行操作处理。它不直接操作对象，而是像代理模式，通过对象的代理对象进行操作，在进行这些操作时，可以添加一些需要的额外操作。
// Reflect 可以用于获取目标对象的行为，它与 Object 类似，但是更易读，为操作对象提供了一种更优雅的方式。它的方法与 Proxy 是对应的。

// ## 基本用法
// Proxy
// 一个 Proxy 对象由两个部分组成： target 、 handler 。在通过 Proxy 构造函数生成实例对象时，需要提供这两个参数。
// target 即目标对象， handler 是一个对象，声明了代理 target 的指定行为。
let target = {
    name: "zhangsan",
    age: 20
}
let handler = {
    get: function (target, key) {
        console.log("getting", key)
        // 不是target.key
        return target[key]
    },
    set: function (target, key, value) {
        console.log("setting", key, value)
        target[key] = value
    }
}

// 定义Proxy对象
let proxy = new Proxy(target, handler)
console.log(proxy.name) // getting name  zhangsan。这个过程会自动调用proxy对象的get方法

proxy.age = 30 // setting age 30。这个过程会自动调用proxy对象的set方法
console.log(proxy)

// 也可以定义空的target对象
target = {}
proxy = new Proxy(target, handler)
// 调用get方法，此时对象属性为空，获取不到name属性
console.log(proxy.name) // undefined

// 通过set方法设置属性
proxy.name = "lisi" // setting name lisi
console.log(proxy)

// handler对象也可以为空，相当于直接操作target对象
target = {
    name: "zhangsan",
    age: 20
}
handler = {}
proxy = new Proxy(target, handler)
console.log(proxy.name) // zhangsan
proxy.age = 30
console.log(proxy) // { name: 'zhangsan', age: 30 }

// 1. ## 实例方法  get(target, propKey, receiver)
// 用于target对象上propKey的读取操作
class Student {
    constructor(name, grader, subject, score) {
        this.name = name
        this.grade = grader
        this.subject = subject
        this._score = score
    }
}

let stu1 = new Student("zhangsan", "一年级", "语文", 95)
proxy = new Proxy(stu1, {
    get(target, propKey, receiver) {
        console.log("Getting", propKey)
        return target[propKey]
    }
})
console.log(proxy.name)

// get()方法可以继承
proxy = new Proxy(stu1, {
    get(target, p, receiver) {
        // 如果是私有属性，抛出异常
        if (p[0] === "_") {
            throw new Error(`不能访问私有属性 ${p}`)
        }
        console.log("Getting", p)
        return target[p]
    }
})
console.log(proxy.name)
// console.log(proxy._score) // 会抛出错误

// 2. ## 实例方法  set(target, propKey, value, receiver)
proxy = new Proxy(stu1, {
    set(target, p, newValue, receiver) {
        if (p === "_score") {
            if (newValue > 150) {
                throw new Error("分数不能大于150分")
            }
        }
        console.log("Setting", p, newValue)
        target[p] = newValue
    }
})
// proxy._score = 180
proxy._score = 140
console.log(stu1)

// 3. 实例方法  apply(target, ctx, args)
// 用于拦截函数调用、call、reply等操作。target表示目标函数、ctx表示函数运行时的this指向，args表示函数参数数组。
function sub(a, b) {
    return a - b
}

proxy = new Proxy(sub, {
    apply: function (target, ctx, args) {
        console.log("apply方法被调用")
        return Reflect.apply(...arguments)
    }
})
console.log(proxy(10, 5))

// 4. has(target, propKey): 用于拦截HasProperty操作，在判断目标对象是否有propKey属性时，会被此方法拦截。
class Person {
    constructor(name, age) {
        this.name = name
        this.age = age
    }
}

PersonProxy = new Proxy(Person, {
    has(target, p) {
        console.log(`has方法被调用, Person类是否包含属性${p}`)
        return p in target
    }
})
// let p1 = new PersonProxy("zhangsan", 20)
console.log("name" in PersonProxy) // true

// 5. construct(target, args): 用于拦截new关键字，在创建对象时，会被此方法拦截
StudentProxy = new Proxy(Student, {
    construct(target, argArray, newTarget) {
        console.log(`对象初始化操作被拦截，新的参数有: ${argArray}`)
        return Reflect.construct(...arguments)
    }
})
let stu2 = new StudentProxy("lisi", "二年级", "数学", 98)
console.log(stu2) // Student { name: 'lisi', grade: '二年级', subject: '数学', _score: 98 }

// ================= Reflect 对象 =================
// Reflect 对象与 Proxy 对象的方法是一一对应的，主要用于操作对象行为。它的所有方法都是静态方法，可以直接通过 Reflect.方法名 进行调用。
// ES6 中将 Object 的一些明显属于语言内部的方法移植到了 Reflect 对象上（当前某些方法会同时存在于 Object 和 Reflect 对象上），未来的新方法会只部署在 Reflect 对象上。
// Reflect 对象对某些方法的返回结果进行了修改，使其更合理。
// Reflect 对象使用函数的方式实现了 Object 的命令式操作。

// 静态方法1: Reflect.get(target, name, receiver)
person = {
    name: "Tom",
    age: 24,
    get info() {
        return `name: ${this.name}, age: ${this.age}`
    },
    set info(val) {
        return this.age = val
    }
}
// 通过Reflect获取属性
console.log(Reflect.get(person, "name"))
// 当target对象中有指定属性的getter方法时，getter方法的this会指向receiver参数
console.log(Reflect.get(person, "info", receiver = {name: "Jerry", age: 98})) // name: Jerry, age: 98

// 静态方法2: Reflect.set(target, name, value, receiver)
// 将target对象的name属性值更新为value。返回值为true，表示修改成功，false表示修改失败。
// console.log(Reflect.set(person, "age", 30))

// 如果target对象中有指定属性的setter方法时，setter方法的this会指向receiver参数
receiver = {age: 50}
console.log("更新是否成功？", Reflect.set(person, "info", 1, receiver))
console.log(receiver.age) // 1

// value为空时，会将指定属性值给清除
// Reflect.set(person, "name", ) // { name: undefined, age: 24, info: [Getter/Setter] }
// console.log(person)

// 静态方法3: Reflect.has(target, name)
// 用于判断target对象中是否包含name属性，返回true或false
console.log(Reflect.has(person, "age")) // true

// 静态方法4: Reflect.deleteProperty(target, name)
// 用于删除target对象中的name属性，返回true或false
console.log(Reflect.deleteProperty(person, "age")) // true
console.log(person) // { name: 'Tom', info: [Getter/Setter] }

// 静态方法5: Reflect.construct(target, args, newTarget)
// 等同于 new target(...args)。
function Animal(type, color) {
    this.type = type
    this.color = color
}

let dog = Reflect.construct(Animal, ["dog", "white"]) // Animal { type: 'dog', color: 'white' }
console.log(dog)

// 静态方法6: Reflect.getPrototypeOf(obj)
// 用于获取obj对象的原型对象，等同于 Object.getPrototypeOf(obj)
console.log(Reflect.getPrototypeOf(dog) === Animal.prototype) // true

// 静态方法7: Reflect.setPrototypeOf(obj, proto)
// 用于设置obj对象的原型对象为proto，等同于 Object.setPrototypeOf(obj, proto)
class Cat {
}

let cat = {}
console.log("Reflect.setPrototypeOf(cat, Array.prototype)", Reflect.setPrototypeOf(cat, Array.prototype))

// 静态方法8: Reflect.apply(func, thisArg, args)
function add(x, y) {
    return x + y
}
console.log(Reflect.apply(add, null, [10, 20])) // 30
// thisArg参数用于指定函数运行时的this指向
let calculator = {
    factor: 2,
    multiply(x) {
        return x * this.factor
    }
}
console.log(Reflect.apply(calculator.multiply, calculator, [5])) // 10
