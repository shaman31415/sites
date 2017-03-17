"use strict";
new Promise(resolve => {
	if (document.readyState === "complete") {
		resolve();
	} else {
		window.addEventListener("load", resolve);
	}
}).then((resolve, reject) => {
	VK.init({
		apiId: 5919763
	});

	VK.Auth.login(response => {
		if (response.session) {
			console.log("Всё ок");
		} else {
			alert("Не удалось авторизоваться!");
		}
	}, 8);
}).then(() => {
	return new Promise((resolve, reject) => {
		VK.api("friends.get", {
			v: 5.62,
			fields: ["photo_50"]
		}, response => {
			if (response.error) {
				reject(new Error(response.error.error_msg));
			} else {
				var body = document.getElementById("body"),
					ulLeft = body.querySelector(".body-left ul"),
					ulRight = body.querySelector(".body-right ul"),
					filterLeft = document.getElementById("filter-left"),
					filterRight = document.getElementById("filter-right"),
					save = document.getElementById("save");

				body.addEventListener("click", e => {
					var target = e.target,
						liTarget = target.parentNode.parentNode;

					if (target.className === "add") {
						target.classList.remove("add");
						target.classList.add("del");
						ulRight.appendChild(liTarget);
					} else if (target.className === "del") {
						target.classList.remove("del");
						target.classList.add("add");
						ulLeft.appendChild(liTarget);
					} else return;
				});
				var arrFirstNames = [],
					arrLastNames = [],
					arrPhotos50 = [],
					arrId = [];

				for (let i = 0; i < response.response.items.length; i++) {
					for (var key in response.response.items[i]) {
						if (key === "first_name") {
							arrFirstNames.push(response.response.items[i][key])
						}

						if (key === "last_name") {
							arrLastNames.push(response.response.items[i][key]);
						}

						if (key === "photo_50") {
							arrPhotos50.push(response.response.items[i][key]);
						}

						if (key === "id") {
							arrId.push(response.response.items[i][key]);
						}
					}
				}

				if (localStorage.length === 0) {
					for (let i = 0; i < arrFirstNames.length; i++) {
						createLi(ulLeft, arrFirstNames[i], arrLastNames[i], arrPhotos50[i], arrId[i]);
					}
				} else {
					var arrRight = JSON.parse(localStorage.ulRight),
						arrLeft = JSON.parse(localStorage.ulLeft);

					for (let i = 0; i < arrRight.length; i++) {
						createLi(ulRight, arrFirstNames[arrRight[i]], arrLastNames[arrRight[i]], arrPhotos50[arrRight[i]], arrId[arrRight[i]], "del");
					}

					for (let i = 0; i < arrLeft.length; i++) {
						createLi(ulLeft, arrFirstNames[arrLeft[i]], arrLastNames[arrLeft[i]], arrPhotos50[arrLeft[i]], arrId[arrLeft[i]]);
					}
				}

				filter(filterLeft, ulLeft);
				filter(filterRight, ulRight);
				dragAndDrop();

				localStorage.clear();

				save.addEventListener("click", () => {
					var filterIdRight = [],
						filterIndexRight = [],
						filterIdLeft = [],
						filterIndexLeft = [];

					for (let i = 0; i < ulRight.children.length; i++) {
						filterIdRight.push(ulRight.children[i].dataset.id);
					}

					for (let i = 0; i < ulLeft.children.length; i++) {
						filterIdLeft.push(ulLeft.children[i].dataset.id);
					}

					for (let i = 0; i < arrId.length; i++) {
						for (let j = 0; j < filterIdRight.length; j++) {
							if (arrId[i] == filterIdRight[j]) {
								filterIndexRight.push(i);
							}
						}
					}

					for (let i = 0; i < arrId.length; i++) {
						for (let j = 0; j < filterIdLeft.length; j++) {
							if (arrId[i] == filterIdLeft[j]) {
								filterIndexLeft.push(i);
							}
						}
					}

					localStorage.ulRight = JSON.stringify(filterIndexRight);
					localStorage.ulLeft = JSON.stringify(filterIndexLeft);
					alert("Текущее состояние успешно сохранено");
				});

				function createLi(where, first_name, last_name, photo_50, id, cls = "add") {
					var li = document.createElement("li");
					li.innerHTML = "<div><img src=" + photo_50 + " alt=\"\"></div><div>" + first_name + " " + last_name + "</div><div><span class=\"" + cls + "\"></span></div>";
					li.className = "draggable";
					li.setAttribute("data-id", id);
					where.appendChild(li);
				}

				resolve();
			}
		});
	})
}).catch(e => {
	alert("Ошибка " + e.message);
});

function filter(input, target) {
	input.addEventListener("keyup", e => {
		for (let i = 0; i < target.children.length; i++) {
			if (!isMatching(target.children[i].children[1].innerText, e.currentTarget.value)) {
				target.children[i].style.display = "none";
			} else {
				target.children[i].style.display = "";
			}
		}
	});	
}

function dragAndDrop() {
	var body = document.getElementById("body"),
		ulLeft = body.querySelector(".body-left ul"),
		ulRight = body.querySelector(".body-right ul");

	ulLeft.addEventListener("dragstart", e => {
		if (e.target.tagName === "IMG") {
			e.preventDefault();
		}
	});

	ulLeft.addEventListener("mousedown", e => {
		var target = e.target,
			li = target.closest(".draggable"),
			cloneLi = li.cloneNode(true),
			shiftX = e.pageX - target.getBoundingClientRect().left,
			shiftY = e.pageY - target.getBoundingClientRect().top;

		if (target.className === "add") return;
		if (li.tagName !== "LI") return;

		cloneLi.style.backgroundColor = "#FFF";
		cloneLi.style.position = "absolute";
		cloneLi.style.opacity = "0.8";
		cloneLi.style.left = li.getBoundingClientRect().left + "px";
		cloneLi.style.top = li.getBoundingClientRect().top + "px";
		cloneLi.style.width = li.offsetWidth + "px";
		cloneLi.style.zIndex = 1;
		cloneLi.style.outline = "1px solid rgba(0, 0, 0, 0.5)";

		document.body.appendChild(cloneLi);

		function move(e) {
	    	cloneLi.style.left = (e.pageX - shiftX) + 'px';
	    	cloneLi.style.top = (e.pageY - shiftY) + 'px';
	    	document.body.style.overflowX = "hidden";
		}

		document.addEventListener("mousemove", move);

		document.addEventListener("mouseup", e => {
			var add = li.querySelector(".add");

			document.removeEventListener("mousemove", move);
			document.body.removeChild(cloneLi);

			if (e.pageX < ulRight.getBoundingClientRect().right && e.pageX > ulRight.getBoundingClientRect().left &&
				e.pageY > ulRight.getBoundingClientRect().top && e.pageY < ulRight.parentNode.getBoundingClientRect().bottom) {
				ulRight.appendChild(li);
				add.className = "del";
			}
		});
	});
}

function isMatching(full, chunk) {
	if (full.toLowerCase().indexOf(chunk.toLowerCase()) === -1) {
		return false;
	}
	return true;
}
