const attribution = new ol.control.Attribution({
    collapsible: true,
});



let map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
        attribution: false
    }).extend([attribution]),
    layers: [baseLayers],
    view: new ol.View({
        center: ol.proj.fromLonLat([-73.1202805, 7.107080]),
        minZoom: 1,
        maxZoom: 20,
        zoom: 19
    })
});




//CONTROLES
// ---------------------------------------------------------------------------------------------------------------------
// ZOOM
const controlZoom =
  new ol.control.Zoom({
    delta: 0.5
  });


// SIDE BAR
const sidebar = new ol.control.Sidebar({
    element: 'sidebar',
    position: 'left'
});
//<i class="fas fa-map-marker-alt"></i>
// BUSQUEDA
var buscar = new ol.control.Button({
  html: '<i class="fas fa-map-marker-alt" id="buscar_apoyo"  aria-hidden="true"></i>',
  className: "buscar_apoyo",
  title: "Buscar por coordenadas en la cartografia",
  handleClick: async function () {
    await BuscarApoyoCartografia();
  }
});

map.on("moveend", function(e){
sessionStorage.setItem('zoom',map.getView().getZoom());
sessionStorage.setItem('center',ol.proj.toLonLat(map.getView().getCenter()));
});


// layerSwitcher
var ctrl = new ol.control.LayerSwitcher({
    // collapsed: false,
    // mouseover: true
});


// Posición del Mouse 
const mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(8),
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'custom-mouse-position',
    target: document.getElementById('coordinates'),
});
  

// Add a custom push button with onToggle function
// USE ESTE CONTROL COMO UN TEMPLATE PARA GENERAR LOS DEMAS
var hello = new ol.control.Button({
  html: '<i class="fa fa-smile-o"></i>',
  className: "hello",
  title: "Hello world!",
    handleClick: function () {
        alert("Hello world!");
    } 
});






map.addControl(hello);  //<--- ESTE CONTROL NO SE USA
map.addControl(controlZoom);
map.addControl(sidebar);
map.addControl(buscar);
map.addControl(mousePositionControl);
map.addControl(ctrl);




map.on('pointermove', function (evt) {
    if (evt.dragging) {
        return;
    }

    // map.getTargetElement().style.cursor = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : '';

    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

