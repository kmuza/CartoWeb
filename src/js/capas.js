let style_apoyos = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 4.0,
        stroke: new ol.style.Stroke({
            color: 'rgba(0,0,0,1.0)',
            lineDash: null,
            lineCap: 'butt',
            lineJoin: 'miter',
            width: 0
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0,0,0,0.8)'
        })
    })
});

let style_media = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        fill: new ol.style.Fill({
            color: 'blue'
        })
    })
});

let style_baja = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 3,
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        fill: new ol.style.Fill({
            color: 'yellow'
        })
    })
});

let style_generico = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 3,
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        fill: new ol.style.Fill({
            color: 'grey'
        })
    })
});


let style_ap = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color: 'yellow'
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        points: 4,
        angle: 0,
        radius: 7,
        radius2: 7,
        radius3: 7,
        radius4: 7,
        scale: [1, 0.5],
        displacement: [15, 0]
    })
});

let style_ap_linea = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color: 'black'
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        radius: 2 / Math.SQRT2,
        radius2: 2,
        points: 4,
        angle: 90,
        scale: [2, 0.5],
        displacement: [3, 0]
    }),
    zindex: 100
});

let style_ap_linea_i = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color: 'black'
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        radius: 2 / Math.SQRT2,
        radius2: 2,
        points: 4,
        angle: 0,
        scale: [0.5, 1],
        displacement: [28, -5]
    })
});


let style_ap_linea_d = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color: 'black'
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        radius: 2 / Math.SQRT2,
        radius2: 2,
        points: 4,
        angle: 0,
        scale: [0.5, 1],
        displacement: [28, 5]
    })
});


let style_ap_linea_a = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color: 'black'
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        radius: 2 / Math.SQRT2,
        radius2: 2,
        points: 4,
        angle: 0,
        scale: [1, 0.5],
        displacement: [23, 0]
    })
});

let style_trafo = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color: 'red'
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        points: 3,
        radius: 6,
        rotation: 2 * Math.PI,
        angle: 0,
        displacement: [3, 10]
    })
});

let style_interruptor = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color: 'green'
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        radius: 5 / Math.SQRT2,
        radius2: 5,
        points: 4,
        angle: 0,
        scale: [1, 0.5],
        displacement: [-15, 0]
    })
});

let style_interruptor_2 = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color: 'green'
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        radius: 5 / Math.SQRT2,
        radius2: 5,
        points: 4,
        angle: 0,
        scale: [1, 0.5],
        displacement: [-22, 0]
    })
});


let style_multiCliente = new ol.style.Style({
    image: new ol.style.RegularShape({
        radius: 8,
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        points: 4,
        angle: Math.PI / 4
    })
});

let style_cliente = new ol.style.Style({
    image: new ol.style.RegularShape({
        radius: 4,
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0
        }),
        fill: new ol.style.Fill({
            color: 'yellow'
        }),
        points: 4,
        angle: Math.PI / 4
    })
});


function reverse (value){
    let R;
    let G;
    let B;
    
    R = value.slice(0,2);
    G = value.slice(2,4);
    B = value.slice(4,6);
    return `${B}${G}${R}`;
    }

function codigo_energis(expr){
        return "#" +reverse(((expr)>>>0).toString(16).slice(-6));
}

function eval_color_by_tension(context) {
    //varios circuitos
    var feature = context.feature;
    var color = '';
    var expr;
    if (feature.hasOwnProperty('circuito')){
        expr = feature.get('color')
    }else{
       expr = feature.get('color')
    }
    color = codigo_energis(expr);

    return color;
}

var style_tramomt = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    return [ new ol.style.Style({
            stroke: new ol.style.Stroke({
                width:  resolution > 10 ? 1.5 : 3.5,
                color : eval_color_by_tension(context)
            })
        })]; 
}; 

const estilosCliente = (feature) => {
    var coord = feature.getFlatCoordinates().toString();
    let estilo = [];
    if (feature.get('cantidad') == 1) {
        estilo.push(style_cliente);
    } else {
        estilo.push(style_cliente);
        estilo.push(style_multiCliente);
    }
    return estilo;
};


let style_departamento = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'darkred',
      width: 3,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(139, 0, 0, 0.1)',
    }),
  });

let style_municipio = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 3,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 128, 0, 0.1)',
    }),
  });

let style_localidad = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'magenta',
      width: 3,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 255, 0.2)',
    }),
  });

let style_barrio = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      width: 3,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  });

let style_subestacion = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 3,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.4)',
    }),
});

let estiloAcometida = new ol.style.Style({
    stroke: new ol.style.Stroke({
        width: 1,
        color : 'gray'
    })
});


// CAPAS
// ---------------------------------------------------------------------------------------------------------------------
// SOURCES
//let source_Apoyos = new ol.source.VectorTile({
//    format: new ol.format.MVT(),
//    url: tiles_server + capa_apoyos,
//})

//let source_Clientes = new ol.source.VectorTile({
//    format: new ol.format.MVT(),
//    url: tiles_server + capa_clientes,
//});


/// FIN ESTILOS ---------------------------------------------------------------------------------------



// MAPAS BASES
  // A group layer for base layers
var baseLayers   = new ol.layer.Group({
    title: 'Mapas Base',
    openInLayerSwitcher: true,
    layers: [
        new ol.layer.Tile({
            title: "OSM",
            baseLayer: true,
            source: new ol.source.OSM(),
            visible: true
        }),
        new ol.layer.Tile({
            title: "Toner",
            baseLayer: true,
            visible: false,
            source: new ol.source.Stamen({ layer: 'toner' })
        })
    ]
});


