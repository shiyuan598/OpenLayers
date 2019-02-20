define([
    'ol'
], function(ol) {
    'use strict';
   
    var controls = {
        getAttributionControl: function(){
            return new ol.control.Attribution({                

            });
        },
        getFullScreenControl: function(){
            return new ol.control.FullScreen({

            });
        },
        getOverviewMapControl:function(){
            return new ol.control.OverviewMap({

            });
        },
        getRotateControl:function(){
            return new ol.control.Rotate({

            });
        },
        getScaleLineControl:function(){
            return new ol.control.ScaleLine({

            });
        },
        getZoomControl:function(){
            return new ol.control.Zoom({

            });
        },
        getZoomSliderControl:function(){
            return new ol.control.ZoomSlider({

            });
        },
        getZoomToExtentCOntrol:function(){
            return new ol.control.ZoomToExtent({

            });
        },
        getMousePositionControl: function(element){
            var mousePositionControl = new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                // comment the following two lines to have the mouse position
                // be placed within the map.
                className: 'custom-mouse-position',
                target: element,
                undefinedHTML: '&nbsp;'
            });
            return mousePositionControl;
        }
    };
    return controls;
});