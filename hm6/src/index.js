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
        var xhr = new XMLHttpRequest(),
            o;
        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);

        xhr.addEventListener("load", function () {
            if (xhr.status !== 200) {
                console.log("Ошибка");
            } else {
                try {
                    o = JSON.parse(xhr.responseText);
                    o.sort(function (a, b) {
                        if (a.name > b.name) {
                            return 1;
                        } else if (a.name < b.name) {
                            return -1;
                        }
                        return 0;
                    });
                    try {
                        resolve(o);
                    } catch (e) {
                        reject(e);
                    }
                } catch (e) {
                    console.log("Error!");
                }
            }
        });

        xhr.send();
    });
    return promise;
}

export {
    delayPromise,
    loadAndSortTowns
};
