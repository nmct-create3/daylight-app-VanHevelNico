// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

let Timer;

// 5 TODO: maak updateSun functie
let updateSun = (percentage) => {
	
	let html_sun = document.querySelector(".js-sun");
	let html_html = document.querySelector(".js-html");
	if(percentage < 100) {
		html_html.setAttribute("class", "is-day js-html");
		if(percentage < 50) {
			html_sun.setAttribute("style",`bottom: ${percentage *2}%; left: ${percentage}%;`);
		}
		else {
			html_sun.setAttribute("style",`bottom: ${100 - percentage}%; left: ${percentage}%;`);
		}
		console.log("sun updated");
	}
	else {
		html_html.setAttribute("class", "is-night js-html");
	}
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (sunrise, sunset) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag. X
	// Bepaal het aantal minuten dat de zon al op is.  X
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is. X
	// We voegen ook de 'is-loaded' class toe aan de body-tag. X
	// Vergeet niet om het resterende aantal minuten in te vullen. X
	// Nu maken we een functie die de zon elke minuut zal updaten X
	// Bekijk of de zon niet nog onder of reeds onder is X
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie. X
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.X
	let html_sun = document.querySelector(".js-sun");
	let html_minutes = document.querySelector(".js-time-left");
	let html_body = document.querySelector(".js-body");
	//Huidige tijd inladen
	var today = new Date();
	var time = today.getHours() + ":" + ((today.getMinutes()<10?'0':'') + today.getMinutes());
	html_sun.setAttribute("data-time",time);
	//isloaded
	html_body.setAttribute("class","is-loaded js-body");
	//Aantal minuten over
	let sunsetDT = '02/01/1970 ' + _parseMillisecondsIntoReadableTime(sunset);
	let timeDT = '02/01/1970 ' + time;
	sunsetDT = new Date(sunsetDT);
	timeDT = new Date(timeDT);
	let diffMs = (sunsetDT - timeDT); // milliseconds between now & Christmas
	let diffHrs = (Math.floor((diffMs % 86400000) / 3600000))*60; // hours
	let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000) + diffHrs; // minutes
	html_minutes.innerHTML = diffMins;
	//Aantal minuten verstreken
	let sunriseDT = '02/01/1970 ' + _parseMillisecondsIntoReadableTime(sunrise);
	sunriseDT = new Date(sunriseDT);
	let verstreken = timeDT - sunriseDT;
	diffMs = verstreken; // milliseconds between now & Christmas
	diffHrs = (Math.floor((diffMs % 86400000) / 3600000))*60; // hours
	verstreken = Math.round(((diffMs % 86400000) % 3600000) / 60000) + diffHrs; // minutes
	console.log(verstreken);
	//Aantal minuten verstreken / totaal aantal minuten zonlicht = percentage updatzsun
	diffMs = (sunsetDT - sunriseDT); // milliseconds between now & Christmas
	diffHrs = (Math.floor((diffMs % 86400000) / 3600000))*60; // hours
	diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000) + diffHrs; // minutes

	let percentage = (verstreken / diffMins) *100;
	updateSun(percentage);
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	let html_locatie = document.querySelector(".js-location");
	let html_sunrise = document.querySelector(".js-sunrise");
	let html_sunset = document.querySelector(".js-sunset");
	html_locatie.innerHTML = queryResponse.city.name;
	html_sunrise.innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
	html_sunset.innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);

	placeSunAndStartMoving(queryResponse.city.sunrise, queryResponse.city.sunset);
	Timer = setInterval(start,60000);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
    const endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=fbdc568c18b4ce494c70da4f911e2200&units=metric&lang=nl&cnt=1`
    fetch(endpoint).then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
        showResult(json);
    }).catch(function(error) {
        console.error('An error occured, we handled it.', error);
    });
};

let start = () => {
	getAPI(50.8027841, 3.2097454);
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	start();
	console.log("dom loaded");
});

