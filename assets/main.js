console.log("Loaded the JavaScrip")
var apiKey = "56f2a20c9d09108cad8cf49dd4894374";
$("#inputSearch").on("click", function(){
    var userInput = $("#userInputField").val()
    console.log(userInput)
    currentForecast(userInput)
})

function currentForecast(cityname){
    var queryVal = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}`
    $.ajax({
        type: "GET",
        url: queryVal
    }).then(function(apiFunction){
        console.log(apiFunction)
    })
}