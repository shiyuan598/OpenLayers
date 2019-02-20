define(["jquery", "ol", "layers", "controls", "measure", "henan"], function ($, ol, layers, controls, measure) {
    /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
    var saveAs = function (e) { "use strict"; if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) { return } var t = e.document, n = function () { return e.URL || e.webkitURL || e }, r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"), o = "download" in r, a = function (e) { var t = new MouseEvent("click"); e.dispatchEvent(t) }, i = /constructor/i.test(e.HTMLElement) || e.safari, f = /CriOS\/[\d]+/.test(navigator.userAgent), u = function (t) { (e.setImmediate || e.setTimeout)(function () { throw t }, 0) }, s = "application/octet-stream", d = 1e3 * 40, c = function (e) { var t = function () { if (typeof e === "string") { n().revokeObjectURL(e) } else { e.remove() } }; setTimeout(t, d) }, l = function (e, t, n) { t = [].concat(t); var r = t.length; while (r--) { var o = e["on" + t[r]]; if (typeof o === "function") { try { o.call(e, n || e) } catch (a) { u(a) } } } }, p = function (e) { if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) { return new Blob([String.fromCharCode(65279), e], { type: e.type }) } return e }, v = function (t, u, d) { if (!d) { t = p(t) } var v = this, w = t.type, m = w === s, y, h = function () { l(v, "writestart progress write writeend".split(" ")) }, S = function () { if ((f || m && i) && e.FileReader) { var r = new FileReader; r.onloadend = function () { var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;"); var n = e.open(t, "_blank"); if (!n) e.location.href = t; t = undefined; v.readyState = v.DONE; h() }; r.readAsDataURL(t); v.readyState = v.INIT; return } if (!y) { y = n().createObjectURL(t) } if (m) { e.location.href = y } else { var o = e.open(y, "_blank"); if (!o) { e.location.href = y } } v.readyState = v.DONE; h(); c(y) }; v.readyState = v.INIT; if (o) { y = n().createObjectURL(t); setTimeout(function () { r.href = y; r.download = u; a(r); h(); c(y); v.readyState = v.DONE }); return } S() }, w = v.prototype, m = function (e, t, n) { return new v(e, t || e.name || "download", n) }; if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) { return function (e, t, n) { t = t || e.name || "download"; if (!n) { e = p(e) } return navigator.msSaveOrOpenBlob(e, t) } } w.abort = function () { }; w.readyState = w.INIT = 0; w.WRITING = 1; w.DONE = 2; w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null; return m }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content); if (typeof module !== "undefined" && module.exports) { module.exports.saveAs = saveAs } else if (typeof define !== "undefined" && define !== null && define.amd !== null) { define("FileSaver.js", function () { return saveAs }) }

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
                    // layers.OSM,
                    // layers.tiandituSatellite,
                    // layers.tiandituSatelliteLabel,
                    // layers.tiandituRoad,
                    // layers.tiandituAnnotation,                    
                    // layers.baiduMap,                                      
                    // layers.baiduRaster,
                    // layers.baiduMapLabel,
                    // layers.googleMap,
                    // layers.googleRaster,
                    layers.offlineGoogleMapLayer
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
                    center: ol.proj.transform([116.39956, 39.92459], "EPSG:4326", "EPSG:3857"),
                    zoom: 12,
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