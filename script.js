
const loading = document.getElementById("loading");

// country api example with callback function

document.querySelector("#btnSearch").addEventListener("click", () => {
    loading.style.display = "block";
    let text = document.querySelector("#txtSearch").value;
    getCountry( text );
    document.querySelector("#txtSearch").value =""
});

document.getElementById("btnLocation").addEventListener("click", () => {
    loading.style.display = "block";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( onSuccess, onError )
    }
})

function onSuccess(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    let api_key = "8f089db5be934eec833462f5a4e001c6";

    const req = new XMLHttpRequest();
    req.open('GET',`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`);
    req.send();
    req.addEventListener("load", function () {
        const data = JSON.parse( this.responseText );
        console.log(data);
        let country = data.results[0].components.country;
        document.getElementById("txtSearch").value = country;
        document.getElementById("btnSearch").click();
    })
}
function onError(error) {
 console.log(error);   
}

function getCountry( country ) {
    const request = new XMLHttpRequest();

    request.open( 'GET' , 'https://restcountries.com/v3.1/name/' + country );
    request.send();

    request.addEventListener('load', function() {

        const data = JSON.parse( this.responseText );
        console.log( data );  
        loading.style.display = "none"          
        renderCountry( data[0] );

        const countries = data[0].borders.toString();

        const req = new XMLHttpRequest();
        req.open('GET', 'https://restcountries.com/v3.1/alpha?codes=' + countries);
        req.send();

        req.addEventListener('load', function() {
            const data = JSON.parse( this.responseText );
            loading.style.display = "none"
            renderNeighbors(data);
        });
    });
}

function renderCountry(data) {        
   
    let html = `        
        <div class="card-header">
                Arama Sonucu
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-4">
                        <img src="${data.flags.png}" alt="" class="img-fluid">
                    </div>
                    <div class="col-8">
                        <h3 class="card-title">${data.name.common}</h3>
                        <hr>
                        <div class="row">
                            <div class="col-4">Nufüs: </div>
                            <div class="col-8">${(data.population / 1000000).toFixed(1)} milyon</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Resmi Dil: </div>
                            <div class="col-8">${Object.values(data.languages)}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Başkent: </div>
                            <div class="col-8">${data.capital[0]}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Para Birimi: </div>
                            <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                        </div>
                    </div>
                </div>
            </div>
    `;  
    document.querySelector("#country-details").innerHTML = html;       
}
 
function renderNeighbors(data) {

    let html = "";
    for(let country of data) {
        html += `
            <div class="col-2 mt-2">
                <div class="card neighbor">
                    <img src="${country.flags.png}" class="card-img-top">
                    <div class="card-body">
                        <h6 class="card-title">${country.name.common}</h6>
                    </div>
                </div>
            </div>
        `;
        
    }
    document.querySelector(".neighbors").style.opacity = 1;
    document.querySelector("#neighbors").innerHTML =  html;
}

document.querySelector(".neighbors").addEventListener("click", function (event) {
    
    if (event.target.classList.contains("neighbor") || event.target.parentElement.classList.contains("neighbor")  || event.target.parentElement.parentElement.classList.contains("neighbor")) {
        let text = event.target.parentElement.textContent.trim();
        console.log("deneme",text);
        getCountry(text);
    }
})