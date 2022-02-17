var datos = [];
$modal_mapa_base = document.getElementById('modal_mapa');
document.getElementById("btnBuscarEntidad").addEventListener("click", async()=> await EnviarDatosBusqueda());



function BuscarApoyoCartografia() {
  $modal_mapa = document.getElementById('buscar_apoyo');



  $modal_mapa.addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Buscar por Coordenadas',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      html:`
         <div class="fila-flex">
            <Label target="tittle">Geometricas
               <input id="swal-input_radio1" checked="checked" type="radio" name="coordenadas" class="swal2-input">
            </label>
         </div>
         <div class="fila-flex">
            <Label>Latitud</label>
            <input type="number" id="swal-input1" class="swal2-input" onkeydown="javascript: changeSelection('#swal-input_radio1')" />
         </div>
         <div class="fila-flex">
            <Label>Longitud</label>
            <input type="number" id="swal-input2" class="swal2-input" onkeydown="javascript: changeSelection('#swal-input_radio1')" />
         </div>
         <div class="fila-flex">
            <Label target="tittle">Planas     
               <input id="swal-input2_radio2" type="radio" name="coordenadas" class="swal2-input">
            </label>
         </div>
         <div class="fila-flex">
            <Label>X</label>
            <input type="number" id="swal-input3" class="swal2-input" onkeydown="javascript: changeSelection('#swal-input2_radio2')" />
         </div>
         <div class="fila-flex">
            <Label>Y</label>
            <input type="number" id="swal-input4" class="swal2-input" onkeydown="javascript: changeSelection('#swal-input2_radio2')" />
         </div>`,
      focusConfirm: true,
      preConfirm: () => {

        let lon = document.getElementById('swal-input2').value;
        let lat = document.getElementById('swal-input1').value;
         if (document.getElementById("swal-input_radio1").checked) {
            if ((lat > 0 && lat < 13) && (lon < -66 && lon > -79)) {
               UbicarEnMapa(lat, lon);
            } else {
               Swal.showValidationMessage(
                  'Las coordenadas que intenta ingresar estan fuera de Colombia, por lo tanto no es posible ubicarlas.'
               );

            }
 
         } else {
            let x = document.getElementById('swal-input3').value;
            let y = document.getElementById('swal-input4').value;
            try {
               UbicarEnMapaXY(x, y);
            }
            catch (error) {
               Swal.showValidationMessage(`${error}`)
            }
         }
      }
    });
  });
};

function UbicarEnMapa(lat, lon) {
   const lugar = ol.proj.fromLonLat([lon, lat]);
   //   map.getView().setCenter(lugar);
   // map.getView().setZoom(16);
   const view = map.getView();
   view.animate({
      center: lugar,
      duration: 2000,
   });
  pulse(lugar);
}



function UbicarEnMapaXY(x, y) {

   let MagnaSirgas = ol.proj.get('EPSG:3116');
   // let XY = ol.proj.get('EPSG:4326');

   let x_c = parseFloat(x);
   let y_c = parseFloat(y);



   let coordinates = ol.proj.transform([x_c,y_c], MagnaSirgas, 'EPSG:4326');
   if ((coordinates[1] > 0 && coordinates[1] < 13) && (coordinates[0] < -66 && coordinates[0] > -79)) {
      let coord_proj = ol.proj.fromLonLat(coordinates);
      
      const view = map.getView();
      view.animate({
         center: coord_proj,
         duration: 2000,
      });

      pulse(coord_proj)

      
   } else {
      throw new Error('Las coordenadas que intenta ingresar estan fuera de Colombia, por lo tanto no es posible ubicarlas.') ;
   }

  
}


$modal_mapa_base.addEventListener('click', async () => {


   const { value: formValues } = await Swal.fire({
      title: 'Agregar nueva Capa',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      html:
         `<div class="fila-flex">
            <Label>Nombre</label>
            <input id="swal-input1" class="swal2-input">
         </div>
         <div class="fila-flex">
            <Label>Ruta</label>
         <input id="swal-input2" class="swal2-input">
         </div>
         <div class="fila-flex">
            <Label>Z Mínimo</label>
            <input type="number" id="swal-input3" class="swal2-input">
         </div>
         <div class="fila-flex">
            <Label>Z Máximo</label>
            <input type="number" id="swal-input4" class="swal2-input">
         </div>`,
      focusConfirm: true,
      preConfirm: () => {
         let json = {
            "code":  Math.floor(Math.random()*394)+10,
            "name": document.getElementById('swal-input1').value,
            "route": document.getElementById('swal-input2').value,
            "minZoom": document.getElementById('swal-input3').value,
            "maxZoom": document.getElementById('swal-input4').value,
         };
         if (isValidURL(json.route)){
         if (parseInt(json.minZoom) < parseInt(json.maxZoom)) {
            if (parseInt(json.maxZoom) >= 0 && parseInt(json.maxZoom) <= 20) {
               if (parseInt(json.minZoom) >= 0 && parseInt(json.minZoom) <= 20) {
                  if (validarModal(json)) {
                     datos.push(json);
                     document.querySelector("#selecetMapaBase").innerHTML = '';
                     userAction();
                     Swal.fire(
                        'Información',
                        'El mapa base se ha agregado con éxito',
                        'information'
                     );

                  } else {
                     Swal.showValidationMessage('Ha ocurrido un error, todos los datos son obligatorios.');
                  }
               } else {
                  Swal.showValidationMessage('Ha ocurrido un error, El nivel de Zoom mínimo debe estar entre 0 y 20');
               }
            } else {
               Swal.showValidationMessage('Ha ocurrido un error, El nivel de Zoom máximo debe estar entre 0 y 20');
            }
         } else {
            Swal.showValidationMessage('Ha ocurrido un error, El nivel de Zoom mínimo debe ser menor al Zoom máximo');
         }
      } else {
         Swal.showValidationMessage('Ha ocurrido un error, La ruta ingresada no es valida, ingrese otra e intente nuevamente');
      }
         return json;
      }
   });

});



function validarModal  (formValues) {
if (formValues.name != '') {
   if (formValues.route != '') {
      if (formValues.minZoom != '') {
         if (formValues.maxZoom != '') {
            return true;
         } else { return false }
      } else { return false }
   } else { return false }
} else { return false };
};


function isValidURL (string) {
var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
return (res !== null)
};

const userAction = async () => {
   select = document.getElementById('selecetMapaBase');

   if (datos.length > 0) {
      for (let i = 0; i <= datos.length - 1; i++) {
         let opt = document.createElement('option');
         opt.value = datos[i].code;
         opt.innerHTML = datos[i].name;
         select.appendChild(opt);

      }
   }

}

const  ConsultarLATLON = async (entidad, codigo, tipocodigo)  =>{

  const apiClient = new ApiClient(backend_url, x_api_key);
    const token = await apiClient.getToken(); // <--- Obtener el token Y ACTUALIZARLO EN EL CLIENTE
    apiClient.getBusquedaCapaNegocio(entidad,codigo,tipocodigo).then(response => {
        let coordenadas = response.data;
       try {
          if (coordenadas.longitud == '0' || coordenadas.latitud == '0') {
             throw new Error('No se encontraron coordenadas');
          } else {

             let lon = parseFloat(coordenadas.longitud);
             let lat = parseFloat(coordenadas.latitud );
             
             UbicarEnMapa(lat, lon);
          }
        } catch (error) {
            alert(error);
        }

    });
      
}

const EnviarDatosBusqueda = async () => {
   let entidad = '';
    let codigo = document.getElementById('CajaCodigoABuscar').value;
    if (document.getElementById('RadioApoyo').checked) {
        entidad = 'apoyo';
    }
    if (document.getElementById('RadioTrafodis').checked) {
        entidad = 'trafodis';
    }
    if (document.getElementById('RadioCliente').checked) {
        entidad = 'cliente';
    }
    if (document.getElementById('RadioTramoMT').checked) {
        entidad = 'tramomt';
    }
    if (document.getElementById('RadioTramoBT').checked) {
        entidad = 'tramobt';
    }
    if (document.getElementById('RadioSubestacion').checked) {
        entidad = 'subestacion';
    }
    if (document.getElementById('RadioCodigoInterno').checked) {
        tipocodigo = 'interno';
    }
    if (document.getElementById('RadioCodigoExterno').checked) {
        tipocodigo = 'externo';
   }
   
   // return alert(`${entidad} ${codigo} ${tipocodigo}`);
   await ConsultarLATLON(entidad, codigo, tipocodigo);
}


const changeSelection = (element) => {
   const radio_button = document.querySelector(element);  

   if (radio_button.checked) {
      return;
   } else {
      radio_button.checked = true;
   }
}