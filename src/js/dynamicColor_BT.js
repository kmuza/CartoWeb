

var listCircuitos = [];

const getColorBt = async (circuito) => {

    
}



var style_tramomt = function(feature){
    var context = {
        feature: feature,
        variables: {}
    };
    return [ new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 5,
                color : eval_color_by_tension(context)
            })
        })]; 
};