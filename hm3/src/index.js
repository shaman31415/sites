/* ДЗ 3 - объекты и массивы */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (var i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    var transformArray = [];
    for (var i = 0; i < array.length; i++) {
        transformArray.push(fn(array[i], i, array));
    }
    return transformArray;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
    var acc = (initial === undefined) ? array[0] : initial;
    for (var i = (initial === undefined) ? 1 : 0; i < array.length; i++) {
        acc = fn(acc, array[i], i, array);
    }
    return acc;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key === prop) {
                delete obj[key];
            }
        }
    }
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key === prop) {
                return true;
            }
        }
    }
    return false;
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    var enumArr = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            enumArr.push(key);
        }
    }
    return enumArr;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    var arrProps = Object.keys(obj);
    return arrProps.map(function (item) {
        return item.toUpperCase();
    });
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from, to) {
    var sliceArr = [];
    if (from === undefined) {
        from = 0;
    } else {
        from = (from < 0) ? Math.max(array.length + from, 0) : from;
    }
    if (to === undefined) {
        to = array.length;
    } else {
        to = (to < 0) ? Math.max(array.length + to, 0) : Math.min(array.length, to);
    }
    for (var i = from; i < to; i++) {
        sliceArr.push(array[i]);
    }

    return sliceArr;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    var proxy = new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = value ** 2;
            return target[prop];
        }
    });
    return proxy;
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
