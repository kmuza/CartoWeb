// active only debug
let tbInfoApoyo = true;//<---- controla la activacion de la info de apoyos
/// VARIABLES

  


function setGlobarVariables(data) {
    
    if (data.type == 'button') {
        tbInfoApoyo = (data.value.toLowerCase() === 'true');
        closeNav(-1);
        // console.log(data);
    }
}



////////////////////////////////////////////////////////////////////////////////////////////
// -------------------PARAMETROS DE CONFIGURACION ----------------------------------
// SERVIDOR DE CAPAS
// http://192.168.0.31:8880/capabilities/essa.json   <---- ruta para ver los tiles activos
const tiles_server = 'http://192.168.0.31:8880/';    // <---- ruta para ver los tiles activos NECESITA CONEXION A LA VPN
const capa_apoyos = 'maps/essa/apoyos/{z}/{x}/{y}.pbf';  //><-----se va a cambiar cuando exista una api de capas
const capa_clientes = 'maps/essa/clientes/{z}/{x}/{y}.pbf';

// -------------------PARAMETROS DE CONFIGURACION ----------------------------------
// BACKEND 
const backend_url = 'https://worker360.electrosoftware.net:3002';
const x_api_key = 'eyJjdXMiOjY1LCJpYXQiOj'    


class ApiClient {
    constructor(url, x_api_key) {
        this.url = url;
        this.x_api_key = x_api_key;
        this.myHeaders = new Headers();
        this.myHeaders.append("x-api-key", this.x_api_key);
        this.myHeaders.append("Content-Type", "application/json");


    }

    setToken(token) {
        this.myHeaders = null;
        this.myHeaders = new Headers();
        this.myHeaders.append("x-api-key", this.x_api_key);
        this.myHeaders.append("Content-Type", "application/json");
        this.myHeaders.append("Authorization", "Bearer " + token);
    }

    async getToken() {
        const url = this.url + '/api/users/login';
        // se loguea con un usuario valido para obtener el token
        const raw = JSON.stringify({
        "loginusuario": "JTRUJIG",
        "contrasenaweb": "JTRUJIG"
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: this.myHeaders,
            body: raw
        });
        // return await response.json();
        const token = await response.json();
        this.setToken(token.data.token); 
        // return token;
    }

    async getApoyo(id) {
        const url = this.url + '/api/apoyo/byPintado/' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: this.myHeaders
        });
        const apoyos = await response.json();
        return apoyos;
    }

    async getClientes(lon, lat) {
        const url = this.url + `/api/clientes/?longitud=${lon}&latitud=${lat}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: this.myHeaders
        });
        const clientes = await response.json();
        return clientes;

    }

    async getBusquedaCapaNegocio(entidad, codigo, tipocodigo) {
        const url = this.url + `/api/consultas/busquedaCapaNegocio?entidad=${entidad}&codigo=${codigo}&tipocodigo=${tipocodigo}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: this.myHeaders
        });
        const clientes = await response.json();
        return clientes;

    }

}

//ELIMINAR PARA PROBAR

// var myFunc = async function() {

//     const apiClient = new ApiClient(backend_url, x_api_key);
//     const token = await apiClient.getToken();
//     // console.log(token);
//     sessionStorage.setItem('token', token.data.token);
//     await apiClient.setToken(token.data.token);
//     const apoyo = await apiClient.getApoyo(1084534);
//     console.log(apoyo);

// }();