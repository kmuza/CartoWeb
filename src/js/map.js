let shouldUpdate = true;


const attribution = new ol.control.Attribution({
    collapsible: true,
});

// default zoom, center and rotation
let zoom = 9;
let center = ol.proj.fromLonLat([-73.1202805, 7.107080]);
let rotation = 0;


if (!!sessionStorage.getItem('hash')) {
    console.log('sessionStorage.getItem("hash")');
    let hash = sessionStorage.getItem('hash').replace('#map=', '');
    const parts = hash.split('/');
    if (parts.length === 4) {
      zoom = parseFloat(parts[0]);
      center = [parseFloat(parts[1]), parseFloat(parts[2])];
      rotation = parseFloat(parts[3]);
    } 
};

if (window.location.hash !== '') {
  // try to restore center, zoom-level and rotation from the URL
  const hash = window.location.hash.replace('#map=', '');
  const parts = hash.split('/');
  if (parts.length === 4) {
    zoom = parseFloat(parts[0]);
    center = [parseFloat(parts[1]), parseFloat(parts[2])];
    rotation = parseFloat(parts[3]);
  }
}

let view = new ol.View({
        center: center,
        zoom: zoom,
        rotation: rotation,
        minZoom: 1,
        maxZoom: 20,
    })


let map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
        attribution: false
    }).extend([attribution]),
    layers: [baseLayers],
    view: view
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


// mantener el estado de la vista zoom y center

const updatePermalink = function () {
    const view = map.getView();

  if (!shouldUpdate) {
    // do not update the URL when the view was changed in the 'popstate' handler
    shouldUpdate = true;
    return;
  }

  const center = view.getCenter();
  const hash =
    '#map=' +
    view.getZoom().toFixed(2) +
    '/' +
    center[0].toFixed(2) +
    '/' +
    center[1].toFixed(2) +
    '/' +
    view.getRotation();
  const state = {
    zoom: view.getZoom(),
    center: view.getCenter(),
    rotation: view.getRotation(),
  };
  window.history.pushState(state, 'map', hash);
  sessionStorage.setItem('hash', hash);
};

map.on('moveend', updatePermalink);

// restore the view state when navigating through the history, see
// https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
window.addEventListener('popstate', function (event) {
  if (event.state === null) {
    return;
  }
  map.getView().setCenter(event.state.center);
  map.getView().setZoom(event.state.zoom);
  map.getView().setRotation(event.state.rotation);
  shouldUpdate = false;
});


/// -----------------------------------------------------------------------------

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

