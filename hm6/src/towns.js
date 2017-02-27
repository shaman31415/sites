/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    return require('./index').loadAndSortTowns();
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
	if (full.toLowerCase().indexOf(chunk.toLowerCase()) === -1) {
		return false;
	}
	return true;
} 

function isMatchingStart(full, chunk) {
	if (full.toLowerCase().indexOf(chunk.toLowerCase()) === 0) {
		return true;
	}
	return false;
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');

var xhr = new XMLHttpRequest(),
	o;
xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
xhr.send();

filterBlock.style.display = "none";

var readyFunc = function readyFunc() {
	if (xhr.readyState !== 4) {
		loadingBlock.innerHTML = "Не удалось загрузить города";
		var repeatButton = document.createElement("button");
		repeatButton.innerText = "Повторить";
		loadingBlock.appendChild(repeatButton);
		repeatButton.addEventListener("click", function () {
			readyFunc();
		});
	}
	
	if (xhr.status !== 200) {
		console.log("Ошибка");
	} else {
		filterBlock.style.display = "";
		loadingBlock.style.display = "none";
		o = JSON.parse(xhr.responseText);
		o.sort(function (a, b) {
			return a.name > b.name;
		});
	}
};

xhr.addEventListener("readystatechange", readyFunc);

filterInput.addEventListener('keyup', function(e) {
    let value = this.value.trim();
		
	filterResult.innerHTML = "";
		
    var arr = [];

	if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 8) {
		if (value !== "") {
		  for (var i = 0; i < o.length; i++) {
			if (isMatchingStart(o[i].name, value)) {
			  arr.push(o[i].name);
			}
		  }
		  if (arr.length === 0) {
			filterResult.innerHTML = "Результатов не найдено";
		  } else {
			for (var i = 0; i < arr.length; i++) {
			  filterResult.innerHTML += arr[i] + "<br>";
			}
		  }
		}
	}
});

export {
    loadTowns,
    isMatching
};
