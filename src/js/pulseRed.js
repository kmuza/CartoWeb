function createHeader() {

}

function createRow(key, value) {
    return `<tr><td>${key}</td><td>${value?value : '--'}</td></tr>`;
}

function createTableApoyo(properties) {
    const keys = ['codigoapoyo', 'pintadoapoyo', 'codigotipoapoyo', 'cantidadap', 'cantidadcondensador'];
    let innerHTML = `<tr><th>Propiedad</th><th>Valor</th></tr>`;
    keys.forEach(key => {
        innerHTML += createRow(key, properties[key]);
    });
    return '<table class="propiedades">' + innerHTML + '</table>'
}

function createTableTramobt(properties) {
    const keys = ['codigotramobt', 'fnap', 'codigotrafodis', 'pintadotrafodis'];
    let innerHTML = `<tr><th>Propiedad</th><th>Valor</th></tr>`;
    keys.forEach(key => {
        innerHTML += createRow(key, properties[key]);
    });
    return '<table class="propiedades">' + innerHTML + '</table>'
}

function createTableTrafo(properties) {
    const keys = ['codigoapoyo', 'cantidadtrafos', 'codigotrafodis', 'pintadotrafodis'];
    let innerHTML = `<tr><th>Propiedad</th><th>Valor</th></tr>`;
    keys.forEach(key => {
        innerHTML += createRow(key, properties[key]);
    });
    return '<table class="propiedades">' + innerHTML + '</table>'
}

function createTableClientes(properties) {
    return `        
    <table id="table-container-breakpoint">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Height</th>
            <th>Province</th>
            <th>Sport</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jill Smith abelador de las priella</td>
            <td>25</td>
            <td>Female</td>
            <td>5'4</td>
            <td>British Columbia</td>
            <td>Volleyball</td>
          </tr>
          <tr>
            <td>John Stone</td>
            <td>30</td>
            <td>Male</td>
            <td>5'9</td>
            <td>Ontario</td>
            <td>Badminton</td>
          </tr>
          <tr>
            <td>Jane Strip</td>
            <td>29</td>
            <td>Female</td>
            <td>5'6</td>
            <td>Manitoba</td>
            <td>Hockey</td>
          </tr>
          <tr>
            <td>Gary Mountain</td>
            <td>21</td>
            <td>Mail</td>
            <td>5'8</td>
            <td>Alberta</td>
            <td>Curling</td>
          </tr>
          <tr>
            <td>James Camera</td>
            <td>31</td>
            <td>Male</td>
            <td>6'1</td>
            <td>British Columbia</td>
            <td>Hiking</td>
          </tr>
        </tbody>
      </table>`
}

function decodeTableClientes(properties) {
    const keys = ['CODIGOCLIENTESGD', 'CODIGOTRAFODIS', 'CODIGO_CUENTA', 'DIRECCIONSUSCRIPTOR', 'NOMBRESUSCRIPTOR'];
    let innerHTML = ``;
    keys.forEach(key => {
        innerHTML += createRow(key, properties[key]);
    });
    return  innerHTML;
}

const hidePopUp = () => {
    document.getElementById('popup').classList.add('hidden');
}

const showPopUp = () => {
    if (document.getElementById('popup').classList.contains('hidden')) {
        document.getElementById('popup').classList.remove('hidden');
    }
}


