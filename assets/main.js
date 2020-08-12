console.log("Loaded the JavaScrip")
var apiKey = "56f2a20c9d09108cad8cf49dd4894374"
var recentSearches = []
recentSearches = JSON.parse(localStorage.getItem("Search History"))
if (recentSearches === undefined || recentSearches === null){
    recentSearches = [];
    alert("This is your first time here! Please, type in the city you want to search on!")
}

displaySearchHistory()
currentForecast(recentSearches[recentSearches.length-1])
fiveDayForecast(recentSearches[recentSearches.length-1])

function displaySearchHistory() {
    $('#userInputField').val("");
    $('#searchHistory').text("");
    for (let i = 0; i < recentSearches.length; i++) {
        const element = recentSearches[i];
        $('#searchHistory').prepend("<li class='historyItem'  onclick='currentForecast(\"" + element + "\")'>" + element + '</li>')
    }
}

$("#inputSearch").on("click", function () {
    var userInput = $("#userInputField").val()
    console.log(userInput)
    currentForecast(userInput)
    recentSearches.push(userInput)
    localStorage.setItem("Search History", JSON.stringify(recentSearches))
    displaySearchHistory()
})

function currentForecast(cityname) {
    fiveDayForecast(cityname)
    var queryVal = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}&units=imperial`
    var currentDate = new Date().toLocaleDateString()
    $.ajax({
        type: "GET",
        url: queryVal
    }).then(function (apiFunction) {
        console.log(apiFunction)
        var lat = apiFunction.coord.lat
        var lon = apiFunction.coord.lon
            $("#city-name").html(apiFunction.name)
            $("#currentForecast").html(`
            <h5>${currentDate}</h5>
            <h6>Temp: ${apiFunction.main.temp}</h6>
            <p>Wind Speed: ${apiFunction.wind.speed}</p>
            <p>Description: ${apiFunction.weather[0].description}</p>
            <img class="images" src="https://openweathermap.org/img/wn/${apiFunction.weather[0].icon}@2x.png">
            <p>Humidity: ${apiFunction.main.humidity}</p>
            <p>Longitude: ${lon}</p>
            <p>Lattitude: ${lat}</p>
            `)
        var uvUrl = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
        $.ajax({
            method: "GET",
            url: uvUrl,
            dataType: "json",
          }).then(function (apiFunction) {
            console.log(apiFunction);
            $("#currentForecast").append(`
           <p id="uv" class="card-text"> UV Index: ${apiFunction.value}</p>
            `) 
            if (apiFunction.value <= 2){
                $("#uv").addClass("bg-success")
             } else if (apiFunction.value > 2 &&  apiFunction.value < 6){
                $("#uv").addClass("bg-info")
             } else if (apiFunction.value >= 6 && apiFunction.value <= 7){
                $("#uv").addClass("bg-warning")
             } else {
                $("#uv").addClass("bg-danger")
             }
            
          });
    })    
}

function fiveDayForecast(cityname) {
    var queryVal = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apiKey}&units=imperial`
    $.ajax({
        type: "GET",
        url: queryVal
    }).then(function (apiFunction) {
        console.log(apiFunction)
        $("#fiveDayForecast").empty()
        // starting at noon, and incrementing by 8 because that is 24 hours
        for (let i = 2; i < apiFunction.list.length; i+=8) {
            const myDate = new Date(apiFunction.list[i].dt_txt).toLocaleDateString();
            $("#fiveDayForecast").append(`<div class="card fdf p-5 bg-secondary text-light">
            <h5>${myDate}</h5>
            <h6>Temp: ${apiFunction.list[i].main.temp}</h6>
            <p>Wind Speed: ${apiFunction.list[i].wind.speed}</p>
            <p>Description: ${apiFunction.list[i].weather[0].description}</p>
            <img class="images" src="https://openweathermap.org/img/wn/${apiFunction.list[i].weather[0].icon}@2x.png">
            <p>Humidity: ${apiFunction.list[i].main.humidity}</p>
            </div>`)
        }

    })
}
