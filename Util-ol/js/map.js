define(["jquery", "ol", "layers", "controls", "measure", "henan", "saveAs"], function ($, ol, layers, controls, measure, saveAs) {
    var map = {
        map: null,
        pointSource: null,
        districtSource: null,
        currentDistrict: null,
        districtStyle: new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 250, 250, 0.2]
            }),
            stroke: new ol.style.Stroke({
                color: [70, 130, 180, 0.95],
                width: 1.5
            }),
        }),
        init: function () {
            var container = document.getElementById("popup");
            var content = document.getElementById("popup-content");
            var closer = document.getElementById("popup-closer");
            closer.onclick = function(){
                overlay.setPosition(null);
                closer.blur();
            }

            var overlay = new ol.Overlay({
                element:container,
                autoPan:true,
                autoPanAnimation:{
                    duration:250
                }
            });

            var olMap = new ol.Map({
                layers: [
                    layers.OSM,
                    // layers.tiandituSatellite,
                    // layers.tiandituSatelliteLabel,
                    // layers.tiandituRoad,
                    // layers.tiandituAnnotation,                    
                    // layers.baiduMap,                                      
                    // layers.baiduRaster,
                    // layers.baiduMapLabel,
                    // layers.googleMap,
                    // layers.googleRaster
                ],
                target: "map",
                controls: ol.control.defaults({

                }).extend([controls.getMousePositionControl("mousePosition"),
                // controls.getAttributionControl(),
                // controls.getFullScreenControl(),
                // controls.getOverviewMapControl(),
                // controls.getRotateControl(),
                controls.getScaleLineControl(),
                    // controls.getZoomSliderControl(),
                    // controls.getZoomToExtentCOntrol()
                ]),

                view: new ol.View({
                    center: ol.proj.transform([116.402, 39.924], "EPSG:4326", "EPSG:3857"),
                    zoom: 9,
                    projection: "EPSG:3857"
                }),
                overlays: [overlay]
            });
            map.map = olMap;

            document.getElementById('export-png').addEventListener('click', function () {
                olMap.once('postcompose', function (event) {
                    var canvas = event.context.canvas;
                    if (navigator.msSaveBlob) {
                        navigator.msSaveBlob(canvas.msToBlob(), 'mapGG.png');
                    } else {
                        canvas.toBlob(function (blob) {
                            saveAs(blob, 'mapPP.png');
                        });
                    }
                });
                olMap.renderSync();
            });

            // Popup showing the position the user clicked
            var popup = new ol.Overlay({
                element: document.getElementById('pointInfo')
            });
            olMap.addOverlay(popup);

            olMap.on("singleclick", function (event) {
                
                $("#pointInfo").css("display", "none");
                var x = event.originalEvent.clientX;
                var y = event.originalEvent.clientY;

                var left = (x - 110 - 10) + "px";
                var top = (y - 300 - 10) + "px";
                var coord = event.coordinate;
                var tolerance = 2000;
                var extent = [coord[0] - tolerance, coord[1] - tolerance, coord[0] + tolerance, coord[1] + tolerance];
                var features = olMap.pointSource.getFeaturesInExtent(extent);
                if (features.length > 0) {
                    // var name = features[0].get("name");
                    // $("#pointInfo").css("display", "block");
                    // $("#pointInfo").text("名称: " + name);
                    // $("#pointInfo").css("left", left);
                    // $("#pointInfo").css("top", top);

                    var hdms = ol.coordinate.toStringHDMS(coordinate);
            
                    var element = popup.getElement();
                    popup.setPosition(coordinate);
                    
                    $(element).popover('destroy');
                    popup.setPosition(coordinate);
                    // the keys are quoted to prevent renaming in ADVANCED mode.
                    $(element).popover({
                      'placement': 'top',
                      'animation': false,
                      'html': true,
                      'content': '<p>The location you clicked was:</p><code>' + hdms + '</code>'
                    });
                    $(element).popover('show');
                }
                var coordinate = event.coordinate;
                content.innerHTML = "<p>You clicked here!</p>";
                // overlay.setPosition(coordinate);
            });
        }
    };
    return map;
});
