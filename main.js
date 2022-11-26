let key = "7ded80d91f2b280ec979100cc8bbba94";
let currentLinkTemplate = "https://api.openweathermap.org/data/2.5/weather?q=:location&appid=:key&units=metric&lang=en";
let forecastLinkTemplate = "https://api.openweathermap.org/data/2.5/forecast?q=:location&appid=:key&units=metric&lang=en";
let currentParent = document.getElementById("current");
let forecastParent = document.getElementById("forecast");

let locationData = document.getElementById("location-input");
locationData.addEventListener("keyup",(event)=>{
    event.preventDefault();

    //check for enter
    if(event.keyCode === 13) 
    {
        let currentLink = currentLinkTemplate.replace(":location",locationData.value).replace(":key",key);
        let ajax = new XMLHttpRequest();
        ajax.onload = function() {
            currentData = JSON.parse(this.responseText);
            console.log(currentData);
            currentParent.replaceChildren();
            addCard(currentParent,currentData);
        };
        ajax.open("GET", currentLink, true);
        ajax.getResponseHeader("Content-type", "application/json");
        ajax.send();

        let forecastLink = forecastLinkTemplate.replace(":location",locationData.value).replace(":key",key);
        fetch(forecastLink)
            .then(response => response.json())
            .then((data)=>{
                console.log(data);
                forecastParent.replaceChildren();
                for(let cardData of data.list)
                {
                    addCard(forecastParent,cardData);
                }
                setTimeout(()=>{
                    for(let card of document.getElementsByClassName("weather-data"))
                    {
                        card.classList.remove("offscreen");
                    }
                },250)
            });
    }
});

let cardTemplate = document.getElementById("weather-data-template");
function addCard(parent,data)
{
    let card = cardTemplate.content.cloneNode(true).children[0];
    let name = card.getElementsByClassName("name")[0];
    let properties = card.getElementsByClassName("properties")[0];
    let description = properties.getElementsByClassName("description")[0];
    let temperature = properties.getElementsByClassName("temperature")[0];
    let humidity = properties.getElementsByClassName("humidity")[0];
    let pressure = properties.getElementsByClassName("pressure")[0];

    name.innerText = data.name ?? data.dt_txt;
    description.children[1].innerText = data.weather[0].description;
    temperature.children[1].innerText = data.main.temp;
    pressure.children[1].innerText = data.main.pressure;
    humidity.children[1].innerText = data.main.humidity;

    if(parent === forecastParent)
        name.classList.add(getTimeOfDay(new Date(data.dt_txt).getHours()));

    parent.appendChild(card);
}

function getTimeOfDay(hour)
{
    if(hour < 6 && hour >3)
        return "morning";
    else if(hour < 13 && hour > 6)
        return "noon";
    else if(hour < 16 && hour > 13)
        return "afternoon";
    else if(hour < 20 && hour > 16)
        return "evening";
    else
        return "night";
}