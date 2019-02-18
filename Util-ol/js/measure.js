define([
    "ol", "jquery"
], function (ol, $) {
    'use strict';
    var measure = {
        init: init,
        exit: exit
    };
    return measure;

    var olMap,
        olDraw,
        olSnap,
        olSource;

    function init(map) {
        olMap = map;
        //prepare a vector layer to store draw features
        olSource = new ol.source.Vector();
        var vector = new ol.layer.Vector({
            source: olSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "#CAFF70"
                }),
                stroke: new ol.style.Stroke({
                    color: "#00FF7F",
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 6,
                    stroke: new ol.style.Stroke({
                        color: "#fff",
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: "#EE5C42"
                    })
                })
            })
        });
        map.addLayer(vector);
        var modify = new ol.interaction.Modify({
            source: olSource
        });
        map.addInteraction(modify);

        var sketch, //current draw feature
            helpToolTipElement,
            helpToolTip,
            measureToolTipElement,
            measureToolTip,
            continueLineMsg = "Click to continue drawing the line",
            continuePolygonMsg = "Click to continue drawing the polygon";


        function addInteraction() {
            olDraw = new ol.interaction.Draw({
                source: olSource,
                type: $("#type").val()
            });
            olSnap = new ol.interaction.Snap({
                source: olSource,
                pixelTolerance: 5
            });

            map.addInteraction(olDraw);
            map.addInteraction(olSnap);
            olDraw.on("drawstart", function (evt) {
                sketch = evt.feature;
                sketch.getGeometry().on("change", function (evt) {
                    var geom = evt.target;
                    var coord;
                    if (geom instanceof ol.geom.Polygon) {
                        coord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        coord = geom.getLastCoordinate();

                    }
                });

            });
            olDraw.on("drawend", function (evt) {
                measureToolTipElement = null;
                createMeasureToolTip();
                var feature = evt.feature;
                var geom = feature.getGeometry();
                var measureResult,
                    tooltipCoord;
                if (geom instanceof ol.geom.Polygon) {
                    measureResult = geom.getArea();
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    measureToolTipElement.innerHTML = measureResult.toString() + " m<sup>2</sup>";
                } else if (geom instanceof ol.geom.LineString) {
                    measureResult = geom.getLength();
                    tooltipCoord = geom.getLastCoordinate();
                    measureToolTipElement.innerHTML = measureResult.toString() + " m";
                }
                measureToolTip.setPosition(tooltipCoord);
            });
        }

        function createMeasureToolTip() {
            if (measureToolTipElement) {
                measureToolTipElement.parentNode.removeChild(measureToolTipElement);
            } else {
                measureToolTipElement = document.createElement("div");
                measureToolTipElement.className = "tooltip tooltip-measure";
                measureToolTip = new ol.Overlay({
                    element: measureToolTipElement,
                    positioning: "bottom-left",
                    offset: [-31, -10]
                });
                map.addOverlay(measureToolTip);
            }
        }

        $("#type").change(function () {
            map.removeInteraction(olDraw);
            map.removeInteraction(olSnap);
            addInteraction();
        });
        addInteraction();
    }

    function exit() {
        if (olMap) {
            var overlays = olMap.getOverlays().forEach(function (obj, index, arr) {

                if (obj) {
                    obj.setPosition(null);
                    olMap.removeOverlay(obj);
                }

            }, this);
            if (olDraw) {
                olMap.removeInteraction(olDraw);
            }
        }
        if (olSource) {
            //olSource.clear();
        }
    }
});