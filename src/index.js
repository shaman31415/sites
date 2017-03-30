document.addEventListener("DOMContentLoaded", () => {
	var map,
		coords,
		placemark,
		lonLat,
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
		objPlacemarksData = {},
		arrPlacemarks = [],
		clusterer;

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
	            	lonLat = res.geoObjects.get(0).geometry.getCoordinates();

	           	address.innerText = firstGeoObject.properties.get("text");
	           	objPlacemarksData[firstGeoObject.properties.get("text")] = {};
	        });
		});

        save.addEventListener("click", e => {
			if (name.value && place.value && text.value) {
	            removeEmpty();
	            reviews.appendChild(createReview(name.value, place.value, text.value));

				if (!placemark) {
		        	placemark = createPlacemark(coords);
				}

				arrPlacemarks.push(placemark);
				alert(arrPlacemarks.length);

	            map.geoObjects.add(placemark);
		    	clusterer.add(arrPlacemarks);

	            var arrNames = [],
			        arrPlaces = [],
			        arrReviews = [];

        		arrNames.push(name.value);
        		arrPlaces.push(place.value);
        		arrReviews.push(text.value);

	            placemark.events.add("click", e => {

					var objData = {
		            	coords: lonLat,
		            	iname: arrNames,
		            	place: arrPlaces,
		            	date: formatDate(new Date()),
		            	review: arrReviews
	        		};
	            	removeEmpty();
	            	for (let i = 0; i < arrNames.length; i++) {
	            		reviews.appendChild(createReview(objData.iname[i], objData.place[i], objData.review[i]));
	            	}
	            });

	            ymaps.geocode(coords).then(res => {
		            var firstGeoObject = res.geoObjects.get(0),
		            	currentAddress = firstGeoObject.properties.get("text");
		            
		           	placemark.events.add("click", e => {
		        		address.innerText = currentAddress;
		            	console.dir(objPlacemarksData);
		            });
		            objPlacemarksData[currentAddress].reviewsAll = reviews.innerHTML

		        });

	            name.value = "";
	            place.value = "";
	            text.value = "";

	            placemark = null;
			} else {
				alert("Нужно заполнить все поля!")
			}
		});

		clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedBlueClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            geoObjectHideIconOnBalloonOpen: false
        });

        clusterer.options.set({
	        gridSize: 150,
	        clusterDisableClickZoom: true
	    });

	    map.geoObjects.add(clusterer);
	}

	function getVariables(arr) {
		for (let i = 0; i < arr.length; i++) {
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

		textDate = formatDate(currentDate);

		name.innerText = n;
		place.innerText = p;
		date.innerText = textDate;
		text.innerText = t;

		return review;
	}

	function formatDate(currentDate) {
		day = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
		month = currentDate.getMonth() < 9 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1;
		year = String(currentDate.getFullYear()).slice(2);
		return day + "." + month + "." + year;
	}

    function createPlacemark(coords) {
        return new ymaps.Placemark(coords);
    }
});
