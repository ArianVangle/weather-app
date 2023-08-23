const apiKey = 'e215e480e8e3b35ca5fba1afd5c83f9b'

const searchInput = document.querySelector('.card__input')
const searchButton = document.querySelector('.card__button')
const weatherIcon = document.querySelector('.weather__icon')

const checkWeather = async (city) => {
	try {
		const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=e215e480e8e3b35ca5fba1afd5c83f9b`
		const response = await fetch(apiUrl)
		const data = await response.json()
		console.log(data.weather[0].main)
		document.querySelector('.weather__city').innerHTML = city.charAt(0).toUpperCase() + city.slice(1)
		document.querySelector('.weather__temp').innerHTML = `${Math.round(data.main.temp)}°C`
		document.querySelector('.humidity').innerHTML = `${Math.round(data.main.humidity)}%`
		document.querySelector('.details__text').innerHTML = 'Влажность'
		document.querySelector('.wind__text').innerHTML = 'Ветер'
		document.querySelector('.wind').innerHTML = `${Math.round(data.wind.speed)} км/ч`
		document.querySelector('.details__column_humidity-img').src = '@img/humidity.png'
		document.querySelector('.details__column_wind-img').src = '@img/wind.png'

		if (data.weather[0].main == 'Clouds') weatherIcon.src = '@img/clouds.png'
		if (data.weather[0].main == 'Clear') weatherIcon.src = '@img/clear.png'
		if (data.weather[0].main == 'Rain') weatherIcon.src = '@img/rain.png'
		if (data.weather[0].main == 'Mist') weatherIcon.src = '@img/mist.png'
		if (data.weather[0].main == 'Drizzle') weatherIcon.src = '@img/drizzle.png'
		if (data.weather[0].main == 'Snow') weatherIcon.src = '@img/snow.png'
	} catch {
		document.querySelector('.weather__city').innerHTML = 'произошла ошибка...'
		document.querySelector('.weather__temp').innerHTML = ``
		document.querySelector('.humidity').innerHTML = ``
		document.querySelector('.details__text').innerHTML = ''
		document.querySelector('.wind__text').innerHTML = ''
		document.querySelector('.wind').innerHTML = ``
		document.querySelector('.details__column_humidity-img').src = ''
		document.querySelector('.details__column_wind-img').src = ''
	}
}

searchButton.addEventListener('click', () => {
	checkWeather(searchInput.value)
})
