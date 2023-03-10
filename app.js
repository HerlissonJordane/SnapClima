 
 //INTERAÇÃO
 const citySearchInput = document.getElementById('city-search-input')
 const citySearchButton = document.getElementById('city-search-buttom')
 
 //EXIBIÇÃO
 const currentDate = document.getElementById('current-date');
 const cityName = document.getElementById('city-name');
 const weatherIcon = document.getElementById("weather-icon");
 const weatherDescription = document.getElementById("weather-description");
 const currentTemperature = document.getElementById("current-temperature");
 const windSpeed = document.getElementById("wind-speed");
 const feelsLikeTemperature = document.getElementById("feels-like-temperature");
 const currentHumidity = document.getElementById("current-humidity");
 const sunriseTime = document.getElementById("sunrise-time");
 const sunsetTime = document.getElementById("sunset-time");

 const api_key = "0bc0049adb30a7ca17976ee9dccb103f";

 //PEGA O VALOR DIGITADO DENTRO DO INPUT
 citySearchButton.addEventListener("click", () => {
    
    let cityName = citySearchInput.value
    getCityWeather(cityName)
 })

 function getCityWeather(cityName){
   //coloca o icone de pesquisa novamente enquanto o novo icone é carregado
   weatherIcon.src=`./assets/loading-puft.svg`

   fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${api_key}`)
   .then((response) => response.json())
   .then((data) => displayWeather(data))
 }

 //função que quebra o Objeto Json em variáveis, define a estrutura a ser usada e salva nas constantes definidas anteriormente
 function displayWeather(data){//desestruturação de Objeto
   let {
      dt,
      name,
      weather:[{icon, description}],
      main: {temp, feels_like, humidity},
      wind: {speed},
      sys: {sunrise, sunset},
    } = data

    currentDate.textContent = formatDate(dt)
    cityName.textContent = name
    weatherIcon.src=`./assets/${icon}.svg`
    weatherDescription.textContent = description
    currentTemperature.textContent = `${Math.round(temp)}°C`
    windSpeed.textContent = `${Math.round(speed * 3.6)} Km/h`
    feelsLikeTemperature.textContent = `${Math.round(feels_like)}°C`
    currentHumidity.textContent = `${Math.round(humidity)}%`
    sunriseTime.textContent = FormatTime(sunrise)
    sunsetTime.textContent = FormatTime(sunset)
 }

 //função nativa do navegador que permite pegar a posição atual do dispositivo
 navigator.geolocation.getCurrentPosition(
   (position) => {//se der certo

      let lat = position.coords.latitude
      let lon = position.coords.longitude

      getCurrentLocationWeather(lat, lon)

 },
   (err) => { //se der errado
      if( err.code === 1){ //código do erro recebido pelo json
         Alert("Habilite a função de localizador para funcionar automaticamente. Caso contrário, digite manualmente a cidade que deseja saber as informações")
      } else{
         console.log(err)
      }
   }
)

function formatDate(epochTime){
   let date = new Date(epochTime * 1000) //converte o tipo de data que recebe pra data normal
   let formattedDate = date.toLocaleDateString('pt-BR',{month: "long", day: 'numeric'})
   return `Hoje, ${formattedDate}` //formata e concatena a data
}

function FormatTime(epochTime){
   let date = new Date(epochTime * 1000)
   let hours = date.getHours()
   let minutes = date.getMinutes()
   return `${hours}:${minutes}`
}

function getCurrentLocationWeather(lat, lon){
   fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${api_key}`)
   .then((response) => response.json())
   .then((data) => displayWeather(data)) 
}

 //https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid={api_key}
 