const MostrarModal = async (properties) => {
    // antiguo MostrarModal
    if (document.getElementById('costumer').classList.contains('active')) {
    } else {
        element = document.getElementById("costumer").classList.remove("disabled");
        document.getElementById('costumer_a').click();
    }
    document.getElementById("costumers_tbody").innerHTML = "";


    const apiClient = new ApiClient(backend_url, x_api_key);
    // let token = sessionStorage.getItem('token');
    // if (!token) {
        token = await apiClient.getToken();
        // sessionStorage.setItem('token', token.data.token);
    // }
    // console.log(token);
    // sessionStorage.setItem('token', token.data.token);
    // apiClient.setToken(token);
    apiClient.getClientes(properties['long'], properties['lat']).then(response => {
        const clientes = response.data;
        // console.log(response.data.length);
        for (var i = 0; i < clientes.length; i++) {
            //console.log(clientes[i]);
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${clientes[i]['CODIGOCLIENTESGD']}</td><td>${clientes[i]['NOMBRESUSCRIPTOR']}</td><td>${clientes[i]['NOMBRESUSCRIPTOR']}</td>`;
            document.getElementById("costumers_tbody").appendChild(tr);
        }

    });


}
// EVENTO SEGUN EL TIPO DE CAPAS
function switchEvent(properties) {
    //check if properties object has a property called 'apoyo'
    showPopUp();
    if (properties.hasOwnProperty('cantidadap')) {
        // console.log('apoyo');
        container_content.innerHTML = createTableApoyo(properties);
        return;
    } else if (properties.hasOwnProperty('delta')) {
        // console.log('trafodis');
        container_content.innerHTML = createTableTrafo(properties);
        return;
    } else if (properties.hasOwnProperty('geohash')) {
        // console.log('cliente');
        // hidePopUp();
        // container_content.innerHTML = '';
        // MostrarModal(properties);
        container_content.innerHTML = createTableClientes(properties);
        new basictable('#table-container-breakpoint', {
            containerBreakpoint: 578,
            tableWrap: true,
        });
        return;
    } else if (properties.hasOwnProperty('fnap')) {
        console.log('tramobt');
        container_content.innerHTML = createTableTramobt(properties);
        return;
    } else {
        console.log('no se encontro propiedad');
        container_content.innerHTML = '';
        // hidePopUp();
        return;
    }

}

// SOLO LOS LAYERS QUE RETORNEN TRUE SERAN ATENDIDOS EN EL PULSE CLICK
function onlyLayerFilter(layer) {
    const list_layers = ['apoyos', 'clientes', 'trafos', 'tramomt', 'tramobt'];
    return list_layers.includes(layer.get('name'));
}

// Pulse feature at coord
const pulseFeature =  async(coord) => {


    const features = map.getFeaturesAtPixel(map.getPixelFromCoordinate(coord), {
        layerFilter: onlyLayerFilter,
        hitTolerance: 15
    });

    

    if (features.length == 0) {
        return;
    }
    //  const closestFeature = source_Apoyos.getClosestFeatureToCoordinate(coord);
    // console.log(features[0].getProperties());

    const closestFeature = features[0];
    const closest_coordinates = closestFeature.getFlatCoordinates();
    // const closest_latlon = ol.proj.fromLonLat(closest_coordinates);
    const properties = closestFeature.getProperties();
    // console.log(JSON.stringify(properties) + '\n');


    switchEvent(properties);   /// <--- CODIFICAR LOS DATOS DE LAS PROPIEDADES SEGUN LA CAPA
    // content.innerHTML = createTable(properties);
    overlay.setPosition(closest_coordinates);




    var f = new ol.Feature(new ol.geom.Point(closest_coordinates));
    f.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 30,
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2
            })
        })
    }));
    map.animateFeature(f, new ol.featureAnimation.Zoom({
        fade: ol.easing.easeOut,
        duration: 3000,
        easing: ol.easing.easeOut
    }));
}

// Pulse on click 
map.on('singleclick', async (evt) => {
    if (tbInfoApoyo) {
        pulseFeature(evt.coordinate);
    }

});

// Pulse at lonlat
function pulse(lonlat) {
    var f = new ol.Feature(new ol.geom.Point(lonlat));
    f.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 30,
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2
            })
        })
    }));
    map.animateFeature(f, new ol.featureAnimation.Zoom({
        fade: ol.easing.easeOut,
        duration: 3000,
        easing: ol.easing.easeOut
    }));

    // showPopUp();
    // container_content.innerHTML = `<asdfadf>`;
    // overlay.setPosition(lonlat);
}