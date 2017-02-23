/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(resolve, seconds * 1000);
    });
    return promise;
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
    let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
    var promise = new Promise(function (resolve, reject) {
        try {
            resolve();
        } catch (e) {
            reject(e);
        }
    });
    return promise.then(function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', false);
        xhr.send();

        var objCity = JSON.parse(xhr.responseText);
        objCity.sort(function (a, b) {
            return a.name > b.name;
        });
        return objCity;
    });
}

export {
    delayPromise,
    loadAndSortTowns
};
