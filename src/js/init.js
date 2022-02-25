let grupo_capas;
proj4.defs("EPSG:3116","+proj=tmerc +lat_0=4.596200416666666 +lon_0=-74.07750791666666 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
ol.proj.proj4.register(proj4);

const loadCapAbilities = async () => {

    fetch(tiles_server + "capabilities/essa.json", { method: 'GET' })
    .then(response => response.json())
    .then(result => paintCapAbilities(result.vector_layers))
    .catch(error => console.log('error', error));
    
}

// loadCapAbilities();

const paintCapAbilities = async (vector_layers) => {
    // lista de layers administrativos
    const administrativos = ['departamento', 'municipio', 'localidad', 'barrios'];
    
    let layers = []; //<-- capas de negocios para pintar
    let layers_admin = []; //<-- capas administrativas para pintar
    let source;
    let layer;
    


  for (i = 0; i < vector_layers.length; i++) {
    geometry = vector_layers[i].geometry_type;
    id = vector_layers[i].id;

    let style_layer;

    switch(id){
        case 'apoyos':
            style_layer = style_apoyos;
            break;
        case 'tramobt':
            style_layer = style_tramobt;
            break;
        case 'tramomt':
            style_layer = style_tramomt;
            break;
        case 'trafos':
            style_layer = style_trafo;
            break;   
        case 'clientes':
            style_layer = estilosCliente;
            break;          
        case 'subestacion':
            style_layer = style_subestacion;
            break;
        case 'acometidas':
            style_layer = estiloAcometida;
            break; 
    }

    if (administrativos.includes(id)) {

// Hacer lo mismo que esta en las lineas de la 31 a la 47 para asignar el estilo y quito el comentario de la linea 63  
    switch(id){
      case 'departamento':
          style_layer = style_departamento;
          break;
      case 'municipio':
          style_layer = style_municipio;
          break;
      case 'localidad':
          style_layer = style_localidad;
          break;   
      case 'barrios':
          style_layer = style_barrio;
          break;          
}

      source = new ol.source.VectorTile({
        url: vector_layers[i].tiles[0],
        format: new ol.format.MVT(),
      });

      layer = new ol.layer.VectorTile({
        name: vector_layers[i].name,
        source: source,
        minZoom: parseInt(vector_layers[i].minzoom) + 1,
        maxZoom: vector_layers[i].maxzoom,
        style: style_layer,
        visible: false,
      });

      layers_admin.push(layer);

    } else {

      
      source = new ol.source.VectorTile({
        url: vector_layers[i].tiles[0],
        format: new ol.format.MVT(),
      });

      layer = new ol.layer.VectorTile({
        name: vector_layers[i].name,
        source: source,
        minZoom: parseInt(vector_layers[i].minzoom) + 1,
        maxZoom: vector_layers[i].maxzoom,
        style: style_layer,
      });

      layers.push(layer);
      

    }   
  }

// GRUPOS DE CAPAS
  grupo_capas =  new ol.layer.Group({
    title: 'Capas Base',
    layers: layers
  })

  // GRUPOS DE CAPAS
  grupo_capas_admin =  new ol.layer.Group({
    title: 'Capas Administrativas',
    layers: layers_admin
  })
    
    map.addLayer(grupo_capas_admin);
    map.addLayer(grupo_capas);
}


