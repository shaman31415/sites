/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

var cookie = document.cookie,
	cookieArr = cookie.split("; ");
if (cookie !== "") {
	for (let i = 0; i < cookieArr.length; i++) {
		createCookieTr(cookieArr[i].split("=")[0], cookieArr[i].split("=")[1]);
	}
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

/**
 * Создает новый tr для таблицы со списком cookie
 *
 * @param name - имя cookie
 * @param value - значение cookie
 */
function createCookieTr(name, value) {
	document.cookie = name + "=" + value;
	var tr = document.createElement("tr");
	tr.innerHTML = "<td>" + name + "</td><td>" + value + "</td><td><button data-name=" + name + ">Удалить</button></td>";	
	if (isMatching(addNameInput.value, filterNameInput.value) || isMatching(addValueInput.value, filterNameInput.value) || filterNameInput.value === "") {
		listTable.appendChild(tr);
	}
}

listTable.addEventListener("click", function (e) {
	if (e.target.tagName !== "BUTTON") return;
	var cookie = document.cookie;
	if (cookie.indexOf(e.target.dataset.name) !== -1) {
		document.cookie = e.target.dataset.name + "=; expires=" + new Date(0);	
	}
	e.currentTarget.removeChild(e.target.parentNode.parentNode);
});

function getAllCookies() {
	var cookie = document.cookie,
		arrCookies = cookie.split("; ");

	for (let i = 0; i < arrCookies.length; i++) {
		var tr = document.createElement("tr"),
			name = arrCookies[i].split("=")[0],
			value = arrCookies[i].split("=")[1];

		if (isMatching(name, filterNameInput.value) ||
			isMatching(value, filterNameInput.value)) {
			tr.innerHTML = "<td>" + name + "</td><td>" + value + "</td><td><button data-name=" + name + ">Удалить</button></td>";
			listTable.appendChild(tr);
		}
	}

}

filterNameInput.addEventListener('keyup', function() {
	listTable.innerHTML = "";
	getAllCookies();
});

addButton.addEventListener('click', () => {
	var k = false,
		cookieArr = document.cookie.split("; ");
	for (let i = 0; i < cookieArr.length; i++) {
		if (addNameInput.value === cookieArr[i].split("=")[0]) {
			k = true;
		}
	}

	if (addNameInput.value !== "") {
		if (!k) {
			createCookieTr(addNameInput.value, addValueInput.value);
		} else {
			document.cookie = addNameInput.value + "=; expires=" + new Date(0);
			document.cookie = addNameInput.value + "=" + addValueInput.value;
			var index;
	
			for (let i = 0; i < listTable.children.length; i++) {
				if (listTable.children[i].firstElementChild.innerHTML === addNameInput.value) {
					index = i;
				}
			}
			
			var tr = document.createElement("tr");

			tr.innerHTML = "<td>" + addNameInput.value + "</td>\n" +
						   "<td>" + addValueInput.value + "</td>\n" + 
						   "<td><button data-name=" + addNameInput.value + ">Удалить</button></td>\n";
			if (isMatching(addNameInput.value, filterNameInput.value)) {
				listTable.replaceChild(tr, listTable.children[index]);
			} else {
				listTable.removeChild(listTable.children[index]);
			}
		}
	}
});

