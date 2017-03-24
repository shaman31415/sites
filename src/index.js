document.addEventListener("DOMContentLoaded", () => {
	var map,
		coords,
		placemark,
		[modal, reviews, mapWrap, address, closeModal, name, place, text, save, overlay] = getVariables([
			"modal",
			"reviews",
			"map",
			"address",
			"close",
			"name",
			"place",
			"review",
			"save",
			"overlay"
		]),
		// новое
		arrPlacemarks = [];

	modal.hidden = true;
	overlay.hidden = true;

	overlay.addEventListener("click", () => {
		closeAndClear();
	});

	ymaps.ready(init);

	function init() {     
	    map = new ymaps.Map("map", {
	        center: [55.75, 37.63],
	        zoom: 12
	    });

		map.cursors.push("arrow");

		closeModal.addEventListener("click", () => {
			closeAndClear();
		});

		mapWrap.addEventListener("click", e => {
			if (modal.hidden) {
				modal.hidden = false;
				overlay.hidden = false;
			}

			modal.style.left = (document.documentElement.offsetWidth - e.pageX) < modal.offsetWidth ?
							  (document.documentElement.offsetWidth - modal.offsetWidth) + "px" : e.pageX + "px";

			modal.style.top = (document.documentElement.offsetHeight - e.pageY) < modal.offsetHeight ?
							  (document.documentElement.offsetHeight - modal.offsetHeight) + "px" : e.pageY + "px";

			if (!reviews.children.length) {
				reviews.appendChild(createEmpty());
			}
		});

		map.events.add("click", e => {
			reviews.innerHTML = "";

			coords = e.get("coords");

			ymaps.geocode(coords).then(res => {
	            var firstGeoObject = res.geoObjects.get(0);

	           	address.innerText = firstGeoObject.properties.get("text");
	        });
		});

        save.addEventListener("click", e => {
			if (name.value && place.value && text.value) {
	            removeEmpty();
	            reviews.appendChild(createReview(name.value, place.value, text.value));

				if (!placemark) {
		        	placemark = new CreatePlacemark(coords, reviews.innerHTML);
				}

	            map.geoObjects.add(placemark);

	            // новое
	           	arrPlacemarks.push(placemark);

	            name.value = "";
	            place.value = "";
	            text.value = "";

	            // новое
	            placemark.events.add("click", () => {
	            	reviews.innerHTML = placemark.cache;
	            });
			} else {
				alert("Нужно заполнить все поля!")
			}
		});
	}

	function getVariables(arr) {
		for (var i = 0; i < arr.length; i++) {
			arr[i] = document.getElementById(arr[i]);
		}
		return arr;
	}

	function closeAndClear() {
		modal.hidden = true;
		overlay.hidden = true;
		reviews.innerHTML = "";
	    createEmpty();		
	}

	function createEmpty() {
		var emptyReviews = document.createElement("div");

		emptyReviews.className = "reviews_empty";
		emptyReviews.id = "reviews_empty";
		emptyReviews.innerText = "Отзывов пока нет...";

		return emptyReviews;
	}

	function removeEmpty() {
		var empty = document.getElementById("reviews_empty");
		if (empty) {
			empty.parentNode.removeChild(empty);
		}
	}

	function createReview(n, p, t) {
		var review = document.createElement("div"),
			name = document.createElement("span"),
			place = document.createElement("span"),
			date = document.createElement("span"),
			text = document.createElement("div"),
			currentDate = new Date(),
			textDate = "",
			day,
			month,
			year;
			collectReview = [name, place, date, text];

		review.className = "review";
		name.className = "name";
		place.className = "place";
		date.className = "date";
		text.className = "text";

		for (let val of collectReview) {
			review.appendChild(val);
		}

		day = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
		month = currentDate.getMonth() < 9 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1;
		year = String(currentDate.getFullYear()).slice(2);
		textDate = day + "." + month + "." + year;

		name.innerText = n;
		place.innerText = p;
		date.innerText = textDate;
		text.innerText = t;

		return review;
	}

	// cache - новое
    function CreatePlacemark(coords, cache) {
    	this.cache = cache;
        return new ymaps.Placemark(coords);
    }
});

/*--0) Форма будет одна, меняться будут только данные формы для каждого объекта--*/
/*--1) Клик по карте - открытие всплывающего окна с формой, в заголовке адрес выбранного объекта--*/
/*--2) После добавления отзыва он появляется в форме, и появляется метка--*/
/*--3) Больше одного отзыва поблизости объединяются в кластер с числом меток--*/
/*--4) При клике на одиночную метку появляется форма с отзывом--*/
/*--5) При клике на кластер появляется карусель с отзывами--*/
/*--6) При клике на адрес в карусели появляется форма с одним отзывом--*/