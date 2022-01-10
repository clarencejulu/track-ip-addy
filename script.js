const SEARCH_URL = "https://geo.ipify.org/api/v2/country,city?apiKey=at_TbL4wnTvXFwhKzvP2QIkTizKP6d0Y&ipAddress=";
const my_ip = "https://api.ipify.org?format=json";
const form = document.getElementById("form");
const search = document.getElementById("search");
const submit = document.getElementById("submit-button");
const ipAddress = document.getElementById("ip-address");
const ipLocation = document.getElementById("location");
const ipTimezone = document.getElementById("timezone");
const ipIsp = document.getElementById("isp");
const map = document.getElementById("map");
const smallScreen = window.matchMedia("(max-width: 470px)");
const ipMap = L.map('map');

editPlaceholder(smallScreen);
smallScreen.addListener(editPlaceholder);
//callback to dynamically change content of placeholder

getUserIP(my_ip);

async function getUserIP(url){
    const response = await fetch(url);
    const data = await response.json();
    getInfo(data.ip); 
}

function editPlaceholder(event){
    
    if (event.matches) { 
        search.placeholder = "Search for IP";
      } else {
       search.placeholder = "Search for any IP address or domain";
      }
}

async function getInfo(current_ip){ //get IP Address
    const response = await fetch(SEARCH_URL + current_ip);
    const data = await response.json();
    showInfo(data);
}

function showInfo(userInfo){ //Display contents from IP Address
    const { city, timezone, postalcode, region, country, lat, lng } = userInfo.location;
    
    const { ip, isp } = userInfo;
    ipMap.setView([lat, lng], 16); 
    
    const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tiles = L.tileLayer(tileURL, {
    attribution}); 
    tiles.addTo(ipMap); //add tile images to our map
    
    const myIcon = L.icon({
        iconUrl: "images/icon-location.svg",
        iconSize: [40, 50],
    });
    
    L.marker([lat, lng], {icon: myIcon}).addTo(ipMap);

    ipAddress.innerText = ip;
    ipLocation.innerHTML = `${city}, ${region}<br>${postalcode==undefined ? country : postalcode}`;
    ipTimezone.innerHTML = `UTC ${timezone}`;
    ipIsp.innerText = isp;
}

form.addEventListener('submit', (event) => {

    event.preventDefault(); 
    const searchTerm = search.value;

    if(searchTerm && searchTerm !== '') {
        getInfo(searchTerm); 
        setTimeout( makeSearchBarEmpty, 3000 );
    } else {
        window.location.reload();
    }
})

function makeSearchBarEmpty(){
    search.value = '';
}